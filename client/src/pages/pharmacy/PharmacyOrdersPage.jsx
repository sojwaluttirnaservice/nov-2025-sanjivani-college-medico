import React from 'react'
import Container from '../../components/utils/Container'
import { Filter, Package, Loader } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { useOrders } from '../../hooks/useOrders'

const PharmacyOrdersPage = () => {
    const user = useSelector(selectCurrentUser)
    const pharmacyId = user?.pharmacy_id
    const { ordersQuery, markDelivered, rejectOrder } = useOrders(pharmacyId)
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
                                            order.order_status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                order.order_status === 'ready' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.order_status?.replace('_', ' ')}
                                        </span>

                                        {order.order_status !== 'DELIVERED' && order.order_status !== 'CANCELLED' && (
                                            <div className="flex gap-2">
                                                <RejectButton
                                                    onConfirm={() => rejectOrder.mutate(order.id)}
                                                    isLoading={rejectOrder.isPending}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to mark this order as delivered? Use this only after collecting payment.')) {
                                                            markDelivered.mutate(order.id)
                                                        }
                                                    }}
                                                    disabled={markDelivered.isPending}
                                                    className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-teal-700 disabled:opacity-50"
                                                >
                                                    {markDelivered.isPending ? 'Updating...' : 'Mark Delivered'}
                                                </button>
                                            </div>
                                        )}
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

import { useState, useEffect } from 'react'

const RejectButton = ({ onConfirm, isLoading }) => {
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        if (confirming) {
            const timer = setTimeout(() => setConfirming(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [confirming]);

    return (
        <button
            onClick={() => {
                if (confirming) {
                    onConfirm();
                    setConfirming(false);
                } else {
                    setConfirming(true);
                }
            }}
            disabled={isLoading}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors ${confirming
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-white border border-red-200 text-red-500 hover:bg-red-50'
                }`}
        >
            {isLoading ? '...' : confirming ? 'Confirm Reject?' : 'Reject'}
        </button>
    );
};
