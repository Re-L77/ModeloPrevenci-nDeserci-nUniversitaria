import Student from '../models/Student';
import { executeQuery, getQueryResults, getQueryResult } from '../database/sqlite';

// Controlador de Estudiante
// Maneja la lógica de negocio relacionada con estudiantes
class StudentController {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    }

    // Obtener todos los estudiantes con filtros
    async getStudents(filters = {}, pagination = { limit: 20, offset: 0 }) {
        try {
            const { limit, offset } = pagination;
            const students = await Student.findAll(limit, offset, filters);

            return {
                success: true,
                data: students,
                total: students.length,
                filters,
                pagination
            };
        } catch (error) {
            console.error('Get students error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener estudiante por ID
    async getStudentById(id) {
        try {
            const cacheKey = `student-${id}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const student = await Student.findById(id);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: student,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: student
            };
        } catch (error) {
            console.error('Get student by ID error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener estudiante por código
    async getStudentByCode(studentCode) {
        try {
            const student = await Student.findByCode(studentCode);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            return {
                success: true,
                data: student
            };
        } catch (error) {
            console.error('Get student by code error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Crear nuevo estudiante
    async createStudent(studentData) {
        try {
            const { student_code, user_id } = studentData;

            // Validar datos requeridos
            if (!student_code || !user_id) {
                throw new Error('Código de estudiante y ID de usuario son requeridos');
            }

            // Verificar que el código no esté en uso
            const existing = await Student.findByCode(student_code);
            if (existing) {
                throw new Error('El código de estudiante ya está en uso');
            }

            const student = await Student.create(studentData);
            if (!student) {
                throw new Error('Error creando estudiante');
            }

            return {
                success: true,
                data: student,
                message: 'Estudiante creado exitosamente'
            };
        } catch (error) {
            console.error('Create student error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Actualizar estudiante
    async updateStudent(id, updateData) {
        try {
            const student = await Student.findById(id);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            await student.update(updateData);

            // Limpiar cache
            this.cache.delete(`student-${id}`);

            return {
                success: true,
                data: student,
                message: 'Estudiante actualizado exitosamente'
            };
        } catch (error) {
            console.error('Update student error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Eliminar estudiante
    async deleteStudent(id) {
        try {
            const student = await Student.findById(id);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            await student.delete();

            // Limpiar cache
            this.cache.delete(`student-${id}`);

            return {
                success: true,
                message: 'Estudiante eliminado exitosamente'
            };
        } catch (error) {
            console.error('Delete student error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener estudiantes en riesgo
    async getStudentsAtRisk(riskLevels = ['high', 'critical']) {
        try {
            const students = await Student.findAtRisk(riskLevels);

            return {
                success: true,
                data: students,
                count: students.length
            };
        } catch (error) {
            console.error('Get students at risk error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Recalcular niveles de riesgo de todos los estudiantes
    async recalculateAllRiskLevels() {
        try {
            const students = await Student.findAll(1000, 0, { status: 'active' });
            let updatedCount = 0;

            for (const student of students) {
                const oldRisk = student.risk_level;
                const newRisk = await student.calculateRiskLevel();
                if (oldRisk !== newRisk) {
                    updatedCount++;
                }
            }

            // Limpiar cache completo
            this.cache.clear();

            return {
                success: true,
                message: `${updatedCount} estudiantes actualizados`,
                updatedCount
            };
        } catch (error) {
            console.error('Recalculate risk levels error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener estadísticas generales
    async getStatistics() {
        try {
            const stats = await getQueryResult(`
                SELECT 
                    COUNT(*) as total_students,
                    AVG(gpa) as average_gpa,
                    SUM(CASE WHEN risk_level = 'critical' THEN 1 ELSE 0 END) as critical_risk,
                    SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk,
                    SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END) as medium_risk,
                    SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END) as low_risk,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_students,
                    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_students
                FROM students
            `);

            const careerStats = await getQueryResults(`
                SELECT 
                    career,
                    COUNT(*) as count,
                    AVG(gpa) as average_gpa,
                    AVG(semester) as average_semester
                FROM students 
                WHERE status = 'active'
                GROUP BY career
                ORDER BY count DESC
            `);

            return {
                success: true,
                data: {
                    general: stats,
                    byCareer: careerStats
                }
            };
        } catch (error) {
            console.error('Get statistics error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Buscar estudiantes por término
    async searchStudents(searchTerm, limit = 20) {
        try {
            const results = await getQueryResults(`
                SELECT s.*, u.name, u.email, u.phone 
                FROM students s 
                LEFT JOIN users u ON s.user_id = u.id 
                WHERE 
                    u.name LIKE ? OR 
                    s.student_code LIKE ? OR 
                    s.career LIKE ? OR
                    u.email LIKE ?
                ORDER BY u.name
                LIMIT ?
            `, [
                `%${searchTerm}%`,
                `%${searchTerm}%`,
                `%${searchTerm}%`,
                `%${searchTerm}%`,
                limit
            ]);

            const students = results.map(data => {
                const student = new Student(data);
                student.user = {
                    name: data.name,
                    email: data.email,
                    phone: data.phone
                };
                return student;
            });

            return {
                success: true,
                data: students,
                searchTerm,
                count: students.length
            };
        } catch (error) {
            console.error('Search students error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener alertas de un estudiante
    async getStudentAlerts(studentId, status = 'active') {
        try {
            const student = await Student.findById(studentId);
            if (!student) {
                throw new Error('Estudiante no encontrado');
            }

            const alerts = await student.getAlerts(status);

            return {
                success: true,
                data: alerts,
                student: student.user
            };
        } catch (error) {
            console.error('Get student alerts error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Limpiar cache
    clearCache() {
        this.cache.clear();
        return {
            success: true,
            message: 'Cache limpiado'
        };
    }
}

// Instancia singleton del controlador
const studentController = new StudentController();

export default studentController;
