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
                            minWidth: 64,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: focused ? '#007AFF' : 'transparent',
                            paddingHorizontal: focused ? 16 : 8,
                            transform: [{ scale: focused ? 1.05 : 1 }],
                        }}>
                            <Ionicons
                                name={iconName}
                                size={iconSize}
                                color={focused ? '#FFFFFF' : color}
                                style={{
                                    opacity: focused ? 1 : 0.8,
                                }}
                            />
                        </View>
                    );
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 15,
                    left: 8,
                    right: 8,
                    height: 68,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 35,
                    shadowColor: '#000000',
                    shadowOffset: {
                        width: 0,
                        height: 12,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 25,
                    elevation: 15,
                    borderTopWidth: 0,
                    paddingBottom: 10,
                    paddingTop: 10,
                    paddingHorizontal: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                    textAlign: 'center',
                },
                tabBarItemStyle: {
                    paddingVertical: 6,
                    borderRadius: 18,
                    marginHorizontal: 1,
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
