import { executeQuery, getQueryResults, getQueryResult } from '../database/sqlite';

// Modelo de Estudiante
// Define la estructura y métodos relacionados con estudiantes
class Student {
    constructor(data = {}) {
        this.id = data.id || null;
        this.user_id = data.user_id || null;
        this.student_code = data.student_code || '';
        this.career = data.career || '';
        this.semester = data.semester || 1;
        this.gpa = data.gpa || 0.0;
        this.risk_level = data.risk_level || 'low';
        this.enrollment_date = data.enrollment_date || null;
        this.status = data.status || 'active';
        this.academic_credits = data.academic_credits || 0;
        this.failed_subjects = data.failed_subjects || 0;
        this.absences = data.absences || 0;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
        // Datos del usuario relacionado (si se incluyen en la consulta)
        this.user = data.user || null;
    }

    // Crear nuevo estudiante
    static async create(studentData) {
        try {
            const {
                user_id,
                student_code,
                career,
                semester = 1,
                gpa = 0.0,
                risk_level = 'low',
                enrollment_date,
                academic_credits = 0,
                failed_subjects = 0,
                absences = 0
            } = studentData;

            const result = await executeQuery(
                'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences]
            );

            if (result.lastInsertRowId) {
                return await Student.findById(result.lastInsertRowId);
            }
            return null;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    }

    // Obtener estudiante por ID
    static async findById(id) {
        try {
            const result = await getQueryResult(
                `SELECT s.*, u.name, u.email, u.phone, u.profile_picture 
                 FROM students s 
                 LEFT JOIN users u ON s.user_id = u.id 
                 WHERE s.id = ?`,
                [id]
            );
            if (result) {
                const student = new Student(result);
                student.user = {
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    profile_picture: result.profile_picture
                };
                return student;
            }
            return null;
        } catch (error) {
            console.error('Error finding student by id:', error);
            throw error;
        }
    }

    // Obtener estudiante por código
    static async findByCode(student_code) {
        try {
            const result = await getQueryResult(
                `SELECT s.*, u.name, u.email, u.phone, u.profile_picture 
                 FROM students s 
                 LEFT JOIN users u ON s.user_id = u.id 
                 WHERE s.student_code = ?`,
                [student_code]
            );
            if (result) {
                const student = new Student(result);
                student.user = {
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    profile_picture: result.profile_picture
                };
                return student;
            }
            return null;
        } catch (error) {
            console.error('Error finding student by code:', error);
            throw error;
        }
    }

    // Obtener estudiante por user_id
    static async findByUserId(user_id) {
        try {
            const result = await getQueryResult(
                'SELECT * FROM students WHERE user_id = ?',
                [user_id]
            );
            return result ? new Student(result) : null;
        } catch (error) {
            console.error('Error finding student by user_id:', error);
            throw error;
        }
    }

    // Obtener todos los estudiantes
    static async findAll(limit = 100, offset = 0, filters = {}) {
        try {
            let query = `SELECT s.*, u.name, u.email, u.phone, u.profile_picture 
                        FROM students s 
                        LEFT JOIN users u ON s.user_id = u.id`;
            let params = [];
            let whereConditions = [];

            // Aplicar filtros
            if (filters.career) {
                whereConditions.push('s.career = ?');
                params.push(filters.career);
            }
            if (filters.semester) {
                whereConditions.push('s.semester = ?');
                params.push(filters.semester);
            }
            if (filters.risk_level) {
                whereConditions.push('s.risk_level = ?');
                params.push(filters.risk_level);
            }
            if (filters.status) {
                whereConditions.push('s.status = ?');
                params.push(filters.status);
            }

            if (whereConditions.length > 0) {
                query += ' WHERE ' + whereConditions.join(' AND ');
            }

            query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const results = await getQueryResults(query, params);
            return results.map(data => {
                const student = new Student(data);
                student.user = {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    profile_picture: data.profile_picture
                };
                return student;
            });
        } catch (error) {
            console.error('Error finding all students:', error);
            throw error;
        }
    }

    // Obtener estudiantes en riesgo
    static async findAtRisk(risk_levels = ['high', 'critical']) {
        try {
            const placeholders = risk_levels.map(() => '?').join(',');
            const results = await getQueryResults(
                `SELECT s.*, u.name, u.email, u.phone 
                 FROM students s 
                 LEFT JOIN users u ON s.user_id = u.id 
                 WHERE s.risk_level IN (${placeholders}) 
                 ORDER BY 
                   CASE s.risk_level 
                     WHEN 'critical' THEN 1 
                     WHEN 'high' THEN 2 
                     ELSE 3 
                   END`,
                risk_levels
            );
            return results.map(data => {
                const student = new Student(data);
                student.user = {
                    name: data.name,
                    email: data.email,
                    phone: data.phone
                };
                return student;
            });
        } catch (error) {
            console.error('Error finding students at risk:', error);
            throw error;
        }
    }

    // Actualizar estudiante
    async update(updateData) {
        try {
            const {
                career,
                semester,
                gpa,
                risk_level,
                status,
                academic_credits,
                failed_subjects,
                absences
            } = updateData;

            await executeQuery(
                'UPDATE students SET career = ?, semester = ?, gpa = ?, risk_level = ?, status = ?, academic_credits = ?, failed_subjects = ?, absences = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [
                    career || this.career,
                    semester !== undefined ? semester : this.semester,
                    gpa !== undefined ? gpa : this.gpa,
                    risk_level || this.risk_level,
                    status || this.status,
                    academic_credits !== undefined ? academic_credits : this.academic_credits,
                    failed_subjects !== undefined ? failed_subjects : this.failed_subjects,
                    absences !== undefined ? absences : this.absences,
                    this.id
                ]
            );

            // Actualizar instancia actual
            Object.assign(this, {
                career: career || this.career,
                semester: semester !== undefined ? semester : this.semester,
                gpa: gpa !== undefined ? gpa : this.gpa,
                risk_level: risk_level || this.risk_level,
                status: status || this.status,
                academic_credits: academic_credits !== undefined ? academic_credits : this.academic_credits,
                failed_subjects: failed_subjects !== undefined ? failed_subjects : this.failed_subjects,
                absences: absences !== undefined ? absences : this.absences
            });

            return this;
        } catch (error) {
            console.error('Error updating student:', error);
            throw error;
        }
    }

