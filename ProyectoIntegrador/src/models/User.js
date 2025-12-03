import { executeQuery, getQueryResults, getQueryResult } from '../database/sqlite';

// Modelo de Usuario
// Define la estructura y métodos relacionados con usuarios
class User {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.email = data.email || '';
        this.password = data.password || '';
        this.role = data.role || 'student';
        this.profile_picture = data.profile_picture || null;
        this.phone = data.phone || null;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Crear nuevo usuario
    static async create(userData) {
        try {
            const { name, email, password, role = 'student', profile_picture, phone } = userData;

            const result = await executeQuery(
                'INSERT INTO users (name, email, password, role, profile_picture, phone) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, password, role, profile_picture, phone]
            );

            if (result.lastInsertRowId) {
                return await User.findById(result.lastInsertRowId);
            }
            return null;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Obtener usuario por ID
    static async findById(id) {
        try {
            const result = await getQueryResult(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            return result ? new User(result) : null;
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    // Obtener usuario por email
    static async findByEmail(email) {
        try {
            const result = await getQueryResult(
                'SELECT * FROM users WHERE email = ? LIMIT 1',
                [email]
            );
            return result ? new User(result) : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            return null; // Fallback más rápido
        }
    }

    // Obtener todos los usuarios
    static async findAll(limit = 100, offset = 0) {
        try {
            const results = await getQueryResults(
                'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            return results.map(userData => new User(userData));
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }

    // Actualizar usuario
    async update(updateData) {
        try {
            const { name, email, profile_picture, phone } = updateData;

            await executeQuery(
                'UPDATE users SET name = ?, email = ?, profile_picture = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name || this.name, email || this.email, profile_picture || this.profile_picture, phone || this.phone, this.id]
            );

            // Actualizar instancia actual
            this.name = name || this.name;
            this.email = email || this.email;
            this.profile_picture = profile_picture || this.profile_picture;
            this.phone = phone || this.phone;

            return this;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Actualizar contraseña
    async updatePassword(newPassword) {
        try {
            await executeQuery(
                'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [newPassword, this.id]
            );
            this.password = newPassword;
            return true;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    // Eliminar usuario
    async delete() {
        try {
            await executeQuery(
                'DELETE FROM users WHERE id = ?',
                [this.id]
            );
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Validar contraseña (simulación - en producción usar hash)
    validatePassword(password) {
        return this.password === password;
    }

    // Obtener datos seguros (sin contraseña)
    toSafeObject() {
        const { password, ...safeData } = this;
        return safeData;
    }

    // Obtener perfil completo con datos del estudiante si aplica
    async getProfile() {
        try {
            const profile = this.toSafeObject();

            if (this.role === 'student') {
                const studentData = await getQueryResult(
                    'SELECT * FROM students WHERE user_id = ? LIMIT 1',
                    [this.id]
                );
                if (studentData) {
                    profile.student = studentData;
                }
            }

            return profile;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return this.toSafeObject(); // Fallback sin datos de estudiante
        }
    }
}

export default User;
