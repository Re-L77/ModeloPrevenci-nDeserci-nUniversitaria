import { executeQuery, getQueryResults, getQueryResult } from '../database/sqlite';

// Modelo de Recurso
// Define la estructura y métodos relacionados con recursos educativos
class Resource {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.type = data.type || 'general';
        this.url = data.url || null;
        this.category = data.category || 'general';
        this.career_specific = data.career_specific || 'general';
        this.file_size = data.file_size || null;
        this.is_active = data.is_active !== undefined ? data.is_active : true;
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    // Crear nuevo recurso
    static async create(resourceData) {
        try {
            const {
                title,
                description,
                type,
                url,
                category,
                is_active = true
            } = resourceData;

            const result = await executeQuery(
                'INSERT INTO resources (title, description, type, url, category, is_active) VALUES (?, ?, ?, ?, ?, ?)',
                [title, description, type, url, category, is_active ? 1 : 0]
            );

            if (result.lastInsertRowId) {
                return await Resource.findById(result.lastInsertRowId);
            }
            return null;
        } catch (error) {
            console.error('Error creating resource:', error);
            throw error;
        }
    }

    // Obtener recurso por ID
    static async findById(id) {
        try {
            const result = await getQueryResult(
                'SELECT * FROM resources WHERE id = ?',
                [id]
            );
            return result ? new Resource(result) : null;
        } catch (error) {
            console.error('Error finding resource by id:', error);
            throw error;
        }
    }

