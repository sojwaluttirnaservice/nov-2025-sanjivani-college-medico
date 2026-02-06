import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Container from '../../components/utils/Container'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { TrendingUp, AlertCircle, ShoppingBag, Settings, Clipboard, Eye } from 'lucide-react'

import { useOrders } from '../../hooks/useOrders'
import { usePrescriptions } from '../../hooks/usePrescriptions'

const PharmacyDashboardPage = () => {
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser)
    const pharmacyId = user?.pharmacy_id
    const { statsQuery, ordersQuery } = useOrders(pharmacyId)
    const { requestsQuery } = usePrescriptions(pharmacyId)

    const { data: statsData } = statsQuery
    const { data: ordersData } = ordersQuery
    const { data: requestsData } = requestsQuery

    const stats = statsData?.stats || { total_revenue: 0, active_orders: 0, total_orders: 0 }
    const recentOrders = ordersData?.orders?.slice(0, 5) || []
    const pendingRequests = requestsData?.requests || []

    // Mock Pharmacy Details (would come from API join with user)
    const pharmacyDetails = {
        name: user?.pharmacy_name || "Pharmacy Dashboard",
        license: user?.license_no || "MH-P-XXXXXX",
        verified: !!user?.is_verified,
        address: user?.address || "Loading address..."
    }

    return (
        <div className="bg-gray-50 min-h-full">
            <Container>
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{pharmacyDetails.name}</h1>
                                {pharmacyDetails.verified && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full tracking-wider">
                                        Verified
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span>Lic No: {pharmacyDetails.license}</span>
                                <span className="hidden md:inline">•</span>
                                <span>{pharmacyDetails.address}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-6 h-6" />
                            </button>
                            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
                                {user?.email?.[0].toUpperCase() || 'P'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-xl font-bold text-gray-900">₹{stats.total_revenue}</h3>
                            <span className="text-green-600 text-[10px] font-medium flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> Confirmed
                            </span>
                        </div>
                        <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Incoming Requests</p>
                            <h3 className="text-xl font-bold text-gray-900">{pendingRequests.length}</h3>
                            <span className="text-orange-500 text-[10px] font-medium mt-1">
                                Needs Attention
                            </span>
                        </div>
                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg">
                            <Clipboard className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Orders</p>
                            <h3 className="text-xl font-bold text-gray-900">{stats.active_orders}</h3>
                            <span className="text-gray-500 text-[10px] font-medium mt-1">
                                Total: {stats.total_orders}
                            </span>
                        </div>
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
                            <h3 className="text-xl font-bold text-gray-900">5</h3>
                            <span className="text-red-500 text-[10px] font-medium mt-1">
                                Restock soon
                            </span>
                        </div>
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* NEW: Pending Prescription Requests */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Prescription Requests</h3>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                                {pendingRequests.length} NEW
                            </span>
                        </div>
                        <div className="space-y-4">
                            {pendingRequests.length > 0 ? (
                                pendingRequests.slice(0, 4).map(request => (
                                    <div key={request.id} className="p-3 bg-orange-50/30 border border-orange-50 rounded-xl hover:bg-orange-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-gray-900 text-sm">{request.customer_name}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">#{request.id}</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-3 line-clamp-1">{request.notes || 'No extra notes'}</p>
                                        <button
                                            onClick={() => navigate(`/pharmacy/prescriptions/${request.id}`)}
                                            className="w-full flex items-center justify-center gap-2 py-1.5 bg-white border border-orange-200 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors"
                                        >
                                            <Eye className="w-3 h-3" /> Review & Bill
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <Clipboard className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400">All caught up!</p>
                                </div>
                            )}
                        </div>
                        {pendingRequests.length > 4 && (
                            <button className="w-full mt-4 py-2 text-sm text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors">
                                View All Requests
                            </button>
                        )}
                    </div>

                    {/* Recent Orders Preview */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">Order #{order.id}</p>
                                            <p className="text-xs text-gray-500">{order.customer_name} • {new Date(order.placed_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{order.total_amount}</p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                order.order_status === 'ready' || order.order_status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                {order.order_status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No recent orders</p>
                            )}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                            View All Orders
                        </button>
                    </div>
                </div>

                {/* Low Stock Alerts (Moved below main grid or hidden if list is long) */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: 2, name: 'Amoxicillin 250mg', qty: 20, limit: 30 },
                            { id: 5, name: 'Metformin 500mg', qty: 15, limit: 50 },
                            { id: 8, name: 'Ibuprofen 400mg', qty: 10, limit: 40 }
                        ].map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 border border-red-100 bg-red-50/50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-xs text-red-600 font-medium">Only {item.qty} units left</p>
                                </div>
                                <div className="text-right">
                                    <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">
                                        Restock
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default PharmacyDashboardPage
