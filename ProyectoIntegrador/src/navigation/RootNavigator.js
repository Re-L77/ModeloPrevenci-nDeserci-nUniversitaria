import React, { createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { useAuthLogic } from '../hooks/useAuth';
import { AlertsBadgeProvider } from '../hooks/AlertsBadgeContext';
import SplashScreen from '../views/SplashScreen';

// Contexto de autenticación
export const AuthContext = createContext({
    isAuthenticated: false,
    currentUser: null,
    login: () => { },
    logout: () => { },
    updateUserProfile: () => { },
    loading: true
});

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Navegador Raíz
// Controla la navegación entre la app autenticada y no autenticada

const RootNavigator = () => {
    // Usar el hook personalizado para manejar toda la lógica de autenticación
    const authLogic = useAuthLogic();

    // Valor del contexto - usar directamente las funciones del hook
    const authValue = {
        ...authLogic
        // No sobrescribir login, usar la función del hook directamente
    };

    if (authLogic.loading) {
        return <SplashScreen />;
    }

    return (
        <AuthContext.Provider value={authValue}>
            <AlertsBadgeProvider>
                <NavigationContainer>
                    {authLogic.isAuthenticated ? (
                        <AppNavigator />
                    ) : (
                        <AuthNavigator />
                    )}
                </NavigationContainer>
            </AlertsBadgeProvider>
        </AuthContext.Provider>
    );
};

export default RootNavigator;
