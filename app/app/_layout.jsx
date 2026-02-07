import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useAuthStore from '../store/authStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import "../global.css";

// Ignore specific warning logs
// Ignore specific warning logs
LogBox.ignoreLogs([
    'SafeAreaView has been deprecated',
    'SafeAreaView has been deprecated and will be removed in a future release',
]);

// Create a client for TanStack Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const { initialize, isAuthenticated, isLoading } = useAuthStore();
    const segments = useSegments();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (isLoading || !navigationState?.key) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if not authenticated and not already in auth group
            router.replace('/(auth)/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to tabs if authenticated and trying to access auth pages
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments, isLoading, navigationState?.key]);

    if (isLoading) {
        return null; // Or a splash screen
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
