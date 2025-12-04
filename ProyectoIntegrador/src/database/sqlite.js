import * as SQLite from 'expo-sqlite';

// Configuración de base de datos SQLite
let database = null;
let dbInitializing = false;
let dbInitialized = false;

// Esperar hasta que la base de datos esté lista
const waitForDatabaseReady = async (timeout = 10000) => {
    const startTime = Date.now();
    while (!dbInitialized && !database) {
        if (Date.now() - startTime > timeout) {
            throw new Error('Timeout esperando inicialización de base de datos');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};

// Inicializar base de datos y crear tablas
export const initializeDatabase = async () => {
    try {
        if (dbInitializing) {
            console.log('Base de datos ya está inicializando, esperando...');
            await waitForDatabaseReady();
            return database;
        }

        if (dbInitialized && database) {
            console.log('Base de datos ya fue inicializada');
            return database;
        }

        dbInitializing = true;
        console.log('🔧 Inicializando base de datos...');

        database = await SQLite.openDatabaseAsync('university.db');
        console.log('✅ Conexión a base de datos abierta');

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
                recovery_email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla users creada');

        // Agregar columna recovery_email si no existe (para bases de datos existentes)
        try {
            await database.execAsync('ALTER TABLE users ADD COLUMN recovery_email TEXT;');
        } catch (error) {
            // La columna ya existe o hay otro error, continuamos
        }

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
        console.log('✅ Tabla students creada');

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
        console.log('✅ Tabla alerts creada');

        // Crear tabla de recursos
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                type TEXT NOT NULL,
                url TEXT,
                category TEXT,
                career_specific TEXT,
                file_size TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla resources creada');

        // Agregar columnas si no existen
        try {
            await database.execAsync('ALTER TABLE resources ADD COLUMN career_specific TEXT;');
        } catch (error) {
            // La columna ya existe
        }

        try {
            await database.execAsync('ALTER TABLE resources ADD COLUMN file_size TEXT;');
        } catch (error) {
            // La columna ya existe
        }

        // Insertar datos de demostración
        await insertDemoData();

        dbInitialized = true;
        console.log('✅ Base de datos inicializada correctamente');
        return database;
    } catch (error) {
        dbInitializing = false;
        console.error('❌ Error inicializando base de datos:', error);
        throw error;
    }
};

// Insertar datos de demostración
const insertDemoData = async () => {
    try {
        // Verificar si ya existen datos - usar las funciones publicas
        const userCount = await database.getFirstAsync('SELECT COUNT(*) as count FROM users');
        if (userCount && userCount.count > 0) {
            console.log('ℹ️ Datos de demostración ya existen, omitiendo inserción');
            return;
        }

        console.log('📝 Insertando datos de demostración...');

        // === DATOS ACADÉMICOS DE ESTUDIANTES ===

        // María - Rendimiento promedio (ID: 1)
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [1, 'EST001', 'Ingeniería de Sistemas', 6, 3.8, 'low', '2022-01-15', 120, 2, 5]
        );
        console.log('✅ Estudiante María insertado');

        // Carlos - En riesgo académico (ID: 2)
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [2, 'EST002', 'Ingeniería Industrial', 4, 2.1, 'critical', '2023-01-15', 85, 6, 15]
        );
        console.log('✅ Estudiante Carlos insertado');

        // Ana - Estudiante destacada (ID: 3)
        await database.runAsync(
            'INSERT INTO students (user_id, student_code, career, semester, gpa, risk_level, enrollment_date, academic_credits, failed_subjects, absences) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [3, 'EST003', 'Administración de Empresas', 8, 4.2, 'low', '2021-08-15', 180, 0, 2]
        );
        console.log('✅ Estudiante Ana insertado');

        // === ALERTAS DEMO ===

        // Alertas para María - Ingeniería de Sistemas (riesgo bajo)
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'academic', 'Recordatorio de Matrícula', 'La matrícula para el próximo semestre cierra el 15 de diciembre', 'high']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'attendance', 'Base de Datos II - Asistencia', 'Has faltado 3 veces a Base de Datos II este mes', 'medium']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [1, 'academic', 'Proyecto de Desarrollo Web', 'Entrega del proyecto final de React pendiente para el 20 de diciembre', 'medium']
        );

        // Alertas para Carlos - Ingeniería Industrial (riesgo crítico)
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'academic', 'GPA Crítico', 'Tu promedio académico está por debajo del mínimo requerido (2.1)', 'critical']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'attendance', 'Investigación Operativa - Crítico', 'Has acumulado 15 faltas en Investigación Operativa. Riesgo de pérdida de asignatura', 'critical']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'academic', 'Examen de Estadística Industrial', 'Debes presentar el examen supletorio de Estadística Industrial antes del 18 de diciembre', 'high']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [2, 'financial', 'Pendiente Financiero', 'Tienes pagos pendientes que pueden afectar tu matrícula', 'high']
        );

        // Alertas para Ana - Administración de Empresas (estudiante destacada)
        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [3, 'general', 'Oportunidad de Beca', 'Calificas para la beca de excelencia académica', 'low']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [3, 'career', 'Práctica Profesional', 'Nuevas oportunidades de prácticas en empresas financieras disponibles', 'low']
        );

        await database.runAsync(
            'INSERT INTO alerts (student_id, type, title, message, severity) VALUES (?, ?, ?, ?, ?)',
            [3, 'academic', 'Seminario de Liderazgo', 'Invitación al seminario "Liderazgo Empresarial" - 22 de diciembre', 'low']
        );

        // === RECURSOS ACADÉMICOS POR CARRERA ===

        // Recursos para Ingeniería de Sistemas
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Guía de Normalización de BD', 'Ejercicios prácticos de normalización de bases de datos relacionales', 'document', 'academic', 'Ingeniería de Sistemas', '2.5 MB', 'https://universidad.edu/recursos/bd-normalizacion.pdf']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Tutorial: React Hooks Avanzados', 'Video tutorial completo sobre useState, useEffect y hooks personalizados', 'video', 'academic', 'Ingeniería de Sistemas', '145 MB', 'https://universidad.edu/videos/react-hooks']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Ejercicios de Algoritmos', 'Colección de ejercicios resueltos de algoritmos y estructuras de datos', 'document', 'academic', 'Ingeniería de Sistemas', '3.2 MB', 'https://universidad.edu/recursos/algoritmos.pdf']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Laboratorio de Programación', 'Acceso a entornos de desarrollo y servidores para prácticas', 'tool', 'laboratory', 'Ingeniería de Sistemas', '-', 'https://lab.universidad.edu']
        );

        // Recursos para Ingeniería Industrial
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Manual de Investigación Operativa', 'Guía completa de métodos de optimización y programación lineal', 'document', 'academic', 'Ingeniería Industrial', '4.1 MB', 'https://universidad.edu/recursos/investigacion-operativa.pdf']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Simulación de Procesos Industriales', 'Video tutorial sobre simulación con Arena y optimización de procesos', 'video', 'academic', 'Ingeniería Industrial', '230 MB', 'https://universidad.edu/videos/simulacion-arena']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Casos de Estudio: Lean Manufacturing', 'Análisis de casos reales de implementación de metodologías Lean', 'document', 'academic', 'Ingeniería Industrial', '2.8 MB', 'https://universidad.edu/recursos/lean-manufacturing.pdf']
        );

        // Recursos para Administración de Empresas
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Plan de Negocios: Plantilla', 'Plantilla estructurada para desarrollo de planes de negocio', 'document', 'academic', 'Administración de Empresas', '1.5 MB', 'https://universidad.edu/recursos/plan-negocios.docx']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Análisis Financiero Empresarial', 'Video tutorial sobre análisis de estados financieros y ratios', 'video', 'academic', 'Administración de Empresas', '180 MB', 'https://universidad.edu/videos/analisis-financiero']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Casos Harvard Business School', 'Colección de casos de estudio para análisis estratégico', 'document', 'academic', 'Administración de Empresas', '5.2 MB', 'https://universidad.edu/recursos/casos-harvard.pdf']
        );

        // Recursos generales para todos
        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Bienestar Estudiantil', 'Servicios de apoyo psicológico y social para todos los estudiantes', 'support', 'wellness', 'general', '-', 'https://universidad.edu/bienestar']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Centro de Prácticas Profesionales', 'Conexión con empresas para experiencia laboral en todas las carreras', 'support', 'internships', 'general', '-', 'https://universidad.edu/practicas']
        );

        await database.runAsync(
            'INSERT INTO resources (title, description, type, category, career_specific, file_size, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            ['Oficina de Apoyo Financiero', 'Información sobre becas, créditos y ayudas económicas', 'support', 'financial', 'general', '-', 'https://universidad.edu/financiera']
        );

        console.log('✅ Datos de demostración insertados:');
        console.log('👤 3 usuarios estudiantes creados');
        console.log('🎓 3 estudiantes con diferentes niveles de riesgo');
        console.log('🚨 9 alertas específicas por carrera');
        console.log('📚 15 recursos educativos específicos por carrera');
    } catch (error) {
        console.error('Error insertando datos demo:', error);
    }
};

