import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import api from '../../services/api';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customers/profile');
            if (response.success && response.data?.exists) {
                const profileData = response.data.profile;
                if (Array.isArray(profileData) && profileData.length > 0) {
                    setProfile(profileData[0]);
                } else if (!Array.isArray(profileData) && profileData) {
                    setProfile(profileData);
                } else {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
        } catch (error) {
            console.log("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    if (loading && !profile) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center" edges={['top']}>
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="bg-white pb-8 pt-4 rounded-b-3xl shadow-sm mb-6">
                    <View className="items-center">
                        <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
                            <Text className="text-3xl font-bold text-blue-600">
                                {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 text-center px-4">
                            {profile?.full_name || user?.email}
                        </Text>
                        <Text className="text-gray-500 capitalize">{user?.role || 'Customer'}</Text>

                        {profile?.phone && (
                            <Text className="text-gray-400 text-sm mt-1">{profile.phone}</Text>
                        )}
                    </View>
                </View>

                <View className="px-4 space-y-3">
                    {!profile && (
                        <View className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4 flex-row items-center">
                            <Ionicons name="alert-circle" size={24} color="#F97316" />
                            <View className="ml-3 flex-1">
                                <Text className="text-orange-800 font-bold">Profile Incomplete</Text>
                                <Text className="text-orange-600 text-xs">Please complete your profile to place orders.</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => router.push('/profile/edit')}
                                className="bg-orange-500 px-3 py-1.5 rounded-lg"
                            >
                                <Text className="text-white text-xs font-bold">Complete</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <TouchableOpacity
                            onPress={() => router.push('/profile/edit')}
                            className="flex-row items-center p-4 border-b border-gray-100"
                        >
                            <View className="w-8 h-8 bg-blue-50 rounded-lg items-center justify-center mr-3">
                                <Ionicons name="person" size={16} color="#3B82F6" />
                            </View>
                            <Text className="flex-1 text-gray-700 font-medium">Edit Profile</Text>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center p-4">
                            <View className="w-8 h-8 bg-purple-50 rounded-lg items-center justify-center mr-3">
                                <Ionicons name="settings" size={16} color="#A855F7" />
                            </View>
                            <Text className="flex-1 text-gray-700 font-medium">Settings</Text>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {profile && (
                        <View className="bg-white rounded-xl overflow-hidden shadow-sm mt-4 p-4">
                            <Text className="text-gray-900 font-bold mb-3">Saved Address</Text>
                            <View className="flex-row items-start">
                                <Ionicons name="location" size={18} color="#6B7280" style={{ marginTop: 2 }} />
                                <Text className="text-gray-600 ml-2 flex-1 leading-5">
                                    {profile.address}, {profile.city} - {profile.pincode}
                                </Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center bg-white p-4 rounded-xl shadow-sm mt-6 mb-10"
                    >
                        <View className="w-8 h-8 bg-red-50 rounded-lg items-center justify-center mr-3">
                            <Ionicons name="log-out" size={16} color="#EF4444" />
                        </View>
                        <Text className="flex-1 text-red-500 font-medium">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
