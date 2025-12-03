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
                    // --- AQUÍ ESTÁ EL TRUCO ---
                    headerShown: true,           // 1. Muestra la barra arriba
                    title: 'Recuperar',          // 2. Título de la barra
                    headerTintColor: '#007AFF',  // 3. Color de la flecha y texto (Azul)
                    headerTransparent: true,     // 4. (Opcional) Hace que el fondo sea transparente
                    headerTitleStyle: { color: 'transparent' }, // (Opcional) Si solo quieres la flecha, descomenta esto
                    animation: 'slide_from_right'
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;