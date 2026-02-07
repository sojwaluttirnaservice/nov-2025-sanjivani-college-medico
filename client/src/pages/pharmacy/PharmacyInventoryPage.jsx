import React, { useEffect, useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { Plus, Search, Loader } from 'lucide-react'
import { useInventory } from '../../hooks/useInventory'

const PharmacyInventoryPage = () => {
    // For now using default pharmacyId (1) or from context if available
    const user = useSelector(state => state.auth.user)
    const pharmacyId = user?.pharmacy_id
    const { inventoryQuery, addStock, getBatches, searchMedicines } = useInventory(pharmacyId)
    const { data: inventory, isLoading, error } = inventoryQuery
    const { mutate: addStockMutate } = addStock;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMedicineId, setSelectedMedicineId] = useState(null);
    const [batches, setBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    // Fetch batches when selectedMedicineId changes
    useEffect(() => {
        if (selectedMedicineId) {
            setLoadingBatches(true);
            getBatches(selectedMedicineId)
                .then(data => setBatches(data))
                .catch(err => console.error("Failed to load batches", err))
                .finally(() => setLoadingBatches(false));
        } else {
            setBatches([]);
        }
    }, [selectedMedicineId, getBatches]);



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
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            Add New Stock
                        </button>
                    </div>
                </div>

                {/* Add Stock Modal - Refactored with React Hook Form & Yup */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Add New Stock Batch</h3>
                            <AddStockForm
                                onSubmit={(data) => {
                                    addStockMutate({
                                        ...data,
                                        medicineId: parseInt(data.medicineId),
                                        quantity: parseInt(data.quantity),
                                        price: parseFloat(data.price),
                                        batch_no: "BATCH-" + Date.now().toString().slice(-6)
                                    }, {
                                        onSuccess: () => {
                                            setIsAddModalOpen(false);
                                        }
                                    });
                                }}
                                onCancel={() => setIsAddModalOpen(false)}
                                searchMedicines={searchMedicines}
                            />
                        </div>
                    </div>
                )}

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
                                            <td className="py-4 text-gray-900 font-medium">
                                                {item.medicine_name} <span className="text-xs text-gray-400 font-normal">({item.dosage_form})</span>
                                                {selectedMedicineId === item.medicine_id && (
                                                    <div className="mt-2 pl-4 border-l-2 border-teal-100 text-sm text-gray-500">
                                                        <p className="text-xs font-bold text-teal-600 mb-1">Active Batches:</p>
                                                        {loadingBatches ? (
                                                            <div className="text-xs">Loading batches...</div>
                                                        ) : batches.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {batches.map(batch => (
                                                                    <div key={batch.id} className="flex justify-between bg-gray-50 p-2 rounded text-xs">
                                                                        <span>{batch.batch_no}</span>
                                                                        <span>Exp: {new Date(batch.expiry_date).toLocaleDateString()}</span>
                                                                        <span className="font-medium">Qty: {batch.physical_quantity}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-gray-400">No active batches found.</div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.quantity < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {item.quantity} units
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-600">₹{item.price ? parseFloat(item.price).toFixed(2) : '-'}</td>
                                            <td className="py-4 text-gray-600">{item.nearest_expiry ? new Date(item.nearest_expiry).toLocaleDateString() : 'N/A'}</td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedMedicineId(selectedMedicineId === item.medicine_id ? null : item.medicine_id)}
                                                    className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                                                    {selectedMedicineId === item.medicine_id ? 'Hide Batches' : 'View Batches'}
                                                </button>
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


// Sub-component for Form Logic
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    medicineId: yup.string().required('Please select a medicine'),
    quantity: yup.number().typeError('Quantity must be a number').positive('Must be positive').integer('Must be an integer').required('Quantity is required'),
    price: yup.number().typeError('Price must be a number').positive('Must be positive').required('Price is required'),
    expiryDate: yup.date().typeError('Invalid date').required('Expiry date is required').min(new Date(), 'Expiry date must be in the future')
});

const AddStockForm = ({ onSubmit, onCancel, searchMedicines }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    // Custom Logic for Medicine Search (kept from previous implementation but integrated)
    const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
    const [medicineResults, setMedicineResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedMedicineName, setSelectedMedicineName] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (medicineSearchTerm.length >= 2) {
                try {
                    const results = await searchMedicines(medicineSearchTerm);
                    setMedicineResults(results.data || []);
                    setShowResults(true);
                } catch (error) {
                    console.error("Search failed", error);
                }
            } else {
                setMedicineResults([]);
                setShowResults(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [medicineSearchTerm, searchMedicines]);

    const selectMedicine = (medicine) => {
        setValue('medicineId', medicine.id.toString(), { shouldValidate: true });
        setSelectedMedicineName(`${medicine.name} (${medicine.dosage_form})`);
        setMedicineSearchTerm('');
        setShowResults(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Medicine</label>
                {selectedMedicineName ? (
                    <div className="flex items-center justify-between p-2 border border-teal-200 bg-teal-50 rounded">
                        <span className="text-sm font-medium text-teal-800">{selectedMedicineName}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setValue('medicineId', '');
                                setSelectedMedicineName('');
                            }}
                            className="text-xs text-red-500 font-bold"
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Search medicine (e.g., Para...)"
                            className="w-full border p-2 rounded"
                            value={medicineSearchTerm}
                            onChange={e => setMedicineSearchTerm(e.target.value)}
                        />
                        {showResults && medicineResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto">
                                {medicineResults.map(med => (
                                    <div
                                        key={med.id}
                                        onClick={() => selectMedicine(med)}
                                        className="p-2 hover:bg-teal-50 cursor-pointer border-b border-gray-50 last:border-0"
                                    >
                                        <p className="text-sm font-medium text-gray-900">{med.name} <span className="text-xs text-gray-500">({med.brand})</span></p>
                                        <p className="text-xs text-gray-500">{med.dosage_form} • {med.strength}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
                <input type="hidden" {...register('medicineId')} />
                {errors.medicineId && <p className="text-xs text-red-500 mt-1">{errors.medicineId.message}</p>}
            </div>

            <div className="flex gap-2">
                <div className="w-1/2">
                    <input
                        type="number"
                        placeholder="Quantity"
                        className={`w-full border p-2 rounded ${errors.quantity ? 'border-red-500' : ''}`}
                        {...register('quantity')}
                    />
                    {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
                </div>
                <div className="w-1/2">
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        className={`w-full border p-2 rounded ${errors.price ? 'border-red-500' : ''}`}
                        {...register('price')}
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                </div>
            </div>

            <div>
                <input
                    type="date"
                    className={`w-full border p-2 rounded ${errors.expiryDate ? 'border-red-500' : ''}`}
                    {...register('expiryDate')}
                />
                {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                    Save Stock
                </button>
            </div>
        </form>
    );
};

export default PharmacyInventoryPage
