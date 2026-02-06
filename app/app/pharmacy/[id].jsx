import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useState, useCallback } from 'react';
import api from '../../services/api';

export default function PharmacyDetailScreen() {
    const { id } = useLocalSearchParams();
    const [image, setImage] = useState(null);
    const [notes, setNotes] = useState('');
    const [uploading, setUploading] = useState(false);

    // Fetch Pharmacy Details
    const { data: pharmacyData, isLoading } = useQuery({
        queryKey: ['pharmacy', id],
        queryFn: async () => {
            const response = await api.get(`/pharmacies/${id}`);
            return response.data;
        },
        enabled: !!id
    });

    // Fetch Customer Profile to get customer_id
    const { data: profileData, isLoading: isProfileLoading, refetch: refetchProfile } = useQuery({
        queryKey: ['customerProfile'],
        queryFn: async () => {
            const response = await api.get('/customers/profile');
            return response.data;
        }
    });

    // Refetch profile when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refetchProfile();
        }, [refetchProfile])
    );

    const pharmacy = pharmacyData?.pharmacy;

    // Extract customer ID safely
    const getCustomerId = () => {
        if (!profileData?.exists) return null;
        const profile = Array.isArray(profileData.profile) ? profileData.profile[0] : profileData.profile;
        return profile?.customer_id;
    };

    const pickImage = async () => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to grant camera roll permissions to upload prescriptions.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            Alert.alert("Missing Prescription", "Please upload an image of your prescription.");
            return;
        }

        if (isProfileLoading) {
            Alert.alert("Checking Profile", "Please wait while we verify your profile details...");
            return;
        }

        const customerId = getCustomerId();
        if (!customerId) {
            Alert.alert("Profile Required", "Please complete your profile details first to place an order.", [
                { text: "Go to Profile", onPress: () => router.push('/(tabs)/profile') }
            ]);
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();

            // Append file
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('prescription', {
                uri: image,
                name: `prescription.${fileType}`,
                type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
            });

            formData.append('customer_id', customerId);
            formData.append('pharmacy_id', id);
            if (notes) formData.append('notes', notes);

            // Using axios directly or api instance with specific headers
            // Ensure content-type is multipart/form-data
            const response = await api.post('/prescriptions/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data, headers) => {
                    // Start of workaround for React Native FormData
                    // Axios transformation might strip FormData, so we return it directly
                    return data;
                },
            });

            if (response.success || response?.data?.prescription_id) { // success check based on API structure
                Alert.alert("Success", "Prescription uploaded successfully!", [
                    { text: "OK", onPress: () => router.push('/(tabs)/orders') }
                ]);
            } else {
                throw new Error(response.message || "Upload failed");
            }

        } catch (error) {
            console.error("Upload Error:", error);
            Alert.alert("Upload Failed", "Could not upload prescription. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
            </SafeAreaView>
        );
    }

    if (!pharmacy) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Text className="text-gray-500">Pharmacy not found.</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-blue-500">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 flex-1" numberOfLines={1}>{pharmacy.pharmacy_name}</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <ScrollView className="flex-1 p-4">
                    {/* Pharmacy Info Card */}
                    <View className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100">
                        <View className="flex-row items-start mb-4">
                            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                                <Ionicons name="medical" size={24} color="#16A34A" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-gray-900">{pharmacy.pharmacy_name}</Text>
                                <Text className="text-gray-500 text-sm mt-1">{pharmacy.address}, {pharmacy.city} - {pharmacy.pincode}</Text>
                            </View>
                        </View>

                        <TouchableOpacity className="flex-row items-center py-2 border-t border-gray-100 mt-2">
                            <Ionicons name="call" size={18} color="#2563EB" />
                            <Text className="text-blue-600 ml-2 font-medium">{pharmacy.contact_no}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Order Section */}
                    <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Place Order</Text>
                        <Text className="text-gray-500 text-sm mb-4">Upload a clear photo of your prescription to calculate the bill.</Text>

                        {/* Image Preview */}
                        <TouchableOpacity
                            onPress={pickImage}
                            className="w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center mb-4 overflow-hidden relative"
                        >
                            {image ? (
                                <View className="w-full h-full relative">
                                    <Image source={{ uri: image }} className="w-full h-full resize-cover" />
                                    <View className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full">
                                        <Ionicons name="camera-reverse" size={20} color="white" />
                                    </View>
                                </View>
                            ) : (
                                <View className="items-center">
                                    <Ionicons name="camera" size={40} color="#9CA3AF" />
                                    <Text className="text-gray-400 mt-2 font-medium">Tap to Upload Prescription</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Notes */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Notes (Optional)</Text>
                        <TextInput
                            className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-700 mb-6 h-24"
                            placeholder="Example: I only need the first 2 medicines..."
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleUpload}
                            disabled={uploading}
                            className={`w-full py-4 rounded-xl items-center justify-center shadow-lg ${uploading ? 'bg-blue-400' : 'bg-blue-600'}`}
                        >
                            {uploading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Send Order Request</Text>
                            )}
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
