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
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/helpers';
// Importamos el controlador para guardar en SQLite
import userController from '../controllers/UserController';

const logoImage = require('../../assets/LogoPI.png');

// Reutilizamos los colores del Login para consistencia
const COLORS = {
  primary: '#007AFF',
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#CCCCCC',
  error: '#E33333',
  inputBg: '#FAFAFA',
};

// Componente Input Reutilizable
const CustomInput = React.forwardRef(({ label, error, ...props }, ref) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      ref={ref}
      style={[styles.input, error ? styles.inputError : null]}
      placeholderTextColor="#999"
      {...props}
    />
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
));

export default function RegisterScreen() {
  const navigation = useNavigation();
  
  // Referencias para el foco automático al dar "Siguiente"
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido.';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Formato de correo inválido.';
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres.';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Llamada al Controlador: Esto guarda en SQLite
      const result = await userController.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      if (result.success) {
        Alert.alert(
          '¡Registro Exitoso!',
          'Tu cuenta ha sido creada correctamente en la base de datos.',
          [{ 
            text: 'Iniciar Sesión', 
            onPress: () => navigation.navigate('Login') // Volvemos al Login
          }]
        );
      } else {
        Alert.alert('Error', result.message || 'No se pudo registrar el usuario.');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Ocurrió un problema inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          
          <Image source={logoImage} style={styles.logo} />
          
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Sistema de Prevención de Deserción</Text>

          <CustomInput
            label="Nombre Completo"
            placeholder="Ej. Juan Pérez"
            value={formData.name}
            onChangeText={(t) => handleChange('name', t)}
            error={errors.name}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <CustomInput
            ref={emailRef}
            label="Correo Institucional"
            placeholder="juan@universidad.edu"
            value={formData.email}
            onChangeText={(t) => handleChange('email', t)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <CustomInput
            ref={phoneRef}
            label="Teléfono (Opcional)"
            placeholder="55 1234 5678"
            value={formData.phone}
            onChangeText={(t) => handleChange('phone', t)}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <CustomInput
            ref={passwordRef}
            label="Contraseña"
            placeholder="********"
            value={formData.password}
            onChangeText={(t) => handleChange('password', t)}
            error={errors.password}
            secureTextEntry
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          <CustomInput
            ref={confirmPasswordRef}
            label="Confirmar Contraseña"
            placeholder="********"
            value={formData.confirmPassword}
            onChangeText={(t) => handleChange('confirmPassword', t)}
            error={errors.confirmPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 28,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 5,
    backgroundColor: COLORS.inputBg,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 8,
    fontSize: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});