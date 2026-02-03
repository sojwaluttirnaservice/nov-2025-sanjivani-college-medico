import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrdersScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center p-6" edges={[]}>
            <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-6">
                {/* Icon place holder */}
                <Text className="text-4xl">📦</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</Text>
            <Text className="text-gray-500 text-center text-base">
                Your order history will appear here once you place an order with a pharmacy.
            </Text>
        </SafeAreaView>
    );
}
