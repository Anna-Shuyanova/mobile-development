// screens/MyReviewsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { userReviews, deleteUserReview } from '../utils/userData';
import ReviewCard from '../components/ReviewCard';

const MyReviewsScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    lastMonth: 0,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    
    // Имитация загрузки
    setTimeout(() => {
      setReviews(userReviews);
      calculateStats(userReviews);
      setLoading(false);
    }, 500);
  };

  const calculateStats = (reviewsList) => {
    const total = reviewsList.length;
    const averageRating = total > 0 
      ? (reviewsList.reduce((sum, review) => sum + review.rating, 0) / total).toFixed(1)
      : 0;
    
    const lastMonth = reviewsList.filter(review => {
      const reviewDate = new Date(review.date);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return reviewDate > monthAgo;
    }).length;

    setStats({ total, averageRating, lastMonth });
  };

  const handleEditReview = (review) => {
    navigation.navigate('AddEditReview', {
      doctorId: review.doctorId,
      review: review,
      mode: 'edit'
    });
  };

  const handleDeleteReview = (reviewId) => {
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
          onPress: () => {
            deleteUserReview(reviewId);
            const updatedReviews = reviews.filter(review => review.id !== reviewId);
            setReviews(updatedReviews);
            calculateStats(updatedReviews);
            
            Alert.alert('Успех', 'Отзыв удален');
          }
        }
      ]
    );
  };

  const handleDoctorPress = (doctorId, doctorName) => {
    navigation.navigate('DoctorDetail', { 
      doctorId,
      doctor: { id: doctorId, name: doctorName }
    });
  };

  const handleReviewAction = (reviewId, action) => {
    console.log(`Action ${action} on review ${reviewId}`);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка ваших отзывов...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Статистика */}
        <View style={styles.header}>
          <Text style={styles.title}>Мои отзывы</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Всего отзывов</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.averageRating}</Text>
              <Text style={styles.statLabel}>Средняя оценка</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.lastMonth}</Text>
              <Text style={styles.statLabel}>За месяц</Text>
            </View>
          </View>
        </View>

        {/* Список отзывов */}
        <View style={styles.reviewsSection}>
          {reviews.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                Ваши отзывы ({reviews.length})
              </Text>
              
              {reviews.map(review => (
                <View key={review.id} style={styles.reviewContainer}>
                  {/* Заголовок с информацией о враче */}
                  <TouchableOpacity 
                    style={styles.doctorHeader}
                    onPress={() => handleDoctorPress(review.doctorId, review.doctorName)}
                  >
                    <Text style={styles.doctorName}>{review.doctorName}</Text>
                    <Text style={styles.doctorSpecialty}>{review.doctorSpecialty}</Text>
                    <Text style={styles.seeDoctorText}>👁️ Посмотреть врача →</Text>
                  </TouchableOpacity>
                  
                  {/* Карточка отзыва */}
                  <ReviewCard
                    review={review}
                    currentUserId="currentUser"
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onAction={handleReviewAction}
                    navigation={navigation}
                  />
                </View>
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📝</Text>
              <Text style={styles.emptyStateTitle}>У вас пока нет отзывов</Text>
              <Text style={styles.emptyStateText}>
                Оставляйте отзывы о врачах, чтобы помочь другим пользователям сделать правильный выбор
              </Text>
              <TouchableOpacity 
                style={styles.findDoctorsButton}
                onPress={() => navigation.navigate('DoctorsList')}
              >
                <Text style={styles.findDoctorsButtonText}>Найти врачей</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  reviewsSection: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  reviewContainer: {
    marginBottom: 20,
  },
  doctorHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  seeDoctorText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  findDoctorsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  findDoctorsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyReviewsScreen;