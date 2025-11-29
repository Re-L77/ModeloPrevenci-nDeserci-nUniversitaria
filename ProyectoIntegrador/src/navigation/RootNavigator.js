import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

// Navegador Raíz
// Controla la navegación entre la app autenticada y no autenticada

const RootNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Verificar si el usuario está autenticado
        // Llamar a un servicio de autenticación o verificar tokens
        setLoading(false);
    }, []);

    if (loading) {
        // TODO: Mostrar pantalla de carga
        return null;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default RootNavigator;
