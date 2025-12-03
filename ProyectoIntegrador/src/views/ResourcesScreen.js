import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    FlatList,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ResourcesScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState('Videos');

    const [resourcesData] = useState([
        {
            id: '1',
            type: 'Material de Estudio',
            title: 'Guía de Estudio: Normalización de BD',
            subject: 'Base de Datos II',
            date: '19 nov 2025',
            fileSize: '2.5 MB',
            tags: ['PDF', 'Material de Estudio'],
            icon: 'document-outline',
            iconBg: '#FEE2E2',
            iconColor: '#F87171',
        },
        {
            id: '2',
            type: 'Video Tutorial',
            title: 'Tutorial: React Hooks Avanzados',
            subject: 'Desarrollo Web',
            date: '17 nov 2025',
            fileSize: '145 MB',
            tags: ['Video', 'Video Tutorial'],
            icon: 'videocam-outline',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
        },
        {
            id: '3',
            type: 'Material de Estudio',
            title: 'Ejercicios Resueltos: Teoría de Grafos',
            subject: 'Matemáticas',
            date: '15 nov 2025',
            fileSize: '1.8 MB',
            tags: ['PDF', 'Material de Estudio'],
            icon: 'document-outline',
            iconBg: '#FEE2E2',
            iconColor: '#F87171',
        },
        {
            id: '4',
            type: 'Video Tutorial',
            title: 'Introducción a Machine Learning',
            subject: 'Inteligencia Artificial',
            date: '12 nov 2025',
            fileSize: '230 MB',
            tags: ['Video', 'Video Tutorial'],
            icon: 'videocam-outline',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
        },
        {
            id: '5',
            type: 'Material de Estudio',
            title: 'Resumen: Patrones de Diseño',
            subject: 'Ingeniería de Software',
            date: '10 nov 2025',
            fileSize: '3.2 MB',
            tags: ['PDF', 'Material de Estudio'],
            icon: 'document-outline',
            iconBg: '#FEE2E2',
            iconColor: '#F87171',
        },
    ]);

    const categoryMap = {
        'Todos': null,
        'Materiales': 'Material de Estudio',
        'Videos': 'Video Tutorial'
    };

    const filterResources = () => {
        const actualFilter = categoryMap[selectedFilter];
        if (actualFilter === null) {
            return resourcesData;
        }
        return resourcesData.filter((resource) => resource.type === actualFilter);
    };

    const renderResourceCard = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                    <Icon name={item.icon} size={28} color={item.iconColor} />
                </View>

                <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>
                        {item.subject} • {item.date}
                    </Text>

                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tag,
                                    index === 0 ? styles.tagPrimary : styles.tagSecondary,
                                ]}
                            >
                                <Text style={[styles.tagText, index === 0 ? styles.tagTextPrimary : styles.tagTextSecondary]}>
                                    {tag}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.cardFooter}>
                        <Text style={styles.fileSize}>{item.fileSize}</Text>
                        <TouchableOpacity style={styles.downloadButton}>
                            <Icon name="download-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.downloadButtonText}>Descargar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const categories = ['Todos', 'Materiales', 'Videos'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Buenas noches, María!</Text>
                    <Text style={styles.subtitle}>
                        Material de estudio, tutorías y más
                    </Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Icon
                    name="search-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar recursos..."
                    placeholderTextColor="#9CA3AF"
                />
            </View>

            <View style={styles.filtersContainer}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.filterButton,
                            selectedFilter === category && styles.filterButtonActive,
                        ]}
                        onPress={() => setSelectedFilter(category)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                selectedFilter === category && styles.filterButtonTextActive,
                            ]}
                        >
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filterResources()}
                renderItem={renderResourceCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    notificationIconContainer: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        backgroundColor: '#EF4444',
        borderRadius: 6,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1F2937',
    },
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        height: 44,
        paddingHorizontal: 20,
    },
    filterButton: {
        width: 100,
        height: 44,
        backgroundColor: '#F3F4F6',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        marginHorizontal: 6,
    },
    filterButtonActive: {
        backgroundColor: '#3B82F6',
    },
    filterButtonText: {
        fontSize: 15,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardContent: {
        flexDirection: 'row',
        gap: 12,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagPrimary: {
        backgroundColor: '#DBEAFE',
    },
    tagSecondary: {
        backgroundColor: '#F3F4F6',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '500',
    },
    tagTextPrimary: {
        color: '#3B82F6',
    },
    tagTextSecondary: {
        color: '#6B7280',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fileSize: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    downloadButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});

export default ResourcesScreen;