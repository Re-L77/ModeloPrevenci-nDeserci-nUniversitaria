// Controlador de Usuario
// Maneja la lógica de negocio relacionada con usuarios
import { API_BASE_URL } from '../utils/constants';

class UserController {
    constructor() {
        // TODO: Inicializar el controlador
    }
    
    // TODO: Métodos para manejar lógica de usuario
    // login()
    // logout()
    // updateProfile()
    // etc.
}

export async function loginUser(email, password) {
  if (!email || !password) return false;

  // Credenciales demo locales
  if (email.toLowerCase() === 'maria.garcia@universidad.edu' && password === 'demo123') {
    return {
      success: true,
      token: 'demo-token-123',
      user: { name: 'Maria Garcia', email },
    };
  }

  // Si tienes un backend configurado en API_BASE_URL, intenta autenticar
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      // Espera { token, user } o { success: true }
      if (data && (data.token || data.success)) {
        return { success: true, token: data.token, user: data.user || null };
      }
      return false;
    } catch (err) {
      console.warn('loginUser error:', err);
      return false;
    }
  }

  return false;
}

export default UserController;
