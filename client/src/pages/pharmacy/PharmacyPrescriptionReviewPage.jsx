import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Container from '../../components/utils/Container'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { ArrowLeft, CheckCircle, Eye, AlertCircle, Clipboard } from 'lucide-react'
import { usePrescriptions } from '../../hooks/usePrescriptions'
import { useOrders } from '../../hooks/useOrders'
import clientConfig from '../../config/clientConfig'

const PharmacyPrescriptionReviewPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser)
    const pharmacyId = user?.pharmacy_id

    const { usePrescriptionDetailQuery } = usePrescriptions(pharmacyId)
    const { data: detail, isLoading } = usePrescriptionDetailQuery(id)
    const { createOrder } = useOrders(pharmacyId)

    const [items, setItems] = useState([])
    const [isProcessing, setIsProcessing] = useState(false)

    // Initial load from AI analysis
    useEffect(() => {
        if (detail?.analysis?.structured_data) {
            const parsed = typeof detail.analysis.structured_data === 'string'
                ? JSON.parse(detail.analysis.structured_data)
                : detail.analysis.structured_data

            // Handle both array (direct) and object ({ medicines: [] }) formats
            const medicinesList = Array.isArray(parsed) ? parsed : (parsed?.medicines || []);

            // Map AI medicines to local state
            const initialItems = medicinesList.map(m => ({
                id: Math.random(),
                name: m.name,
                dosage: m.dosage, // Ensure dosage is mapped if available
                quantity: m.quantity || 1,
                medicine_id: m.medicine_id || null, // Will need matching if not provided
                batch_id: null,
                price: 0,
                batches: []
            }))
            setItems(initialItems)
        }
    }, [detail])



    const handleCreateOrder = async () => {
        if (items.some(item => !item.batch_id)) {
            alert("Please select a batch for all items")
            return
        }

        setIsProcessing(true)
        try {
            await createOrder.mutateAsync({
                pharmacy_id: pharmacyId,
                customer_id: detail.prescription.customer_id,
                prescription_id: id,
                items: items.map(item => ({
                    medicine_id: item.medicine_id,
                    batch_id: item.batch_id,
                    quantity: item.quantity,
                    price: item.price
                }))
            })
            navigate('/pharmacy/orders')
        } catch (err) {
            console.error(err)
        } finally {
            setIsProcessing(false)
        }
    }

    if (isLoading) return <Container><div className="py-20 text-center">Loading prescription...</div></Container>

    return (
        <div className="bg-gray-50 min-h-full pb-20">
            <Container>
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 pt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Review Prescription</h1>
                        <p className="text-sm text-gray-500">Review AI analysis and generate bill</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Private View (Prescription Image) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900">Prescription Image</h3>
                            </div>
                            <div className="aspect-video bg-gray-100 relative">
                                <img
                                    src={`${clientConfig.ASSET_URL}${detail.prescription.file_path}`}
                                    alt="Prescription"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-4 bg-gray-50">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Patient Notes</p>
                                <p className="text-sm text-gray-700">{detail.prescription.notes || 'No notes provided by patient.'}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Customer Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Name</span>
                                    <span className="text-sm font-medium text-gray-900">{detail.prescription.customer_name || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Phone</span>
                                    <span className="text-sm font-medium text-gray-900">{detail.prescription.customer_phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bill Generation */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900">Order Items</h3>
                                <button className="text-xs font-bold text-teal-600 hover:text-teal-700">+ Add Medicine</button>
                            </div>

                            <div className="space-y-4">
                                {detail?.analysis?.status === 'failed' && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-4 flex flex-col items-center justify-center text-center">
                                        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                                        <p className="text-red-800 font-medium">AI Analysis Failed</p>
                                        <p className="text-red-600 text-xs mt-1">We couldn't read this prescription automatically.<br />Please add medicines manually using the button above.</p>
                                    </div>
                                )}

                                {items.length === 0 && detail?.analysis?.status !== 'failed' && (
                                    <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
                                        <Clipboard className="w-8 h-8 text-gray-300 mb-2" />
                                        <p className="text-gray-500 font-medium">No Medicines Found</p>
                                        <p className="text-gray-400 text-xs mt-1">AI didn't detect any medicines or analysis is pending.<br />Click "+ Add Medicine" to start billing.</p>
                                    </div>
                                )}

                                {items.map((item, index) => (
                                    <div key={item.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <input
                                                    className="font-bold text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const newItems = [...items]
                                                        newItems[index].name = e.target.value
                                                        setItems(newItems)
                                                    }}
                                                />
                                                <p className="text-xs text-gray-500">{item.dosage}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Qty:</span>
                                                    <input
                                                        type="number"
                                                        className="w-16 h-8 text-center border border-gray-200 rounded-lg text-sm"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newItems = [...items]
                                                            newItems[index].quantity = parseInt(e.target.value) || 1
                                                            setItems(newItems)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Select Batch</label>
                                                <select
                                                    className="w-full h-9 text-xs border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                                    onChange={(e) => {
                                                        const newItems = [...items]
                                                        newItems[index].batch_id = e.target.value
                                                        // Price would be fetched from batch in real app
                                                        newItems[index].price = 120
                                                        newItems[index].medicine_id = 1 // Mock
                                                        setItems(newItems)
                                                    }}
                                                >
                                                    <option>Select Batch</option>
                                                    <option value="1">B-101 (Exp: 12/25) - ₹120.00</option>
                                                    <option value="2">B-202 (Exp: 08/26) - ₹135.00</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Unit Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                                    <input
                                                        type="number"
                                                        className="w-full h-9 pl-7 text-xs border border-gray-200 rounded-lg"
                                                        value={item.price}
                                                        onChange={(e) => {
                                                            const newItems = [...items]
                                                            newItems[index].price = parseFloat(e.target.value) || 0
                                                            setItems(newItems)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Billing Summary */}
                            <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>₹{items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-600 font-medium">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                                        <span>Total Amount</span>
                                        <span>₹{items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateOrder}
                                    disabled={isProcessing || items.length === 0}
                                    className="w-full py-4 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? 'Generating Bill...' : <><CheckCircle className="w-5 h-5" /> Generate Bill & Create Order</>}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-wider font-bold">
                                    Clicking generate will notify the customer for payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default PharmacyPrescriptionReviewPage
