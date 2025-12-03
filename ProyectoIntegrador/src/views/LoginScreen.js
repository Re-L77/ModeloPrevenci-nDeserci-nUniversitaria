import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Keyboard, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/helpers';
import userController from '../controllers/UserController';
import { useAuth } from '../navigation/RootNavigator';

const logoImage = require('../../assets/LogoPI.png');

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login: contextLogin } = useAuth();
  const passwordRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    let valid = true;
    const trimmedEmail = (email || '').trim();

    if (!trimmedEmail) {
      setEmailError('El correo es requerido.');
      valid = false;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError('Formato de correo inválido.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('La contraseña es requerida.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    console.log('=== HANDLE LOGIN INICIADO ===');
    Keyboard.dismiss();
    if (!validateFields()) return;

    setLoading(true);
    try {
      console.log('LoginScreen: Llamando a contextLogin...');
      const result = await contextLogin(email.trim(), password);
      console.log('LoginScreen: Resultado recibido:', result);
      console.log('LoginScreen: Tipo de resultado:', typeof result);

      // Validación más robusta
      if (!result) {
        console.error('LoginScreen: Result is null/undefined');
        Alert.alert('Error', 'No se recibió respuesta del servidor');
        return;
      }

      if (result && result.success === true) {
        console.log('LoginScreen: Login exitoso');
        const userData = result.user;
        const welcomeMessage = `¡Bienvenido, ${userData?.name || 'Usuario'}!`;
        Alert.alert('Login exitoso', welcomeMessage);
      } else {
        console.log('LoginScreen: Login falló');
        Alert.alert('Error de autenticación', result?.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('LoginScreen: Error en catch:', error);
      Alert.alert('Error', 'Error al intentar iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async (userType = 'student') => {
    const credentials = {
      student: { 
        email: 'maria.garcia@universidad.edu', 
        password: 'demo123',
        name: 'María García López',
        description: 'Estudiante de Ing. Sistemas con buen rendimiento académico'
      },
      risk: { 
        email: 'carlos.rodriguez@universidad.edu', 
        password: 'demo456',
        name: 'Carlos Rodríguez',
        description: 'Estudiante con alto riesgo de deserción que necesita apoyo'
      },
      admin: { 
        email: 'admin@universidad.edu', 
        password: 'admin123',
        name: 'Dr. Ana Martínez',
        description: 'Administrador con acceso completo al sistema'
      },
      teacher: { 
        email: 'luis.hernandez@universidad.edu', 
        password: 'prof123',
        name: 'Prof. Luis Hernández',
        description: 'Profesor consejero especializado en apoyo estudiantil'
      },
      excellent: { 
        email: 'ana.delgado@universidad.edu', 
        password: 'demo789',
        name: 'Ana Sofia Delgado',
        description: 'Estudiante destacada con excelente rendimiento académico'
      }
    };

    const creds = credentials[userType] || credentials.student;
    
    // Llenar los campos
    setEmail(creds.email);
    setPassword(creds.password);
    setEmailError('');
    setPasswordError('');
    
    // Hacer login automáticamente
    setLoading(true);
    try {
      console.log('Demo Login: Iniciando login automático para', creds.name);
      const result = await contextLogin(creds.email, creds.password);
      
      if (result && result.success) {
        Alert.alert(
          `¡Bienvenido, ${creds.name}!`, 
          creds.description,
          [{ text: 'Continuar', style: 'default' }]
        );
      } else {
        Alert.alert('Error', result?.message || 'Error en login demo');
        // Mantener credenciales en los campos para intentar manual
      }
    } catch (error) {
      console.error('Demo Login Error:', error);
      Alert.alert('Error', 'Error en login demo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.card}>

        <Image
          source={logoImage}
          style={styles.logo}
        />

        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Sistema de Prevención de Deserción</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="nombre@ejemplo.com"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (emailError) setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          ref={passwordRef}
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="********"
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (passwordError) setPasswordError('');
          }}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (loading || emailError || passwordError) && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <View style={styles.demoSection}>
          <Text style={styles.demoSectionTitle}>🚀 Login Rápido - Demo</Text>
          <Text style={styles.demoSectionSubtitle}>Toca cualquier botón para login automático</Text>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => loginWithDemo('student')}
            disabled={loading}
          >
            <Text style={styles.demoButtonText}>👩‍🎓 María García - Estudiante Regular</Text>
            <Text style={styles.demoButtonSubtext}>Rendimiento promedio • Sin riesgo de deserción</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, styles.demoButtonRisk]}
            onPress={() => loginWithDemo('risk')}
            disabled={loading}
          >
            <Text style={styles.demoButtonText}>⚠️ Carlos Rodríguez - Estudiante en Riesgo</Text>
            <Text style={styles.demoButtonSubtext}>Bajo rendimiento • Requiere intervención urgente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, styles.demoButtonExcellent]}
            onPress={() => loginWithDemo('excellent')}
            disabled={loading}
          >
            <Text style={styles.demoButtonText}>⭐ Ana Delgado - Estudiante Destacada</Text>
            <Text style={styles.demoButtonSubtext}>Excelencia académica • Modelo a seguir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoButton, styles.demoButtonAdmin]}
            onPress={() => loginWithDemo('admin')}
            disabled={loading}
          >
            <Text style={styles.demoButtonText}>🔧 Dr. Ana Martínez - Administrador</Text>
            <Text style={styles.demoButtonSubtext}>Vista completa del sistema • Gestión de usuarios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#E33',
  },
  errorText: {
    color: '#E33',
    marginBottom: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  demoSection: {
    marginTop: 20,
  },
  demoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  demoSectionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  demoButton: {
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  demoButtonRisk: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FF5722',
  },
  demoButtonExcellent: {
    backgroundColor: '#F0FFF0',
    borderColor: '#4CAF50',
  },
  demoButtonAdmin: {
    backgroundColor: '#FFF9F0',
    borderColor: '#FF9800',
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  demoButtonSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
});
