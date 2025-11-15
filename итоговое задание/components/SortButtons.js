import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SortButtons = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { key: 'rating', label: 'По рейтингу' },
    { key: 'name', label: 'По имени' },
    { key: 'experience', label: 'По опыту' },
    { key: 'price', label: 'По цене' },
  ];

  return (
    <View style={styles.container}>
      {sortOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.sortButton,
            sortBy === option.key && styles.sortButtonActive
          ]}
          onPress={() => onSortChange(option.key)}
        >
          <Text style={[
            styles.sortButtonText,
            sortBy === option.key && styles.sortButtonTextActive
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default SortButtons;