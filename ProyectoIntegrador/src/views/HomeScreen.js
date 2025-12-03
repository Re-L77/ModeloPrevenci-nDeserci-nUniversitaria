import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions, SafeAreaView, } from 'react-native';
import { useAuth } from '../navigation/RootNavigator';
import alertController from '../controllers/AlertController';
import resourceController from '../controllers/ResourceController';
import studentController from '../controllers/StudentController';

const { width } = Dimensions.get('window');


//   Descripción: Pantalla principal del estudiante que muestra su desempeño académico

export default function PantallaPrincipalEstudiante() {
  const { currentUser } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos del estudiante calculados dinámicamente
  const datosEstudiante = {
    name: currentUser?.name?.split(' ')[0] || 'Usuario',
    program: currentUser?.student?.career || 'Programa no definido',
    semester: `Semestre ${currentUser?.student?.semester || 'N/A'}`,
    gpa: currentUser?.student?.gpa || 0.0,
    maxGpa: 5.0,
    gpaChange: 0.15,
    attendance: calculateAttendance(currentUser?.student),
    lastAttendanceUpdate: 80,
    materiasEnRiesgo: materias.filter(m => m.status === 'En Riesgo').length,
    creditosTotales: materias.reduce((sum, m) => sum + m.credits, 0),
  };

  // Calcular asistencia basada en las faltas del estudiante
  function calculateAttendance(student) {
    if (!student) return 85.0;
    const absences = student.absences || 0;
    return Math.max(60, 100 - (absences * 1.5));
  }

  // Cargar todos los datos desde la base de datos
  useEffect(() => {
    const loadAllData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log('HomeScreen: Cargando datos para usuario:', currentUser.name);

        // Cargar alertas si es estudiante
        if (currentUser?.student?.id) {
          console.log('HomeScreen: Cargando alertas para estudiante ID:', currentUser.student.id);
          const alertResult = await alertController.getAlertsByStudent(currentUser.student.id);

          if (alertResult.success) {
            const alertasUI = alertResult.data.map(alert => ({
              id: alert.id,
              type: alert.type,
              title: alert.title,
              message: alert.message,
              visible: alert.status === 'active',
              severity: alert.severity
            }));
            setAlertas(alertasUI);
          }

          // Generar materias simuladas basadas en datos reales del estudiante
          const materiasSimuladas = generateStudentSubjects(currentUser.student);
          setMaterias(materiasSimuladas);
        }

        // Cargar recursos recientes
        const resourceResult = await resourceController.getAllResources();
        if (resourceResult.success) {
          // Tomar solo los primeros 3 recursos
          setRecursos(resourceResult.data.slice(0, 3));
        }

      } catch (error) {
        console.error('HomeScreen: Error cargando datos:', error);
        setAlertas([]);
        setMaterias([]);
        setRecursos([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [currentUser]);

  // Generar materias simuladas basadas en el estudiante real
  const generateStudentSubjects = (student) => {
    const baseSubjects = [
      { code: 'BD202', name: 'Base de Datos II', professor: 'Dr. Carlos Ruiz', credits: 4 },
      { code: 'DW301', name: 'Desarrollo Web', professor: 'Ing. Laura Méndez', credits: 4 },
      { code: 'MD205', name: 'Matemáticas Discretas', professor: 'Dr. Roberto Silva', credits: 3 },
      { code: 'AA504', name: 'Algoritmos Avanzados', professor: 'Dra. Ana Torres', credits: 4 },
      { code: 'RC401', name: 'Redes de Computadoras', professor: 'Ing. Miguel López', credits: 4 }
    ];

    return baseSubjects.map((subject, index) => {
      // Generar notas basadas en el GPA del estudiante
      const baseGrade = student.gpa || 3.5;
      const variation = (Math.random() - 0.5) * 1.5;
      const grade = Math.max(1.0, Math.min(5.0, baseGrade + variation));

      // Calcular asistencia basada en las faltas
      const absences = student.absences || 0;
      const attendance = Math.max(60, 100 - (absences * 2) - (Math.random() * 10));

      // Determinar estado basado en la nota
      let status, statusColor;
      if (grade >= 4.0) {
        status = 'Excelente';
        statusColor = '#10b981';
      } else if (grade >= 3.0) {
        status = 'Bueno';
        statusColor = '#3b82f6';
      } else {
        status = 'En Riesgo';
        statusColor = '#ef4444';
      }

      return {
        id: index + 1,
        code: subject.code,
        name: subject.name,
        professor: subject.professor,
        grade: parseFloat(grade.toFixed(1)),
        attendance: Math.round(attendance),
        credits: subject.credits,
        status,
        statusColor
      };
    });
  };







  // Generar historial de promedio dinámico
  const generateGradeHistory = (currentSemester, currentGpa) => {
    const semester = parseInt(currentSemester) || 5;
    const gpa = parseFloat(currentGpa) || 3.5;
    const history = [];

    // Generar historial progresivo hacia el GPA actual
    for (let i = Math.max(1, semester - 4); i <= semester; i++) {
      const progress = (i - Math.max(1, semester - 4)) / Math.max(1, 4);
      const historicalGpa = Math.max(2.0, gpa - (1 - progress) * 1.0 + (Math.random() - 0.5) * 0.3);
      history.push({
        semester: `S${i}`,
        gpa: parseFloat(historicalGpa.toFixed(2))
      });
    }

    return history;
  };

  const historialPromedio = generateGradeHistory(
    currentUser?.student?.semester,
    currentUser?.student?.gpa
  );


  // CÁLCULOS Y FUNCIONES AUXILIARES
  // Calcula la distribución de estados de las materias
  // Retorna porcentajes de: Excelente, Bueno, En Riesgo usando la grafica de pastel


  const calcularDistribucionEstados = () => {
    const total = materias.length;
    const excelente = materias.filter(m => m.status === 'Excelente').length;
    const bueno = materias.filter(m => m.status === 'Bueno').length;
    const enRiesgo = materias.filter(m => m.status === 'En Riesgo').length;

    return {
      excelente: { percentage: Math.round((excelente / total) * 100) },
      bueno: { percentage: Math.round((bueno / total) * 100) },
      enRiesgo: { percentage: Math.round((enRiesgo / total) * 100) },
    };
  };

  const distEstados = calcularDistribucionEstados();


  // Convierte un promedio a altura de barra para el gráfico

  const obtenerAlturaBarra = (promedio) => {
    return Math.round((promedio / 10) * 100);
  };


  //  Elimina una alerta por su ID
  //   Se ejecuta cuando el usuario hace clic en la X de la alerta

  const eliminarAlerta = (id) => {
    setAlertas(alertas.filter(alerta => alerta.id !== id));
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Encabezado con saludo personalizado y programa del estudiante */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Buenas noches, {datosEstudiante.name}!</Text>
            <Text style={styles.subtitle}>{datosEstudiante.program} • {datosEstudiante.semester}</Text>
          </View>
        </View>

        {/* ===== CONTENEDOR PRINCIPAL ===== */}
        <View style={styles.contentContainer}>

          {/* SECCIÓN: ALERTAS */}
          {/* Muestra alertas sobre asistencia baja o calificaciones en riesgo */}

          {alertas.filter(a => a.visible).length > 0 && (
            <View style={styles.alertsContainer}>
              {alertas.filter(a => a.visible).map((alerta) => (
                <View key={alerta.id} style={styles.alertCard}>
                  <View style={styles.alertIcon}>
                    <Text style={styles.alertIconText}>⚠</Text>
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alerta.title}</Text>
                    <Text style={styles.alertMessage}>{alerta.message}</Text>
                  </View>
                  <TouchableOpacity onPress={() => eliminarAlerta(alerta.id)} style={styles.dismissButton}>
                    <Text style={styles.dismissText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* SECCIÓN: ESTADÍSTICAS */}
          {/* - Promedio General
              - Asistencia
              - Materias en Riesgo
              - Créditos Totales  */}
          <View style={styles.statsGridContainer}>
            <View style={styles.statsRow}>
              <View style={[styles.miniCard, styles.blueCard]}>
                <Text style={styles.miniLabel}>Promedio General</Text>
                <Text style={styles.miniIcon}>📊</Text>
                <Text style={styles.miniValue}>{datosEstudiante.gpa.toFixed(2)}</Text>
                <Text style={styles.miniSub}>De {datosEstudiante.maxGpa} posibles</Text>
                <Text style={styles.miniChange}>+{datosEstudiante.gpaChange.toFixed(2)}%</Text>
              </View>

              <View style={[styles.miniCard, styles.orangeCard]}>
                <Text style={styles.miniLabel}>Asistencia</Text>
                <Text style={styles.miniIcon}>📅</Text>
                <Text style={styles.miniValue}>{datosEstudiante.attendance.toFixed(1)}%</Text>
                <Text style={styles.miniSub}>Última: {datosEstudiante.lastAttendanceUpdate}%</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.miniCard, styles.pinkCard]}>
                <Text style={styles.miniLabel}>Materias en Riesgo</Text>
                <Text style={styles.miniIcon}>⚠️</Text>
                <Text style={styles.miniValue}>{datosEstudiante.materiasEnRiesgo}</Text>
                <Text style={styles.miniSub}>De {materias.length} materias</Text>
              </View>

              <View style={[styles.miniCard, styles.yellowCard]}>
                <Text style={styles.miniLabel}>Créditos Totales</Text>
                <Text style={styles.miniIcon}>⭐</Text>
                <Text style={styles.miniValue}>{datosEstudiante.creditosTotales}</Text>
                <Text style={styles.miniSub}>Este semestre</Text>
              </View>
            </View>
          </View>

          {/* SECCIÓN: MIS MATERIAS
           Lista de todas las materias inscritas con su información: */}


          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📚 Mis Materias</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Ver todas →</Text>
              </TouchableOpacity>
            </View>

            {materias.map((materia) => (
              <TouchableOpacity key={materia.id} style={styles.subjectCard} activeOpacity={0.7}>
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectInfo}>
                    <View style={styles.subjectIconContainer}>
                      <Text style={styles.subjectIconText}>📖</Text>
                    </View>
                    <View style={styles.subjectTexts}>
                      <Text style={styles.subjectName}>{materia.name}</Text>
                      <Text style={styles.professorName}>{materia.professor}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: materia.statusColor + '20' }]}>
                    <Text style={[styles.statusText, { color: materia.statusColor }]}>
                      {materia.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.subjectStats}>
                  <View style={styles.statItem}>

                    <Text style={styles.statValue}>{materia.grade.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Calificación</Text>
                  </View>
                  <View style={styles.statItem}>
                    {/* <Text style={styles.statIcon}>📅</Text> */}
                    <Text style={styles.statValue}>{materia.attendance}%</Text>
                    <Text style={styles.statLabel}>Asistencia</Text>
                  </View>
                  <View style={styles.statItem}>

                    <Text style={styles.statValue}>{materia.credits}</Text>
                    <Text style={styles.statLabel}>Créditos</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* SECCIÓN: ANÁLISIS DE RENDIMIENTO */}
          {/* Gráficos y análisis del desempeño académico: */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}> Análisis de Rendimiento</Text>

            {/* SUB-SECCIÓN: EVOLUCIÓN DE PROMEDIO */}
            {/* Gráfico de pastel mostrando la distribución de promedios por semestre */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Evolución de Promedio</Text>
              <View style={styles.chartContainer}>
                <View style={styles.barsContainer}>
                  {historialPromedio.map((item, i) => {
                    const h = obtenerAlturaBarra(item.gpa);
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

            {/*  COMPARACIÓN POR MATERIA */}
            {/* Gráfico de barras comparativo mostrando asistencia vs calificación por materia */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Comparación por Materia</Text>
              <View style={styles.comparisonContainer}>
                {materias.map((materia) => (
                  <View key={materia.id} style={styles.comparisonRow}>
                    <Text style={styles.comparisonCode}>{materia.code}</Text>
                    <View style={styles.comparisonBars}>
                      <View style={styles.barBackground}>
                        <View style={[styles.comparisonBar, styles.comparisonBarGreen, { width: `${materia.attendance}%` }]} />
                      </View>
                      <View style={styles.barBackground}>
                        <View style={[styles.comparisonBar, styles.comparisonBarBlue, { width: `${(materia.grade / 10) * 100}%` }]} />
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

        {/* SECCIÓN: RECURSOS RECIENTES */}
        {recursos.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { marginHorizontal: 20 }]}>
              <Text style={styles.sectionTitle}>📚 Recursos Recientes</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>Ver todos →</Text>
              </TouchableOpacity>
            </View>

            {recursos.map((resource) => (
              <TouchableOpacity key={resource.id} style={styles.resourceCard} activeOpacity={0.7}>
                <View style={styles.resourceIcon}>
                  <Text style={styles.resourceIconText}>
                    {resource.type === 'video' ? '🎥' : '📄'}
                  </Text>
                </View>
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceCategory}>{resource.category || 'General'}</Text>
                  <Text style={styles.resourceDate}>
                    {new Date(resource.created_at).toLocaleDateString('es-ES')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}


//    ESTILOS DEL COMPONENTE

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingTop: 40,
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
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
    width: '100%',
    gap: 10,
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
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  resourceIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resourceIconText: {
    fontSize: 20,
  },
  resourceContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
    lineHeight: 22,
  },
  resourceCategory: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  resourceDate: {
    fontSize: 12,
    color: '#adb5bd',
    fontWeight: '400',
  },
  bottomSpacing: {
    height: 40,
  },
});