// Obtener instancia de base de datos
export const getDatabase = () => {
    if (!database || !dbInitialized) {
        const error = new Error('Base de datos no inicializada. Asegúrate de llamar a initializeDatabase() primero.');
        console.error('❌ ' + error.message);
        throw error;
    }
    return database;
};

// Verificar si la base de datos está lista
export const isDatabaseReady = () => {
    return database !== null && dbInitialized;
};

// Esperar a que la base de datos esté lista
export const ensureDatabaseReady = async (timeout = 10000) => {
    if (isDatabaseReady()) {
        return;
    }
    await waitForDatabaseReady(timeout);
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
        // Asegurar que la base de datos esté lista
        await ensureDatabaseReady();

        console.log('📝 Ejecutando query:', sql);
        if (params.length > 0) console.log('   Parámetros:', params);

        // En expo-sqlite v16, los parámetros se pasan como array o como argumentos  
        const result = await database.runAsync(sql, params);

        console.log('✅ Query ejecutada exitosamente');
        return result;
    } catch (error) {
        console.error('❌ Error ejecutando consulta:', error);
        throw error;
    }
};

// Función auxiliar para obtener resultados
export const getQueryResults = async (sql, params = []) => {
    try {
        // Asegurar que la base de datos esté lista
        await ensureDatabaseReady();

        console.log('📝 Ejecutando getAllAsync:', sql);
        if (params.length > 0) console.log('   Parámetros:', params);

        // En expo-sqlite v16
        const results = await database.getAllAsync(sql, params);

        console.log('✅ Resultados obtenidos:', results ? results.length : 0);
        return results || [];
    } catch (error) {
        console.error('❌ Error obteniendo resultados:', error);
        throw error;
    }
};

// Función auxiliar para obtener un solo resultado
export const getQueryResult = async (sql, params = []) => {
    try {
        // Asegurar que la base de datos esté lista
        await ensureDatabaseReady();

        console.log('📝 Ejecutando getFirstAsync:', sql);
        if (params.length > 0) console.log('   Parámetros:', params);

        // En expo-sqlite v16
        const result = await database.getFirstAsync(sql, params);

        console.log('✅ Resultado obtenido:', result ? 'encontrado' : 'no encontrado');
        return result || null;
    } catch (error) {
        console.error('❌ Error obteniendo resultado:', error);
        throw error;
    }
};
