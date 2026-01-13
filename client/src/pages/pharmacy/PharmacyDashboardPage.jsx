import React from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { TrendingUp, AlertCircle, ShoppingBag, Settings } from 'lucide-react'

const PharmacyDashboardPage = () => {
    const user = useSelector(selectCurrentUser)

    // Mock Pharmacy Details (would come from API join with user)
    const pharmacyDetails = {
        name: "Sanjivani Medicos",
        license: "MH-P-123456",
        verified: true,
        address: "123 Main St, Kopargaon"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹45,231</h3>
                            <span className="text-green-600 text-sm font-medium flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> +12.5%
                            </span>
                        </div>
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Orders</p>
                            <h3 className="text-2xl font-bold text-gray-900">12</h3>
                            <span className="text-gray-500 text-sm font-medium mt-1">
                                4 Ready for Pickup
                            </span>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-gray-900">5</h3>
                            <span className="text-red-500 text-sm font-medium mt-1">
                                Needs Attention
                            </span>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Recent Activity & Alerts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders Preview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                        <div className="space-y-4">
                            {[
                                { id: 102, customer: 'Jane Smith', amount: '450.00', status: 'ready', time: '2 mins ago' },
                                { id: 101, customer: 'John Doe', amount: '125.00', status: 'processing', time: '15 mins ago' },
                                { id: 100, customer: 'Mike Ross', amount: '85.50', status: 'picked_up', time: '1 hr ago' }
                            ].map(order => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">Order #{order.id}</p>
                                        <p className="text-xs text-gray-500">{order.customer} • {order.time}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">₹{order.amount}</p>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-teal-600 font-medium hover:bg-teal-50 rounded-lg transition-colors">
                            View All Orders
                        </button>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
                </div>
            </Container>
        </div>
    )
}

export default PharmacyDashboardPage
