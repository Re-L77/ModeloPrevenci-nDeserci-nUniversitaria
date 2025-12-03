import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, Keyboard, Image, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { validateEmail } from '../utils/helpers';
import userController from '../controllers/UserController';
import { useAuth } from '../navigation/RootNavigator';
import User from '../models/User';

const logoImage = require('../../assets/LogoPI.png');

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const passwordRef = useRef(null);

  const [email, setEmail] = useState('maria.garcia@universidad.edu');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const [demoNames, setDemoNames] = useState({
    carlos: 'Carlos Rodríguez',
    maria: 'María García',
    ana: 'Ana Delgado'
  });

  useFocusEffect(
    useCallback(() => {
      const loadRealNames = async () => {
        try {
          const uMaria = await User.findByEmail('maria.garcia@universidad.edu');
          const uCarlos = await User.findByEmail('carlos.rodriguez@universidad.edu');
          const uAna = await User.findByEmail('ana.delgado@universidad.edu');

          setDemoNames({
            maria: uMaria ? uMaria.name : 'María García',
            carlos: uCarlos ? uCarlos.name : 'Carlos Rodríguez',
            ana: uAna ? uAna.name : 'Ana Delgado',
          });
        } catch (error) {
          console.log('Error cargando nombres demo:', error);
        }
      };

      loadRealNames();
    }, [])
  );

  const handleLogin = async () => {
    Keyboard.dismiss();

    // Validar formulario completo
    const { validateLoginForm, formatErrorMessage } = require('../utils/helpers');

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      Alert.alert('Errores de validación', formatErrorMessage(validation.errors));
      return;
    }

    setLoading(true);
    try {
      const result = await userController.login(email.trim(), password);

      if (result.success && result.user) {
        console.log('LoginScreen: Login exitoso:', result.user.name);
        await setUser(result.user);
      } else {
        Alert.alert('Error de acceso', result.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('LoginScreen: Error en login:', error);
      Alert.alert('Error de conexión', 'Error al iniciar sesión. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const handleDemoLogin = useCallback(async (demoUser) => {
    setLoading(true);
    try {
      const result = await userController.login(demoUser.email, demoUser.password);

      if (result.success && result.user) {
        console.log('LoginScreen: Demo login exitoso:', result.user.name);
        await setUser(result.user);
      } else {
        Alert.alert('Error', result.message || 'Usuario de demostración no encontrado');
      }
    } catch (error) {
      console.error('LoginScreen: Error en demo login:', error);
      Alert.alert('Error', 'Error al iniciar sesión de demostración');
    }
    setLoading(false);
  }, [setUser]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>
          <View style={styles.card}>
            <Image source={logoImage} style={styles.logo} />
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Sistema de Prevención de Deserción Estudiantil</Text>

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="usuario@universidad.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotContainer}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
            </TouchableOpacity>

            <View style={styles.demoSection}>
              <Text style={styles.demoSectionTitle}>👥 Estudiantes de Demostración</Text>
              <Text style={styles.demoSectionSubtitle}>Diferentes perfiles académicos</Text>

              <TouchableOpacity
                style={[styles.demoButton, styles.demoButtonRisk]}
                onPress={() => handleDemoLogin({ email: 'carlos.rodriguez@universidad.edu', password: 'demo456' })}
                disabled={loading}
              >
                <Text style={styles.demoButtonText}>👨‍🎓 {demoNames.carlos}</Text>
                <Text style={styles.demoButtonSubtext}>Estudiante - Riesgo Alto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoButton, styles.demoButtonExcellent]}
                onPress={() => handleDemoLogin({ email: 'maria.garcia@universidad.edu', password: 'demo123' })}
                disabled={loading}
              >
                <Text style={styles.demoButtonText}>👩‍🎓 {demoNames.maria}</Text>
                <Text style={styles.demoButtonSubtext}>Estudiante - Rendimiento Bueno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoButton, styles.demoButtonExcellent]}
                onPress={() => handleDemoLogin({ email: 'ana.delgado@universidad.edu', password: 'demo789' })}
                disabled={loading}
              >
                <Text style={styles.demoButtonText}>👩‍🎓 {demoNames.ana}</Text>
                <Text style={styles.demoButtonSubtext}>Estudiante - Rendimiento Excelente</Text>
              </TouchableOpacity>


            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: '100%',
  },
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
  // ESTILOS NUEVOS PARA REGISTRO
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // ESTILOS DE DEMO
  demoSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 20,
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
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
  },
});