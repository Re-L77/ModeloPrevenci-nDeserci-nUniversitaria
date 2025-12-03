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
                // Usamos una función de actualización para comparar con el estado anterior
                setCurrentUser(prevUser => {
                    if (!prevUser || prevUser.id !== user.id || prevUser.name !== user.name) {
                        return user;
                    }
                    return prevUser;
                });
                setIsAuthenticated(true);
            } else {
                // Si no hay sesión válida, limpiamos todo
                setCurrentUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error verificando estado de autenticación:', error);
            setCurrentUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Inicialización
        const initialize = async () => {
            await checkAuthStatus();
        };
        initialize();

        // Intervalo de seguridad (Polling)
        const interval = setInterval(checkAuthStatus, 2000);

        // Limpieza al desmontar
        return () => clearInterval(interval);
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

    // --- FUNCIÓN DE ELIMINAR BLINDADA ---
    const deleteAccount = async () => {
        try {
            console.log('Hook useAuth: Solicitando eliminación de cuenta...');
            
            // 1. Ejecutar borrado en BD y limpieza de memoria en controlador
            const result = await userController.deleteAccount();
            
            if (result.success) {
                // 2. IMPORTANTE: Forzar el estado a nulo INMEDIATAMENTE
                // Esto dispara el cambio de pantalla en App.js / RootNavigator
                setIsAuthenticated(false);
                setCurrentUser(null);
                console.log('Hook useAuth: Cuenta eliminada y estado limpiado.');
            }
            return result;
        } catch (error) {
            console.error('Hook useAuth: Error crítico eliminando cuenta:', error);
            return { success: false, message: 'Error al eliminar cuenta' };
        }
    };

    return {
        isAuthenticated,
        currentUser,
        loading,
        login,
        logout,
        updateUserProfile,
        checkAuthStatus,
        deleteAccount
    };
};