import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ReviewItem = ({ 
  review, 
  onPress, 
  onEdit,
  onDelete,
  showActions = false 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.doctorName}>{review.doctorName}</Text>
          <Text style={styles.doctorSpecialty}>{review.doctorSpecialty}</Text>
        </View>
        {review.isEdited && (
          <Text style={styles.editedBadge}>ред.</Text>
        )}
      </View>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.stars}>{renderStars(review.rating)}</Text>
        <Text style={styles.date}>{formatDate(review.date)}</Text>
      </View>
      
      <Text style={styles.comment} numberOfLines={3}>
        {review.comment}
      </Text>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Text style={styles.actionText}>✏️ Редактировать</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={onDelete}
          >
            <Text style={[styles.actionText, styles.deleteText]}>🗑️ Удалить</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  editedBadge: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  comment: {
    fontSize: 14,
    lineHeight: 18,
    color: '#555555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
  },
  deleteButton: {
    marginLeft: 12,
  },
  deleteText: {
    color: '#FF3B30',
  },
});

export default ReviewItem;