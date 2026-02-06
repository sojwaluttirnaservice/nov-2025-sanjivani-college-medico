import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Pill, Package, UserCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import Sidebar from '../components/dashboard/Sidebar'
import DashboardNavbar from '../components/dashboard/DashboardNavbar'
import { instance } from '../utils/instance'
import { updateUser } from '../redux/slices/authSlice'
import { setPharmacyProfile } from '../redux/slices/pharmacySlice'

const PharmacyLayout = () => {
    const dispatch = useDispatch()

    // Sync profile on mount to ensure pharmacy_id is present in auth state
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await instance.get('/users/me')
                if (response.success && response.data?.user) {
                    const profile = response.data.user
                    // Update both slices
                    dispatch(updateUser(profile))
                    dispatch(setPharmacyProfile(profile))
                }
            } catch (err) {
                console.error("Failed to sync pharmacy profile:", err)
            }
        }
        fetchProfile()
    }, [dispatch])

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
