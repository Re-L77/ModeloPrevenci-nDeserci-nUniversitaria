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
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🎓</Text>
          </View>
        </View>
        <Text style={styles.appTitle}>Sistema de Prevención</Text>
        <Text style={styles.appSubtitle}>de Deserción Universitaria</Text>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        <Text style={styles.loadingText}>Inicializando aplicación...</Text>
        <StatusBar style="auto" />
      </View>
    );
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
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
