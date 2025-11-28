import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Vista de Detalles del Estudiante
// TODO: Implementar interfaz de detalles del estudiante

const StudentDetailsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Student Details Screen</Text>
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

export default StudentDetailsScreen;
