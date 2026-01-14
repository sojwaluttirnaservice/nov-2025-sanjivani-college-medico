import React from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Pill, Package, UserCircle } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'

const PharmacyLayout = () => {
    // Pharmacy-specific navigation links
    const links = [
        { label: 'Dashboard', path: '/pharmacy/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Inventory', path: '/pharmacy/inventory', icon: Pill },
        { label: 'Orders', path: '/pharmacy/orders', icon: Package },
        { label: 'Profile', path: '/pharmacy/profile', icon: UserCircle },
    ]

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <Sidebar roleName="Pharmacy" links={links} />

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

export default PharmacyLayout
