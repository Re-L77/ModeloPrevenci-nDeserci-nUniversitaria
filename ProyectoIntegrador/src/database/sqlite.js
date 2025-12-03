import * as SQLite from 'expo-sqlite';

// Configuración de base de datos SQLite
let database = null;

// Inicializar base de datos y crear tablas
export const initializeDatabase = async () => {
    try {
        database = await SQLite.openDatabaseAsync('university.db');

        // Crear tabla de usuarios
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                profile_picture TEXT,
                phone TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Crear tabla de estudiantes
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                student_code TEXT UNIQUE NOT NULL,
                career TEXT NOT NULL,
                semester INTEGER,
                gpa REAL DEFAULT 0.0,
                risk_level TEXT DEFAULT 'low',
                enrollment_date DATE,
                status TEXT DEFAULT 'active',
                academic_credits INTEGER DEFAULT 0,
                failed_subjects INTEGER DEFAULT 0,
                absences INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );
        `);

        // Crear tabla de alertas
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                severity TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                resolved_at DATETIME,
                FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
            );
        `);

        // Crear tabla de recursos
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                type TEXT NOT NULL,
                url TEXT,
                category TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insertar datos de prueba si no existen
        await insertDemoData();

        console.log('Base de datos inicializada correctamente');
        return database;
    } catch (error) {
        console.error('Error inicializando base de datos:', error);
        throw error;
    }
};

