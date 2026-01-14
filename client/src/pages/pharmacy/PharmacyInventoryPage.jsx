import React, { useState } from 'react'
import Container from '../../components/utils/Container'
import { Plus, Search, Loader } from 'lucide-react'
// import { useInventory } from '../../hooks/useInventory'

const PharmacyInventoryPage = () => {
    // For now using default pharmacyId (1) or from context if available
    // const { useInventoryQuery } = useInventory(1)
    // const { data: inventory, isLoading, error } = useInventoryQuery()

    // TEMPORARY: Mock Data
    const isLoading = false;
    const error = null;
    const inventory = [
        { id: 1, medicine_name: 'Paracetamol 500mg', quantity: 450, price: 25.00, expiry_date: '2025-12-31', dosage_form: 'Tablet' },
        { id: 2, medicine_name: 'Amoxicillin 250mg', quantity: 20, price: 85.50, expiry_date: '2024-10-15', dosage_form: 'Capsule' },
        { id: 3, medicine_name: 'Cetirizine 10mg', quantity: 100, price: 15.00, expiry_date: '2026-05-20', dosage_form: 'Tablet' },
    ];

    const [searchTerm, setSearchTerm] = useState('')

    const filteredInventory = inventory?.filter(item =>
        item.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search medicines..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            Add New Stock
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">
                            Failed to load inventory. Please try again.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                                    <th className="py-4 font-semibold">Medicine Name</th>
                                    <th className="py-4 font-semibold">Stock Qty</th>
                                    <th className="py-4 font-semibold">Price/Unit</th>
                                    <th className="py-4 font-semibold">Expiry Date</th>
                                    <th className="py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredInventory.length > 0 ? (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-gray-900 font-medium">{item.medicine_name} <span className="text-xs text-gray-400 font-normal">({item.dosage_form})</span></td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.quantity < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {item.quantity} units
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-600">₹{parseFloat(item.price).toFixed(2)}</td>
                                            <td className="py-4 text-gray-600">{new Date(item.expiry_date).toLocaleDateString()}</td>
                                            <td className="py-4 text-right">
                                                <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-500">
                                            No inventory items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default PharmacyInventoryPage
