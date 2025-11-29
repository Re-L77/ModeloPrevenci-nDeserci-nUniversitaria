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

// Vista de Cambio de Contraseña
const ChangePasswordScreen = () => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleInputChange = (field, value) => {
        setPasswordData({
            ...passwordData,
            [field]: value,
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field],
        });
    };

    const validatePasswords = () => {
        if (!passwordData.currentPassword) {
            Alert.alert('Error', 'Por favor ingresa tu contraseña actual');
            return false;
        }
        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return false;
        }
        return true;
    };

    const handleChangePassword = () => {
        if (validatePasswords()) {
            // TODO: Implementar cambio de contraseña en backend
            Alert.alert('Éxito', 'Contraseña cambida correctamente');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    };

    const PasswordInput = ({ icon, placeholder, value, field, showPassword }) => (
        <View style={styles.passwordInputContainer}>
            <Ionicons name={icon} size={20} color="#8E8E93" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity
                onPress={() => togglePasswordVisibility(field)}
                style={styles.eyeIcon}
            >
                <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#8E8E93"
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
                <Text style={styles.sectionDescription}>
                    Por tu seguridad, te pedimos que confirmes tu contraseña actual
                </Text>

                <View style={styles.formContainer}>
                    <PasswordInput
                        icon="lock-closed"
                        placeholder="Contraseña Actual"
                        value={passwordData.currentPassword}
                        field="currentPassword"
                        showPassword={showPasswords.current}
                    />

                    <View style={styles.divider} />

                    <PasswordInput
                        icon="lock-open"
                        placeholder="Nueva Contraseña"
                        value={passwordData.newPassword}
                        field="newPassword"
                        showPassword={showPasswords.new}
                    />

                    <Text style={styles.passwordHint}>
                        Mínimo 6 caracteres, incluye números y letras
                    </Text>

                    <View style={styles.divider} />

                    <PasswordInput
                        icon="lock-open"
                        placeholder="Confirmar Contraseña"
                        value={passwordData.confirmPassword}
                        field="confirmPassword"
                        showPassword={showPasswords.confirm}
                    />
                </View>

                <TouchableOpacity
                    style={styles.changeButton}
                    onPress={handleChangePassword}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.changeButtonText}>Cambiar Contraseña</Text>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={20} color="#007AFF" />
                    <Text style={styles.infoText}>
                        Tu contraseña será cambiada inmediatamente. Tendrás que iniciar sesión nuevamente.
                    </Text>
                </View>
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
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 25,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
    },
    eyeIcon: {
        padding: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 5,
    },
    passwordHint: {
        fontSize: 12,
        color: '#8E8E93',
        paddingHorizontal: 15,
        paddingTop: 10,
        fontStyle: 'italic',
    },
    changeButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
        padding: 12,
        gap: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#0D47A1',
        fontWeight: '500',
    },
});

export default ChangePasswordScreen;
