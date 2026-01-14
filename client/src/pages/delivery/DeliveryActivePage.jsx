import React from 'react'
import Container from '../../components/utils/Container'
import { CheckCircle, Phone, MapPin, Navigation, Loader } from 'lucide-react'
// import { useDelivery } from '../../hooks/useDelivery'

const DeliveryActivePage = () => {
    // const { useActiveDeliveriesQuery } = useDelivery()
    // const { data: deliveries, isLoading, error } = useActiveDeliveriesQuery()

    // TEMPORARY: Mock Data
    const isLoading = false;
    const error = null;
    const deliveries = [
        { id: 101, customer_name: 'John Doe', customer_phone: '9876543210', delivery_address: 'Plot 4, Main Road, Kopargaon', order_status: 'assigned' },
        { id: 102, customer_name: 'Alice Brown', customer_phone: '9876500000', delivery_address: 'Flat 202, Sunshine Apts, Shirdi', order_status: 'picked_up' },
    ];

    return (
        <Container>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Current Deliveries</h2>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        Failed to load deliveries. Please try again.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {deliveries && deliveries.length > 0 ? (
                            deliveries.map((delivery) => (
                                <div key={delivery.id} className="border border-gray-200 rounded-xl p-5 hover:border-teal-100 transition-colors bg-white">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900">Order #{delivery.id}</h3>
                                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase rounded-full">
                                                    {delivery.order_status?.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm">{delivery.customer_name}</p>
                                        </div>
                                        {delivery.customer_phone && (
                                            <a href={`tel:${delivery.customer_phone}`} className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {delivery.delivery_address}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                            <Navigation className="w-4 h-4" />
                                            Navigate
                                        </button>
                                        <button className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
                                            Mark Delivered
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                                <p className="text-gray-500">No active deliveries at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default DeliveryActivePage
