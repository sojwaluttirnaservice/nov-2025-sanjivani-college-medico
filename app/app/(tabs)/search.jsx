import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch customer profile to get default location
    const { data: profileData } = useQuery({
        queryKey: ['customerProfile'],
        queryFn: async () => {
            const response = await api.get('/customers/profile');
            return response.data;
        },
    });

    const profile = profileData?.exists && Array.isArray(profileData.profile) ? profileData.profile[0] :
        profileData?.exists ? profileData.profile : null;
    const defaultCity = profile?.city || '';

    // Fetch pharmacies with search and location
    const { data: pharmaciesData, isLoading, refetch } = useQuery({
        queryKey: ['pharmacies', searchQuery, defaultCity],
        queryFn: async () => {
            const params = new URLSearchParams();

            if (searchQuery) {
                params.append('search', searchQuery);
            }
            // Always append city if available to provide ranking context (Rank 1 vs Rank 3)
            if (defaultCity) {
                params.append('city', defaultCity);
            }

            const queryString = params.toString();
            const url = queryString ? `/pharmacies?${queryString}` : '/pharmacies';

            const response = await api.get(url);
            return response.data;
        },
        enabled: true, // Always matching
    });

    const pharmacies = pharmaciesData?.pharmacies || [];

    const handleSearch = () => {
        refetch();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/pharmacy/${item.pharmacy_id}`)}
            className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100"
        >
            <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                    <Ionicons name="medical" size={24} color="#16A34A" />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{item.pharmacy_name}</Text>
                    <Text className="text-gray-500 text-sm mt-1">{item.address}, {item.city}</Text>
                    <View className="flex-row items-center mt-2 justify-between">
                        <View className="flex-row items-center">
                            <Ionicons name="call" size={14} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">{item.contact_no}</Text>
                        </View>
                        {item.city === defaultCity && (
                            <View className="bg-blue-100 px-2 py-1 rounded">
                                <Text className="text-blue-600 text-[10px] font-bold">NEARBY</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="p-4 flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-4">Find Pharmacies</Text>

                <View className="flex-row items-center space-x-2 mb-6">
                    <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-2 text-gray-800"
                            placeholder={defaultCity ? `Search in ${defaultCity}...` : "Search by name or city..."}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={handleSearch}
                        className="bg-blue-600 p-3.5 rounded-xl justify-center items-center"
                    >
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#2563EB" className="mt-10" />
                ) : (
                    <FlatList
                        data={pharmacies}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.pharmacy_id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-20">
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-500 text-lg mt-4">No pharmacies found</Text>
                                <Text className="text-gray-400 text-base text-center mt-2 px-10">
                                    {searchQuery
                                        ? `We couldn't find any pharmacies matching "${searchQuery}"`
                                        : "Try searching for a pharmacy name or city"}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
