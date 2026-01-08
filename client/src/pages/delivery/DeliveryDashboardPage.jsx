import React, { useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { MapPin, Truck, Phone, Navigation, Clock, ToggleLeft, ToggleRight, CheckCircle } from 'lucide-react'

// Mock Data based on Schema
const mockDeliveries = [
    { id: 101, customer: 'John Doe', phone: '9876543210', address: 'Plot 4, Main Road, Kopargaon', status: 'assigned' },
    { id: 102, customer: 'Alice Brown', phone: '9876500000', address: 'Flat 202, Sunshine Apts, Shirdi', status: 'picked_up' },
]

const mockHistory = [
    { id: 99, customer: 'Mike Ross', date: '2024-01-14', earnings: 40 },
    { id: 98, customer: 'Rachel Zane', date: '2024-01-13', earnings: 35 },
]

const DeliveryDashboardPage = () => {
    const user = useSelector(selectCurrentUser)
    const [isAvailable, setIsAvailable] = useState(true)
    const [activeTab, setActiveTab] = useState('current')

    // Mock Delivery Agent Details
    const agentDetails = {
        name: user?.name || "Robert D.",
        vehicle: "MH-17-AB-1234",
        phone: "+91 9988776655",
        location: "Kopargaon Ops Center"
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Container>
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
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

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Current Tasks */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Current Task Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="border-b border-gray-100">
                                <nav className="flex gap-6 px-6">
                                    <button
                                        onClick={() => setActiveTab('current')}
                                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'current'
                                                ? 'border-teal-600 text-teal-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Current Deliveries
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('history')}
                                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history'
                                                ? 'border-teal-600 text-teal-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Delivery History
                                    </button>
                                </nav>
                            </div>

                            <div className="p-6">
                                {activeTab === 'current' && (
                                    <div className="space-y-4">
                                        {mockDeliveries.length > 0 ? (
                                            mockDeliveries.map((delivery) => (
                                                <div key={delivery.id} className="border border-gray-200 rounded-xl p-5 hover:border-teal-100 transition-colors bg-white">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-gray-900">Order #{delivery.id}</h3>
                                                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase rounded-full">
                                                                    {delivery.status.replace('_', ' ')}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-500 text-sm">{delivery.customer}</p>
                                                        </div>
                                                        <a href={`tel:${delivery.phone}`} className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors">
                                                            <Phone className="w-5 h-5" />
                                                        </a>
                                                    </div>

                                                    <div className="flex items-start gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            {delivery.address}
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

                                {activeTab === 'history' && (
                                    <div className="space-y-4">
                                        {mockHistory.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <p className="font-medium text-gray-900">Order #{item.id}</p>
                                                    <p className="text-xs text-gray-500">{item.date} • {item.customer}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">+ ₹{item.earnings}</p>
                                                    <p className="text-xs text-gray-400">Earned</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Mini Stats */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
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
                </div>
            </Container>
        </div>
    )
}

export default DeliveryDashboardPage
