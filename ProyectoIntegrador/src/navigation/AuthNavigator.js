import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/LoginScreen';
import ForgotPasswordScreen from '../views/ForgotPasswordScreen';
import RegisterScreen from '../views/RegisterScreen';

const Stack = createNativeStackNavigator();

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
                name="Register"
                component={RegisterScreen}
                options={{
                    headerShown: true,
                    title: 'Crear Cuenta',
                    headerTintColor: '#007AFF',
                    animation: 'slide_from_right'
                }}
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