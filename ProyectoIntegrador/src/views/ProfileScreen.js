import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Vista de Perfil
// TODO: Implementar lógica completa de perfil y configuración

const ProfileScreen = ({ navigation }) => {
    const handleLogout = () => {
        // TODO: Implementar lógica de logout
        console.log('Logout');
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Sección de Información Personal */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>MG</Text>
                    </View>
                </View>
                <Text style={styles.userName}>María García</Text>
                <Text style={styles.userCareer}>Ingeniería en Sistemas</Text>
                <Text style={styles.userStatus}>Excelente</Text>
            </View>

            {/* Estadísticas */}
            <View style={styles.statsSection}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>9.06</Text>
                    <Text style={styles.statLabel}>Promedio General</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Semestre Actual</Text>
                </View>
            </View>

            {/* Información de Contacto */}
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Correo Electrónico</Text>
                    <Text style={styles.infoValue}>maria.garcia@universidad.edu</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Carrera</Text>
                    <Text style={styles.infoValue}>Ingeniería en Sistemas</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Semestre</Text>
                    <Text style={styles.infoValue}>5</Text>
                </View>
            </View>

            {/* Sección de Configuración */}
            <View style={styles.configSection}>
                <Text style={styles.sectionTitle}>Configuración</Text>

                <TouchableOpacity style={styles.configButton} onPress={handleEditProfile}>
                    <Ionicons name="pencil" size={20} color="#FF9500" />
                    <Text style={styles.configButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.configButton} onPress={handleChangePassword}>
                    <Ionicons name="lock-closed" size={20} color="#FF9500" />
                    <Text style={styles.configButtonText}>Cambiar Contraseña</Text>
                </TouchableOpacity>
            </View>

            {/* Botón de Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Sistema de Prevención de Deserción Universitaria
                </Text>
                <Text style={styles.footerVersion}>Versión 1.0.0 • © 2025</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingTop: 10,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 25,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 12,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    userCareer: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 8,
    },
    userStatus: {
        fontSize: 14,
        color: '#34C759',
        fontWeight: '500',
    },
    statsSection: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        marginBottom: 15,
        gap: 15,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
    infoSection: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    configSection: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 15,
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    infoRow: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    infoLabel: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 15,
        color: '#000000',
        fontWeight: '500',
    },
    configButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
        gap: 12,
    },
    configButtonText: {
        fontSize: 15,
        color: '#000000',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginBottom: 20,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        marginHorizontal: 15,
    },
    footerText: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 5,
    },
    footerVersion: {
        fontSize: 12,
        color: '#8E8E93',
    },
});

export default ProfileScreen;
