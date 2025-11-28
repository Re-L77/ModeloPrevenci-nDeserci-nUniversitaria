import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Vista de Recursos
// TODO: Implementar interfaz de recursos (materiales de estudio, tutoriales, etc.)

const ResourcesScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Resources Screen</Text>
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

export default ResourcesScreen;
