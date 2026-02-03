import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackTitleVisible: false,
                headerTintColor: '#2563EB',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    title: 'Sign In',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="register"
                options={{
                    title: 'Create Account',
                    headerShown: false
                }}
            />
        </Stack>
    );
}
