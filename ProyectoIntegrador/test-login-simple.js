// Test simple para verificar que el login funciona

import userController from './src/controllers/UserController.js';

console.log('=== INICIANDO PRUEBA SIMPLE DE LOGIN ===');

const testLogin = async () => {
    try {
        console.log('1. Probando login con credenciales válidas...');
        
        // Prueba con datos hardcodeados primero
        const email = 'ana.delgado@universidad.edu';
        const password = 'demo789';
        
        console.log('2. Llamando a userController.login...');
        const result = await userController.login(email, password);
        
        console.log('3. Resultado recibido:', result);
        console.log('4. Tipo de resultado:', typeof result);
        
        if (result && result.success) {
            console.log('✅ LOGIN EXITOSO');
            console.log('Usuario:', result.user?.name);
        } else {
            console.log('❌ LOGIN FALLÓ');
            console.log('Mensaje:', result?.message);
        }
        
    } catch (error) {
        console.log('💥 ERROR EN PRUEBA:', error);
    }
};

export { testLogin };