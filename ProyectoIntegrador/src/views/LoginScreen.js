import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Vista de Login
// TODO: Implementar interfaz de login

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
