import { useState, useEffect, useCallback } from 'react';
import userController from '../controllers/UserController';

// Hook personalizado para manejar la lógica de autenticación
export const useAuthLogic = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Envolvemos checkAuthStatus en useCallback para optimizar rendimiento
    const checkAuthStatus = useCallback(async () => {
        try {
            // Obtenemos datos de la memoria del controlador
            const user = userController.getCurrentUser();
            const isAuth = userController.isAuthenticated();

            if (isAuth && user) {
                // Solo actualizamos si hay cambios reales para evitar re-renders
                setCurrentUser(prevUser => {
                    if (!prevUser || prevUser.id !== user.id || prevUser.name !== user.name) {
                        return user;
                    }
                    return prevUser;
                });

                // Solo actualizar isAuthenticated si no está ya en true
                if (!isAuthenticated) {
                    setIsAuthenticated(true);
                }
            } else {
                // Solo limpiar si realmente hay algo que limpiar
                if (isAuthenticated || currentUser) {
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            }
        } catch (error) {
            console.error('Error verificando estado de autenticación:', error);
            // Solo limpiar si hay algo que limpiar
            if (isAuthenticated || currentUser) {
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            // No cambiamos loading aquí, se maneja en el useEffect principal
            // para asegurar que el splash se muestre el tiempo suficiente
        }
    }, [isAuthenticated, currentUser, loading]);

    useEffect(() => {
        // Inicialización inicial solo una vez
        const initialize = async () => {
            const startTime = Date.now();
            await checkAuthStatus();

            // Asegurar que el splash se muestre por al menos 3 segundos
            const elapsedTime = Date.now() - startTime;
            const minSplashTime = 3000; // 3 segundos

            if (elapsedTime < minSplashTime) {
                setTimeout(() => {
                    setLoading(false);
                }, minSplashTime - elapsedTime);
            } else {
                setLoading(false);
            }
        };

        initialize();
    }, [checkAuthStatus]);

    const login = async (email, password) => {
        try {
            console.log('Hook useAuth: Iniciando login...');
            const result = await userController.login(email, password);

            if (result && result.success) {
                // Forzamos actualización inmediata
                await checkAuthStatus();
            }
            return result || { success: false, message: 'Error desconocido' };
        } catch (error) {
            console.error('Hook useAuth: Error durante login:', error);
            return { success: false, message: error?.message || 'Error desconocido' };
        }
    };

    const logout = async () => {
        try {
            await userController.logout();
            // Limpieza manual inmediata para que la UI reaccione rápido
            setIsAuthenticated(false);
            setCurrentUser(null);
        } catch (error) {
            console.error('Hook useAuth: Error durante logout:', error);
            // Aun con error, sacamos al usuario por seguridad
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
    };

    const setUser = async (user) => {
        try {
            console.log('Hook useAuth: Estableciendo usuario:', user.name);
            setCurrentUser(user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Hook useAuth: Error estableciendo usuario:', error);
            return { success: false, message: error.message };
        }
    };

    const updateUserProfile = async (updatedData) => {
        try {
            const result = await userController.updateProfile(updatedData);
            if (result.success) {
                await checkAuthStatus();
            }
            return result;
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            throw error;
        }
    };


    return {
        isAuthenticated,
        currentUser,
        loading,
        login,
        logout,
        setUser,
        updateUserProfile,
        checkAuthStatus,
    };
};