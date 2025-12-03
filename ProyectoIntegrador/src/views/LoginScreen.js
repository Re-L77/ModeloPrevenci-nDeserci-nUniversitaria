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
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('=== HANDLE LOGIN INICIADO ===');
    Keyboard.dismiss();
    setLoading(true);
    // Simulación rápida para ejemplo:
    setTimeout(() => {
        if(email && password) {
             if(onLogin) onLogin();
        } else {
            Alert.alert('Error', 'Llena los campos');
        }
        setLoading(false);
    }, 1000);
  };

  const useDemoCredentials = () => {
    setEmail('maria.garcia@universidad.edu');
    setPassword('demo123');
  };

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Sistema de Prevención de Deserción</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="nombre@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* --- BOTÓN QUE ACTIVA LA NAVEGACIÓN EN PILA --- */}
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

        <TouchableOpacity onPress={useDemoCredentials}>
          <Text style={styles.demoLink}>Usar credenciales de demostración</Text>
        </TouchableOpacity>
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
