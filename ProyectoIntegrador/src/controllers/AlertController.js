import Alert from '../models/Alert';
import Student from '../models/Student';

// Controlador de Alertas
// Maneja la lógica de negocio relacionada con alertas
class AlertController {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 2 * 60 * 1000; // 2 minutos
    }

    // Crear nueva alerta
    async createAlert(alertData) {
        try {
            const { student_id, type, title, message, severity } = alertData;

            // Validaciones
            if (!student_id || !type || !title || !message) {
                throw new Error('Datos de alerta incompletos');
            }

            // Verificar que el estudiante existe
            const student = await Student.findById(student_id);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            const alert = await Alert.create({
                student_id,
                type,
                title,
                message,
                severity: severity || 'medium'
            });

            if (!alert) {
                throw new Error('Error creando alerta');
            }

            // Limpiar cache relacionado
            this.clearStudentCache(student_id);

            return {
                success: true,
                data: alert,
                message: 'Alerta creada exitosamente'
            };
        } catch (error) {
            console.error('Create alert error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener alerta por ID
    async getAlertById(id) {
        try {
            const cacheKey = `alert-${id}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const alert = await Alert.findById(id);
            if (!alert) {
                throw new Error('Alerta no encontrada');
            }

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: alert,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: alert
            };
        } catch (error) {
            console.error('Get alert by ID error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener alertas por estudiante
    async getAlertsByStudent(studentId, status = 'active') {
        try {
            const cacheKey = `student-alerts-${studentId}-${status}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const alerts = await Alert.findByStudent(studentId, status);

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: alerts,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: alerts,
                count: alerts.length
            };
        } catch (error) {
            console.error('Get alerts by student error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener todas las alertas con filtros
    async getAllAlerts(filters = {}, pagination = { limit: 50, offset: 0 }) {
        try {
            const { limit, offset } = pagination;
            const alerts = await Alert.findAll(filters, limit, offset);

            return {
                success: true,
                data: alerts,
                count: alerts.length,
                filters,
                pagination
            };
        } catch (error) {
            console.error('Get all alerts error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener alertas críticas
    async getCriticalAlerts() {
        try {
            const alerts = await Alert.findBySeverity('critical', 'active');

            return {
                success: true,
                data: alerts,
                count: alerts.length
            };
        } catch (error) {
            console.error('Get critical alerts error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener alertas de alta prioridad
    async getHighPriorityAlerts() {
        try {
            const critical = await Alert.findBySeverity('critical', 'active');
            const high = await Alert.findBySeverity('high', 'active');

            const alerts = [...critical, ...high].sort((a, b) => {
                if (a.severity === 'critical' && b.severity !== 'critical') return -1;
                if (b.severity === 'critical' && a.severity !== 'critical') return 1;
                return new Date(b.created_at) - new Date(a.created_at);
            });

            return {
                success: true,
                data: alerts,
                count: alerts.length,
                critical: critical.length,
                high: high.length
            };
        } catch (error) {
            console.error('Get high priority alerts error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Actualizar alerta
    async updateAlert(id, updateData) {
        try {
            const alert = await Alert.findById(id);
            if (!alert) {
                throw new Error('Alerta no encontrada');
            }

            await alert.update(updateData);

            // Limpiar cache
            this.cache.delete(`alert-${id}`);
            this.clearStudentCache(alert.student_id);

            return {
                success: true,
                data: alert,
                message: 'Alerta actualizada exitosamente'
            };
        } catch (error) {
            console.error('Update alert error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Resolver alerta
    async resolveAlert(id) {
        try {
            const alert = await Alert.findById(id);
            if (!alert) {
                throw new Error('Alerta no encontrada');
            }

            if (alert.isResolved()) {
                return {
                    success: false,
                    message: 'La alerta ya está resuelta'
                };
            }

            await alert.resolve();

            // Limpiar cache
            this.cache.delete(`alert-${id}`);
            this.clearStudentCache(alert.student_id);

            return {
                success: true,
                data: alert,
                message: 'Alerta resuelta exitosamente'
            };
        } catch (error) {
            console.error('Resolve alert error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Reactivar alerta
    async reactivateAlert(id) {
        try {
            const alert = await Alert.findById(id);
            if (!alert) {
                throw new Error('Alerta no encontrada');
            }

            if (!alert.isResolved()) {
                return {
                    success: false,
                    message: 'La alerta ya está activa'
                };
            }

            await alert.activate();

            // Limpiar cache
            this.cache.delete(`alert-${id}`);
            this.clearStudentCache(alert.student_id);

            return {
                success: true,
                data: alert,
                message: 'Alerta reactivada exitosamente'
            };
        } catch (error) {
            console.error('Reactivate alert error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Eliminar alerta
    async deleteAlert(id) {
        try {
            const alert = await Alert.findById(id);
            if (!alert) {
                throw new Error('Alerta no encontrada');
            }

            const studentId = alert.student_id;
            await alert.delete();

            // Limpiar cache
            this.cache.delete(`alert-${id}`);
            this.clearStudentCache(studentId);

            return {
                success: true,
                message: 'Alerta eliminada exitosamente'
            };
        } catch (error) {
            console.error('Delete alert error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Crear alertas automáticas basadas en riesgo del estudiante
    async createAutomaticAlerts(studentId) {
        try {
            const student = await Student.findById(studentId);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            const alerts = [];

            // Alerta por GPA bajo
            if (student.gpa < 2.5) {
                const alert = await this.createAlert({
                    student_id: studentId,
                    type: 'academic',
                    title: 'GPA Crítico',
                    message: `El estudiante ${student.user?.name} tiene un GPA de ${student.gpa}, que está por debajo del mínimo requerido.`,
                    severity: student.gpa < 2.0 ? 'critical' : 'high'
                });
                if (alert.success) alerts.push(alert.data);
            }

            // Alerta por materias reprobadas
            if (student.failed_subjects > 2) {
                const alert = await this.createAlert({
                    student_id: studentId,
                    type: 'academic',
                    title: 'Materias Reprobadas',
                    message: `El estudiante tiene ${student.failed_subjects} materias reprobadas. Se requiere seguimiento académico.`,
                    severity: student.failed_subjects > 4 ? 'critical' : 'high'
                });
                if (alert.success) alerts.push(alert.data);
            }

            // Alerta por asistencia
            if (student.absences > 10) {
                const alert = await this.createAlert({
                    student_id: studentId,
                    type: 'attendance',
                    title: 'Asistencia Baja',
                    message: `El estudiante ha acumulado ${student.absences} faltas. Se requiere intervención inmediata.`,
                    severity: student.absences > 15 ? 'critical' : 'high'
                });
                if (alert.success) alerts.push(alert.data);
            }

            return {
                success: true,
                data: alerts,
                count: alerts.length,
                message: `${alerts.length} alertas automáticas creadas`
            };
        } catch (error) {
            console.error('Create automatic alerts error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener resumen de alertas por severidad
    async getAlertsSummary() {
        try {
            const critical = await Alert.findBySeverity('critical', 'active');
            const high = await Alert.findBySeverity('high', 'active');
            const medium = await Alert.findBySeverity('medium', 'active');
            const low = await Alert.findBySeverity('low', 'active');

            return {
                success: true,
                data: {
                    critical: critical.length,
                    high: high.length,
                    medium: medium.length,
                    low: low.length,
                    total: critical.length + high.length + medium.length + low.length
                }
            };
        } catch (error) {
            console.error('Get alerts summary error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Limpiar cache de estudiante específico
    clearStudentCache(studentId) {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes(`student-alerts-${studentId}`)) {
                this.cache.delete(key);
            }
        });
    }

    // Limpiar todo el cache
    clearCache() {
        this.cache.clear();
        return {
            success: true,
            message: 'Cache de alertas limpiado'
        };
    }

    // Procesar alertas en lote
    async processBatchAlerts(actions) {
        try {
            const results = [];

            for (const action of actions) {
                const { type, id, data } = action;

                let result;
                switch (type) {
                    case 'resolve':
                        result = await this.resolveAlert(id);
                        break;
                    case 'reactivate':
                        result = await this.reactivateAlert(id);
                        break;
                    case 'update':
                        result = await this.updateAlert(id, data);
                        break;
                    case 'delete':
                        result = await this.deleteAlert(id);
                        break;
                    default:
                        result = { success: false, message: 'Acción no válida' };
                }

                results.push({ id, type, ...result });
            }

            const successful = results.filter(r => r.success).length;
            const failed = results.length - successful;

            return {
                success: true,
                data: results,
                summary: {
                    total: results.length,
                    successful,
                    failed
                }
            };
        } catch (error) {
            console.error('Process batch alerts error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
}

// Instancia singleton del controlador
const alertController = new AlertController();

export default alertController;