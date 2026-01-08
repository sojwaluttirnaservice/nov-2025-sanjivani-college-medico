import React, { useState } from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { Package, TrendingUp, AlertCircle, ShoppingBag, Settings, Plus, Search, Filter } from 'lucide-react'

// Mock Data based on Schema
const mockInventory = [
    { id: 1, medicine: 'Paracetamol 500mg', quantity: 450, price: 25.00, expiry: '2025-12-31' },
    { id: 2, medicine: 'Amoxicillin 250mg', quantity: 20, price: 85.50, expiry: '2024-10-15' },
    { id: 3, medicine: 'Cetirizine 10mg', quantity: 100, price: 15.00, expiry: '2026-05-20' },
]

const mockOrders = [
    { id: 101, customer: 'John Doe', total: 125.00, status: 'processing', date: '2024-01-15' },
    { id: 102, customer: 'Jane Smith', total: 450.00, status: 'ready', date: '2024-01-14' },
    { id: 103, customer: 'Bob Wilson', total: 85.00, status: 'picked_up', date: '2024-01-14' },
]

const PharmacyDashboardPage = () => {
    const user = useSelector(selectCurrentUser)
    const [activeTab, setActiveTab] = useState('inventory')

    // Mock Pharmacy Details (would come from API join with user)
    const pharmacyDetails = {
        name: "Sanjivani Medicos",
        license: "MH-P-123456",
        verified: true,
        address: "123 Main St, Kopargaon"
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
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

                {/* Main Content Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100">
                        <nav className="flex gap-6 px-6">
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'inventory'
                                        ? 'border-teal-600 text-teal-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Inventory Management
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders'
                                        ? 'border-teal-600 text-teal-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Recent Orders
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'inventory' && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search medicines..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        />
                                    </div>
                                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors">
                                        <Plus className="w-4 h-4" />
                                        Add New Stock
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                                                <th className="py-4 font-semibold">Medicine Name</th>
                                                <th className="py-4 font-semibold">Stock Qty</th>
                                                <th className="py-4 font-semibold">Price/Unit</th>
                                                <th className="py-4 font-semibold">Expiry Date</th>
                                                <th className="py-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {mockInventory.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 text-gray-900 font-medium">{item.medicine}</td>
                                                    <td className="py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.quantity < 30 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {item.quantity} units
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-gray-600">₹{item.price.toFixed(2)}</td>
                                                    <td className="py-4 text-gray-600">{item.expiry}</td>
                                                    <td className="py-4 text-right">
                                                        <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Incoming Orders</h3>
                                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                        <Filter className="w-4 h-4" /> Filter
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {mockOrders.map((order) => (
                                        <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-100 transition-colors">
                                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                                                    <p className="text-sm text-gray-500">{order.customer} • {order.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                <span className="font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                                <button className="text-sm font-medium text-teal-600 hover:text-teal-800">
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default PharmacyDashboardPage
