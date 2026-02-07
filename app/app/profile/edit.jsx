import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

const schema = yup.object({
    full_name: yup.string().required('Full name is required'),
    phone: yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    pincode: yup.string().required('Pincode is required').matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
});

export default function EditProfileScreen() {
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    // Fetch profile using TanStack Query
    const { data: profileData, isLoading: isFetchingProfile, isError } = useQuery({
        queryKey: ['customerProfile'],
        queryFn: async () => {
            const response = await api.get('/customers/profile');
            return response;
        },
        retry: 1,
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            return await api.post('/customers', data);
        },
        onSuccess: (response) => {
            if (response.success) {
                // Invalidate and refetch profile
                queryClient.invalidateQueries({ queryKey: ['customerProfile'] });

                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        },
        onError: (error) => {
            Alert.alert('Error', error.message || 'Failed to update profile');
        }
    });

    // Prefill form when profile data is loaded
    useEffect(() => {
        let profile = null;
        if (profileData?.exists) {
            profile = profileData.profile;
        } else if (profileData?.success && profileData?.data?.exists) {
            profile = profileData.data.profile;
        }

        if (profile) {
            // Handle both array (typical) and object (fallback) responses
            const profileObj = Array.isArray(profile) ? (profile.length > 0 ? profile[0] : null) : profile;

            if (profileObj) {
                reset({
                    full_name: profileObj.full_name || '',
                    phone: profileObj.phone || '',
                    address: profileObj.address || '',
                    city: profileObj.city || '',
                    pincode: profileObj.pincode || ''
                });
            }
        }
    }, [profileData, reset]);

    const onSubmit = (data) => {
        updateProfileMutation.mutate(data);
    };

    if (isFetchingProfile) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-4 text-gray-600">Loading profile...</Text>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
                <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                <Text className="mt-4 text-gray-800 text-lg font-semibold">Failed to load profile</Text>
                <Text className="mt-2 text-gray-600 text-center">Please check your connection and try again</Text>
                <TouchableOpacity
                    onPress={() => queryClient.invalidateQueries({ queryKey: ['customerProfile'] })}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="flex-row items-center p-4 bg-white border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>
            </View>

            <ScrollView className="flex-1 p-4">

                {/* Full Name */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-1">Full Name</Text>
                    <Controller
                        control={control}
                        name="full_name"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                                placeholder="Enter your full name"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.full_name && <Text className="text-red-500 text-sm mt-1">{errors.full_name.message}</Text>}
                </View>

                {/* Phone */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-1">Phone Number</Text>
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                                placeholder="Enter 10-digit phone number"
                                keyboardType="phone-pad"
                                value={value}
                                onChangeText={onChange}
                                maxLength={10}
                            />
                        )}
                    />
                    {errors.phone && <Text className="text-red-500 text-sm mt-1">{errors.phone.message}</Text>}
                </View>

                {/* Address */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-1">Address</Text>
                    <Controller
                        control={control}
                        name="address"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800 h-24"
                                placeholder="Enter your full address"
                                multiline
                                textAlignVertical="top"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.address && <Text className="text-red-500 text-sm mt-1">{errors.address.message}</Text>}
                </View>

                <View className="flex-row space-x-4">
                    {/* City */}
                    <View className="flex-1 mb-4">
                        <Text className="text-gray-700 font-medium mb-1">City</Text>
                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                                    placeholder="City"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.city && <Text className="text-red-500 text-sm mt-1">{errors.city.message}</Text>}
                    </View>

                    {/* Pincode */}
                    <View className="flex-1 mb-4">
                        <Text className="text-gray-700 font-medium mb-1">Pincode</Text>
                        <Controller
                            control={control}
                            name="pincode"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className="bg-white p-3 rounded-xl border border-gray-200 text-gray-800"
                                    placeholder="Pincode"
                                    keyboardType="numeric"
                                    maxLength={6}
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.pincode && <Text className="text-red-500 text-sm mt-1">{errors.pincode.message}</Text>}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={updateProfileMutation.isPending}
                    className={`p-4 rounded-xl items-center mt-6 ${updateProfileMutation.isPending ? 'bg-blue-400' : 'bg-blue-600'}`}
                >
                    {updateProfileMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Save Profile</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
