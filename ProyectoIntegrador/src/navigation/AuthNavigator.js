import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/LoginScreen';
import ForgotPasswordScreen from '../views/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

// Navegador de Autenticación
// Define las pantallas de login y registro

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false, // Por defecto oculto (para el Login)
                contentStyle: { backgroundColor: '#F0F2F5' },
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    headerShown: true,
                    title: 'Recuperar Contraseña',
                    headerTintColor: '#007AFF',
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;