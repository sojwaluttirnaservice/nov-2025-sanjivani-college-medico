import React, { useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { MapPin, Truck, Phone, ToggleLeft, ToggleRight } from 'lucide-react'

const DeliveryDashboardPage = () => {
    const user = useSelector(selectCurrentUser)
    const [isAvailable, setIsAvailable] = useState(true)

    // Mock Delivery Agent Details
    const agentDetails = {
        name: user?.name || "Robert D.",
        vehicle: "MH-17-AB-1234",
        phone: "+91 9988776655",
        location: "Kopargaon Ops Center"
    }

    return (
        <div className="bg-gray-50 min-h-full">
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

                {/* Left Column: Mini Stats */}
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

                {/* Welcome Message */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to your Dashboard</h3>
                    <p className="text-gray-500">View tasks and manage your profile from the sidebar.</p>
                </div>
            </Container>
        </div>
    )
}

export default DeliveryDashboardPage
