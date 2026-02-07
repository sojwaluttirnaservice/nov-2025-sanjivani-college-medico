import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
    const { data: orders, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['myOrders'],
        queryFn: async () => {
            const response = await api.get('/orders/my-orders');
            return response.data;
        }
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl border border-gray-100 mb-4 shadow-sm"
            onPress={() => { /* Navigate to detail - Future Scope */ }}
        >
            <View className="flex-row justify-between items-start mb-3">
                <View>
                    <Text className="text-xs text-gray-500 font-medium mb-1">ORDER #{item.id}</Text>
                    <Text className="text-base font-bold text-gray-900">{item.pharmacy_name}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${item.order_status === 'DELIVERED' ? 'bg-green-100' :
                    item.order_status === 'CANCELLED' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                    <Text className={`text-xs font-bold ${item.order_status === 'DELIVERED' ? 'text-green-700' :
                        item.order_status === 'CANCELLED' ? 'text-red-700' : 'text-blue-700'
                        }`}>
                        {item.order_status}
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
                <Text className="text-gray-500 text-sm">
                    Total Amount
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                    ₹{item.total_amount}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading && !isRefetching) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900">My Orders</Text>
            </View>

            {orders && orders.length > 0 ? (
                <FlatList
                    data={orders}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 24 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                    }
                />
            ) : (
                <View className="flex-1 items-center justify-center p-6">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
                        <Ionicons name="receipt-outline" size={48} color="#2563EB" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</Text>
                    <Text className="text-gray-500 text-center text-base">
                        Your order history will appear here once you place an order with a pharmacy.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}
