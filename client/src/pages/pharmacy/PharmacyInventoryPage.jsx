import React, { useEffect, useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { Plus, Search, Loader, AlertTriangle, PackageSearch } from 'lucide-react'
import { useInventory } from '../../hooks/useInventory'
import { useRestock } from '../../hooks/useRestock'
import { Link as RouterLink } from 'react-router-dom'

const LOW_STOCK_THRESHOLD = 30

const PharmacyInventoryPage = () => {
    const user = useSelector(state => state.auth.user)
    const pharmacyId = user?.pharmacy_id

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [restockModal, setRestockModal] = useState(null); // { medicine_id, medicine_name }
    const [selectedMedicineId, setSelectedMedicineId] = useState(null);
    const [batches, setBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);

    // Debounce search term to avoid spamming the API
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { inventoryQuery, addStock, getBatches, searchMedicines } = useInventory(pharmacyId, page, debouncedSearchTerm);
    const { data: inventoryData, isLoading, error } = inventoryQuery;
    const inventory = inventoryData?.inventory || [];
    const pagination = inventoryData?.pagination || null;
    const { mutate: addStockMutate } = addStock;

    const { agentsQuery, createRestockRequest } = useRestock(pharmacyId)
    const { data: agents = [] } = agentsQuery
    const { mutate: createRestockMutate, isPending: restockPending } = createRestockRequest

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

    const lowStockCount = inventory.filter(i => i.quantity <= LOW_STOCK_THRESHOLD).length;

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
                        {lowStockCount > 0 && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low on stock
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <RouterLink
                            to="/pharmacy/restock-requests"
                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 font-medium rounded-lg transition-colors text-sm"
                        >
                            <PackageSearch className="w-4 h-4" />
                            Restock Requests
                        </RouterLink>
                        <div className="relative">
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

                {/* Add Stock Modal */}
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

                {/* Restock Request Modal */}
                {restockModal && (
                    <RestockRequestModal
                        medicine={restockModal}
                        agents={agents}
                        isPending={restockPending}
                        onSubmit={(data) => {
                            createRestockMutate({
                                medicine_id: restockModal.medicine_id,
                                delivery_agent_id: data.delivery_agent_id || null,
                                quantity_requested: parseInt(data.quantity_requested),
                                price: parseFloat(data.price) || 0,
                                expiry_date: data.expiry_date || null,
                                notes: data.notes || null,
                            }, {
                                onSuccess: () => setRestockModal(null)
                            });
                        }}
                        onClose={() => setRestockModal(null)}
                    />
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
                                {inventory.length > 0 ? (
                                    inventory.map((item) => {
                                        const isLowStock = item.quantity <= LOW_STOCK_THRESHOLD
                                        return (
                                            <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${isLowStock ? 'bg-red-50/40' : ''}`}>
                                                <td className="py-4 text-gray-900 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {isLowStock && (
                                                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" title="Low Stock" />
                                                        )}
                                                        {item.medicine_name}
                                                        <span className="text-xs text-gray-400 font-normal">({item.type || item.dosage_form})</span>
                                                    </div>
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
                                                                            <span className="font-medium">Qty: {batch.quantity}</span>
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
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {item.quantity} units
                                                        {isLowStock && ' ⚠ Low'}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-gray-600">₹{item.price ? parseFloat(item.price).toFixed(2) : '-'}</td>
                                                <td className="py-4 text-gray-600">{item.nearest_expiry ? new Date(item.nearest_expiry).toLocaleDateString() : 'N/A'}</td>
                                                <td className="py-4 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => setSelectedMedicineId(selectedMedicineId === item.medicine_id ? null : item.medicine_id)}
                                                            className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                                                            {selectedMedicineId === item.medicine_id ? 'Hide Batches' : 'View Batches'}
                                                        </button>
                                                        {isLowStock && (
                                                            <button
                                                                onClick={() => setRestockModal({ medicine_id: item.medicine_id, medicine_name: item.medicine_name })}
                                                                className="text-orange-600 hover:text-orange-800 text-sm font-medium whitespace-nowrap"
                                                            >
                                                                Request Restock
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
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

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-4">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.totalItems)}</span> of <span className="font-medium">{pagination.totalItems}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded-md border border-gray-200">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    )
}

// ────────────────────────────────────────────────────────────
// Restock Request Modal
// ────────────────────────────────────────────────────────────
const RestockRequestModal = ({ medicine, agents, onSubmit, onClose, isPending }) => {
    const [form, setForm] = useState({
        quantity_requested: '',
        delivery_agent_id: '',
        price: '',
        expiry_date: '',
        notes: '',
    })
    const [formError, setFormError] = useState('')

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.quantity_requested || parseInt(form.quantity_requested) <= 0) {
            setFormError('Please enter a valid quantity.')
            return
        }
        setFormError('')
        onSubmit(form)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Request Restock</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Medicine: <span className="font-semibold text-teal-700">{medicine.medicine_name}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quantity to Request <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="quantity_requested"
                            min="1"
                            placeholder="e.g. 100"
                            value={form.quantity_requested}
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            required
                        />
                    </div>

                    {/* Delivery Agent */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Select Delivery Agent
                        </label>
                        <select
                            name="delivery_agent_id"
                            value={form.delivery_agent_id}
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                        >
                            <option value="">-- Any available agent --</option>
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.full_name} {agent.is_available ? '✓ Available' : '(Busy)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Price per unit */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>
                        {/* Expected Expiry */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Expected Expiry Date</label>
                            <input
                                type="date"
                                name="expiry_date"
                                value={form.expiry_date}
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
                        <textarea
                            name="notes"
                            rows={2}
                            placeholder="Any special instructions..."
                            value={form.notes}
                            onChange={handleChange}
                            className="w-full border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                        />
                    </div>

                    {formError && <p className="text-xs text-red-500">{formError}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Sending...' : 'Send Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


// ────────────────────────────────────────────────────────────
// Add Stock Form (unchanged logic, kept here)
// ────────────────────────────────────────────────────────────
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

    const [medicineSearchTerm, setMedicineSearchTerm] = useState('');
    const [medicineResults, setMedicineResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedMedicineName, setSelectedMedicineName] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (medicineSearchTerm.length >= 2) {
                try {
                    const results = await searchMedicines(medicineSearchTerm);
                    setMedicineResults(results || []);
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
        setSelectedMedicineName(`${medicine.name} (${medicine.type || medicine.dosage_form})`);
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
                                        <p className="text-sm font-medium text-gray-900">{med.name} <span className="text-xs text-gray-500">({med.manufacturer || med.brand})</span></p>
                                        <p className="text-xs text-gray-500">{med.type || med.dosage_form} • {med.pack_size || med.strength}</p>
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
