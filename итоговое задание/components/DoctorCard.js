// components/DoctorCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const DoctorCard = ({ doctor, onPress, navigation }) => {
  return (
    <View style={styles.doctorCard}>
      {/* Основная информация - кликабельная */}
      <TouchableOpacity onPress={onPress} style={styles.mainInfo}>
        <View style={styles.doctorHeader}>
          {/* Фото врача */}
          <View style={styles.photoContainer}>
            {doctor.photoUrl ? (
              <Image 
                source={{ uri: doctor.photoUrl }} 
                style={styles.doctorPhoto}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>
                  {doctor.name ? doctor.name.charAt(0).toUpperCase() : 'Д'}
                </Text>
              </View>
            )}
          </View>

          {/* Информация о враче */}
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <Text style={styles.doctorExperience}>
              🏥 Опыт работы: {doctor.experience} {getExperienceText(doctor.experience)}
            </Text>
            
            {/* Рейтинг и отзывы */}
            <View style={styles.ratingContainer}>
              <View style={styles.ratingStars}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.ratingValue}>{doctor.rating}</Text>
              </View>
              <Text style={styles.reviewsCount}>
                {doctor.reviewsCount} {getReviewsText(doctor.reviewsCount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Краткая информация */}
        {doctor.description && (
          <Text style={styles.doctorDescription} numberOfLines={2}>
            {doctor.description}
          </Text>
        )}

        {/* Дополнительная информация */}
        <View style={styles.doctorFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Консультация от</Text>
            <Text style={styles.price}>{doctor.price} ₽</Text>
          </View>
          
          <View style={styles.availabilityContainer}>
            <Text style={styles.availability}>
              📅 {doctor.nextAvailable || 'Сегодня'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Кнопка отзывов */}
      <TouchableOpacity 
        style={styles.reviewsButton}
        onPress={() => navigation.navigate('Reviews', { 
          doctorId: doctor.id, 
          doctorName: doctor.name,
          currentUserId: 'user1'
        })}
      >
        <Text style={styles.reviewsButtonText}>
          📝 Посмотреть все отзывы ({doctor.reviewsCount || 0})
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Вспомогательные функции для правильного склонения
const getExperienceText = (years) => {
  if (years === 1) return 'год';
  if (years >= 2 && years <= 4) return 'года';
  return 'лет';
};

const getReviewsText = (count) => {
  if (count === 1) return 'отзыв';
  if (count >= 2 && count <= 4) return 'отзыва';
  return 'отзывов';
};

const styles = StyleSheet.create({
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  mainInfo: {
    padding: 16,
  },
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photoContainer: {
    marginRight: 12,
  },
  doctorPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  photoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 6,
  },
  doctorExperience: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666666',
  },
  doctorDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  doctorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  availabilityContainer: {
    alignItems: 'flex-end',
  },
  availability: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  reviewsButton: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    alignItems: 'center',
  },
  reviewsButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DoctorCard;