import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del logo: fade-in y scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de los dots de carga
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const dotOpacity = dotAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <View style={styles.background} />

      {/* Contenido principal */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/LogoPI.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>Modelo de prevención para deserción universitaria</Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Tu camino universitario, nuestra misión: tu éxito</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[styles.dot, { opacity: dotOpacity }]}
        />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Texto de carga */}
      <Text style={styles.loadingText}>Iniciando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FC',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F9FC',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  logoContainer: {
    marginBottom: 24,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F1F7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#0D5B8F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  logo: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D5B8F',
    marginBottom: 8,
    marginHorizontal:10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#3D7CA8',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D5B8F',
  },
  loadingText: {
    fontSize: 12,
    color: '#7A9FBE',
    position: 'absolute',
    bottom: 40,
  },
});

export default SplashScreen;
