import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../views/HomeScreen';
import ResourcesScreen from '../views/ResourcesScreen';
import AlertsScreen from '../views/AlertsScreen';
import StudentDetailsScreen from '../views/StudentDetailsScreen';
import ProfileScreen from '../views/ProfileScreen';
import EditProfileScreen from '../views/EditProfileScreen';
import ChangePasswordScreen from '../views/ChangePasswordScreen';
import useAlertsBadge from '../hooks/useAlertsBadge';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator para el tab de Perfil (con navegación interna)
const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                    title: 'Editar Perfil',
                }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{
                    title: 'Cambiar Contraseña',
                }}
            />
        </Stack.Navigator>
    );
};

// Navegador de Tab (Inicio, Recursos, Alertas, Perfil)
const HomeTabNavigator = () => {
    const { alertsCount } = useAlertsBadge();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let iconSize = focused ? 28 : 24;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Recursos') {
                        iconName = focused ? 'library' : 'library-outline';
                    } else if (route.name === 'Notificaciones') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }

                    return (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: focused ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                            transform: [{ scale: focused ? 1.02 : 1 }],
                        }}>
                            <Ionicons
                                name={iconName}
                                size={iconSize}
                                color={color}
                                style={{
                                    opacity: focused ? 1 : 0.8,
                                }}
                            />
                        </View>
                    );
                },
                tabBarActiveTintColor: '#6366F1',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 12,
                    right: 12,
                    height: 70,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 25,
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 8,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,
                    elevation: 10,
                    borderTopWidth: 0,
                    paddingBottom: 8,
                    paddingTop: 8,
                    paddingHorizontal: 12,
                    // Subtle border for definition
                    borderWidth: 0.5,
                    borderColor: '#E2E8F0',
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginTop: 4,
                    letterSpacing: 0.3,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                    borderRadius: 18,
                    marginHorizontal: 2,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarBadgeStyle: {
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: 10,
                    fontWeight: '700',
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    marginTop: -2,
                    marginLeft: 8,
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
                name="Notificaciones"
                component={AlertsScreen}
                options={{
                    title: 'Notificaciones',
                    tabBarBadge: alertsCount > 0 ? alertsCount : null,
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileStackNavigator}
                options={{
                    title: 'Perfil',
                    headerShown: false,
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
        </Stack.Navigator>
    );
};

export default AppNavigator;
