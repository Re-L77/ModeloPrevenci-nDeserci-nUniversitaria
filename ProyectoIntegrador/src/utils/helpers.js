// Funciones auxiliares y utilidades

// TODO: Agregar funciones de validación, formateo, etc.

export const validateEmail = (email) => {
    // TODO: Implementar validación de email
    return true;
};

export const formatDate = (date) => {
    // TODO: Implementar formateo de fecha
    return date;
};

export const parseJSON = (json) => {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
};
