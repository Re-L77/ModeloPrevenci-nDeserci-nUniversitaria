import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";

export default function AlertsScreen() {

    const [notificaciones, setNotificaciones] = useState([
        {
            id: 1,
            titulo: "Asistencia Baja",
            desc: "Tu asistencia en Matemáticas Discretas es del 78%. Se requiere mínimo 80%.",
            tipo: "Asistencia",
            leida: false
        },
        {
            id: 2,
            titulo: "Calificación en Riesgo",
            desc: "Tu promedio de 7.2 en Matemáticas Discretas está por debajo del mínimo recomendado.",
            tipo: "Calificación",
            leida: false
        },
    ]);


    const eliminarNotificacion = async (id) => {
        console.log("Eliminar en BD (pendiente): ", id);


        setNotificaciones(prev => prev.filter(noti => noti.id !== id));
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

                <TouchableOpacity style={styles.markAllBtn}>
                    <Text style={styles.markAllText}>Marcar todas como leídas</Text>
                </TouchableOpacity>
            </View>



            {notificaciones.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../assets/fondoNotis.png')}
                        style={styles.emptyImage}
                        resizeMode="contain"
                    />

                    <Text style={styles.emptyText}>No hay notificaciones</Text>
                </View>
            ) : (
                <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 30 }}>
                    {notificaciones.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.row}>

                                <View style={item.tipo === "Asistencia" ? styles.iconWarning : styles.iconAlert}>
                                    <Text style={{ fontSize: 20 }}>
                                        {item.tipo === "Asistencia" ? "⚠️" : "🚨"}
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
                                        <TouchableOpacity>
                                            <Text style={styles.markRead}>✓ Marcar como leída</Text>
                                        </TouchableOpacity>

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