// Insertar datos de demostración
const insertDemoData = async () => {
    try {
        // Verificar si ya existen datos
        const userCount = await database.getFirstAsync('SELECT COUNT(*) as count FROM users');
        if (userCount.count > 0) return;

        // === USUARIOS DEMO ===

        // Usuario estudiante principal
        const mariaResult = await database.runAsync(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['María García López', 'maria.garcia@universidad.edu', 'demo123', 'student', '+57 300 123 4567']
        );

        // Usuario estudiante en riesgo
        const carlosResult = await database.runAsync(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['Carlos Rodríguez', 'carlos.rodriguez@universidad.edu', 'demo456', 'student', '+57 301 234 5678']
        );

        // Usuario administrador
        const adminResult = await database.runAsync(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['Dr. Ana Martínez', 'admin@universidad.edu', 'admin123', 'admin', '+57 302 345 6789']
        );

        // Usuario profesor/consejero
        const teacherResult = await database.runAsync(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['Prof. Luis Hernández', 'luis.hernandez@universidad.edu', 'prof123', 'teacher', '+57 303 456 7890']
        );

        // Usuario estudiante exitoso
        const anaResult = await database.runAsync(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['Ana Sofia Delgado', 'ana.delgado@universidad.edu', 'demo789', 'student', '+57 304 567 8901']
        );

        // === ESTUDIANTES DEMO ===

        // María - Estudiante promedio
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [mariaResult.lastInsertRowId, 'EST001', 'Ingeniería de Sistemas', 6, 3.8, 'low', '2022-01-15', 120, 2, 5]
        );

        // Carlos - Estudiante en riesgo alto
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [carlosResult.lastInsertRowId, 'EST002', 'Ingeniería Industrial', 4, 2.1, 'critical', '2023-01-15', 85, 6, 15]
        );

        // Ana - Estudiante exitosa
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [anaResult.lastInsertRowId, 'EST003', 'Administración de Empresas', 8, 4.2, 'low', '2021-08-15', 180, 0, 2]
        );

        // === ALERTAS DEMO ===

        // Alertas para María (riesgo bajo)
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'academic', 'Recordatorio de Matrícula', 'La matrícula para el próximo semestre cierra el 15 de diciembre', 'high']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'attendance', 'Asistencia Regular', 'Has faltado 3 veces a Cálculo III este mes', 'medium']
        );

        // Alertas para Carlos (riesgo crítico)
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'academic', 'GPA Crítico', 'Tu promedio académico está por debajo del mínimo requerido (2.1)', 'critical']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'attendance', 'Asistencia Crítica', 'Has acumulado 15 faltas este semestre. Riesgo de pérdida de asignatura', 'critical']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'financial', 'Pendiente Financiero', 'Tienes pagos pendientes que pueden afectar tu matrícula', 'high']
        );

        // Alerta para Ana (estudiante exitosa)
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [3, 'general', 'Oportunidad de Beca', 'Calificas para la beca de excelencia académica', 'low']
        );

        // === RECURSOS DEMO ===

        // Recursos académicos
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Tutorías de Matemáticas', 'Apoyo académico gratuito para materias de matemáticas y cálculo', 'academic', 'tutoring', 'https://universidad.edu/tutorias']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Centro de Escritura', 'Apoyo para redacción de ensayos y trabajos académicos', 'academic', 'tutoring', 'https://universidad.edu/escritura']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Laboratorio de Informática', 'Acceso libre a computadores y software especializado', 'academic', 'technology', 'https://universidad.edu/laboratorio']
        );

        // Recursos de bienestar
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Bienestar Estudiantil', 'Servicios de apoyo psicológico y social', 'support', 'wellness', 'https://universidad.edu/bienestar']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Consejería Académica', 'Orientación personalizada para tu plan de estudios', 'support', 'counseling', 'https://universidad.edu/consejeria']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Programa de Mentorías', 'Conexión con estudiantes de semestres avanzados', 'support', 'mentoring', 'https://universidad.edu/mentorias']
        );

        // Recursos financieros
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Oficina Financiera', 'Información sobre becas, créditos y ayudas económicas', 'financial', 'aid', 'https://universidad.edu/financiera']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Programa Trabajo-Estudio', 'Oportunidades de empleo dentro del campus', 'financial', 'employment', 'https://universidad.edu/trabajo-estudio']
        );

        // Recursos de desarrollo profesional
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Centro de Carrera', 'Preparación para entrevistas y búsqueda de empleo', 'career', 'development', 'https://universidad.edu/carrera']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Prácticas Profesionales', 'Conexión con empresas para experiencia laboral', 'career', 'internships', 'https://universidad.edu/practicas']
        );

        // Recursos de salud
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Centro Médico', 'Servicios básicos de salud para estudiantes', 'health', 'medical', 'https://universidad.edu/salud']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Programa de Actividad Física', 'Gimnasio y clases deportivas para estudiantes', 'health', 'fitness', 'https://universidad.edu/deportes']
        );

        console.log('✅ Datos de demostración insertados:');
        console.log('👤 5 usuarios creados (estudiantes, admin, profesor)');
        console.log('🎓 3 estudiantes con diferentes niveles de riesgo');
        console.log('🚨 6 alertas de ejemplo');
        console.log('📚 12 recursos educativos');
    } catch (error) {
        console.error('Error insertando datos demo:', error);
    }
};

// Obtener instancia de base de datos
export const getDatabase = () => {
    if (!database) {
        throw new Error('Base de datos no inicializada. Llama a initializeDatabase() primero.');
    }
    return database;
};

// Cerrar base de datos
export const closeDatabase = async () => {
    if (database) {
        await database.closeAsync();
        database = null;
        console.log('Base de datos cerrada');
    }
};

// Función auxiliar para ejecutar consultas
export const executeQuery = async (sql, params = []) => {
    try {
        const db = getDatabase();
        return await db.runAsync(sql, params);
    } catch (error) {
        console.error('Error ejecutando consulta:', error);
        throw error;
    }
};

// Función auxiliar para obtener resultados
export const getQueryResults = async (sql, params = []) => {
    try {
        const db = getDatabase();
        return await db.getAllAsync(sql, params);
    } catch (error) {
        console.error('Error obteniendo resultados:', error);
        throw error;
    }
};

// Función auxiliar para obtener un solo resultado
export const getQueryResult = async (sql, params = []) => {
    try {
        const db = getDatabase();
        return await db.getFirstAsync(sql, params);
    } catch (error) {
        console.error('Error obteniendo resultado:', error);
        throw error;
    }
};
