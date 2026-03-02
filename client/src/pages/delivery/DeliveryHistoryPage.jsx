import React from 'react'
import Container from '../../components/utils/Container'
import { Loader, History, Package } from 'lucide-react'
import { useDelivery } from '../../hooks/useDelivery'

const DeliveryHistoryPage = () => {
    const { historyQuery } = useDelivery()
    const { data: history, isLoading, error } = historyQuery

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-teal-600" />
                    <h2 className="text-xl font-bold text-gray-900">Delivery History</h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        Failed to load history. Please try again.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history && history.length > 0 ? (
                            history.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
                                            <Package className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Order #{item.id}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.delivered_at
                                                    ? new Date(item.delivered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : 'Date N/A'
                                                }
                                                {item.customer_name ? ` • ${item.customer_name}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            + ₹{parseFloat(item.total_amount || 0).toFixed(2)}
                                        </p>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">
                                            Delivered
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                    <History className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No History Yet</h3>
                                <p className="text-gray-500 text-sm mt-1">Completed deliveries will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default DeliveryHistoryPage
