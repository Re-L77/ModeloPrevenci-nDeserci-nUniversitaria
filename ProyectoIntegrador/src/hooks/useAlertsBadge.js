import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import alertController from '../controllers/AlertController';
import { useAuth } from '../navigation/RootNavigator';
import { useAlertsBadgeContext } from './AlertsBadgeContext';

// Hook personalizado para gestionar el badge de alertas
const useAlertsBadge = () => {
    const { currentUser } = useAuth();
    const { alertsCount, updateAlertsCount } = useAlertsBadgeContext();

    // Función para obtener el conteo de alertas activas
    const fetchAlertsCount = useCallback(async () => {
        if (!currentUser?.student?.id) {
            updateAlertsCount(0);
            return;
        }

        try {
            console.log('useAlertsBadge: Obteniendo conteo de alertas para estudiante:', currentUser.student.id);

            const result = await alertController.getAlertsByStudent(currentUser.student.id, 'active');

            if (result.success) {
                const count = result.data.length;
                updateAlertsCount(count);
                console.log('useAlertsBadge: Alertas activas encontradas:', count);
            } else {
                console.warn('useAlertsBadge: Error obteniendo alertas:', result.message);
                updateAlertsCount(0);
            }
        } catch (error) {
            console.error('useAlertsBadge: Error:', error);
            updateAlertsCount(0);
        }
    }, [currentUser?.student?.id, updateAlertsCount]);

    // Actualizar cuando el componente obtiene foco
    useFocusEffect(
        useCallback(() => {
            fetchAlertsCount();
        }, [fetchAlertsCount])
    );

    // Función para refrescar manualmente el conteo
    const refreshCount = useCallback(() => {
        fetchAlertsCount();
    }, [fetchAlertsCount]);

    return {
        alertsCount,
        refreshCount
    };
};

export default useAlertsBadge;