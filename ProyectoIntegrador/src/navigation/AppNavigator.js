import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../views/HomeScreen';
import ResourcesScreen from '../views/ResourcesScreen';
import AlertsScreen from '../views/AlertsScreen';
import StudentDetailsScreen from '../views/StudentDetailsScreen';
import ProfileScreen from '../views/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de Tab (Inicio, Recursos, Alertas, Perfil)
const HomeTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Recursos') {
                        iconName = focused ? 'book' : 'book-outline';
                    } else if (route.name === 'Alertas') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    paddingVertical: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            })}
        >
            <Tab.Screen
                name="Inicio"
                component={HomeScreen}
                options={{
                    title: 'Inicio',
                }}
            />
            <Tab.Screen
                name="Recursos"
                component={ResourcesScreen}
                options={{
                    title: 'Recursos',
                }}
            />
            <Tab.Screen
                name="Alertas"
                component={AlertsScreen}
                options={{
                    title: 'Alertas',
                    tabBarBadge: 2,
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{
                    title: 'Perfil',
                }}
            />
        </Tab.Navigator>
    );
};

// Navegador de la Aplicación (después de login)
const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={HomeTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="StudentDetails"
                component={StudentDetailsScreen}
                options={{
                    title: 'Detalles del Estudiante',
                }}
            />
            {/* TODO: Agregar más pantallas según sea necesario */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
