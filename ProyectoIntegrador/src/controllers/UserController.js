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
      console.log('UserController: Verificando sesión guardada...');

      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('currentUser');

      if (token && userData) {
        try {
          this.authToken = token;
          this.currentUser = JSON.parse(userData);

          console.log('UserController: Sesión restaurada para:', this.currentUser.name);
          return true;
        } catch (parseError) {
          console.error('UserController: Error parseando datos de usuario:', parseError);
          // Limpiar datos corruptos
          await this.logout();
          return false;
        }
      }

      console.log('UserController: No hay sesión previa');
      return false;
    } catch (error) {
      console.error('UserController: Error inicializando sesión:', error);
      return false;
    }
  }

  // Autenticar usuario con base de datos
  async login(email, password) {
    try {
      // Validaciones básicas
      if (!email || !password) {
        return { success: false, message: 'Email y contraseña requeridos' };
      }

      const user = await User.findByEmail(email.toLowerCase());

      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      if (!user.validatePassword(password)) {
        return { success: false, message: 'Contraseña incorrecta' };
      }

      // Generar token de autenticación
      this.authToken = `token-${user.id}-${Date.now()}`;

      // Obtener perfil completo con datos de estudiante si aplica
      const profile = await user.getProfile();
      this.currentUser = profile;

      // Guardar sesión en AsyncStorage (en paralelo)
      AsyncStorage.multiSet([
        ['authToken', this.authToken],
        ['currentUser', JSON.stringify(this.currentUser)]
      ]).catch(error => console.warn('Error guardando sesión:', error));

      console.log('Login exitoso para:', this.currentUser.name);
      return {
        success: true,
        token: this.authToken,
        user: this.currentUser
      };

    } catch (error) {
      console.error('💥 Error durante login:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Cerrar sesión
  async logout() {
    try {
      console.log('UserController: Iniciando logout...');

      // Limpiar estado interno primero
      this.currentUser = null;
      this.authToken = null;

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');

      console.log('UserController: Logout completado exitosamente');
      return { success: true };
    } catch (error) {
      console.error('UserController: Logout error:', error);
      // Asegurar que el estado se limpia aunque falle AsyncStorage
      this.currentUser = null;
      this.authToken = null;
      return { success: false, message: error.message };
    }
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const { name, email, password, confirmPassword, phone } = userData;

      // Importar validaciones
      const { validateRegisterForm, formatErrorMessage, capitalizeName } = require('../utils/helpers');

      // Validar formulario completo
      const validation = validateRegisterForm(userData);
      if (!validation.isValid) {
        throw new Error(formatErrorMessage(validation.errors));
      }

      // Verificar si el email ya existe
      const existingUser = await User.findByEmail(email.toLowerCase().trim());
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Crear usuario
      const newUser = await User.create({
        name: capitalizeName(name.trim()),
        email: email.toLowerCase().trim(),
        password, // En producción, hashear la contraseña
        phone: phone?.trim() || null,
        recovery_email: null // Se puede configurar después en el perfil
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

      // Validar datos de actualización
      const { validateProfileForm, formatErrorMessage, formatPhoneNumber } = require('../utils/helpers');

      const validation = validateProfileForm(updateData);
      if (!validation.isValid) {
        throw new Error(formatErrorMessage(validation.errors));
      }

      const user = await User.findById(this.currentUser.id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Formatear datos antes de guardar
      const formattedData = {
        ...updateData,
        phone: updateData.phone ? formatPhoneNumber(updateData.phone) : null,
        recovery_email: updateData.recovery_email ? updateData.recovery_email.toLowerCase().trim() : null
      };

      await user.update(formattedData);
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

      // Validar formulario de cambio de contraseña
      const { validatePasswordChangeForm, formatErrorMessage } = require('../utils/helpers');

      const validation = validatePasswordChangeForm(currentPassword, newPassword, confirmPassword);
      if (!validation.isValid) {
        throw new Error(formatErrorMessage(validation.errors));
      }

      const user = await User.findById(this.currentUser.id);
      console.log('Change password: Usuario encontrado:', user ? user.email : 'No encontrado');
      console.log('Change password: Contraseña actual ingresada:', currentPassword);
      console.log('Change password: Contraseña almacenada:', user ? user.password : 'N/A');
      console.log('Change password: Usuario actual en memoria:', this.currentUser ? this.currentUser.email : 'No hay usuario');

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña con trimming por seguridad
      const trimmedCurrentPassword = currentPassword.trim();
      const storedPassword = user.password.trim();

      if (trimmedCurrentPassword !== storedPassword) {
        console.log('Change password: Validación falló - contraseñas no coinciden');
        console.log('Change password: Ingresada (trimmed):', trimmedCurrentPassword);
        console.log('Change password: Almacenada (trimmed):', storedPassword);
        throw new Error('La contraseña actual es incorrecta');
      }

      console.log('Change password: Validación exitosa, actualizando contraseña...');
      await user.updatePassword(newPassword);

      // Actualizar usuario en memoria
      this.currentUser = await User.findById(this.currentUser.id);

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


  // Función de prueba para verificar la base de datos
  async testDatabaseConnection() {
    try {
      console.log('UserController: Probando conexión a base de datos...');
      const users = await User.findAll(5, 0);
      console.log('UserController: Usuarios encontrados:', users.length);
      users.forEach(user => {
        console.log(`- ${user.email} (${user.name})`);
      });
      return true;
    } catch (error) {
      console.error('UserController: Error probando base de datos:', error);
      return false;
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

  // Solicitar recuperación de contraseña
  async requestPasswordReset(email) {
    try {
      if (!email) {
        return { success: false, message: 'Email es requerido' };
      }

      const user = await User.findByEmail(email.toLowerCase());
      if (!user) {
        // Por seguridad, no revelamos si el email existe o no
        return {
          success: true,
          message: 'Si el correo está registrado, recibirás las instrucciones de recuperación'
        };
      }

      // Generar código de recuperación de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // En un entorno real, aquí enviarías un email
      // Para la demo, guardamos el código en memoria
      if (!this.resetCodes) this.resetCodes = new Map();
      this.resetCodes.set(email.toLowerCase(), {
        code: resetCode,
        expiry: resetExpiry,
        userId: user.id
      });

      console.log(`🔑 Código de recuperación para ${email}: ${resetCode}`);

      return {
        success: true,
        message: 'Si el correo está registrado, recibirás las instrucciones de recuperación',
        demoCode: resetCode // Solo para la demo
      };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Verificar código de recuperación
  async verifyResetCode(email, code) {
    try {
      if (!this.resetCodes) {
        return { success: false, message: 'No hay solicitudes de recuperación pendientes' };
      }

      const resetData = this.resetCodes.get(email.toLowerCase());
      if (!resetData) {
        return { success: false, message: 'Código de recuperación no válido' };
      }

      if (new Date() > resetData.expiry) {
        this.resetCodes.delete(email.toLowerCase());
        return { success: false, message: 'El código ha expirado. Solicita uno nuevo' };
      }

      if (resetData.code !== code) {
        return { success: false, message: 'Código incorrecto' };
      }

      return {
        success: true,
        message: 'Código verificado correctamente',
        userId: resetData.userId
      };
    } catch (error) {
      console.error('Error verifying reset code:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  // Resetear contraseña con código
  async resetPasswordWithCode(email, code, newPassword) {
    try {
      // Verificar código primero
      const verification = await this.verifyResetCode(email, code);
      if (!verification.success) {
        return verification;
      }

      if (newPassword.length < 6) {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
      }

      // Buscar usuario y actualizar contraseña
      const user = await User.findById(verification.userId);
      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      await user.updatePassword(newPassword);

      // Limpiar código de recuperación
      this.resetCodes.delete(email.toLowerCase());

      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
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
