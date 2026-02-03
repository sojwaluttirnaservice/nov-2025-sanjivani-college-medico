import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();

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

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={[]}>
            <View className="bg-white pb-8 pt-4 rounded-b-3xl shadow-sm mb-6">
                <View className="items-center">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
                        <Text className="text-3xl font-bold text-blue-600">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-900">{user?.email}</Text>
                    <Text className="text-gray-500 capitalize">{user?.role || 'Customer'}</Text>
                </View>
            </View>

            <View className="px-4 space-y-3">
                <View className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
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

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center bg-white p-4 rounded-xl shadow-sm mt-6"
                >
                    <View className="w-8 h-8 bg-red-50 rounded-lg items-center justify-center mr-3">
                        <Ionicons name="log-out" size={16} color="#EF4444" />
                    </View>
                    <Text className="flex-1 text-red-500 font-medium">Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
