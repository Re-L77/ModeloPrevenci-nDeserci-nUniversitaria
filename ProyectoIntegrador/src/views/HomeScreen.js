import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState({
    name: 'María',
    program: 'Ingeniería en Sistemas',
    semester: 'Semestre 5',
    gpa: 9.06,
    maxGpa: 10.0,
    gpaChange: 0.15,
    attendance: 89.6,
    lastAttendanceUpdate: 80,
    materiasEnRiesgo: 1,
    creditosTotales: 18,
  });

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

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      code: 'BD202',
      name: 'Base de Datos II',
      professor: 'Dr. Carlos Ruiz',
      grade: 9.8,
      attendance: 95,
      credits: 4,
      status: 'Excelente',
      statusColor: '#10b981',
    },
    {
      id: 2,
      code: 'DW301',
      name: 'Desarrollo Web',
      professor: 'Ing. Laura Méndez',
      grade: 9.5,
      attendance: 92,
      credits: 4,
      status: 'Excelente',
      statusColor: '#10b981',
    },
    {
      id: 3,
      code: 'MD205',
      name: 'Matemáticas Discretas',
      professor: 'Dr. Roberto Silva',
      grade: 7.2,
      attendance: 78,
      credits: 3,
      status: 'En Riesgo',
      statusColor: '#ef4444',
    },
    {
      id: 4,
      code: 'AA504',
      name: 'Algoritmos Avanzados',
      professor: 'Dra. Ana Torres',
      grade: 9.7,
      attendance: 98,
      credits: 4,
      status: 'Excelente',
      statusColor: '#10b981',
    },
    {
      id: 5,
      code: 'RC401',
      name: 'Redes de Computadoras',
      professor: 'Ing. Miguel López',
      grade: 8.9,
      attendance: 88,
      credits: 4,
      status: 'Bueno',
      statusColor: '#3b82f6',
    },
  ]);

  const [gpaHistory, setGpaHistory] = useState([
    { semester: 'S1', gpa: 8.5 },
    { semester: 'S2', gpa: 8.8 },
    { semester: 'S3', gpa: 8.9 },
    { semester: 'S4', gpa: 8.91 },
    { semester: 'S5', gpa: 9.06 },
  ]);


  // ===== CÁLCULOS =====
  const calculateStatusDistribution = () => {
    const total = subjects.length;
    const excelente = subjects.filter(s => s.status === 'Excelente').length;
    const bueno = subjects.filter(s => s.status === 'Bueno').length;
    const enRiesgo = subjects.filter(s => s.status === 'En Riesgo').length;

    return {
      excelente: { percentage: Math.round((excelente / total) * 100) },
      bueno: { percentage: Math.round((bueno / total) * 100) },
      enRiesgo: { percentage: Math.round((enRiesgo / total) * 100) },
    };
  };

  const statusDist = calculateStatusDistribution();

  const getBarHeight = (gpa) => {
    return Math.round((gpa / 10) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Buenas noches, {studentData.name}!</Text>
            <Text style={styles.subtitle}>{studentData.program} • {studentData.semester}</Text>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Alerts */}
          {alerts.filter(a => a.visible).length > 0 && (
            <View style={styles.alertsContainer}>
              {alerts.filter(a => a.visible).map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertIcon}>
                    <Text style={styles.alertIconText}>⚠</Text>
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                  </View>
                  <TouchableOpacity onPress={() => dismissAlert(alert.id)} style={styles.dismissButton}>
                    <Text style={styles.dismissText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Stats Grid - 2x2 Layout */}
          <View style={styles.statsGridContainer}>
            <View style={styles.statsRow}>
              <View style={[styles.miniCard, styles.blueCard]}>
                <Text style={styles.miniLabel}>Promedio General</Text>
                <Text style={styles.miniIcon}>📊</Text>
                <Text style={styles.miniValue}>{studentData.gpa.toFixed(2)}</Text>
                <Text style={styles.miniSub}>De {studentData.maxGpa} posibles</Text>
                <Text style={styles.miniChange}>+{studentData.gpaChange.toFixed(2)}%</Text>
              </View>

              <View style={[styles.miniCard, styles.orangeCard]}>
                <Text style={styles.miniLabel}>Asistencia</Text>
                <Text style={styles.miniIcon}>📅</Text>
                <Text style={styles.miniValue}>{studentData.attendance.toFixed(1)}%</Text>
                <Text style={styles.miniSub}>Última: {studentData.lastAttendanceUpdate}%</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.miniCard, styles.pinkCard]}>
                <Text style={styles.miniLabel}>Materias en Riesgo</Text>
                <Text style={styles.miniIcon}>⚠️</Text>
                <Text style={styles.miniValue}>{studentData.materiasEnRiesgo}</Text>
                <Text style={styles.miniSub}>De {subjects.length} materias</Text>
              </View>

              <View style={[styles.miniCard, styles.yellowCard]}>
                <Text style={styles.miniLabel}>Créditos Totales</Text>
                <Text style={styles.miniIcon}>⭐</Text>
                <Text style={styles.miniValue}>{studentData.creditosTotales}</Text>
                <Text style={styles.miniSub}>Este semestre</Text>
              </View>
            </View>
          </View>

          {/* Subjects Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}> Mis Materias</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Ver todas →</Text>
              </TouchableOpacity>
            </View>

            {subjects.map((sub) => (
              <TouchableOpacity key={sub.id} style={styles.subjectCard} activeOpacity={0.7}>
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectInfo}>
                    <View style={styles.subjectIconContainer}>
                      <Text style={styles.subjectIconText}>📖</Text>
                    </View>
                    <View style={styles.subjectTexts}>
                      <Text style={styles.subjectName}>{sub.name}</Text>
                      <Text style={styles.professorName}>{sub.professor}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: sub.statusColor + '20' }]}>
                    <Text style={[styles.statusText, { color: sub.statusColor }]}>
                      {sub.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.subjectStats}>
                  <View style={styles.statItem}>
               
                    <Text style={styles.statValue}>{sub.grade.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Calificación</Text>
                  </View>
                  <View style={styles.statItem}>
                    {/* <Text style={styles.statIcon}>📅</Text> */}
                    <Text style={styles.statValue}>{sub.attendance}%</Text>
                    <Text style={styles.statLabel}>Asistencia</Text>
                  </View>
                  <View style={styles.statItem}>
                  
                    <Text style={styles.statValue}>{sub.credits}</Text>
                    <Text style={styles.statLabel}>Créditos</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Analytics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análisis de Rendimiento</Text>

            {/* Evolución */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Evolución de Promedio</Text>
              <View style={styles.chartContainer}>
                <View style={styles.barsContainer}>
                  {gpaHistory.map((item, i) => {
                    const h = getBarHeight(item.gpa);
                    return (
                      <View key={i} style={styles.barWrapper}>
                        <View style={[styles.bar, { height: h }]} />
                        <Text style={styles.barLabel}>{item.semester}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Distribución */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Distribución por Estado</Text>
              <View style={styles.pieContainer}>
                <View style={styles.pieChart}>
                  <View style={[styles.pieSegment, styles.pieGreen, { flex: statusDist.excelente.percentage }]} />
                  <View style={[styles.pieSegment, styles.pieBlue, { flex: statusDist.bueno.percentage }]} />
                  <View style={[styles.pieSegment, styles.pieRed, { flex: statusDist.enRiesgo.percentage }]} />
                </View>
                <View style={styles.legend}>
                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, styles.legendGreen]} />
                      <Text style={styles.legendText}>Excelente</Text>
                    </View>
                    <Text style={styles.legendPercent}>{statusDist.excelente.percentage}%</Text>
                  </View>
                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, styles.legendBlue]} />
                      <Text style={styles.legendText}>Bueno</Text>
                    </View>
                    <Text style={styles.legendPercent}>{statusDist.bueno.percentage}%</Text>
                  </View>
                  <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendColor, styles.legendRed]} />
                      <Text style={styles.legendText}>En Riesgo</Text>
                    </View>
                    <Text style={styles.legendPercent}>{statusDist.enRiesgo.percentage}%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Comparación */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Comparación por Materia</Text>
              <View style={styles.comparisonContainer}>
                {subjects.map((sub) => (
                  <View key={sub.id} style={styles.comparisonRow}>
                    <Text style={styles.comparisonCode}>{sub.code}</Text>
                    <View style={styles.comparisonBars}>
                      <View style={styles.barBackground}>
                        <View style={[styles.comparisonBar, styles.comparisonBarGreen, { width: `${sub.attendance}%` }]} />
                      </View>
                      <View style={styles.barBackground}>
                        <View style={[styles.comparisonBar, styles.comparisonBarBlue, { width: `${(sub.grade / 10) * 100}%` }]} />
                      </View>
                    </View>
                  </View>
                ))}
                <View style={styles.comparisonLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, styles.legendGreen]} />
                    <Text style={styles.legendText}>■ Asistencia</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, styles.legendBlue]} />
                    <Text style={styles.legendText}>■ Calificación</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
    width: '100%',
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    width: '100%',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6c757d',
    textAlign: 'center',
  },

  // Alerts
  alertsContainer: {
    width: '100%',
    marginTop: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffe0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIconText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 17,
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 18,
    color: '#adb5bd',
  },

  // Stats Grid - 2x2 Layout
  statsGridContainer: {
    marginTop: 12,
    marginBottom: 16,
    marginHorizontal: 0,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  miniCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 140,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  blueCard: {
    backgroundColor: '#E8F4FD',
  },
  orangeCard: {
    backgroundColor: '#FFF4E6',
  },
  pinkCard: {
    backgroundColor: '#FFE8E8',
  },
  yellowCard: {
    backgroundColor: '#FFF9E6',
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 5,
  },
  miniIcon: {
    fontSize: 26,
    marginBottom: 5,
  },
  miniValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 3,
  },
  miniSub: {
    fontSize: 9,
    color: '#6c757d',
    marginBottom: 2,
    lineHeight: 12,
  },
  miniChange: {
    fontSize: 8,
    color: '#059669',
    fontWeight: '600',
    lineHeight: 10,
  },

  // Section
  section: {
    width: '100%',
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    color: '#0d6efd',
    fontWeight: '600',
  },

  // Subject Card
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  subjectInfo: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 8,
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectIconText: {
    fontSize: 20,
  },
  subjectTexts: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  professorName: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subjectStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6c757d',
  },

  // Analytics
  analyticsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    height: 120,
    marginBottom: 16,
  },
  barWrapper: {
    alignItems: 'center',
    gap: 10,
  },
  bar: {
    width: 28,
    backgroundColor: '#5B9FED',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '600',
  },

  // Pie Chart
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pieSegment: {
    height: '100%',
  },
  pieGreen: {
    backgroundColor: '#34D399',
  },
  pieBlue: {
    backgroundColor: '#60A5FA',
  },
  pieRed: {
    backgroundColor: '#F87171',
  },

  // Legend
  legend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendGreen: {
    backgroundColor: '#34D399',
  },
  legendBlue: {
    backgroundColor: '#60A5FA',
  },
  legendRed: {
    backgroundColor: '#F87171',
  },
  legendText: {
    fontSize: 12,
    color: '#495057',
  },
  legendPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212529',
  },

  // Comparison
  comparisonContainer: {
    gap: 14,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  comparisonCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#212529',
    width: 50,
  },
  comparisonBars: {
    flex: 1,
    gap: 8,
  },
  barBackground: {
    height: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    overflow: 'hidden',
  },
  comparisonBar: {
    height: '100%',
    borderRadius: 6,
  },
  comparisonBarGreen: {
    backgroundColor: '#34D399',
  },
  comparisonBarBlue: {
    backgroundColor: '#60A5FA',
  },
  comparisonLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 40,
  },
});