import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Truck, History, UserCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'
import { instance } from '../utils/instance'
import { updateUser } from '../redux/slices/authSlice'

const DeliveryLayout = () => {
    const dispatch = useDispatch()

    // Sync profile on mount to ensure agent_id is present in auth state
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await instance.get('/users/me')
                // axios wraps body in response.data; sendSuccess wraps in {success, data: {user}}
                if (response.data?.success && response.data?.data?.user) {
                    dispatch(updateUser(response.data.data.user))
                }
            } catch (err) {
                console.error("Failed to sync delivery profile:", err)
            }
        }
        fetchProfile()
    }, [dispatch])

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
