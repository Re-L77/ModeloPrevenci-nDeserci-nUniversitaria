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

        // Insertar usuario demo
        const result = await database.runAsync(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            ['Maria Garcia', 'maria.garcia@universidad.edu', 'demo123', 'student', '+57 300 123 4567']
        );

        // Insertar estudiante demo
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [result.lastInsertRowId, 'EST001', 'Ingeniería de Sistemas', 6, 3.8, 'low', '2022-01-15', 120, 2, 5]
        );

        // Insertar alertas demo
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'academic', 'Recordatorio de Matrícula', 'La matrícula para el próximo semestre cierra el 15 de diciembre', 'high']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'attendance', 'Asistencia Baja', 'Has faltado 3 veces a Cálculo III este mes', 'medium']
        );

        // Insertar recursos demo
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Tutorías de Matemáticas', 'Apoyo académico gratuito para materias de matemáticas', 'academic', 'tutoring', 'https://universidad.edu/tutorias']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, url) VALUES (?, ?, ?, ?, ?)',
            ['Bienestar Estudiantil', 'Servicios de apoyo psicológico y social', 'support', 'wellness', 'https://universidad.edu/bienestar']
        );

        console.log('Datos de demostración insertados');
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
