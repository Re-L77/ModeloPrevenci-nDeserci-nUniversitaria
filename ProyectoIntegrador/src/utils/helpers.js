// Funciones auxiliares y utilidades

// TODO: Agregar funciones de validación, formateo, etc.

export function validateEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
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
