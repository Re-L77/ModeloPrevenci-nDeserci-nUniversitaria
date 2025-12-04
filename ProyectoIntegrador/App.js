import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeDatabase } from './src/database/sqlite';
import userController from './src/controllers/UserController';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('🚀 Inicializando aplicación...');

      // 1. Inicializar base de datos
      await initializeDatabase();
      console.log('✅ Base de datos inicializada');

      // 2. Intentar restaurar sesión previa
      const sessionRestored = await userController.initializeSession();
      if (sessionRestored) {
        console.log('✅ Sesión previa restaurada');
      } else {
        console.log('ℹ️ No hay sesión previa - usuario debe hacer login');
      }

      // 3. Aplicación lista
      console.log('🎯 Inicialización completada');
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
      setInitError(error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // No mostrar splash propio, dejar que RootNavigator maneje el SplashScreen
    return null;
  }

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error de Inicialización</Text>
        <Text style={styles.errorText}>{initError}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
