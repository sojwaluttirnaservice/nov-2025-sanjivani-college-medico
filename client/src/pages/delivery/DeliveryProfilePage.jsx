import React, { useState, useEffect } from 'react'
import Container from '../../components/utils/Container'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUser } from '../../redux/slices/authSlice'
import { Save, Loader, Edit2, Truck } from 'lucide-react'
import { instance } from '../../utils/instance'
import { showSuccess, showError } from '../../utils/error'

const DeliveryProfilePage = () => {
    const user = useSelector(selectCurrentUser)
    const dispatch = useDispatch()

    const [profile, setProfile] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        vehicle_number: '',
    })

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoadingProfile(true)
                const { data: profileData } = await instance.get('/deliveries/profile')
                console.log(profileData)
                if (profileData) {
                    setProfile(profileData)
                    setForm({
                        full_name: profileData.full_name || '',
                        phone: profileData.phone || '',
                        vehicle_number: profileData.vehicle_number || '',
                    })
                } else {
                    // No profile yet — open edit mode automatically
                    setEditing(true)
                }
            } catch (err) {
                console.error('Failed to load profile', err)
                setEditing(true)
            } finally {
                setLoadingProfile(false)
            }
        }
        fetchProfile()
    }, [])

    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.full_name || !form.phone) {
            showError(null, 'Name and phone are required')
            return
        }
        try {
            setSaving(true)
            const { data: updatedProfile } = await instance.put('/deliveries/profile', form)
            setProfile(updatedProfile)
            // Update agent_id in Redux so supply requests start loading
            if (updatedProfile?.agent_id) {
                dispatch(updateUser({ agent_id: updatedProfile.agent_id }))
            }
            showSuccess('Profile saved!')
            setEditing(false)
        } catch (err) {
            showError(err, 'Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    if (loadingProfile) {
        return (
            <Container>
                <div className="flex justify-center items-center h-64">
                    <Loader className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Banner */}
                <div className="bg-linear-to-r from-teal-500 to-emerald-600 h-28 relative">
                    <div className="absolute bottom-0 left-8 translate-y-1/2">
                        <div className="h-20 w-20 bg-white rounded-full p-1.5 shadow-md">
                            <div className="h-full w-full bg-teal-100 rounded-full flex items-center justify-center text-3xl font-bold text-teal-700">
                                {(form.full_name || user?.email || 'D')[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 pt-14 pb-8">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {profile?.full_name || 'Set Up Your Profile'}
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                <Truck className="w-3.5 h-3.5" />
                                Delivery Partner · {user?.email}
                            </p>
                        </div>
                        {profile && !editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Card: no profile yet */}
                    {!profile && !editing && (
                        <div className="text-center py-8 text-gray-400">
                            <User className="w-10 h-10 mx-auto mb-2 opacity-25" />
                            <p className="text-sm">No profile set up yet.</p>
                            <button
                                onClick={() => setEditing(true)}
                                className="mt-3 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition"
                            >
                                Create Profile
                            </button>
                        </div>
                    )}

                    {/* View Mode */}
                    {profile && !editing && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard label="Full Name" value={profile.full_name} emoji="👤" />
                            <InfoCard label="Phone" value={profile.phone} emoji="📞" />
                            <InfoCard label="Vehicle Number" value={profile.vehicle_number || '—'} emoji="🚗" />
                        </div>
                    )}

                    {/* Edit / Create Form */}
                    {editing && (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXXXXXXX"
                                    required
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                                    Vehicle Number
                                </label>
                                <input
                                    type="text"
                                    name="vehicle_number"
                                    value={form.vehicle_number}
                                    onChange={handleChange}
                                    placeholder="e.g. MH-17-AB-1234"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                {profile && (
                                    <button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>

                            {!profile && (
                                <p className="text-xs text-gray-400 mt-1">
                                    ⚡ Saving your profile registers you as a delivery agent — pharmacies can assign restock requests to you.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </Container>
    )
}

const InfoCard = ({ label, value, emoji = '•' }) => (
    <div className="p-4 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">{label}</p>
        <div className="flex items-center gap-2 text-gray-900 font-medium">
            <span className="text-gray-400">{emoji}</span>
            {value}
        </div>
    </div>
)

export default DeliveryProfilePage
