import React, { createContext, useContext, useState, useCallback } from 'react';

// Contexto para manejar el contador de alertas globalmente
const AlertsBadgeContext = createContext();

export const useAlertsBadgeContext = () => {
    const context = useContext(AlertsBadgeContext);
    if (!context) {
        throw new Error('useAlertsBadgeContext debe usarse dentro de AlertsBadgeProvider');
    }
    return context;
};

export const AlertsBadgeProvider = ({ children }) => {
    const [alertsCount, setAlertsCount] = useState(0);

    // Actualizar el contador
    const updateAlertsCount = useCallback((count) => {
        console.log('AlertsBadgeContext: Actualizando contador a:', count);
        setAlertsCount(count);
    }, []);

    // Decrementar el contador
    const decrementAlertsCount = useCallback(() => {
        setAlertsCount(prev => {
            const newCount = Math.max(0, prev - 1);
            console.log('AlertsBadgeContext: Decrementando contador de', prev, 'a', newCount);
            return newCount;
        });
    }, []);

    // Incrementar el contador
    const incrementAlertsCount = useCallback(() => {
        setAlertsCount(prev => {
            const newCount = prev + 1;
            console.log('AlertsBadgeContext: Incrementando contador de', prev, 'a', newCount);
            return newCount;
        });
    }, []);

    const value = {
        alertsCount,
        updateAlertsCount,
        decrementAlertsCount,
        incrementAlertsCount
    };

    return (
        <AlertsBadgeContext.Provider value={value}>
            {children}
        </AlertsBadgeContext.Provider>
    );
};

export default AlertsBadgeContext;