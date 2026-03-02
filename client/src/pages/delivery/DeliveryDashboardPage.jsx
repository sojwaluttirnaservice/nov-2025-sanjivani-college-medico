import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { MapPin, Truck, Phone, ToggleLeft, ToggleRight, PackageSearch, CheckCircle, Loader, Clock } from 'lucide-react'
import { useAgentRestock } from '../../hooks/useRestock'

const DeliveryDashboardPage = () => {
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser)
    const [isAvailable, setIsAvailable] = useState(true)

    // The delivery agent ID comes from the user object (agent_id field)
    const agentId = user?.agent_id

    const { agentRestockQuery, fulfillRequest } = useAgentRestock(agentId)
    const { data: restockRequests = [], isLoading: loadingRestock } = agentRestockQuery
    const { mutate: fulfillMutate, isPending: fulfilling } = fulfillRequest

    const agentDetails = {
        name: user?.name || "Delivery Agent",
        vehicle: user?.vehicle_number || "Vehicle N/A",
        phone: user?.phone || "N/A",
        location: user?.current_location || "Not set"
    }

    return (
        <div className="bg-gray-50 min-h-full">
            <Container>
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-2xl">
                                {user?.email?.[0].toUpperCase() || 'D'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{agentDetails.name}</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Truck className="w-4 h-4" />
                                    <span>{agentDetails.vehicle}</span>
                                    <span className="hidden md:inline">•</span>
                                    <Phone className="w-4 h-4 ml-2 md:ml-0" />
                                    <span>{agentDetails.phone}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                            <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                                {isAvailable ? 'You are Online' : 'You are Offline'}
                            </span>
                            <button
                                onClick={() => setIsAvailable(!isAvailable)}
                                className="text-teal-600 focus:outline-none"
                            >
                                {isAvailable ? (
                                    <ToggleRight className="w-10 h-10 fill-current text-green-500" />
                                ) : (
                                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="bg-linear-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="text-teal-100 font-medium mb-1">Total Earnings</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">₹1,250</span>
                            <span className="text-sm text-teal-200">/ today</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20 flex gap-4">
                            <div>
                                <p className="text-xs text-teal-100">Completed</p>
                                <p className="font-bold text-lg">8</p>
                            </div>
                            <div>
                                <p className="text-xs text-teal-100">Pending</p>
                                <p className="font-bold text-lg">2</p>
                            </div>
                            <div>
                                <p className="text-xs text-teal-100">Hours</p>
                                <p className="font-bold text-lg">4.5</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Current Location</h3>
                        <div className="flex items-center gap-3 text-gray-600 mb-2">
                            <MapPin className="w-5 h-5 text-teal-600" />
                            <span>{agentDetails.location}</span>
                        </div>
                        <p className="text-xs text-gray-400 pl-8">Last updated: 5 mins ago</p>
                    </div>
                </div>

                {/* ─── SUPPLY REQUESTS SECTION ─── */}
                {!agentId ? (
                    <div className="bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm p-6 text-center mb-6">
                        <h2 className="text-xl font-bold text-yellow-800 mb-2">Profile Incomplete</h2>
                        <p className="text-yellow-700 mb-6 font-medium">You must complete your delivery agent profile before you can receive and fulfill supply requests.</p>
                        <button onClick={() => navigate('/delivery/profile')} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer">
                            Complete Profile
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <PackageSearch className="w-5 h-5 text-orange-500" />
                                <h2 className="text-lg font-bold text-gray-900">Supply Requests</h2>
                                {restockRequests.length > 0 && (
                                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {restockRequests.length}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">Auto-refreshes every 30s</p>
                        </div>

                        {loadingRestock ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader className="w-6 h-6 text-teal-500 animate-spin" />
                            </div>
                        ) : restockRequests.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <PackageSearch className="w-10 h-10 mx-auto mb-2 opacity-25" />
                                <p className="text-sm">No pending supply requests.</p>
                                <p className="text-xs mt-1">When a pharmacy requests medicine restock, it will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {restockRequests.map(request => (
                                    <div
                                        key={request.id}
                                        className="border border-orange-100 rounded-xl p-4 bg-orange-50/30 hover:bg-orange-50 transition-colors"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            {/* Medicine + Pharmacy Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-gray-900">{request.medicine_name}</span>
                                                    <span className="text-xs text-gray-400">({request.dosage_form})</span>
                                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        <Clock className="w-3 h-3" />
                                                        {request.status}
                                                    </span>
                                                    {!request.delivery_agent_id ? (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Open</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">Assigned to You</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                                                    <span>
                                                        <span className="font-medium">Qty needed:</span>{' '}
                                                        <span className="text-orange-700 font-semibold">{request.quantity_requested} units</span>
                                                    </span>
                                                    <span>
                                                        <span className="font-medium">Pharmacy:</span> {request.pharmacy_name}
                                                    </span>
                                                    {request.pharmacy_phone && (
                                                        <span>
                                                            <span className="font-medium">Phone:</span> {request.pharmacy_phone}
                                                        </span>
                                                    )}
                                                    {request.pharmacy_address && (
                                                        <span>
                                                            <span className="font-medium">Address:</span> {request.pharmacy_address}
                                                        </span>
                                                    )}
                                                </div>
                                                {request.notes && (
                                                    <p className="text-xs italic text-gray-400 mt-1">Note: "{request.notes}"</p>
                                                )}
                                                <p className="text-xs text-gray-300 mt-1">
                                                    Requested: {new Date(request.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* Fulfill Button */}
                                            <button
                                                onClick={() => fulfillMutate(request.id)}
                                                disabled={fulfilling}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                {fulfilling ? 'Fulfilling...' : 'Mark as Fulfilled'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default DeliveryDashboardPage
