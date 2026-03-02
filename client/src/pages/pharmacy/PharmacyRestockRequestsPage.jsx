import React, { useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { Loader, PackageSearch, CheckCircle, XCircle, Clock, Truck } from 'lucide-react'
import { useRestock } from '../../hooks/useRestock'

const STATUS_CONFIG = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800', iconColor: 'text-yellow-500' },
    fulfilled: { label: 'Fulfilled', icon: CheckCircle, color: 'bg-green-100 text-green-800', iconColor: 'text-green-500' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800', iconColor: 'text-red-500' },
    accepted: { label: 'Accepted', icon: Truck, color: 'bg-blue-100 text-blue-800', iconColor: 'text-blue-500' },
}

const PharmacyRestockRequestsPage = () => {
    const user = useSelector(state => state.auth.user)
    const pharmacyId = user?.pharmacy_id

    const { restockRequestsQuery, cancelRestockRequest } = useRestock(pharmacyId)
    const { data: requests = [], isLoading, error } = restockRequestsQuery
    const { mutate: cancelMutate, isPending: cancelling } = cancelRestockRequest

    const [filterStatus, setFilterStatus] = useState('all')

    const filteredRequests = filterStatus === 'all'
        ? requests
        : requests.filter(r => r.status === filterStatus)

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <PackageSearch className="w-5 h-5 text-teal-600" />
                            Restock Requests
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Track medicine supply requests sent to delivery agents</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'fulfilled', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${filterStatus === status
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">Failed to load restock requests. Please try again.</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <PackageSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No restock requests found.</p>
                        {filterStatus === 'all' && (
                            <p className="text-xs mt-1">When a medicine runs low, request a restock from the Inventory page.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredRequests.map(request => {
                            const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending
                            const StatusIcon = cfg.icon
                            return (
                                <div
                                    key={request.id}
                                    className="border border-gray-100 rounded-xl p-4 hover:border-teal-100 hover:bg-teal-50/30 transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                        {/* Left: Medicine + Agent Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900">{request.medicine_name}</span>
                                                <span className="text-xs text-gray-400">({request.dosage_form})</span>
                                            </div>
                                            <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                                                <span>
                                                    <span className="font-medium text-gray-700">Qty:</span> {request.quantity_requested} units
                                                </span>
                                                {request.price > 0 && (
                                                    <span>
                                                        <span className="font-medium text-gray-700">Price:</span> ₹{parseFloat(request.price).toFixed(2)}/unit
                                                    </span>
                                                )}
                                                {request.agent_name && (
                                                    <span>
                                                        <span className="font-medium text-gray-700">Agent:</span> {request.agent_name}
                                                    </span>
                                                )}
                                                {request.batch_no && (
                                                    <span>
                                                        <span className="font-medium text-gray-700">Batch:</span>{' '}
                                                        <code className="text-xs bg-gray-100 px-1 rounded">{request.batch_no}</code>
                                                    </span>
                                                )}
                                            </div>
                                            {request.expiry_date && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Expected Expiry: {new Date(request.expiry_date).toLocaleDateString()}
                                                </p>
                                            )}
                                            {request.notes && (
                                                <p className="text-xs italic text-gray-400 mt-1">"{request.notes}"</p>
                                            )}
                                        </div>

                                        {/* Right: Status + Actions */}
                                        <div className="flex items-center gap-3">
                                            {/* Status Badge */}
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                                <StatusIcon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
                                                {cfg.label}
                                            </span>

                                            {/* Cancel button only for pending */}
                                            {request.status === 'pending' && (
                                                <button
                                                    onClick={() => cancelMutate(request.id)}
                                                    disabled={cancelling}
                                                    className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
                                                >
                                                    {cancelling ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <p className="text-xs text-gray-300 mt-2">
                                        Requested on {new Date(request.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default PharmacyRestockRequestsPage
