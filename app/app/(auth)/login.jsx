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
});

export default function Login() {
    const { login, isLoading } = useAuthStore();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: 'customer@gmail.com',
            password: '123456',
        }
    });

    const onSubmit = async (data) => {
        console.log('Login button pressed. Form data:', data);
        const result = await login(data.email, data.password);
        if (result.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Login Failed', result.message);
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
                    <View className="items-center mb-10">
                        {/* Placeholder for Logo */}
                        <View className="w-20 h-20 bg-blue-500 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-300">
                            <Text className="text-white text-4xl font-bold">M+</Text>
                        </View>
                        <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
                        <Text className="text-gray-500 mt-2 text-center">Sign in to continue to MedoPlus</Text>
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
                                        placeholder="Enter your email"
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
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
                            <TouchableOpacity className="self-end mt-2">
                                <Text className="text-blue-500 text-sm font-medium">Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                handleSubmit(onSubmit)()
                            }}
                            disabled={isLoading}
                            className={`w-full bg-blue-600 rounded-xl py-4 items-center shadow-md shadow-blue-200 mt-4 ${isLoading ? 'opacity-70' : ''}`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Sign In</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-500">Don't have an account? </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-600 font-bold">Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
