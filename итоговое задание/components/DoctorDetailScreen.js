import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { simpleDoctorsData, doctorReviews } from '../utils/simpleData';

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const doctor = simpleDoctorsData.find(d => d.id === doctorId);
  const reviews = doctorReviews[doctorId] || [];

  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text>Врач не найден</Text>
      </View>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleBookAppointment = () => {
    Alert.alert(
      'Запись на прием',
      `Запись к ${doctor.name}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Записаться', 
          onPress: () => Alert.alert('Успех', 'Вы записаны на прием!')
        }
      ]
    );
  };

  const handleAddReview = () => {
    Alert.alert(
      'Оставить отзыв',
      'Функция добавления отзыва будет доступна в следующем обновлении',
      [{ text: 'Понятно' }]
    );
  };

  const ReviewItem = ({ review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
        <Text style={styles.reviewRating}>⭐ {review.rating}/5</Text>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Шапка с кнопкой назад */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Карточка врача</Text>
      </View>

      {/* Основная информация о враче */}
      <View style={styles.section}>
        <View style={styles.doctorHeader}>
          <Text style={styles.doctorPhoto}>{doctor.photo}</Text>
          <View style={styles.doctorMainInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {doctor.rating}</Text>
              <Text style={styles.reviewsCount}>({reviews.length} отзывов)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.doctorDescription}>{doctor.description}</Text>
      </View>

      {/* Детальная информация */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Подробная информация</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>🎓 Опыт работы:</Text>
          <Text style={styles.detailValue}>{doctor.experience} лет</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>💰 Стоимость приема:</Text>
          <Text style={styles.detailValue}>{doctor.price} ₽</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅 Ближайшая запись:</Text>
          <Text style={styles.detailValue}>{doctor.nextAvailable}</Text>
        </View>
        
        {doctor.education && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🎓 Образование:</Text>
            <Text style={styles.detailValue}>{doctor.education}</Text>
          </View>
        )}
        
        {doctor.address && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Адрес:</Text>
            <Text style={styles.detailValue}>{doctor.address}</Text>
          </View>
        )}
      </View>

      {/* Услуги */}
      {doctor.services && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🩺 Услуги</Text>
          <View style={styles.servicesContainer}>
            {doctor.services.map((service, index) => (
              <View key={index} style={styles.serviceItem}>
                <Text style={styles.serviceText}>• {service}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* График работы */}
      {doctor.workingHours && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 График работы</Text>
          {Object.entries(doctor.workingHours).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{day}:</Text>
              <Text style={styles.hoursTime}>{hours}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Кнопки действий */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleBookAppointment}>
          <Text style={styles.primaryButtonText}>📅 Записаться на прием</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleAddReview}>
          <Text style={styles.secondaryButtonText}>✍️ Оставить отзыв</Text>
        </TouchableOpacity>
      </View>

      {/* Отзывы */}
      <View style={styles.section}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>💬 Отзывы пациентов</Text>
          <Text style={styles.reviewsCount}>({reviews.length})</Text>
        </View>

        {reviews.length > 0 ? (
          <>
            {displayedReviews.map((review, index) => (
              <ReviewItem key={index} review={review} />
            ))}
            
            {reviews.length > 3 && (
              <TouchableOpacity 
                style={styles.showMoreButton}
                onPress={() => setShowAllReviews(!showAllReviews)}
              >
                <Text style={styles.showMoreText}>
                  {showAllReviews ? 'Скрыть' : `Показать все ${reviews.length} отзывов`}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.noReviews}>
            <Text style={styles.noReviewsText}>😔 Пока нет отзывов</Text>
            <Text style={styles.noReviewsSubtext}>
              Будьте первым, кто оставит отзыв об этом враче
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  doctorPhoto: {
    fontSize: 60,
    marginRight: 16,
  },
  doctorMainInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginRight: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666666',
  },
  doctorDescription: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'right',
  },
  servicesContainer: {
    marginTop: 8,
  },
  serviceItem: {
    paddingVertical: 8,
  },
  serviceText: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hoursDay: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: 16,
    color: '#666666',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
  },
  reviewRating: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  showMoreButton: {
    padding: 16,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default DoctorDetailScreen;