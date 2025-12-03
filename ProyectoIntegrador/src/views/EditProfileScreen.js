import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../navigation/RootNavigator';

const EditProfileScreen = () => {
  const { currentUser, updateUserProfile, deleteAccount } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    career: '',
    phone: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        career: currentUser.career || 'Carrera no especificada',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (formData.name.trim() === '') {
      Alert.alert('Error', 'El nombre es obligatorio.');
      return;
    }

    setLoading(true);

    try {
      const result = await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
      });

      if (result.success) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        setIsEditing(false);
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        career: currentUser.career || '',
        phone: currentUser.phone || '',
      });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Eliminar Cuenta',
      'Esta acción es permanente y borrará todos tus datos de la base de datos local. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Definitivamente',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await deleteAccount();
              if (!result.success) {
                Alert.alert('Error', result.message || 'No se pudo eliminar la cuenta');
                setLoading(false);
              }
            } catch (error) {
              setLoading(false);
              Alert.alert('Error', 'Falló la eliminación de la cuenta');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            editable={isEditing}
            placeholder="Nombre completo"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={formData.email}
            editable={false} 
            placeholder="Correo electrónico"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Carrera</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={formData.career}
            editable={false}
            placeholder="Carrera"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            editable={isEditing}
            keyboardType="phone-pad"
            placeholder="Teléfono"
          />
        </View>

        {!isEditing ? (
          <View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar Información</Text>
            </TouchableOpacity>

            {/* --- 4. BOTÓN DE ELIMINAR CUENTA --- */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.deleteButtonText}>Eliminar mi cuenta</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputDisabled: {
    backgroundColor: '#F8F8F8',
    color: '#8E8E93',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EditProfileScreen;