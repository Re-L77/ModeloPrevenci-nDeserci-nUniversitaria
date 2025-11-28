import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Si tienes react-native-vector-icons instalado, importa así:
// import Icon from 'react-native-vector-icons/Ionicons';
// Si no, usa emojis temporalmente

export default function StudentDashboard() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'low_attendance',
      title: 'Asistencia Baja',
      message: 'Tu asistencia en Matemáticas Discretas es del 78%. Se requiere mínimo 80%.',
      visible: true,
    },
    {
      id: 2,
      type: 'at_risk',
      title: 'Calificación en Riesgo',
      message: 'Tu promedio de 7.2 en Matemáticas Discretas está por debajo del mínimo recomendado.',
      visible: true,
    },
  ]);

  const [studentData] = useState({
    name: 'María',
    program: 'Ingeniería en Sistemas',
    semester: 'Semestre 5',
    gpa: 9.06,
    maxGpa: 10.0,
    gpaChange: '+0.15 vs semestre anterior',
    attendance: 89.6,
    attendanceDetail: 'Última actualización: 80%',
  });

  const dismissAlert = (id) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, visible: false } : alert)));
  };

  // Funciones para conectar a BD
  const fetchStudentData = async () => {
    // TODO: Implementar fetch de datos del estudiante
  };

  const fetchAlerts = async () => {
    // TODO: Implementar fetch de alertas
  };

  const updateAttendance = async () => {
    // TODO: Implementar actualización de asistencia
  };

  const navigateToProfile = () => {
    // TODO: Navegación a perfil
  };

  const navigateToAlerts = () => {
    // TODO: Navegación a alertas
  };

  const navigateToRecursos = () => {
    // TODO: Navegación a recursos
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Buenas noches, {studentData.name}! 👋</Text>
          <Text style={styles.subtitle}>
            {studentData.program} • {studentData.semester}
          </Text>
        </View>

        {/* Alerts Section */}
        <View style={styles.alertsContainer}>
          {alerts
            .filter((alert) => alert.visible)
            .map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertIconContainer}>
                  <Text style={styles.alertEmoji}>⚠️</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={() => dismissAlert(alert.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dismissText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {/* GPA Card */}
        <View style={styles.gpaCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Promedio General</Text>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>📊</Text>
            </View>
          </View>
          <Text style={styles.mainValue}>{studentData.gpa}</Text>
          <Text style={styles.subValue}>De {studentData.maxGpa} posibles</Text>
          <View style={styles.changeBadge}>
            <Text style={styles.changeEmoji}>📈</Text>
            <Text style={styles.changeText}>{studentData.gpaChange}</Text>
          </View>
        </View>

        {/* Attendance Card */}
        <View style={styles.attendanceCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Asistencia</Text>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>📅</Text>
            </View>
          </View>
          <Text style={styles.mainValue}>{studentData.attendance}%</Text>
          <Text style={styles.subValue}>{studentData.attendanceDetail}</Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  alertsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  alertCard: {
    backgroundColor: '#ffe4e6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  alertEmoji: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  dismissButton: {
    padding: 8,
  },
  dismissText: {
    fontSize: 18,
    color: '#6b7280',
  },
  gpaCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  attendanceCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  iconCircle: {
    width: 36,
    height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  mainValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subValue: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  changeText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 40,
  },
});