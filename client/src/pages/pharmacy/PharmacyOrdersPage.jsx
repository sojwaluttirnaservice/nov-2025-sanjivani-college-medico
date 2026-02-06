import React from 'react'
import Container from '../../components/utils/Container'
import { Filter, Package, Loader } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { useOrders } from '../../hooks/useOrders'

const PharmacyOrdersPage = () => {
    const user = useSelector(selectCurrentUser)
    const pharmacyId = user?.pharmacy_id
    const { ordersQuery } = useOrders(pharmacyId)
    const { data: ordersData, isLoading, error } = ordersQuery
    const orders = ordersData?.orders || []

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        Failed to load orders. Please try again.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-100 transition-colors">
                                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                                            <p className="text-sm text-gray-500">{order.customer_name} • {new Date(order.placed_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <span className="font-bold text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                            order.order_status === 'ready' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.order_status?.replace('_', ' ')}
                                        </span>
                                        <button className="text-sm font-medium text-teal-600 hover:text-teal-800">
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No orders found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default PharmacyOrdersPage
