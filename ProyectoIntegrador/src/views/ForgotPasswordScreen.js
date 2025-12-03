import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/helpers';
import userController from '../controllers/UserController';

const logoImage = require('../../assets/LogoPI.png');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('carlos.rodriguez@universidad.edu');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('nuevapass123');
  const [confirmPassword, setConfirmPassword] = useState('nuevapass123');
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState('');

  const handleSendCode = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo válido.');
      return;
    }

    setLoading(true);
    try {
      const result = await userController.requestPasswordReset(email);

      if (result.success) {
        setDemoCode(result.demoCode || '');
        Alert.alert(
          'Código Enviado',
          `Se han enviado las instrucciones a tu correo.\n\n🎯 DEMO: Tu código es ${result.demoCode}`,
          [{ text: 'Continuar', onPress: () => setStep(2) }]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al enviar el código. Intenta de nuevo.');
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Ingresa un código de 6 dígitos válido.');
      return;
    }

    setLoading(true);
    try {
      const result = await userController.verifyResetCode(email, code);

      if (result.success) {
        setStep(3);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al verificar el código.');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const result = await userController.resetPasswordWithCode(email, code, newPassword);

      if (result.success) {
        Alert.alert(
          'Éxito',
          'Tu contraseña ha sido actualizada correctamente.',
          [{ text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar la contraseña.');
    }
    setLoading(false);
  };

  const useDemoCode = () => {
    if (demoCode) {
      setCode(demoCode);
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tu correo institucional para recibir el código de recuperación.</Text>

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="tu.correo@universidad.edu"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar Código</Text>}
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.title}>Verificar Código</Text>
      <Text style={styles.subtitle}>Ingresa el código de 6 dígitos enviado a {email}</Text>

      <Text style={styles.label}>Código de Verificación</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el código de 6 dígitos"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
      />

      {demoCode && (
        <TouchableOpacity onPress={useDemoCode} style={styles.demoButton}>
          <Text style={styles.demoButtonText}>🎯 Usar código de demo: {demoCode}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerifyCode}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verificar Código</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Cambiar correo</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.title}>Nueva Contraseña</Text>
      <Text style={styles.subtitle}>Ingresa tu nueva contraseña segura.</Text>

      <Text style={styles.label}>Nueva Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña (mínimo 6 caracteres)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirma tu nueva contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Actualizar Contraseña</Text>}
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.page}>
      <View style={[styles.card, { marginTop: 60 }]}>
        <Image source={logoImage} style={styles.logo} />

        {/* Indicador de paso */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map(stepNum => (
            <View
              key={stepNum}
              style={[
                styles.stepDot,
                step >= stepNum ? styles.stepDotActive : styles.stepDotInactive
              ]}
            />
          ))}
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F0F2F5', justifyContent: 'center', padding: 20, alignItems: 'center' },
  card: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 12, width: '100%', maxWidth: 400, elevation: 4 },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 20, resizeMode: 'contain' },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepDotActive: {
    backgroundColor: '#007AFF',
  },
  stepDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, color: '#666', lineHeight: 20 },
  label: { fontSize: 14, marginBottom: 6, color: '#444' },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#FAFAFA' },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 8, marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  demoButton: {
    backgroundColor: '#E8F4FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  demoButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});