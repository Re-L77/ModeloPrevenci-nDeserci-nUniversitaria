import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/RootNavigator';
import userController from '../controllers/UserController';

const PasswordInput = ({ icon, placeholder, value, onChangeText, showPassword, onTogglePassword }) => (
    <View style={styles.passwordInputContainer}>
        <Ionicons name={icon} size={20} color="#8E8E93" style={styles.inputIcon} />
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={!showPassword}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#8E8E93"
            editable={true}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            textContentType="none"
            passwordRules=""
            importantForAutofill="no"
        />
        <TouchableOpacity
            onPress={onTogglePassword}
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

// Vista de Cambio de Contraseña
const ChangePasswordScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const validatePasswords = () => {
        const { validatePasswordChangeForm, formatErrorMessage } = require('../utils/helpers');

        const validation = validatePasswordChangeForm(
            passwordData.currentPassword,
            passwordData.newPassword,
            passwordData.confirmPassword
        );

        if (!validation.isValid) {
            Alert.alert('Errores de validación', formatErrorMessage(validation.errors));
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePasswords()) {
            return;
        }

        setLoading(true);

        try {
            console.log('ChangePasswordScreen: Cambiando contraseña...');

            const result = await userController.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );

            if (result.success) {
                Alert.alert(
                    'Contraseña Actualizada',
                    'Tu contraseña ha sido cambiada exitosamente. Debes iniciar sesión nuevamente por seguridad.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                // Cerrar sesión automáticamente
                                await logout();
                                if (navigation) {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Auth' }],
                                    });
                                }
                            },
                        },
                    ],
                    { cancelable: false }
                );

                // Limpiar formulario
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                Alert.alert('Error', result.message || 'No se pudo cambiar la contraseña');
            }
        } catch (error) {
            console.error('ChangePasswordScreen: Error cambiando contraseña:', error);
            Alert.alert('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
            >
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
                            onChangeText={(text) => handleInputChange('currentPassword', text)}
                            showPassword={showPasswords.currentPassword}
                            onTogglePassword={() => togglePasswordVisibility('currentPassword')}
                        />

                        <View style={styles.divider} />

                        <PasswordInput
                            icon="lock-open"
                            placeholder="Nueva Contraseña"
                            value={passwordData.newPassword}
                            onChangeText={(text) => handleInputChange('newPassword', text)}
                            showPassword={showPasswords.newPassword}
                            onTogglePassword={() => togglePasswordVisibility('newPassword')}
                        />

                        <Text style={styles.passwordHint}>
                            Mínimo 6 caracteres, incluye números y letras
                        </Text>

                        <View style={styles.divider} />

                        <PasswordInput
                            icon="lock-open"
                            placeholder="Confirmar Contraseña"
                            value={passwordData.confirmPassword}
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                            showPassword={showPasswords.confirmPassword}
                            onTogglePassword={() => togglePasswordVisibility('confirmPassword')}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.changeButton, loading && styles.buttonDisabled]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                        )}
                        <Text style={styles.changeButtonText}>
                            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={20} color="#007AFF" />
                        <Text style={styles.infoText}>
                            Tu contraseña será cambiada inmediatamente. Tendrás que iniciar sesión nuevamente.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
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
    buttonDisabled: {
        backgroundColor: '#B0B0B0',
        opacity: 0.7,
    },
});

export default ChangePasswordScreen;