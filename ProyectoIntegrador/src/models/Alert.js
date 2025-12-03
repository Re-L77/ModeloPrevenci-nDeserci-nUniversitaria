import { executeQuery, getQueryResults, getQueryResult } from '../database/sqlite';

// Modelo de Alerta
// Define la estructura y métodos relacionados con alertas
class Alert {
    constructor(data = {}) {
        this.id = data.id || null;
        this.student_id = data.student_id || null;
        this.type = data.type || 'general';
        this.title = data.title || '';
        this.message = data.message || '';
        this.severity = data.severity || 'medium';
        this.status = data.status || 'active';
        this.created_at = data.created_at || null;
        this.resolved_at = data.resolved_at || null;
        // Datos del estudiante relacionado (si se incluyen)
        this.student = data.student || null;
    }

    // Crear nueva alerta
    static async create(alertData) {
        try {
            const {
                student_id,
                type,
                title,
                message,
                severity = 'medium'
            } = alertData;

            const result = await executeQuery(
                'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
                [student_id, type, title, message, severity]
            );

            if (result.lastInsertRowId) {
                return await Alert.findById(result.lastInsertRowId);
            }
            return null;
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    }

    // Obtener alerta por ID
    static async findById(id) {
        try {
            const result = await getQueryResult(
                `SELECT a.*, s.student_code, u.name as student_name, u.email as student_email
                 FROM alerts a
                 LEFT JOIN students s ON a.student_id = s.id
                 LEFT JOIN users u ON s.user_id = u.id
                 WHERE a.id = ?`,
                [id]
            );
            if (result) {
                const alert = new Alert(result);
                alert.student = {
                    code: result.student_code,
                    name: result.student_name,
                    email: result.student_email
                };
                return alert;
            }
            return null;
        } catch (error) {
            console.error('Error finding alert by id:', error);
            throw error;
        }
    }

    // Obtener alertas por estudiante
    static async findByStudent(studentId, status = 'active') {
        try {
            const results = await getQueryResults(
                'SELECT * FROM alerts WHERE student_id = ? AND status = ? ORDER BY created_at DESC',
                [studentId, status]
            );
            return results.map(data => new Alert(data));
        } catch (error) {
            console.error('Error finding alerts by student:', error);
            throw error;
        }
    }

    // Obtener todas las alertas con filtros
    static async findAll(filters = {}, limit = 50, offset = 0) {
        try {
            let query = `
                SELECT a.*, s.student_code, u.name as student_name, u.email as student_email
                FROM alerts a
                LEFT JOIN students s ON a.student_id = s.id
                LEFT JOIN users u ON s.user_id = u.id
            `;
            let params = [];
            let whereConditions = [];

            if (filters.type) {
                whereConditions.push('a.type = ?');
                params.push(filters.type);
            }
            if (filters.severity) {
                whereConditions.push('a.severity = ?');
                params.push(filters.severity);
            }
            if (filters.status) {
                whereConditions.push('a.status = ?');
                params.push(filters.status);
            }
            if (filters.student_id) {
                whereConditions.push('a.student_id = ?');
                params.push(filters.student_id);
            }

            if (whereConditions.length > 0) {
                query += ' WHERE ' + whereConditions.join(' AND ');
            }

            query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const results = await getQueryResults(query, params);
            return results.map(data => {
                const alert = new Alert(data);
                alert.student = {
                    code: data.student_code,
                    name: data.student_name,
                    email: data.student_email
                };
                return alert;
            });
        } catch (error) {
            console.error('Error finding all alerts:', error);
            throw error;
        }
    }

    // Obtener alertas por severidad
    static async findBySeverity(severity, status = 'active') {
        try {
            const results = await getQueryResults(
                `SELECT a.*, s.student_code, u.name as student_name
                 FROM alerts a
                 LEFT JOIN students s ON a.student_id = s.id
                 LEFT JOIN users u ON s.user_id = u.id
                 WHERE a.severity = ? AND a.status = ?
                 ORDER BY a.created_at DESC`,
                [severity, status]
            );
            return results.map(data => {
                const alert = new Alert(data);
                alert.student = {
                    code: data.student_code,
                    name: data.student_name
                };
                return alert;
            });
        } catch (error) {
            console.error('Error finding alerts by severity:', error);
            throw error;
        }
    }

    // Actualizar alerta
    async update(updateData) {
        try {
            const { title, message, severity, status } = updateData;

            await executeQuery(
                'UPDATE alerts SET title = ?, message = ?, severity = ?, status = ? WHERE id = ?',
                [
                    title || this.title,
                    message || this.message,
                    severity || this.severity,
                    status || this.status,
                    this.id
                ]
            );

            // Actualizar instancia actual
            Object.assign(this, {
                title: title || this.title,
                message: message || this.message,
                severity: severity || this.severity,
                status: status || this.status
            });

            return this;
        } catch (error) {
            console.error('Error updating alert:', error);
            throw error;
        }
    }

    // Marcar alerta como resuelta
    async resolve() {
        try {
            await executeQuery(
                'UPDATE alerts SET status = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['resolved', this.id]
            );
            this.status = 'resolved';
            this.resolved_at = new Date().toISOString();
            return this;
        } catch (error) {
            console.error('Error resolving alert:', error);
            throw error;
        }
    }

    // Marcar alerta como activa
    async activate() {
        try {
            await executeQuery(
                'UPDATE alerts SET status = ?, resolved_at = NULL WHERE id = ?',
                ['active', this.id]
            );
            this.status = 'active';
            this.resolved_at = null;
            return this;
        } catch (error) {
            console.error('Error activating alert:', error);
            throw error;
        }
    }

    // Eliminar alerta
    async delete() {
        try {
            await executeQuery('DELETE FROM alerts WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            console.error('Error deleting alert:', error);
            throw error;
        }
    }

    // Verificar si la alerta está resuelta
    isResolved() {
        return this.status === 'resolved' && this.resolved_at !== null;
    }

    // Obtener el icono según el tipo de alerta
    getIcon() {
        const icons = {
            academic: '📚',
            attendance: '📅',
            financial: '💰',
            health: '🏥',
            general: '📢',
            system: '⚙️'
        };
        return icons[this.type] || icons.general;
    }

    // Obtener color según la severidad
    getColor() {
        const colors = {
            low: '#4CAF50',
            medium: '#FF9800',
            high: '#FF5722',
            critical: '#F44336'
        };
        return colors[this.severity] || colors.medium;
    }
}

export default Alert;