import React from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Truck, History, UserCircle } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'

const DeliveryLayout = () => {
    // Delivery Agent specific navigation links
    const links = [
        { label: 'Dashboard', path: '/delivery/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Active Tasks', path: '/delivery/active', icon: Truck },
        { label: 'History', path: '/delivery/history', icon: History },
        { label: 'Profile', path: '/delivery/profile', icon: UserCircle },
    ]

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <Sidebar roleName="Delivery Agent" links={links} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <DashboardNavbar />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DeliveryLayout
