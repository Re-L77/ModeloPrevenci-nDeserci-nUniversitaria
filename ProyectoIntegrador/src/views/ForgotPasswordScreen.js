import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validateEmail } from '../utils/helpers';

const logoImage = require('../../assets/LogoPI.png');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if(!email || !validateEmail(email)) {
        Alert.alert('Error', 'Ingresa un correo válido.');
        return;
    }
    setLoading(true);
    
    setTimeout(() => {
        setLoading(false);
        Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada.', [
            { text: 'Listo', onPress: () => navigation.goBack() } 
        ]);
    }, 1500);
  };

  return (
    <View style={styles.page}>
      <View style={[styles.card, { marginTop: 60 }]}>
        <Image source={logoImage} style={styles.logo} />
        
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Ingresa tu correo institucional.</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="nombre@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSend}
          disabled={loading}
        >
           {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Enviar Instrucciones</Text>}
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F0F2F5', justifyContent: 'center', padding: 20, alignItems: 'center' },
  card: { backgroundColor: '#FFFFFF', padding: 28, borderRadius: 12, width: '100%', maxWidth: 400, elevation: 4 },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 20, resizeMode: 'contain' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, color: '#666' },
  label: { fontSize: 14, marginBottom: 6, color: '#444' },
  input: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#FAFAFA' },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, borderRadius: 8, marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontWeight: '600', fontSize: 16 },
});