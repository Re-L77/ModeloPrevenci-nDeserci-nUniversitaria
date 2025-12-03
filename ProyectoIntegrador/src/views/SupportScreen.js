import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Vista de Ayuda y Soporte
const SupportScreen = () => {
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [message, setMessage] = useState('');

    const faqs = [
        {
            id: 1,
            question: '¿Cómo reporto un problema académico?',
            answer:
                'Puedes reportar problemas académicos en la sección de Alertas o contactando directamente con tu consejero académico.',
        },
        {
            id: 2,
            question: '¿Cómo cambio mi foto de perfil?',
            answer:
                'Ve a Editar Perfil en la configuración y selecciona tu nueva foto. El cambio se guardará automáticamente.',
        },
        {
            id: 3,
            question: '¿Qué puedo hacer si olvido mi contraseña?',
            answer:
                'Puedes usar la opción de recuperar contraseña en la pantalla de login. Recibirás un correo con instrucciones.',
        },
        {
            id: 4,
            question: '¿Cómo accedo a mis recursos académicos?',
            answer:
                'Todos tus recursos están disponibles en la pestaña Recursos. Puedes descargar materiales, tutoriales y más.',
        },
    ];

    const handleSendMessage = () => {
        const { validateSupportMessage, formatErrorMessage } = require('../utils/helpers');

        const validation = validateSupportMessage(message);
        if (!validation.isValid) {
            Alert.alert('Error en el mensaje', formatErrorMessage(validation.errors));
            return;
        }

        // TODO: Enviar mensaje de soporte
        Alert.alert('Éxito', 'Tu mensaje ha sido enviado. Te responderemos pronto.');
        setMessage('');
    };

    const handleContactEmail = () => {
        Linking.openURL('mailto:soporte@universidad.edu');
    };

    const handleContactPhone = () => {
        Linking.openURL('tel:+34600000000');
    };

    const FAQItem = ({ item }) => {
        const isExpanded = expandedFAQ === item.id;

        return (
            <TouchableOpacity
                style={styles.faqItem}
                onPress={() => setExpandedFAQ(isExpanded ? null : item.id)}
            >
                <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#007AFF"
                    />
                </View>
                {isExpanded && <Text style={styles.faqAnswer}>{item.answer}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Sección de Contacto Rápido */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contacto Rápido</Text>

                <View style={styles.contactCardsContainer}>
                    <TouchableOpacity style={styles.contactCard} onPress={handleContactEmail}>
                        <Ionicons name="mail" size={24} color="#007AFF" />
                        <Text style={styles.contactCardTitle}>Email</Text>
                        <Text style={styles.contactCardText}>soporte@universidad.edu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactCard} onPress={handleContactPhone}>
                        <Ionicons name="call" size={24} color="#34C759" />
                        <Text style={styles.contactCardTitle}>Teléfono</Text>
                        <Text style={styles.contactCardText}>+34 600 00 00 00</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sección de Mensajes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Enviar Mensaje</Text>

                <View style={styles.messageForm}>
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Describe tu problema o pregunta..."
                        placeholderTextColor="#8E8E93"
                        multiline
                        numberOfLines={5}
                        value={message}
                        onChangeText={setMessage}
                    />

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                    >
                        <Ionicons name="send" size={18} color="#FFFFFF" />
                        <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sección de Preguntas Frecuentes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>

                <View style={styles.faqContainer}>
                    {faqs.map((faq) => (
                        <FAQItem key={faq.id} item={faq} />
                    ))}
                </View>
            </View>

            {/* Sección de Información */}
            <View style={styles.section}>
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={24} color="#007AFF" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Centro de Ayuda</Text>
                        <Text style={styles.infoText}>
                            Estamos disponibles de lunes a viernes de 8:00 AM a 6:00 PM
                        </Text>
                    </View>
                </View>
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
        marginBottom: 15,
    },
    contactCardsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    contactCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    contactCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginTop: 8,
        marginBottom: 4,
    },
    contactCardText: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
    messageForm: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    messageInput: {
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#000000',
        marginBottom: 12,
        textAlignVertical: 'top',
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    sendButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    faqContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    faqAnswer: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 10,
        lineHeight: 18,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#8E8E93',
        lineHeight: 18,
    },
});

export default SupportScreen;
