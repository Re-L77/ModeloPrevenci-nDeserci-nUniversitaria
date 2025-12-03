import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/LoginScreen';

const Stack = createNativeStackNavigator();

// Navegador de Autenticación
// Define las pantallas de login y registro

const AuthNavigator = ({ onLogin }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                initialParams={{ onLogin }}
            />
            {/* TODO: Agregar más pantallas de autenticación */}
        </Stack.Navigator>
    );
};

export default AuthNavigator;
