# Estructura del Proyecto - MVC con React Navigation

## 📁 Estructura de Carpetas

```
ProyectoIntegrador/
├── src/
│   ├── database/
│   │   └── sqlite.js          # Configuración de base de datos SQLite
│   │
│   ├── models/
│   │   ├── User.js            # Modelo de Usuario
│   │   └── Student.js         # Modelo de Estudiante
│   │
│   ├── controllers/
│   │   ├── UserController.js  # Controlador de Usuario
│   │   └── StudentController.js # Controlador de Estudiante
│   │
│   ├── views/
│   │   ├── LoginScreen.js           # Pantalla de Login
│   │   ├── HomeScreen.js            # Pantalla de Inicio
│   │   ├── ResourcesScreen.js       # Pantalla de Recursos
│   │   ├── AlertsScreen.js          # Pantalla de Alertas
│   │   ├── StudentDetailsScreen.js  # Pantalla de Detalles del Estudiante
│   │   └── ProfileScreen.js         # Pantalla de Perfil
│   │
│   ├── navigation/
│   │   ├── RootNavigator.js   # Navegador Principal
│   │   ├── AuthNavigator.js   # Navegador de Autenticación
│   │   └── AppNavigator.js    # Navegador de la App (con Tab Navigator)
│   │
│   └── utils/
│       ├── api.js             # Servicio de API
│       ├── constants.js       # Constantes
│       └── helpers.js         # Funciones Auxiliares
│
├── App.js                     # Punto de entrada principal
├── index.js                   # Archivo de inicio
├── app.json                   # Configuración de Expo
└── package.json               # Dependencias
```

## 🔧 Estructura MVC

### Model (Modelos)
- `src/models/` - Define la estructura de datos
- Contiene clases que representan entidades (User, Student, etc.)
- Métodos para operaciones CRUD con SQLite

### View (Vistas)
- `src/views/` - Componentes React Native
- Pantallas de la aplicación
- Interfaz de usuario

### Controller (Controladores)
- `src/controllers/` - Lógica de negocio
- Maneja la comunicación entre modelos y vistas
- Procesa datos antes de enviarlos a las vistas

## 📱 Sistema de Navegación

### RootNavigator
- Componente raíz de navegación
- Controla si mostrar AuthNavigator o AppNavigator
- Verifica el estado de autenticación del usuario

### AuthNavigator
- Stack Navigator para pantallas de autenticación
- Pantalla: Login
- Solo accesible sin autenticación

### AppNavigator
- Combinación de Stack Navigator + Tab Navigator
- **Tab Navigator (4 tabs en la parte inferior):**
  - 🏠 **Inicio** → HomeScreen
  - 📚 **Recursos** → ResourcesScreen
  - 🔔 **Alertas** → AlertsScreen (con badge para notificaciones)
  - 👤 **Perfil** → ProfileScreen
- **Stack Navigator:**
  - Pantallas adicionales como StudentDetailsScreen
  - Navegación entre detalles sin perder los tabs

## 🗄️ Base de Datos

### SQLite
- `src/database/sqlite.js` - Configuración y conexión de SQLite
- Inicialización de la base de datos
- Métodos para consultas y operaciones CRUD

## 🔌 Utilidades

- **api.js** - Servicio para llamadas HTTP a API o servidor
- **constants.js** - Valores constantes (URLs, colores, mensajes)
- **helpers.js** - Funciones auxiliares reutilizables

## 🎨 Características Implementadas

- ✅ Navegación con React Navigation
- ✅ Tab Navigator con 4 pestañas
- ✅ Iconos dinámicos (Ionicons) en tabs
- ✅ Badge en la pestaña de Alertas
- ✅ Stack Navigator para pantallas de detalle
- ✅ Separación completa de vistas
- ✅ Estructura escalable y modular

## 📋 Próximos Pasos para Completar

1. **Autenticación:**
   - Implementar login en `LoginScreen.js`
   - Usar `UserController.js` para lógica de autenticación
   - Actualizar `RootNavigator.js` con verificación de tokens

2. **Base de Datos:**
   - Configurar SQLite en `src/database/sqlite.js`
   - Crear tablas para usuarios, estudiantes, etc.
   - Implementar métodos CRUD en modelos

3. **Modelos y Controladores:**
   - Completar clases en `User.js` y `Student.js`
   - Agregar métodos en controladores
   - Conectar con base de datos

4. **Vistas:**
   - Implementar interfaz de login
   - Diseñar pantalla de inicio
   - Crear listados en Recursos y Alertas
   - Implementar perfil de usuario

5. **API:**
   - Implementar funciones de llamadas HTTP en `utils/api.js`
   - Conectar con backend si es necesario
   - Manejar errores y respuestas

## 🚀 Dependencias Instaladas

```bash
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
@expo/vector-icons
react-native-screens
react-native-safe-area-context
```
