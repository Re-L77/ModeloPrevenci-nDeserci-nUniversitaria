// Servicio de API
// Maneja todas las llamadas HTTP a la base de datos o servidor

import { API_BASE_URL } from './constants';

// TODO: Implementar cliente HTTP (fetch o axios)

export const apiCall = async (endpoint, method = 'GET', data = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// TODO: Implementar funciones específicas de API
// export const loginUser = (credentials) => { }
// export const getStudents = () => { }
// etc.
