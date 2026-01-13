import React from 'react'
import Container from '../../components/utils/Container'
import { Loader } from 'lucide-react'
// import { useDelivery } from '../../hooks/useDelivery'

const DeliveryHistoryPage = () => {
    // const { useHistoryQuery } = useDelivery()
    // const { data: history, isLoading, error } = useHistoryQuery()

    // TEMPORARY: Mock Data
    const isLoading = false;
    const error = null;
    const history = [
        { id: 99, customer_name: 'Mike Ross', delivered_at: '2024-01-14', total_amount: 40 },
        { id: 98, customer_name: 'Rachel Zane', delivered_at: '2024-01-13', total_amount: 35 },
    ];

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery History</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        Failed to load history. Please try again.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history && history.length > 0 ? (
                            history.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Order #{item.id}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.delivered_at ? new Date(item.delivered_at).toLocaleDateString() : 'Date N/A'} • {item.customer_name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">+ ₹{parseFloat(item.total_amount || 0).toFixed(2)}</p>
                                        <p className="text-xs text-gray-400">Total Order</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No history available.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default DeliveryHistoryPage
