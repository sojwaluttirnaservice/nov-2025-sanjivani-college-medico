import React from 'react'
import Container from '../../components/utils/Container'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../redux/slices/authSlice'
import { User, Mail, MapPin, Store } from 'lucide-react'

const PharmacyProfilePage = () => {
    const user = useSelector(selectCurrentUser)

    return (
        <Container>
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-teal-600 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="h-32 w-32 bg-white rounded-full p-2 inline-block">
                            <div className="h-full w-full bg-teal-100 rounded-full flex items-center justify-center text-4xl font-bold text-teal-700 border-4 border-white">
                                {user?.email?.[0]?.toUpperCase() || 'P'}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pharmacy Name</h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> 123 Main St, Kopargaon
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Email Address</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {user?.email}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Role</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <Store className="w-4 h-4 text-gray-400" />
                                    {user?.role}
                                </div>
                            </div>
                        </div>

                        <div>
                            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default PharmacyProfilePage
