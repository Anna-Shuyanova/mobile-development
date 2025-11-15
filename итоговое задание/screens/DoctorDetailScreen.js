import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { simpleDoctorsData } from '../utils/simpleData';
import { sampleReviews, calculateDoctorRating } from '../utils/reviewData';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    visitDate: '',
  });

  useEffect(() => {
    // Находим врача по ID
    const foundDoctor = simpleDoctorsData.find(d => d.id === doctorId);
    setDoctor(foundDoctor);

    // Загружаем отзывы для этого врача
    const doctorReviews = sampleReviews.filter(review => review.doctorId === doctorId);
    setReviews(doctorReviews);
  }, [doctorId]);

  const handleAddReview = () => {
    setReviewModalVisible(true);
  };

  const handleSubmitReview = () => {
    if (newReview.comment.trim().length < 10) {
      Alert.alert('Ошибка', 'Отзыв должен содержать не менее 10 символов');
      return;
    }

    // Создаем новый отзыв
    const review = {
      id: Date.now().toString(),
      doctorId: doctorId,
      userId: 'currentUser',
      userName: 'Текущий пользователь',
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: new Date().toISOString().split('T')[0],
      visitDate: newReview.visitDate || null,
      likes: 0,
      dislikes: 0,
      isVerified: false,
    };

    // Добавляем отзыв в список
    setReviews(prev => [review, ...prev]);
    setReviewModalVisible(false);
    setNewReview({ rating: 5, comment: '', visitDate: '' });

    Alert.alert('Успех', 'Ваш отзыв добавлен!');
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Врач не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Шапка с основной информацией */}
        <View style={styles.header}>
          <View style={styles.doctorMainInfo}>
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

            <View style={styles.basicInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <View style={styles.ratingContainer}>
                <StarRating rating={doctor.rating} size={20} />
                <Text style={styles.ratingText}>
                  {doctor.rating} ({reviews.length} отзывов)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{doctor.experience}</Text>
              <Text style={styles.statLabel}>лет опыта</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reviews.length}</Text>
              <Text style={styles.statLabel}>отзывов</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{doctor.price} ₽</Text>
              <Text style={styles.statLabel}>консультация</Text>
            </View>
          </View>
        </View>

        {/* Подробная информация о враче */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О враче</Text>
          <Text style={styles.doctorDescription}>{doctor.description}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>🎓 Образование</Text>
              <Text style={styles.detailValue}>Высшее медицинское образование</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>🏥 Место работы</Text>
              <Text style={styles.detailValue}>Городская больница №1</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>⭐ Категория</Text>
              <Text style={styles.detailValue}>Высшая категория</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>📅 График работы</Text>
              <Text style={styles.detailValue}>Пн-Пт: 9:00-18:00</Text>
            </View>
          </View>
        </View>

        {/* Услуги и цены */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Услуги и цены</Text>
          <View style={styles.servicesList}>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Первичная консультация</Text>
              <Text style={styles.servicePrice}>{doctor.price} ₽</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Повторная консультация</Text>
              <Text style={styles.servicePrice}>1500 ₽</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Расширенная диагностика</Text>
              <Text style={styles.servicePrice}>3500 ₽</Text>
            </View>
          </View>
        </View>

        {/* Отзывы */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>
              Отзывы ({reviews.length})
            </Text>
            <TouchableOpacity onPress={handleAddReview}>
              <Text style={styles.addReviewButton}>✏️ Оставить отзыв</Text>
            </TouchableOpacity>
          </View>

          {displayedReviews.length > 0 ? (
            <>
              {displayedReviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId="currentUser"
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
              
              {reviews.length > 3 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllReviews(!showAllReviews)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllReviews ? 'Свернуть' : `Показать все ${reviews.length} отзывов`}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>😔 Отзывов пока нет</Text>
              <Text style={styles.noReviewsSubtext}>
                Будьте первым, кто оставит отзыв об этом враче
              </Text>
              <TouchableOpacity 
                style={styles.firstReviewButton}
                onPress={handleAddReview}
              >
                <Text style={styles.firstReviewButtonText}>Оставить первый отзыв</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Кнопка записи */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>📅 Записаться на прием</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно добавления отзыва */}
      <Modal
        visible={reviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Оставить отзыв</Text>
            <Text style={styles.modalSubtitle}>О враче {doctor.name}</Text>

            <Text style={styles.modalLabel}>Ваша оценка:</Text>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
              editable={true}
              size={32}
            />

            <Text style={styles.modalLabel}>Комментарий:</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              placeholder="Расскажите о своем опыте посещения..."
              value={newReview.comment}
              onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
            />

            <Text style={styles.modalLabel}>Дата посещения (опционально):</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="ГГГГ-ММ-ДД"
              value={newReview.visitDate}
              onChangeText={(text) => setNewReview(prev => ({ ...prev, visitDate: text }))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setReviewModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitReview}
              >
                <Text style={styles.submitButtonText}>Опубликовать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  },
  doctorMainInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoContainer: {
    marginRight: 16,
  },
  doctorPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  basicInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  doctorDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  servicesList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  serviceName: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  showMoreButton: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  showMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
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
    marginBottom: 20,
    lineHeight: 20,
  },
  firstReviewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  firstReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666666',
  },
});

export default DoctorDetailScreen;