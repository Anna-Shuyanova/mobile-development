import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterButtons = ({ specialties, selectedSpecialty, onSpecialtyChange }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {specialties.map((specialty) => (
        <TouchableOpacity
          key={specialty}
          style={[
            styles.filterButton,
            selectedSpecialty === specialty && styles.filterButtonActive
          ]}
          onPress={() => onSpecialtyChange(specialty)}
        >
          <Text style={[
            styles.filterButtonText,
            selectedSpecialty === specialty && styles.filterButtonTextActive
          ]}>
            {specialty}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default FilterButtons;