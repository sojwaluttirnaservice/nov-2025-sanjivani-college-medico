import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../store/authStore';

export default function HomeScreen() {
    const { user } = useAuthStore();

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

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={[]}>
            <StatusBar style="dark" />
            <ScrollView className="flex-1 p-5">

                {/* Header */}
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-gray-500 text-sm">Welcome back,</Text>
                        <Text className="text-2xl font-bold text-gray-900">
                            {user?.email ? user.email.split('@')[0] : 'Guest'}
                        </Text>
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

                {/* Recent Section */}
                <View className="mb-4 flex-row justify-between items-end">
                    <Text className="text-lg font-bold text-gray-900">Popular Pharmacies</Text>
                    <Link href="/(tabs)/search" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 text-sm font-semibold">See All</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                {/* Placeholder for list calling API, but just static for Home */}
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-gray-100 rounded-lg mr-4 bg-gray-200 animate-pulse" />
                        <View className="flex-1 space-y-2">
                            <View className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                            <View className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
