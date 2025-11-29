import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashScreen from '../views/SplashScreen';

// Navegador Raíz
// Controla la navegación entre la app autenticada y no autenticada

const RootNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Verificar si el usuario está autenticado
        // Llamar a un servicio de autenticación o verificar tokens
        // Simulamos un tiempo de carga (puedes cambiar esto según necesites)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000); // Muestra el splash durante 3 segundos

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default RootNavigator;
