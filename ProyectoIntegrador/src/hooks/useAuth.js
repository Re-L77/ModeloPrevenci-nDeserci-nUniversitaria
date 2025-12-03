import { useState, useEffect } from 'react';
import userController from '../controllers/UserController';

// Hook personalizado para manejar la lógica de autenticación
export const useAuthLogic = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Inicialización inicial solo una vez
        const initialize = async () => {
            await checkAuthStatus();
        };

        initialize();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const user = userController.getCurrentUser();
            const isAuth = userController.isAuthenticated();

            if (isAuth && user) {
                // Solo actualizar si realmente hay cambios
                if (!currentUser || currentUser.id !== user.id || !isAuthenticated) {
                    setCurrentUser(user);
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
            if (loading) {
                setLoading(false);
            }
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Hook useAuth: Iniciando login para', email);

            const result = await userController.login(email, password);
            console.log('Hook useAuth: Resultado del login:', result);

            // Validar que result no sea undefined
            if (!result) {
                console.error('Hook useAuth: Login result is undefined');
                return {
                    success: false,
                    message: 'Error interno durante el login - resultado undefined'
                };
            }

            // Validar que result tenga la estructura esperada
            if (typeof result !== 'object') {
                console.error('Hook useAuth: Login result is not an object:', typeof result);
                return {
                    success: false,
                    message: 'Error interno durante el login - resultado inválido'
                };
            }

            if (result.success) {
                console.log('Hook useAuth: Login exitoso');
                return result;
            } else {
                console.log('Hook useAuth: Login falló:', result.message);
                return result;
            }
        } catch (error) {
            console.error('Hook useAuth: Error durante login:', error);
            return {
                success: false,
                message: error?.message || 'Error desconocido durante el login'
            };
        }
    };

    const logout = async () => {
        try {
            console.log('Hook useAuth: Iniciando logout...');
            await userController.logout();

            // Forzar actualización inmediata del estado
            setCurrentUser(null);
            setIsAuthenticated(false);
            console.log('Hook useAuth: Logout completado, estado actualizado');

        } catch (error) {
            console.error('Hook useAuth: Error durante logout:', error);
            // Forzar logout local aunque falle
            setCurrentUser(null);
            setIsAuthenticated(false);
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
                // El estado se actualizará automáticamente en el siguiente ciclo
                return result;
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
        checkAuthStatus
    };
};