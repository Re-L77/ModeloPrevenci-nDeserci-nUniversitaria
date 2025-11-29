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
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const [resourcesData] = useState([
    {
      id: '1',
      type: 'Material de Estudio',
      title: 'Guía de Estudio: Normalización de BD',
      subject: 'Base de Datos II',
      date: '19 nov 2025',
      fileSize: '2.5 MB',
      tags: ['PDF', 'Material de Estudio'],
      icon: 'book-outline',
      iconBg: '#F3E8FF',
      iconColor: '#C084FC',
      tagColors: [
        { bg: '#FEE2E2', text: '#F87171' },
        { bg: '#DBEAFE', text: '#60A5FA' },
      ],
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
      tagColors: [
        { bg: '#DBEAFE', text: '#3B82F6' },
        { bg: '#DBEAFE', text: '#3B82F6' },
      ],
    },
    {
      id: '3',
      type: 'Material de Estudio',
      title: 'Ejercicios Resueltos: Teoría de Grafos',
      subject: 'Matemáticas',
      date: '15 nov 2025',
      fileSize: '1.8 MB',
      tags: ['PDF', 'Material de Estudio'],
      icon: 'book-outline',
      iconBg: '#F3E8FF',
      iconColor: '#C084FC',
      tagColors: [
        { bg: '#FEE2E2', text: '#F87171' },
        { bg: '#DBEAFE', text: '#60A5FA' },
      ],
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
      tagColors: [
        { bg: '#DBEAFE', text: '#3B82F6' },
        { bg: '#DBEAFE', text: '#3B82F6' },
      ],
    },
    {
      id: '5',
      type: 'Material de Estudio',
      title: 'Resumen: Patrones de Diseño',
      subject: 'Ingeniería de Software',
      date: '10 nov 2025',
      fileSize: '3.2 MB',
      tags: ['PDF', 'Material de Estudio'],
      icon: 'book-outline',
      iconBg: '#F3E8FF',
      iconColor: '#C084FC',
      tagColors: [
        { bg: '#FEE2E2', text: '#F87171' },
        { bg: '#DBEAFE', text: '#60A5FA' },
      ],
    },
  ]);

  // Mapeo de categorías cortas a tipos completos
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
          <Icon name={item.icon} size={24} color={item.iconColor} />
        </View>

        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>
            {item.subject} • {item.date}
          </Text>

          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  { backgroundColor: item.tagColors[index]?.bg || '#F3F4F6' },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: item.tagColors[index]?.text || '#4B5563' },
                  ]}
                >
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
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Buenas noches, María!</Text>
            <Text style={styles.subtitle}>
              Material de estudio, tutorías y más
            </Text>
          </View>
          <View style={styles.notificationIconContainer}>
            <Icon name="notifications-outline" size={24} color="#FBBF24" />
            <View style={styles.notificationBadge} />
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedFilter === category && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(category)}
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
        </ScrollView>

        <FlatList
          data={filterResources()}
          renderItem={renderResourceCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 32,
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
    marginTop: 16,
    marginBottom: 24,
    height: 100,
  },
  filtersContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    marginRight: 14,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navIconContainer: {
    position: 'relative',
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  navTextActive: {
    color: '#3B82F6',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 16,
    height: 16,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default ResourcesScreen;