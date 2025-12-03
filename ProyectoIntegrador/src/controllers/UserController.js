import User from '../models/User';
import Student from '../models/Student';
import { API_BASE_URL } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Controlador de Usuario
// Maneja la lógica de negocio relacionada con usuarios
class UserController {
  constructor() {
    this.currentUser = null;
    this.authToken = null;
  }

  // Inicializar sesión desde AsyncStorage
  async initializeSession() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('currentUser');

      if (token && userData) {
        this.authToken = token;
        this.currentUser = JSON.parse(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error initializing session:', error);
      return false;
    }
  }

  // Autenticar usuario
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      const user = await User.findByEmail(email.toLowerCase());
      if (!user || !user.validatePassword(password)) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token (en producción usar JWT)
      this.authToken = `token-${user.id}-${Date.now()}`;
      this.currentUser = user.toSafeObject();

      // Obtener perfil completo
      const profile = await user.getProfile();
      this.currentUser = profile;

      // Guardar sesión
      await AsyncStorage.setItem('authToken', this.authToken);
      await AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return {
        success: true,
        token: this.authToken,
        user: this.currentUser
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      this.currentUser = null;
      this.authToken = null;

      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const { name, email, password, confirmPassword, phone } = userData;

      // Validaciones
      if (!name || !email || !password) {
        throw new Error('Todos los campos son requeridos');
      }

      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Verificar si el email ya existe
      const existingUser = await User.findByEmail(email.toLowerCase());
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear usuario
      const newUser = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // En producción, hashear la contraseña
        phone: phone?.trim()
      });

      if (!newUser) {
        throw new Error('Error creando usuario');
      }

      return {
        success: true,
        user: newUser.toSafeObject(),
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Obtener perfil del usuario actual
  async getCurrentUserProfile() {
    try {
      if (!this.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const user = await User.findById(this.currentUser.id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const profile = await user.getProfile();
      this.currentUser = profile;

      // Actualizar AsyncStorage
      await AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return {
        success: true,
        profile
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Actualizar perfil
  async updateProfile(updateData) {
    try {
      if (!this.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const user = await User.findById(this.currentUser.id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      await user.update(updateData);
      const updatedProfile = await user.getProfile();
      this.currentUser = updatedProfile;

      // Actualizar AsyncStorage
      await AsyncStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      return {
        success: true,
        profile: updatedProfile,
        message: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      if (!this.currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (newPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const user = await User.findById(this.currentUser.id);
      if (!user || !user.validatePassword(currentPassword)) {
        throw new Error('Contraseña actual incorrecta');
      }

      await user.updatePassword(newPassword);

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Verificar si hay usuario autenticado
  isAuthenticated() {
    return this.currentUser !== null && this.authToken !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Obtener token de autenticación
  getAuthToken() {
    return this.authToken;
  }
}

// Instancia singleton del controlador
const userController = new UserController();

// Función de compatibilidad para el código existente
export async function loginUser(email, password) {
  const result = await userController.login(email, password);
  return result.success ? result : false;
}

export default userController;
