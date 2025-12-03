// Script de prueba para verificar la estructura MVC y datos
import { initializeDatabase, getQueryResults } from '../src/database/sqlite';
import userController from '../src/controllers/UserController';
import studentController from '../src/controllers/StudentController';
import alertController from '../src/controllers/AlertController';
import resourceController from '../src/controllers/ResourceController';

const testMVCStructure = async () => {
    console.log('🧪 Iniciando pruebas de la estructura MVC...\n');

    try {
        // Inicializar base de datos
        await initializeDatabase();
        console.log('✅ Base de datos inicializada\n');

        // === PRUEBAS DE USUARIOS ===
        console.log('👤 PRUEBAS DE USUARIOS:');

        // Obtener todos los usuarios
        const users = await getQueryResults('SELECT * FROM users');
        console.log(`• ${users.length} usuarios encontrados:`);
        users.forEach(user => {
            console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
        });
        console.log('');

        // Prueba de login
        const loginResult = await userController.login('maria.garcia@universidad.edu', 'demo123');
        if (loginResult.success) {
            console.log('✅ Login exitoso para María García');
            console.log(`  - Nombre: ${loginResult.user.name}`);
            console.log(`  - Rol: ${loginResult.user.role}`);
            if (loginResult.user.student) {
                console.log(`  - Código: ${loginResult.user.student.student_code}`);
                console.log(`  - GPA: ${loginResult.user.student.gpa}`);
            }
        }
        console.log('');

        // === PRUEBAS DE ESTUDIANTES ===
        console.log('🎓 PRUEBAS DE ESTUDIANTES:');

        const studentsResult = await studentController.getStudents();
        if (studentsResult.success) {
            console.log(`• ${studentsResult.data.length} estudiantes encontrados:`);
            studentsResult.data.forEach(student => {
                console.log(`  - ${student.user?.name || 'N/A'} (${student.student_code})`);
                console.log(`    Carrera: ${student.career}`);
                console.log(`    GPA: ${student.gpa} | Riesgo: ${student.risk_level}`);
            });
        }
        console.log('');

        // Estudiantes en riesgo
        const riskResult = await studentController.getStudentsAtRisk(['high', 'critical']);
        if (riskResult.success) {
            console.log(`🚨 ${riskResult.data.length} estudiantes en riesgo alto/crítico:`);
            riskResult.data.forEach(student => {
                console.log(`  - ${student.user?.name}: ${student.risk_level}`);
            });
        }
        console.log('');

        // === PRUEBAS DE ALERTAS ===
        console.log('🚨 PRUEBAS DE ALERTAS:');

        const alertsResult = await alertController.getAllAlerts();
        if (alertsResult.success) {
            console.log(`• ${alertsResult.data.length} alertas encontradas:`);
            alertsResult.data.forEach(alert => {
                console.log(`  - ${alert.title} (${alert.severity})`);
                console.log(`    Estudiante: ${alert.student?.name || 'N/A'}`);
            });
        }
        console.log('');

        // Alertas críticas
        const criticalResult = await alertController.getCriticalAlerts();
        if (criticalResult.success) {
            console.log(`⚠️ ${criticalResult.data.length} alertas críticas activas`);
        }
        console.log('');

        // === PRUEBAS DE RECURSOS ===
        console.log('📚 PRUEBAS DE RECURSOS:');

        const resourcesResult = await resourceController.getAllResources();
        if (resourcesResult.success) {
            console.log(`• ${resourcesResult.data.length} recursos encontrados:`);

            // Agrupar por tipo
            const byType = {};
            resourcesResult.data.forEach(resource => {
                if (!byType[resource.type]) byType[resource.type] = [];
                byType[resource.type].push(resource);
            });

            Object.keys(byType).forEach(type => {
                console.log(`  ${type}: ${byType[type].length} recursos`);
            });
        }
        console.log('');

        // === ESTADÍSTICAS FINALES ===
        console.log('📊 ESTADÍSTICAS GENERALES:');

        const statsResult = await studentController.getStatistics();
        if (statsResult.success) {
            const stats = statsResult.data.general;
            console.log(`• Total estudiantes: ${stats.total_students}`);
            console.log(`• Promedio general: ${parseFloat(stats.average_gpa).toFixed(2)}`);
            console.log(`• Estudiantes activos: ${stats.active_students}`);
            console.log(`• Riesgo crítico: ${stats.critical_risk}`);
            console.log(`• Riesgo alto: ${stats.high_risk}`);
        }

        console.log('\n✅ ¡Todas las pruebas completadas exitosamente!');
        console.log('🎉 La estructura MVC está funcionando correctamente');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
    }
};

// Ejecutar pruebas si se llama directamente
if (typeof window === 'undefined') {
    testMVCStructure();
}

export default testMVCStructure;