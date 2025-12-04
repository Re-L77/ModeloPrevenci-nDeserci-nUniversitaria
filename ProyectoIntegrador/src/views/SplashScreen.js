import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image, Easing } from 'react-native';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  // 1. Valores para la entrada principal (Logo y Textos)
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(50)).current; // Para que suban
  const textOpacity = useRef(new Animated.Value(0)).current;

  // 2. Valor para el efecto "Pulse" (Latido de fondo)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 3. Valores para los 3 puntos de carga (Array de valores)
  const dotAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // --- SECUENCIA DE ENTRADA ---
    Animated.sequence([
      // A. Aparece el logo con un efecto de rebote (Spring)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,      // Rebote suave
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // B. Aparecen el título y subtítulo deslizando hacia arriba
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.exp), // Deceleración suave
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // --- ANIMACIONES EN BUCLE ---

    // 1. Efecto Pulse (Latido del círculo)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1, // Crece un 10%
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,   // Regresa
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Efecto Ola para los dots (Uno tras otro)
    const dotAnimations = dotAnims.map((anim) =>
      Animated.sequence([
        Animated.timing(anim, {
          toValue: -10, // Sube 10 pixeles
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,   // Baja
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    // Ejecutamos la animación de los dots con un retraso entre cada uno (stagger)
    Animated.loop(
      Animated.stagger(200, dotAnimations) // 200ms de diferencia entre cada punto
    ).start();

  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo estático */}
      <View style={styles.background} />

      <View style={styles.content}>
        {/* Logo con efecto Pulse detrás */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale }, // Escala de entrada
                { scale: pulseAnim }  // Escala del latido (se multiplican visualmente)
              ],
            },
          ]}
        >
          {/* Círculo decorativo extra para el efecto pulse */}
          <Image
            source={require('../../assets/LogoPI.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Textos con entrada deslizante */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center'
          }}
        >
          <Text style={styles.subtitle}>Tu camino universitario, nuestra misión: tu éxito</Text>
        </Animated.View>
      </View>

      {/* Loading dots tipo "Ola" */}
      <View style={styles.loaderContainer}>
        {dotAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              { transform: [{ translateY: anim }] } // Animamos la posición Y
            ]}
          />
        ))}
      </View>

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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F9FC',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80, // Ajustado para dar espacio visual
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8F1F7',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras suaves
    shadowColor: '#0D5B8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF', // Un borde blanco sutil lo hace ver más limpio
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28, // Un poco más pequeño para asegurar que quepa bien
    fontWeight: '800',
    color: '#0D5B8F',
    marginBottom: 10,
    marginHorizontal: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A8BB0', // Un tono ligeramente más suave que antes
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 22,
    fontWeight: '500',
  },
  loaderContainer: {
    position: 'absolute', // Fijamos posición inferior
    bottom: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12, // Más separación entre puntos
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D5B8F',
  },
  loadingText: {
    fontSize: 12,
    color: '#7A9FBE',
    position: 'absolute',
    bottom: 40,
    letterSpacing: 1,
    textTransform: 'uppercase', // Se ve más técnico
    fontWeight: '600'
  },
});

export default SplashScreen;