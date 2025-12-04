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
  const { currentUser, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    career: '',
    phone: '',
    recovery_email: '',
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
        recovery_email: currentUser.recovery_email || '',
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
    // Validar formulario antes de enviar
    const { validateProfileForm, formatErrorMessage } = require('../utils/helpers');

    const validation = validateProfileForm({
      phone: formData.phone,
      recovery_email: formData.recovery_email
    });

    if (!validation.isValid) {
      Alert.alert('Errores de validación', formatErrorMessage(validation.errors));
      return;
    }

    setLoading(true);

    try {
      const result = await updateUserProfile({
        phone: formData.phone.trim(),
        recovery_email: formData.recovery_email.trim(),
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
        recovery_email: currentUser.recovery_email || '',
      });
    }
  };



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={formData.name}
            editable={false}
            placeholder="Nombre completo"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo Institucional</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={formData.email}
            editable={false}
            placeholder="Correo institucional"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo de Recuperación</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={formData.recovery_email}
            onChangeText={(value) => handleInputChange('recovery_email', value)}
            editable={isEditing}
            keyboardType="email-address"
            placeholder="correo.personal@ejemplo.com"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isEditing && (
            <Text style={styles.fieldHint}>
              Correo personal para recuperar tu contraseña (opcional)
            </Text>
          )}
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
            placeholder="+57 300 123 4567"
          />
          {isEditing && (
            <Text style={styles.fieldHint}>
              Formato: +57 XXX XXX XXXX (opcional)
            </Text>
          )}
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
  fieldHint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default EditProfileScreen;