    // Obtener todos los recursos activos
    static async findAll(limit = 50, offset = 0, activeOnly = true) {
        try {
            let query = 'SELECT * FROM resources';
            let params = [];

            if (activeOnly) {
                query += ' WHERE is_active = 1';
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const results = await getQueryResults(query, params);
            return results.map(data => new Resource(data));
        } catch (error) {
            console.error('Error finding all resources:', error);
            throw error;
        }
    }

    // Obtener recursos por tipo
    static async findByType(type, activeOnly = true) {
        try {
            let query = 'SELECT * FROM resources WHERE type = ?';
            let params = [type];

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            query += ' ORDER BY created_at DESC';

            const results = await getQueryResults(query, params);
            return results.map(data => new Resource(data));
        } catch (error) {
            console.error('Error finding resources by type:', error);
            throw error;
        }
    }

    // Obtener recursos por categoría
    static async findByCategory(category, activeOnly = true) {
        try {
            let query = 'SELECT * FROM resources WHERE category = ?';
            let params = [category];

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            query += ' ORDER BY created_at DESC';

            const results = await getQueryResults(query, params);
            return results.map(data => new Resource(data));
        } catch (error) {
            console.error('Error finding resources by category:', error);
            throw error;
        }
    }

    // Obtener recursos por carrera
    static async findByCareer(career, activeOnly = true) {
        try {
            let query = 'SELECT * FROM resources WHERE (career_specific = ? OR career_specific = "general")';
            let params = [career];

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            query += ' ORDER BY career_specific = ? DESC, created_at DESC';
            params.push(career);

            const results = await getQueryResults(query, params);
            return results.map(data => new Resource(data));
        } catch (error) {
            console.error('Error finding resources by career:', error);
            throw error;
        }
    }

    // Buscar recursos por término
    static async search(searchTerm, limit = 20, activeOnly = true) {
        try {
            let query = `
                SELECT * FROM resources 
                WHERE (title LIKE ? OR description LIKE ? OR category LIKE ?)
            `;
            let params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

            if (activeOnly) {
                query += ' AND is_active = 1';
            }

            query += ' ORDER BY title LIMIT ?';
            params.push(limit);

            const results = await getQueryResults(query, params);
            return results.map(data => new Resource(data));
        } catch (error) {
            console.error('Error searching resources:', error);
            throw error;
        }
    }

    // Obtener recursos con filtros
    static async findWithFilters(filters = {}, limit = 50, offset = 0) {
        try {
            let query = 'SELECT * FROM resources';
            let params = [];
            let whereConditions = [];

            if (filters.type) {
                whereConditions.push('type = ?');
                params.push(filters.type);
            }
            if (filters.category) {
                whereConditions.push('category = ?');
                params.push(filters.category);
            }
            if (filters.is_active !== undefined) {
                whereConditions.push('is_active = ?');
                params.push(filters.is_active ? 1 : 0);
            }

            if (whereConditions.length > 0) {
                query += ' WHERE ' + whereConditions.join(' AND ');
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            params.push(limit, offset);

            const results = await getQueryResults(query, params);
            return results.map(data => new Resource(data));
        } catch (error) {
            console.error('Error finding resources with filters:', error);
            throw error;
        }
    }

    // Actualizar recurso
    async update(updateData) {
        try {
            const {
                title,
                description,
                type,
                url,
                category,
                is_active
            } = updateData;

            await executeQuery(
                'UPDATE resources SET title = ?, description = ?, type = ?, url = ?, category = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [
                    title || this.title,
                    description || this.description,
                    type || this.type,
                    url || this.url,
                    category || this.category,
                    is_active !== undefined ? (is_active ? 1 : 0) : this.is_active,
                    this.id
                ]
            );

            // Actualizar instancia actual
            Object.assign(this, {
                title: title || this.title,
                description: description || this.description,
                type: type || this.type,
                url: url || this.url,
                category: category || this.category,
                is_active: is_active !== undefined ? is_active : this.is_active
            });

            return this;
        } catch (error) {
            console.error('Error updating resource:', error);
            throw error;
        }
    }

    // Activar recurso
    async activate() {
        try {
            await this.update({ is_active: true });
            return this;
        } catch (error) {
            console.error('Error activating resource:', error);
            throw error;
        }
    }

    // Desactivar recurso
    async deactivate() {
        try {
            await this.update({ is_active: false });
            return this;
        } catch (error) {
            console.error('Error deactivating resource:', error);
            throw error;
        }
    }

    // Eliminar recurso
    async delete() {
        try {
            await executeQuery('DELETE FROM resources WHERE id = ?', [this.id]);
            return true;
        } catch (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
    }

    // Obtener tipos de recursos disponibles
    static async getTypes() {
        try {
            const results = await getQueryResults(
                'SELECT DISTINCT type FROM resources WHERE is_active = 1 ORDER BY type'
            );
            return results.map(row => row.type);
        } catch (error) {
            console.error('Error getting resource types:', error);
            throw error;
        }
    }

    // Obtener categorías de recursos disponibles
    static async getCategories() {
        try {
            const results = await getQueryResults(
                'SELECT DISTINCT category FROM resources WHERE is_active = 1 ORDER BY category'
            );
            return results.map(row => row.category);
        } catch (error) {
            console.error('Error getting resource categories:', error);
            throw error;
        }
    }

    // Obtener estadísticas de recursos
    static async getStatistics() {
        try {
            const stats = await getQueryResult(`
                SELECT 
                    COUNT(*) as total_resources,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_resources,
                    SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_resources
                FROM resources
            `);

            const typeStats = await getQueryResults(`
                SELECT 
                    type,
                    COUNT(*) as count
                FROM resources 
                WHERE is_active = 1
                GROUP BY type
                ORDER BY count DESC
            `);

            const categoryStats = await getQueryResults(`
                SELECT 
                    category,
                    COUNT(*) as count
                FROM resources 
                WHERE is_active = 1
                GROUP BY category
                ORDER BY count DESC
            `);

            return {
                general: stats,
                byType: typeStats,
                byCategory: categoryStats
            };
        } catch (error) {
            console.error('Error getting resource statistics:', error);
            throw error;
        }
    }

    // Verificar si el recurso está activo
    isActive() {
        return this.is_active === true || this.is_active === 1;
    }

    // Obtener icono según el tipo
    getIcon() {
        const icons = {
            academic: '📚',
            support: '🤝',
            wellness: '💚',
            career: '💼',
            technology: '💻',
            library: '📖',
            tutoring: '👨‍🏫',
            general: '📄'
        };
        return icons[this.type] || icons.general;
    }

    // Verificar si tiene URL
    hasUrl() {
        return this.url && this.url.trim() !== '';
    }
}

export default Resource;