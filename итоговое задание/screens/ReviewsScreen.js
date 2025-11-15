// screens/ReviewsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { 
  getReviewsByDoctorId, 
  calculateDoctorRating, 
  getRatingDistribution,
  getTotalReviewsCount 
} from '../utils/reviewData';

const ReviewsScreen = ({ route, navigation }) => {
  const { doctorId, doctorName, currentUserId } = route.params;
  
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    total: 0,
    hasMore: true,
    currentPage: 1,
    totalPages: 1
  });
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [doctorRating, setDoctorRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [totalReviews, setTotalReviews] = useState(0);

  const limit = 5;

  useEffect(() => {
    loadDoctorStats();
    loadReviews(1, true);
  }, [doctorId]);

  useEffect(() => {
    loadReviews(1, true);
  }, [sortBy]);

  const loadDoctorStats = () => {
    const rating = calculateDoctorRating(doctorId);
    const distribution = getRatingDistribution(doctorId);
    const total = getTotalReviewsCount(doctorId);
    
    setDoctorRating(rating);
    setRatingDistribution(distribution);
    setTotalReviews(total);
  };

  const loadReviews = async (page = 1, reset = false) => {
    if (loading || loadingMore) return;
    
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    // Имитация загрузки данных
    setTimeout(() => {
      const data = getReviewsByDoctorId(doctorId, page, limit, sortBy);
      
      if (reset) {
        setReviewsData(data);
        setLoading(false);
      } else {
        setReviewsData(prev => ({
          ...data,
          reviews: [...prev.reviews, ...data.reviews]
        }));
        setLoadingMore(false);
      }
    }, 500);
  };

  const handleLoadMore = () => {
    if (reviewsData.hasMore && !loadingMore) {
      loadReviews(reviewsData.currentPage + 1, false);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleReviewAction = (reviewId, action) => {
    // Здесь будет логика для лайков/дизлайков
    console.log(`Action ${action} on review ${reviewId}`);
  };

  const calculatePercentage = (count) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  const renderRatingBar = (stars, count) => {
    const percentage = calculatePercentage(count);
    return (
      <View style={styles.ratingBar}>
        <Text style={styles.ratingStars}>{stars} ⭐</Text>
        <View style={styles.barContainer}>
          <View 
            style={[
              styles.bar, 
              { width: `${percentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.ratingCount}>({count})</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка отзывов...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Заголовок и общий рейтинг */}
        <View style={styles.header}>
          <Text style={styles.title}>Отзывы о враче</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
          
          <View style={styles.ratingOverview}>
            <View style={styles.overallRating}>
              <Text style={styles.ratingNumber}>{doctorRating}</Text>
              <StarRating rating={parseFloat(doctorRating)} size={20} />
              <Text style={styles.totalReviews}>Всего отзывов: {totalReviews}</Text>
            </View>
            
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map(stars => (
                <View key={stars}>
                  {renderRatingBar(stars, ratingDistribution[stars] || 0)}
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Сортировка */}
        <View style={styles.sortSection}>
          <Text style={styles.sortLabel}>Сортировка:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'date' && styles.sortButtonActive
              ]}
              onPress={() => handleSortChange('date')}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === 'date' && styles.sortButtonTextActive
              ]}>
                По дате
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'rating' && styles.sortButtonActive
              ]}
              onPress={() => handleSortChange('rating')}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === 'rating' && styles.sortButtonTextActive
              ]}>
                По оценке
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sortButton,
                sortBy === 'relevant' && styles.sortButtonActive
              ]}
              onPress={() => handleSortChange('relevant')}
            >
              <Text style={[
                styles.sortButtonText,
                sortBy === 'relevant' && styles.sortButtonTextActive
              ]}>
                По релевантности
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Список отзывов */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            Отзывы ({reviewsData.total})
          </Text>
          
          {reviewsData.reviews.length > 0 ? (
            <>
              {reviewsData.reviews.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={currentUserId}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onAction={handleReviewAction}
                />
              ))}
              
              {/* Кнопка загрузки еще */}
              {reviewsData.hasMore && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : (
                    <Text style={styles.loadMoreText}>
                      Загрузить еще ({reviewsData.total - reviewsData.reviews.length})
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              
              {/* Индикатор конца списка */}
              {!reviewsData.hasMore && reviewsData.reviews.length > 0 && (
                <View style={styles.endOfList}>
                  <Text style={styles.endOfListText}>
                    Вы просмотрели все отзывы
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsText}>😔 Отзывов пока нет</Text>
              <Text style={styles.noReviewsSubtext}>
                Будьте первым, кто оставит отзыв об этом враче
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Кнопка добавления отзыва */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity 
          style={styles.addReviewButton}
          onPress={() => navigation.navigate('AddReview', { 
            doctorId, 
            doctorName 
          })}
        >
          <Text style={styles.addReviewButtonText}>✏️ Написать отзыв</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  ratingOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overallRating: {
    alignItems: 'center',
    flex: 1,
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  ratingBars: {
    flex: 1,
    paddingLeft: 20,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingStars: {
    fontSize: 14,
    width: 40,
    color: '#666',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#FF9500',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  sortSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  reviewsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  loadMoreButton: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loadMoreText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  endOfList: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  endOfListText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
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
  fixedButtonContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addReviewButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewsScreen;