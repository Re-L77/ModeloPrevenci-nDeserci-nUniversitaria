import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Vista de Configuración de Notificaciones
const NotificationsSettingsScreen = () => {
    const [notifications, setNotifications] = useState({
        academic: true,
        alerts: true,
        messages: true,
        events: false,
        newsLetters: true,
    });

    const handleToggle = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key],
        });
    };

    const handleSave = () => {
        // TODO: Guardar configuración de notificaciones
        Alert.alert('Éxito', 'Configuración de notificaciones guardada');
    };

    const NotificationItem = ({ icon, title, description, value, onToggle }) => (
        <View style={styles.notificationItem}>
            <View style={styles.notificationContent}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={24} color="#007AFF" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.notificationTitle}>{title}</Text>
                    <Text style={styles.notificationDescription}>{description}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E5E5EA', true: '#81C784' }}
                thumbColor="#FFFFFF"
            />
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notificaciones</Text>
                <Text style={styles.sectionDescription}>
                    Elige qué notificaciones deseas recibir
                </Text>

                <View style={styles.notificationsContainer}>
                    <NotificationItem
                        icon="book"
                        title="Notificaciones Académicas"
                        description="Calificaciones, asistencia y tareas"
                        value={notifications.academic}
                        onToggle={() => handleToggle('academic')}
                    />

                    <NotificationItem
                        icon="alert-circle"
                        title="Alertas de Riesgo"
                        description="Avisos de bajo desempeño"
                        value={notifications.alerts}
                        onToggle={() => handleToggle('alerts')}
                    />

                    <NotificationItem
                        icon="mail"
                        title="Mensajes"
                        description="Mensajes de tutores y consejeros"
                        value={notifications.messages}
                        onToggle={() => handleToggle('messages')}
                    />

                    <NotificationItem
                        icon="calendar"
                        title="Eventos"
                        description="Eventos universitarios y seminarios"
                        value={notifications.events}
                        onToggle={() => handleToggle('events')}
                    />

                    <NotificationItem
                        icon="newspaper"
                        title="Boletines"
                        description="Información de la universidad"
                        value={notifications.newsLetters}
                        onToggle={() => handleToggle('newsLetters')}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.saveButtonText}>Guardar Configuración</Text>
                </TouchableOpacity>
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
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 20,
    },
    notificationsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    notificationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    notificationDescription: {
        fontSize: 13,
        color: '#8E8E93',
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#34C759',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default NotificationsSettingsScreen;
