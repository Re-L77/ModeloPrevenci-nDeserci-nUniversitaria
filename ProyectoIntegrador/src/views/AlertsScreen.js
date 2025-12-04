import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { useAuth } from '../navigation/RootNavigator';
import alertController from '../controllers/AlertController';
import { useAlertsBadgeContext } from '../hooks/AlertsBadgeContext';

export default function AlertsScreen() {
    const { currentUser } = useAuth();
    const { decrementAlertsCount, updateAlertsCount } = useAlertsBadgeContext();

    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar alertas desde la base de datos
    useEffect(() => {
        const loadAlerts = async () => {
            if (!currentUser?.student?.id) {
                setLoading(false);
                return;
            }

            try {
                console.log('AlertsScreen: Cargando alertas para estudiante ID:', currentUser.student.id);
                const result = await alertController.getAlertsByStudent(currentUser.student.id);

                if (result.success) {
                    const alertasUI = result.data.map(alert => ({
                        id: alert.id,
                        titulo: alert.title,
                        desc: alert.message,
                        tipo: mapAlertType(alert.type),
                        severity: alert.severity,
                        leida: alert.status !== 'active'
                    }));
                    setNotificaciones(alertasUI);

                    // Actualizar el badge con el número de alertas activas
                    const alertasActivas = alertasUI.filter(alert => !alert.leida);
                    updateAlertsCount(alertasActivas.length);

                    console.log('AlertsScreen: Alertas cargadas:', alertasUI.length);
                } else {
                    console.warn('AlertsScreen: Error cargando alertas:', result.message);
                }
            } catch (error) {
                console.error('AlertsScreen: Error cargando alertas:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAlerts();
    }, [currentUser]);

    // Mapear tipos de alerta para la UI
    const mapAlertType = (type) => {
        const typeMap = {
            'academic': 'Académico',
            'attendance': 'Asistencia',
            'financial': 'Financiero',
            'career': 'Carrera',
            'general': 'General'
        };
        return typeMap[type] || 'General';
    };

    // Obtener icono según tipo y severidad
    const getAlertIcon = (tipo, severity) => {
        if (severity === 'critical') return '🚨';
        if (severity === 'high') return '⚠️';
        if (tipo === 'Asistencia') return '📅';
        if (tipo === 'Académico') return '📚';
        if (tipo === 'Financiero') return '💰';
        if (tipo === 'Carrera') return '👨‍🎓';
        return '🔔';
    };

    // Obtener color de fondo según severidad
    const getIconBackground = (severity) => {
        if (severity === 'critical') return '#FFE1E1';
        if (severity === 'high') return '#FFF1C9';
        if (severity === 'medium') return '#E3F2FD';
        return '#F0F8FF';
    };


    const eliminarNotificacion = async (id) => {
        try {
            console.log('AlertsScreen: Eliminando alerta ID:', id);
            const result = await alertController.deleteAlert(id);

            if (result.success) {
                setNotificaciones(prev => prev.filter(noti => noti.id !== id));
                decrementAlertsCount(); // Decrementar el badge
            } else {
                console.warn('AlertsScreen: Error eliminando alerta:', result.message);
            }
        } catch (error) {
            console.error('AlertsScreen: Error eliminando alerta:', error);
        }
    };

    // Marcar alerta como leída
    const marcarComoLeida = async (id) => {
        try {
            const result = await alertController.resolveAlert(id);

            if (result.success) {
                setNotificaciones(prev => prev.map(noti =>
                    noti.id === id ? { ...noti, leida: true } : noti
                ));
                decrementAlertsCount(); // Decrementar el badge cuando se resuelve
            }
        } catch (error) {
            console.error('AlertsScreen: Error marcando como leída:', error);
        }
    };

    // Marcar todas como leídas
    const marcarTodasLeidas = async () => {
        try {
            const alertasActivas = notificaciones.filter(noti => !noti.leida);
            const promises = alertasActivas.map(noti => alertController.resolveAlert(noti.id));

            await Promise.all(promises);
            setNotificaciones(prev => prev.map(noti => ({ ...noti, leida: true })));

            // Actualizar el badge a 0 ya que todas las alertas están resueltas
            updateAlertsCount(0);
        } catch (error) {
            console.error('AlertsScreen: Error marcando todas como leídas:', error);
        }
    };

    return (
        <View style={styles.container}>


            <View style={styles.fondo}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{notificaciones.length} nuevas</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.markAllBtn} onPress={marcarTodasLeidas}>
                    <Text style={styles.markAllText}>Marcar todas como leídas</Text>
                </TouchableOpacity>
            </View>



            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Cargando notificaciones...</Text>
                </View>
            ) : notificaciones.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../assets/fondoNotis.png')}
                        style={styles.emptyImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.emptyText}>No hay notificaciones</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {notificaciones.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.row}>
                                <View style={[styles.iconContainer, { backgroundColor: getIconBackground(item.severity) }]}>
                                    <Text style={{ fontSize: 20 }}>
                                        {getAlertIcon(item.tipo, item.severity)}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardTitle}>{item.titulo}</Text>
                                    <Text style={styles.cardDesc}>{item.desc}</Text>

                                    <View style={styles.tagsRow}>
                                        <Text style={styles.time}>Hace un momento</Text>

                                        <View style={styles.tag}>
                                            <Text style={styles.tagText}>{item.tipo}</Text>
                                        </View>

                                        <View style={styles.tagGray}>
                                            <Text style={styles.tagGrayText}>
                                                {item.leida ? "Leída" : "No leída"}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.actionsRow}>
                                        {!item.leida && (
                                            <TouchableOpacity onPress={() => marcarComoLeida(item.id)}>
                                                <Text style={styles.markRead}>✓ Marcar como leída</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity onPress={() => eliminarNotificacion(item.id)}>
                                            <Text style={styles.delete}>🗑 Eliminar</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FA",
        paddingHorizontal: 20,
        paddingTop: 40,
    },

    fondo: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 20,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
    },

    badge: {
        backgroundColor: "#E55050",
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 20,
    },

    badgeText: {
        color: "white",
        fontWeight: "bold",
    },

    markAllBtn: {
        backgroundColor: "white",
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E4E4E4",
    },

    markAllText: {
        fontSize: 16,
        color: "#333",
    },

    scroll: {
        marginTop: 25,
    },

    card: {
        backgroundColor: "rgba(197, 229, 255, 0.28)",
        padding: 20,
        borderRadius: 20,
        marginBottom: 18,
        shadowColor: "rgb(1, 4, 6)",
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },

    row: {
        flexDirection: "row",
    },

    iconWarning: {
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: "#FFF1C9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    iconAlert: {
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: "#FFE1E1",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    iconContainer: {
        width: 35,
        height: 35,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },

    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },

    cardDesc: {
        color: "#555",
        marginBottom: 10,
    },

    tagsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        gap: 6,
    },

    time: {
        color: "#777",
    },

    tag: {
        backgroundColor: "#DCEBFF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },

    tagText: {
        color: "#2F74D0",
        fontWeight: "500",
        fontSize: 10,
    },

    tagGray: {
        backgroundColor: "#EEE",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },

    tagGrayText: {
        color: "#555",
        fontSize: 10,
        fontWeight: "500",
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    markRead: {
        color: "#3A7BFF",
        fontWeight: "bold",
        backgroundColor: "hsla(207, 86.8%, 73.3%, 0.43)",
        borderRadius: 20,
        padding: 6,
    },

    delete: {
        color: "#D9534F",
        fontWeight: "bold",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -60,


    },

    emptyImage: {
        width: 250,
        height: 250,
    },

    emptyText: {
        marginTop: 20,
        fontSize: 18,
        color: "#555",
        fontWeight: "500",
    },

});
