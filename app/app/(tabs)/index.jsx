import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export default function HomeScreen() {
    const { user } = useAuthStore();

    // Fetch customer profile to get location
    const { data: profileData } = useQuery({
        queryKey: ['customerProfile'],
        queryFn: async () => {
            const response = await api.get('/customers/profile');
            return response.data;
        },
    });

    // Extract city and pincode
    const profile = profileData?.exists && Array.isArray(profileData.profile) ? profileData.profile[0] :
        profileData?.exists ? profileData.profile : null;

    const city = profile?.city || '';
    const pincode = profile?.pincode || '';

    // Fetch pharmacies based on location
    const { data: pharmaciesData, isLoading: loadingPharmacies } = useQuery({
        queryKey: ['pharmacies', city, pincode],
        queryFn: async () => {
            // Build query params
            const params = new URLSearchParams();
            if (city) params.append('city', city);
            if (pincode) params.append('pincode', pincode);

            const queryString = params.toString();
            const url = queryString ? `/pharmacies?${queryString}` : '/pharmacies';

            const response = await api.get(url);
            return response.data;
        },
        enabled: !!profileData, // Wait for profile data
    });

    const pharmacies = pharmaciesData?.pharmacies || [];

    const ActionCard = ({ title, icon, color, href }) => (
        <Link href={href} asChild>
            <TouchableOpacity className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 items-center justify-center space-y-2 h-32 mr-3 last:mr-0">
                <View className={`w-12 h-12 rounded-full items-center justify-center ${color}`}>
                    <Ionicons name={icon} size={24} color="white" />
                </View>
                <Text className="font-semibold text-gray-800 text-center text-xs">{title}</Text>
            </TouchableOpacity>
        </Link>
    );

    const PharmacyCard = ({ pharmacy }) => (
        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
            <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                    <Ionicons name="medical" size={24} color="#16A34A" />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900">{pharmacy.pharmacy_name}</Text>
                    <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                        {pharmacy.address}, {pharmacy.city}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={12} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1">
                            {pharmacy.city === city ? 'Nearby' : pharmacy.city}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <StatusBar style="dark" />
            <ScrollView className="flex-1 p-5">

                {/* Header */}
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-gray-500 text-sm">Welcome back,</Text>
                        <Text className="text-2xl font-bold text-gray-900">
                            {profile?.full_name || (user?.email ? user.email.split('@')[0] : 'Guest')}
                        </Text>
                        {city ? (
                            <View className="flex-row items-center mt-1">
                                <Ionicons name="location" size={14} color="#2563EB" />
                                <Text className="text-blue-600 text-xs ml-1 font-medium">{city}</Text>
                            </View>
                        ) : null}
                    </View>
                    <Link href="/(tabs)/profile" asChild>
                        <TouchableOpacity className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center border border-blue-200">
                            <Text className="font-bold text-blue-600 rounded-full">
                                {user?.email?.charAt(0).toUpperCase() || 'G'}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Hero Card */}
                <View className="w-full h-40 bg-blue-600 rounded-3xl p-6 justify-between shadow-lg shadow-blue-300 mb-8 overflow-hidden relative">
                    <View className="z-10">
                        <Text className="text-blue-100 font-medium mb-1">Upload Prescription</Text>
                        <Text className="text-white text-xl font-bold max-w-[70%]">Get your medicines delivered quickly</Text>
                        <TouchableOpacity className="bg-white px-4 py-2 rounded-full self-start mt-4">
                            <Text className="text-blue-600 font-bold text-xs">Order Now</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Decorative circles */}
                    <View className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500 rounded-full opacity-50" />
                    <View className="absolute right-10 -top-8 w-24 h-24 bg-blue-400 rounded-full opacity-30" />
                </View>

                {/* Quick Actions */}
                <Text className="text-lg font-bold text-gray-900 mb-4">Quick Actions</Text>
                <View className="flex-row justify-between mb-8">
                    <ActionCard title="Search" icon="search" color="bg-indigo-500" href="/(tabs)/search" />
                    <ActionCard title="Orders" icon="medical" color="bg-orange-500" href="/(tabs)/orders" />
                    <ActionCard title="Profile" icon="person" color="bg-teal-500" href="/(tabs)/profile" />
                </View>

                {/* Pharmacies Section */}
                <View className="mb-4 flex-row justify-between items-end">
                    <Text className="text-lg font-bold text-gray-900">
                        {city ? `Pharmacies in ${city}` : 'Popular Pharmacies'}
                    </Text>
                    <Link href="/(tabs)/search" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 text-sm font-semibold">See All</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {loadingPharmacies ? (
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                        <ActivityIndicator color="#2563EB" />
                    </View>
                ) : pharmacies.length > 0 ? (
                    pharmacies.slice(0, 5).map(pharmacy => (
                        <PharmacyCard key={pharmacy.pharmacy_id} pharmacy={pharmacy} />
                    ))
                ) : (
                    <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 items-center">
                        <Text className="text-gray-500 text-center mb-2">No pharmacies found in your area yet.</Text>
                        {!city && <Text className="text-blue-500 text-xs text-center">Update your profile to see local pharmacies</Text>}
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
