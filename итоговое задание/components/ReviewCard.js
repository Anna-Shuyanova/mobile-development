// components/ReviewCard.js (дополненный)
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import StarRating from './StarRating';

const ReviewCard = ({ review, currentUserId, onEdit, onDelete, onAction, navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);
  
  const isOwnReview = review.userId === currentUserId;
  const shouldTruncate = review.comment.length > 150;

  const handleHelpfulClick = () => {
    if (!helpfulClicked) {
      setHelpfulClicked(true);
      onAction?.(review.id, 'helpful');
    }
  };

  const handleEdit = () => {
    navigation.navigate('AddEditReview', {
      doctorId: review.doctorId,
      review: review,
      mode: 'edit'
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление отзыва',
      'Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.',
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => onDelete(review.id)
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      {/* Заголовок отзыва */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {review.userName}
            {review.isVerified && ' ✅'}
          </Text>
          <Text style={styles.date}>
            {formatDate(review.date)}
            {review.visitDate && ` • Посещение: ${formatDate(review.visitDate)}`}
          </Text>
        </View>
        <StarRating rating={review.rating} size={16} />
      </View>

      {/* Текст отзыва */}
      <TouchableOpacity 
        onPress={() => setIsExpanded(!isExpanded)} 
        disabled={!shouldTruncate}
      >
        <Text style={styles.comment} numberOfLines={isExpanded ? undefined : 3}>
          {review.comment}
        </Text>
        {shouldTruncate && (
          <Text style={styles.readMore}>
            {isExpanded ? 'Свернуть' : 'Читать далее...'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Действия с отзывом */}
      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleHelpfulClick}
            disabled={helpfulClicked}
          >
            <Text style={[
              styles.actionText,
              helpfulClicked && styles.actionTextActive
            ]}>
              👍 Полезно ({review.helpful || 0})
            </Text>
          </TouchableOpacity>
          
          <View style={styles.reactions}>
            <Text style={styles.reactionText}>👍 {review.likes}</Text>
            <Text style={styles.reactionText}>👎 {review.dislikes}</Text>
          </View>
        </View>

        {isOwnReview && (
          <View style={styles.ownActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.ownActionButton}>
              <Text style={styles.ownActionText}>✏️ Редактировать</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.ownActionButton}>
              <Text style={styles.ownActionText}>🗑️ Удалить</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... существующие стили (такие же как в предыдущем примере) ...
  ownActionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

export default ReviewCard;