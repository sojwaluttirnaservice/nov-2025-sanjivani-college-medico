import { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function SearchScreen() {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPharmacies = async (query = '') => {
        try {
            setLoading(true);
            const url = query ? `/pharmacies?search=${query}` : '/pharmacies';
            const response = await api.get(url);

            if (response.success) {
                setPharmacies(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
            Alert.alert('Error', error.message || 'Failed to fetch pharmacies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const handleSearch = () => {
        fetchPharmacies(searchQuery);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity className="bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
            <View className="flex-row items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                    <Ionicons name="medical" size={24} color="#16A34A" />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{item.pharmacy_name}</Text>
                    <Text className="text-gray-500 text-sm mt-1">{item.address}, {item.city}</Text>
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="call" size={14} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1">{item.contact_no}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={[]}>
            <View className="p-4">
                <Text className="text-2xl font-bold text-gray-900 mb-4">Find Pharmacies</Text>

                <View className="flex-row items-center space-x-2 mb-6">
                    <View className="flex-1 flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-2 text-gray-800"
                            placeholder="Search by name or city..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSearch}
                        className="bg-blue-600 p-3.5 rounded-xl justify-center items-center"
                    >
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563EB" className="mt-10" />
                ) : (
                    <FlatList
                        data={pharmacies}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.pharmacy_id.toString()}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-20">
                                <Text className="text-gray-500 text-lg">No pharmacies found.</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
