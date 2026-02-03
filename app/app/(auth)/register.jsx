import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import useAuthStore from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup.string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function Register() {
    const { register: registerUser, isLoading } = useAuthStore();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: 'customer@gmail.com',
            password: '123456',
            confirmPassword: '123456',
        }
    });

    const onSubmit = async (data) => {
        const result = await registerUser(data.email, data.password, 'CUSTOMER');
        if (result.success) {
            Alert.alert('Success', 'Account created! Please log in.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        } else {
            Alert.alert('Registration Failed', result.message);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
                    className="px-6"
                >
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                            <Text className="text-blue-600 text-2xl font-bold">M+</Text>
                        </View>
                        <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
                        <Text className="text-gray-500 mt-2 text-center">Join MedoPlus today</Text>
                    </View>

                    <View className="space-y-4 w-full">
                        <View>
                            <Text className="text-gray-700 mb-2 font-medium">Email Address</Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-gray-800 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Ex. john@example.com"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-gray-800 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Create a password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
                        </View>

                        <View>
                            <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 text-gray-800 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Confirm your password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.confirmPassword && <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</Text>}
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                            className={`w-full bg-blue-600 rounded-xl py-4 items-center shadow-md shadow-blue-200 mt-4 ${isLoading ? 'opacity-70' : ''}`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Sign Up</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-500">Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-600 font-bold">Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
