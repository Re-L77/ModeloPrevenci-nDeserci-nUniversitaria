import React from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/RootNavigator';

const ProfileScreen = ({ navigation }) => {
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('ProfileScreen: Error cerrando sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar la sesión correctamente');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(currentUser?.name)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.userName}>{currentUser?.name || 'Cargando usuario...'}</Text>
        
        <Text style={styles.userCareer}>
          {currentUser?.student?.career ||
            (currentUser?.role === 'admin' ? 'Administrador' :
             currentUser?.role === 'teacher' ? 'Profesor' : 'Estudiante')}
        </Text>

        <Text style={[
          styles.userStatus,
          currentUser?.student?.risk_level === 'critical' ? styles.riskCritical :
          currentUser?.student?.risk_level === 'high' ? styles.riskHigh :
          currentUser?.student?.risk_level === 'medium' ? styles.riskMedium :
          styles.riskLow
        ]}>
          {currentUser?.student?.risk_level === 'low' ? '✅ Bajo Riesgo' :
           currentUser?.student?.risk_level === 'medium' ? '⚠️ Riesgo Medio' :
           currentUser?.student?.risk_level === 'high' ? '🔴 Alto Riesgo' :
           currentUser?.student?.risk_level === 'critical' ? '🚨 Riesgo Crítico' :
           '✅ Estado Normal'}
        </Text>
      </View>

      {currentUser?.student && (
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{currentUser.student.gpa || '0.0'}</Text>
            <Text style={styles.statLabel}>Promedio General</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{currentUser.student.semester || '1'}</Text>
            <Text style={styles.statLabel}>Semestre Actual</Text>
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Correo Electrónico</Text>
          <Text style={styles.infoValue}>{currentUser?.email || 'No disponible'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoValue}>{currentUser?.phone || 'Sin registrar'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de Usuario</Text>
          <Text style={styles.infoValue}>
            {currentUser?.role === 'student' ? 'Estudiante' :
             currentUser?.role === 'admin' ? 'Administrador' :
             currentUser?.role === 'teacher' ? 'Profesor' : 'Usuario'}
          </Text>
        </View>

        {currentUser?.student && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Carrera</Text>
              <Text style={styles.infoValue}>{currentUser.student.career}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Semestre</Text>
              <Text style={styles.infoValue}>{currentUser.student.semester}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Código Estudiantil</Text>
              <Text style={styles.infoValue}>{currentUser.student.student_code}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.configSection}>
        <Text style={styles.sectionTitle}>Configuración</Text>

        <TouchableOpacity style={styles.configButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={20} color="#FF9500" />
          <Text style={styles.configButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.configButton} onPress={handleChangePassword}>
          <Ionicons name="lock-closed" size={20} color="#FF9500" />
          <Text style={styles.configButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginHorizontal: 0,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  userCareer: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    textAlign: 'center',
  },
  userStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  riskLow: { color: '#34C759' },
  riskMedium: { color: '#FF9500' },
  riskHigh: { color: '#FF5722' },
  riskCritical: { color: '#FF3B30' },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    marginBottom: 15,
    gap: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    marginBottom: 15,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 0, // Quitamos padding horizontal del contenedor para que los bordes lleguen al final
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  configSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  infoRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  infoLabel: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  configButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    gap: 12,
  },
  configButtonText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    marginHorizontal: 0,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    marginHorizontal: 0,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 5,
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default ProfileScreen;