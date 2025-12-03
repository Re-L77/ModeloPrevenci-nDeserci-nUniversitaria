import Resource from '../models/Resource';

// Controlador de Recursos
// Maneja la lógica de negocio relacionada con recursos educativos
class ResourceController {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutos
    }

    // Crear nuevo recurso
    async createResource(resourceData) {
        try {
            const { title, description, type, url, category } = resourceData;

            // Validaciones
            if (!title || !description || !type) {
                throw new Error('Título, descripción y tipo son requeridos');
            }

            // Validar URL si se proporciona
            if (url && url.trim() !== '') {
                try {
                    new URL(url);
                } catch {
                    throw new Error('La URL proporcionada no es válida');
                }
            }

            const resource = await Resource.create({
                title: title.trim(),
                description: description.trim(),
                type: type.trim(),
                url: url ? url.trim() : null,
                category: category ? category.trim() : 'general'
            });

            if (!resource) {
                throw new Error('Error creando recurso');
            }

            // Limpiar cache relacionado
            this.clearTypeCache(type);
            this.clearCategoryCache(category);

            return {
                success: true,
                data: resource,
                message: 'Recurso creado exitosamente'
            };
        } catch (error) {
            console.error('Create resource error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener recurso por ID
    async getResourceById(id) {
        try {
            const cacheKey = `resource-${id}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const resource = await Resource.findById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: resource,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: resource
            };
        } catch (error) {
            console.error('Get resource by ID error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener todos los recursos
    async getAllResources(pagination = { limit: 50, offset: 0 }, activeOnly = true) {
        try {
            const { limit, offset } = pagination;
            const cacheKey = `all-resources-${limit}-${offset}-${activeOnly}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const resources = await Resource.findAll(limit, offset, activeOnly);

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: resources,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: resources,
                count: resources.length,
                pagination
            };
        } catch (error) {
            console.error('Get all resources error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener recursos por tipo
    async getResourcesByType(type, activeOnly = true) {
        try {
            const cacheKey = `resources-type-${type}-${activeOnly}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const resources = await Resource.findByType(type, activeOnly);

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: resources,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: resources,
                count: resources.length,
                type
            };
        } catch (error) {
            console.error('Get resources by type error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener recursos por categoría
    async getResourcesByCategory(category, activeOnly = true) {
        try {
            const cacheKey = `resources-category-${category}-${activeOnly}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const resources = await Resource.findByCategory(category, activeOnly);

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: resources,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: resources,
                count: resources.length,
                category
            };
        } catch (error) {
            console.error('Get resources by category error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener recursos por carrera
    async getResourcesByCareer(career, activeOnly = true) {
        try {
            console.log('ResourceController: Obteniendo recursos para carrera:', career);
            const cacheKey = `resources-career-${career}-${activeOnly}`;
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const resources = await Resource.findByCareer(career, activeOnly);

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: resources,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: resources,
                count: resources.length,
                career: career,
                message: `${resources.length} recursos encontrados para ${career}`
            };
        } catch (error) {
            console.error('ResourceController: Error obteniendo recursos por carrera:', error);
            return {
                success: false,
                data: [],
                message: 'Error al obtener los recursos por carrera'
            };
        }
    }

    // Buscar recursos
    async searchResources(searchTerm, limit = 20, activeOnly = true) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                throw new Error('Término de búsqueda requerido');
            }

            const resources = await Resource.search(searchTerm.trim(), limit, activeOnly);

            return {
                success: true,
                data: resources,
                count: resources.length,
                searchTerm: searchTerm.trim()
            };
        } catch (error) {
            console.error('Search resources error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener recursos con filtros
    async getResourcesWithFilters(filters = {}, pagination = { limit: 50, offset: 0 }) {
        try {
            const { limit, offset } = pagination;
            const resources = await Resource.findWithFilters(filters, limit, offset);

            return {
                success: true,
                data: resources,
                count: resources.length,
                filters,
                pagination
            };
        } catch (error) {
            console.error('Get resources with filters error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Actualizar recurso
    async updateResource(id, updateData) {
        try {
            const resource = await Resource.findById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }

            // Validar URL si se actualiza
            if (updateData.url && updateData.url.trim() !== '') {
                try {
                    new URL(updateData.url);
                } catch {
                    throw new Error('La URL proporcionada no es válida');
                }
            }

            const oldType = resource.type;
            const oldCategory = resource.category;

            await resource.update(updateData);

            // Limpiar cache relacionado
            this.cache.delete(`resource-${id}`);
            this.clearTypeCache(oldType);
            this.clearTypeCache(resource.type);
            this.clearCategoryCache(oldCategory);
            this.clearCategoryCache(resource.category);
            this.clearGeneralCache();

            return {
                success: true,
                data: resource,
                message: 'Recurso actualizado exitosamente'
            };
        } catch (error) {
            console.error('Update resource error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Activar recurso
    async activateResource(id) {
        try {
            const resource = await Resource.findById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }

            if (resource.isActive()) {
                return {
                    success: false,
                    message: 'El recurso ya está activo'
                };
            }

            await resource.activate();

            // Limpiar cache
            this.cache.delete(`resource-${id}`);
            this.clearTypeCache(resource.type);
            this.clearCategoryCache(resource.category);
            this.clearGeneralCache();

            return {
                success: true,
                data: resource,
                message: 'Recurso activado exitosamente'
            };
        } catch (error) {
            console.error('Activate resource error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Desactivar recurso
    async deactivateResource(id) {
        try {
            const resource = await Resource.findById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }

            if (!resource.isActive()) {
                return {
                    success: false,
                    message: 'El recurso ya está inactivo'
                };
            }

            await resource.deactivate();

            // Limpiar cache
            this.cache.delete(`resource-${id}`);
            this.clearTypeCache(resource.type);
            this.clearCategoryCache(resource.category);
            this.clearGeneralCache();

            return {
                success: true,
                data: resource,
                message: 'Recurso desactivado exitosamente'
            };
        } catch (error) {
            console.error('Deactivate resource error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Eliminar recurso
    async deleteResource(id) {
        try {
            const resource = await Resource.findById(id);
            if (!resource) {
                throw new Error('Recurso no encontrado');
            }

            const type = resource.type;
            const category = resource.category;

            await resource.delete();

            // Limpiar cache
            this.cache.delete(`resource-${id}`);
            this.clearTypeCache(type);
            this.clearCategoryCache(category);
            this.clearGeneralCache();

            return {
                success: true,
                message: 'Recurso eliminado exitosamente'
            };
        } catch (error) {
            console.error('Delete resource error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener tipos de recursos disponibles
    async getResourceTypes() {
        try {
            const cacheKey = 'resource-types';
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const types = await Resource.getTypes();

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: types,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: types
            };
        } catch (error) {
            console.error('Get resource types error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener categorías de recursos disponibles
    async getResourceCategories() {
        try {
            const cacheKey = 'resource-categories';
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const categories = await Resource.getCategories();

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: categories,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: categories
            };
        } catch (error) {
            console.error('Get resource categories error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener estadísticas de recursos
    async getResourceStatistics() {
        try {
            const cacheKey = 'resource-statistics';
            const cached = this.cache.get(cacheKey);

            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return {
                    success: true,
                    data: cached.data
                };
            }

            const stats = await Resource.getStatistics();

            // Cache del resultado
            this.cache.set(cacheKey, {
                data: stats,
                timestamp: Date.now()
            });

            return {
                success: true,
                data: stats
            };
        } catch (error) {
            console.error('Get resource statistics error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Obtener recursos recomendados para un estudiante
    async getRecommendedResources(student, limit = 10) {
        try {
            const recommendations = [];

            // Recursos académicos si el GPA es bajo
            if (student.gpa < 3.0) {
                const academicResources = await Resource.findByType('academic', true);
                recommendations.push(...academicResources.slice(0, 3));
            }

            // Recursos de bienestar si tiene muchas faltas
            if (student.absences > 5) {
                const wellnessResources = await Resource.findByType('support', true);
                recommendations.push(...wellnessResources.slice(0, 2));
            }

            // Recursos por carrera
            const careerResources = await Resource.findByCategory('career', true);
            recommendations.push(...careerResources.slice(0, 2));

            // Recursos generales
            if (recommendations.length < limit) {
                const generalResources = await Resource.findByCategory('general', true);
                const needed = limit - recommendations.length;
                recommendations.push(...generalResources.slice(0, needed));
            }

            // Eliminar duplicados y limitar resultados
            const uniqueRecommendations = Array.from(
                new Map(recommendations.map(r => [r.id, r])).values()
            ).slice(0, limit);

            return {
                success: true,
                data: uniqueRecommendations,
                count: uniqueRecommendations.length,
                student: {
                    id: student.id,
                    name: student.user?.name
                }
            };
        } catch (error) {
            console.error('Get recommended resources error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // Limpiar cache por tipo
    clearTypeCache(type) {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes(`type-${type}`)) {
                this.cache.delete(key);
            }
        });
    }

    // Limpiar cache por categoría
    clearCategoryCache(category) {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes(`category-${category}`)) {
                this.cache.delete(key);
            }
        });
    }

    // Limpiar cache general
    clearGeneralCache() {
        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes('all-resources') || key.includes('statistics') ||
                key.includes('types') || key.includes('categories')) {
                this.cache.delete(key);
            }
        });
    }

    // Limpiar todo el cache
    clearCache() {
        this.cache.clear();
        return {
            success: true,
            message: 'Cache de recursos limpiado'
        };
    }

    // Validar recurso antes de guardar
    async validateResource(resourceData) {
        const errors = [];

        if (!resourceData.title || resourceData.title.trim() === '') {
            errors.push('El título es requerido');
        }

        if (!resourceData.description || resourceData.description.trim() === '') {
            errors.push('La descripción es requerida');
        }

        if (!resourceData.type || resourceData.type.trim() === '') {
            errors.push('El tipo es requerido');
        }

        if (resourceData.url && resourceData.url.trim() !== '') {
            try {
                new URL(resourceData.url);
            } catch {
                errors.push('La URL proporcionada no es válida');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Instancia singleton del controlador
const resourceController = new ResourceController();

export default resourceController;