    // Calcular y actualizar nivel de riesgo automáticamente
    async calculateRiskLevel() {
        try {
            let riskScore = 0;

            // Factores de riesgo
            if (this.gpa < 2.5) riskScore += 3;
            else if (this.gpa < 3.0) riskScore += 2;
            else if (this.gpa < 3.5) riskScore += 1;

            if (this.failed_subjects > 3) riskScore += 3;
            else if (this.failed_subjects > 1) riskScore += 2;
            else if (this.failed_subjects > 0) riskScore += 1;

            if (this.absences > 10) riskScore += 2;
            else if (this.absences > 5) riskScore += 1;

            // Determinar nivel de riesgo
            let risk_level = 'low';
            if (riskScore >= 6) risk_level = 'critical';
            else if (riskScore >= 4) risk_level = 'high';
            else if (riskScore >= 2) risk_level = 'medium';

            if (risk_level !== this.risk_level) {
                await this.update({ risk_level });
            }

            return risk_level;
        } catch (error) {
            console.error('Error calculating risk level:', error);
            throw error;
        }
    }

    // Eliminar estudiante
    async delete() {
        try {
            await executeQuery(
                'DELETE FROM students WHERE id = ?',
                [this.id]
            );
            return true;
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    }

    // Obtener alertas del estudiante
    async getAlerts(status = 'active') {
        try {
            return await getQueryResults(
                'SELECT * FROM alerts WHERE student_id = ? AND status = ? ORDER BY created_at DESC',
                [this.id, status]
            );
        } catch (error) {
            console.error('Error getting student alerts:', error);
            throw error;
        }
    }

    // Obtener estadísticas del estudiante
    getStats() {
        return {
            gpa: this.gpa,
            semester: this.semester,
            academic_credits: this.academic_credits,
            failed_subjects: this.failed_subjects,
            absences: this.absences,
            risk_level: this.risk_level,
            status: this.status
        };
    }
}

export default Student;
