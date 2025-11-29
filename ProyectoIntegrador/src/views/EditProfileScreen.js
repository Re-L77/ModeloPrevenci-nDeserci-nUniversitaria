import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Vista de Edición de Perfil
const EditProfileScreen = () => {
    const [formData, setFormData] = useState({
        name: 'María García',
        email: 'maria.garcia@universidad.edu',
        career: 'Ingeniería en Sistemas',
        phone: '+34 612 345 678',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSave = () => {
        // TODO: Guardar cambios en la base de datos
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: 'María García',
            email: 'maria.garcia@universidad.edu',
            career: 'Ingeniería en Sistemas',
            phone: '+34 612 345 678',
        });
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre Completo</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        editable={isEditing}
                        placeholder="Nombre completo"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        editable={isEditing}
                        keyboardType="email-address"
                        placeholder="Correo electrónico"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Carrera</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={formData.career}
                        onChangeText={(value) => handleInputChange('career', value)}
                        editable={false}
                        placeholder="Carrera"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        editable={isEditing}
                        keyboardType="phone-pad"
                        placeholder="Teléfono"
                    />
                </View>

                {!isEditing ? (
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setIsEditing(true)}
                    >
                        <Ionicons name="pencil" size={20} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Editar Información</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <Ionicons name="close" size={20} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    section: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#8E8E93',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000000',
        backgroundColor: '#FFFFFF',
    },
    inputDisabled: {
        backgroundColor: '#F8F8F8',
        color: '#8E8E93',
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    saveButton: {
        backgroundColor: '#34C759',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default EditProfileScreen;
