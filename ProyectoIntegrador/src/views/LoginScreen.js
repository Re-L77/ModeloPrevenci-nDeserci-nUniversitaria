import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/helpers';
import { loginUser } from '../controllers/UserController';

export default function LoginScreen() {
  const navigation = useNavigation();
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
    } else if (!trimmedEmail.toLowerCase().endsWith('@universidad.edu')) {
      setEmailError('Usa tu correo institucional (@universidad.edu).');
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
    Keyboard.dismiss();
    if (!validateFields()) return;

    setLoading(true);
    try {
      const result = await loginUser(email.trim(), password);
      const success =
        result === true ||
        (result && result.success === true) ||
        (result && result.token);

      if (success) {
        Alert.alert('Login exitoso', 'Bienvenido al sistema.', [
          {
            text: 'Continuar',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error de autenticación', 'Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Ocurrió un error al intentar iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setEmail('maria.garcia@universidad.edu');
    setPassword('demo123');
    setEmailError('');
    setPasswordError('');
    setTimeout(() => passwordRef.current && passwordRef.current.focus(), 100);
  };

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Sistema de Prevención de Deserción</Text>

        <Text style={styles.label}>Correo Institucional</Text>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="estudiante@universidad.edu"
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

        <TouchableOpacity onPress={useDemoCredentials}>
          <Text style={styles.demoLink}>Usar credenciales de demostración</Text>
        </TouchableOpacity>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Cuenta Demo</Text>
          <Text>Email: maria.garcia@universidad.edu</Text>
          <Text>Contraseña: demo123</Text>
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
  demoLink: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  demoBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
});
