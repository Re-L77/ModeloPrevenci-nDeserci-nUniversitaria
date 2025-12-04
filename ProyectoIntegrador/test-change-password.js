#!/usr/bin/env node

// Test de funcionalidad de cambio de contraseña
console.log('🔒 Test de Cambio de Contraseña');
console.log('================================');

// Configurar el entorno de prueba
process.env.NODE_ENV = 'test';

// Mock de React Native y AsyncStorage
const mockAsyncStorage = {
    data: new Map(),
    getItem: async (key) => mockAsyncStorage.data.get(key) || null,
    setItem: async (key, value) => mockAsyncStorage.data.set(key, value),
    removeItem: async (key) => mockAsyncStorage.data.delete(key),
    multiSet: async (pairs) => pairs.forEach(([key, value]) => mockAsyncStorage.data.set(key, value))
};

// Mock de React Native
global.require = (path) => {
    if (path === '@react-native-async-storage/async-storage') {
        return { default: mockAsyncStorage };
    }
    return originalRequire(path);
};

const originalRequire = require;

async function testChangePassword() {
    try {
        // Importar dependencias
        const userController = require('./src/controllers/UserController').default;
        const { initDatabase } = require('./src/database/sqlite');

        console.log('📊 Inicializando base de datos...');
        await initDatabase();

        console.log('👤 Creando usuario de prueba...');
        const testUser = {
            name: 'Usuario Test',
            email: 'test.change@password.com',
            password: 'password123',
            confirmPassword: 'password123',
            phone: '1234567890'
        };

        const registerResult = await userController.register(testUser);
        if (!registerResult.success) {
            console.error('❌ Error registrando usuario:', registerResult.message);
            return;
        }

        console.log('✅ Usuario registrado:', registerResult.user.email);

        console.log('🔐 Haciendo login...');
        const loginResult = await userController.login(testUser.email, testUser.password);
        if (!loginResult.success) {
            console.error('❌ Error en login:', loginResult.message);
            return;
        }

        console.log('✅ Login exitoso');

        console.log('🔄 Probando cambio de contraseña...');

        // Test 1: Contraseña actual incorrecta
        console.log('\nTest 1: Contraseña actual incorrecta');
        const test1 = await userController.changePassword('wrong_password', 'newpass123', 'newpass123');
        console.log(test1.success ? '❌ FALLÓ - debería rechazar contraseña incorrecta' : '✅ PASÓ - rechazó contraseña incorrecta');
        console.log('   Mensaje:', test1.message);

        // Test 2: Contraseñas nuevas no coinciden
        console.log('\nTest 2: Contraseñas nuevas no coinciden');
        const test2 = await userController.changePassword('password123', 'newpass123', 'different123');
        console.log(test2.success ? '❌ FALLÓ - debería rechazar contraseñas que no coinciden' : '✅ PASÓ - rechazó contraseñas que no coinciden');
        console.log('   Mensaje:', test2.message);

        // Test 3: Nueva contraseña muy corta
        console.log('\nTest 3: Nueva contraseña muy corta');
        const test3 = await userController.changePassword('password123', '123', '123');
        console.log(test3.success ? '❌ FALLÓ - debería rechazar contraseña corta' : '✅ PASÓ - rechazó contraseña corta');
        console.log('   Mensaje:', test3.message);

        // Test 4: Cambio exitoso
        console.log('\nTest 4: Cambio exitoso');
        const test4 = await userController.changePassword('password123', 'mynewpass456', 'mynewpass456');
        console.log(test4.success ? '✅ PASÓ - cambio exitoso' : '❌ FALLÓ - debería cambiar contraseña válida');
        console.log('   Mensaje:', test4.message);

        if (test4.success) {
            // Test 5: Verificar que el login funciona con la nueva contraseña
            console.log('\nTest 5: Login con nueva contraseña');
            await userController.logout();
            const test5 = await userController.login(testUser.email, 'mynewpass456');
            console.log(test5.success ? '✅ PASÓ - login con nueva contraseña' : '❌ FALLÓ - no puede hacer login con nueva contraseña');

            // Test 6: Verificar que el login falla con la contraseña anterior
            console.log('\nTest 6: Login con contraseña anterior');
            await userController.logout();
            const test6 = await userController.login(testUser.email, 'password123');
            console.log(!test6.success ? '✅ PASÓ - rechaza contraseña anterior' : '❌ FALLÓ - acepta contraseña anterior');
        }

        console.log('\n🎉 Tests de cambio de contraseña completados');

    } catch (error) {
        console.error('💥 Error en test:', error);
    }
}

// Ejecutar test
testChangePassword().then(() => {
    console.log('\n✨ Test finalizado');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});