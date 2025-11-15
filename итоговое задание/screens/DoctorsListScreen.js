import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';
import SortButtons from '../components/SortButtons';
import DoctorCard from '../components/DoctorCard';
import { simpleDoctorsData, simpleSpecialties } from '../utils/simpleData';

const DoctorsListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Все');
  const [sortBy, setSortBy] = useState('rating');

  const handleDoctorPress = (doctor) => {
    if (navigation && doctor && doctor.id) {
      navigation.navigate('DoctorDetail', {
        doctorId: doctor.id,
        doctor: doctor
      });
    } else {
      alert(`Переход к врачу: ${doctor.name}`);
    }
  };

  // ПРОВЕРКА ДАННЫХ
  if (!simpleDoctorsData || !Array.isArray(simpleDoctorsData)) {
    return (
      <View style={styles.container}>
        <Text>Ошибка: Данные не загружены</Text>
      </View>
    );
  }

  // ФИЛЬТРАЦИЯ И СОРТИРОВКА
  const filteredDoctors = simpleDoctorsData
    .filter(doctor => {
      if (!doctor || !doctor.name || !doctor.specialty) return false;

      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.description && doctor.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpecialty = selectedSpecialty === 'Все' || doctor.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>🏥 Наши врачи</Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.profileButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Выберите специалиста для консультации</Text>
        </View>

        {/* ПОИСК */}
        <View style={styles.section}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="🔍 Поиск врача, специальности или симптомов..."
          />
        </View>

        {/* ФИЛЬТРЫ И СОРТИРОВКА */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Специальности</Text>
          <FilterButtons
            specialties={simpleSpecialties}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
          />

          <Text style={styles.sectionTitle}>Сортировка</Text>
          <SortButtons
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </View>

        {/* СПИСОК ВРАЧЕЙ */}
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>
              Найдено врачей: {filteredDoctors.length}
            </Text>
            {(searchQuery || selectedSpecialty !== 'Все') && (
              <TouchableOpacity
                style={styles.clearFilters}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('Все');
                }}
              >
                <Text style={styles.clearFiltersText}>Очистить фильтры</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onPress={() => handleDoctorPress(doctor)}
                navigation={navigation}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>😔 Врачи не найдены</Text>
              <Text style={styles.emptyStateSubtext}>
                Попробуйте изменить параметры поиска или выбрать другую специальность
              </Text>
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('Все');
                }}
              >
                <Text style={styles.resetFiltersButtonText}>Сбросить фильтры</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Отступ внизу для лучшего скролла */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 1,
  },
  profileButton: {
    padding: 8,
  },
  profileButtonText: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearFilters: {
    padding: 8,
  },
  clearFiltersText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  resetFiltersButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default DoctorsListScreen;