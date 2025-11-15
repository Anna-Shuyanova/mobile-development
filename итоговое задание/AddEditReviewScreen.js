// screens/AddEditReviewScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import StarRating from '../components/StarRating';
import { simpleDoctorsData } from '../utils/simpleData';

const AddEditReviewScreen = ({ route, navigation }) => {
  const { doctorId, review: existingReview, mode = 'add' } = route.params;
  
  const [doctor, setDoctor] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Проверка авторизации (в реальном приложении здесь будет проверка токена)
  const isAuthenticated = true; // Заглушка
  const currentUser = {
    id: 'currentUser',
    name: 'Текущий пользователь'
  };

  useEffect(() => {
    // Находим врача
    const foundDoctor = simpleDoctorsData.find(d => d.id === doctorId);
    setDoctor(foundDoctor);

    // Если режим редактирования, заполняем форму данными отзыва
    if (mode === 'edit' && existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setVisitDate(existingReview.visitDate || '');
    }
  }, [doctorId, existingReview, mode]);

  const validateForm = () => {
    if (!isAuthenticated) {
      Alert.alert('Ошибка', 'Для добавления отзыва необходимо авторизоваться');
      return false;
    }

    if (rating === 0) {
      Alert.alert('Ошибка', 'Пожалуйста, поставьте оценку');
      return false;
    }

    if (comment.trim().length < 10) {
      Alert.alert('Ошибка', 'Отзыв должен содержать не менее 10 символов');
      return false;
    }

    if (comment.trim().length > 1000) {
      Alert.alert('Ошибка', 'Отзыв не должен превышать 1000 символов');
      return false;
    }

    // Проверка формата даты (если указана)
    if (visitDate && !isValidDate(visitDate)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите дату в формате ГГГГ-ММ-ДД');
      return false;
    }

    return true;
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Имитация отправки данных
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reviewData = {
        id: mode === 'edit' ? existingReview.id : Date.now().toString(),
        doctorId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment: comment.trim(),
        visitDate: visitDate.trim() || null,
        date: new Date().toISOString().split('T')[0],
        likes: mode === 'edit' ? existingReview.likes : 0,
        dislikes: mode === 'edit' ? existingReview.dislikes : 0,
        helpful: mode === 'edit' ? existingReview.helpful : 0,
        isVerified: true,
      };

      // В реальном приложении здесь будет вызов API
      console.log('Отправка отзыва:', reviewData);

      // Показываем уведомление об успехе
      Alert.alert(
        'Успех',
        mode === 'edit' ? 'Отзыв успешно обновлен!' : 'Отзыв успешно добавлен!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить отзыв. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
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
          onPress: async () => {
            try {
              // Имитация удаления
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // В реальном приложении здесь будет вызов API для удаления
              console.log('Удаление отзыва:', existingReview.id);
              
              Alert.alert(
                'Успех',
                'Отзыв успешно удален',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить отзыв. Попробуйте еще раз.');
            }
          }
        }
      ]
    );
  };

  if (!doctor) {
    return (
      <View style={styles.container}>
        <Text>Врач не найден</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authRequired}>
          <Text style={styles.authRequiredTitle}>🔐 Требуется авторизация</Text>
          <Text style={styles.authRequiredText}>
            Для добавления отзыва необходимо войти в систему
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Войти</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'edit' ? 'Редактирование отзыва' : 'Новый отзыв'}
            </Text>
            <Text style={styles.doctorName}>О враче: {doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          </View>

          {/* Оценка */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ваша оценка *</Text>
            <View style={styles.ratingContainer}>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                editable={true}
                size={36}
              />
              <Text style={styles.ratingText}>
                {rating === 5 ? 'Отлично' : 
                 rating === 4 ? 'Хорошо' : 
                 rating === 3 ? 'Удовлетворительно' : 
                 rating === 2 ? 'Плохо' : 
                 'Ужасно'}
              </Text>
            </View>
          </View>

          {/* Комментарий */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Комментарий * {comment.length}/1000
            </Text>
            <TextInput
              style={[
                styles.commentInput,
                comment.length > 1000 && styles.inputError
              ]}
              multiline
              numberOfLines={6}
              placeholder="Расскажите о своем опыте посещения врача. Что понравилось, что можно улучшить?"
              value={comment}
              onChangeText={setComment}
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text style={styles.helperText}>
              Минимум 10 символов. Поделитесь своим реальным опытом.
            </Text>
          </View>

          {/* Дата посещения */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Дата посещения</Text>
            <TextInput
              style={styles.dateInput}
              placeholder="ГГГГ-ММ-ДД (например: 2024-01-15)"
              value={visitDate}
              onChangeText={setVisitDate}
            />
            <Text style={styles.helperText}>
              Необязательное поле. Поможет другим пользователям понять актуальность отзыва.
            </Text>
          </View>

          {/* Подсказки */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Советы по написанию отзыва:</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Опишите свой личный опыт</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Будьте конкретны и объективны</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Отметьте сильные и слабые стороны</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Избегайте оскорблений и ненормативной лексики</Text>
            </View>
          </View>
        </ScrollView>

        {/* Кнопки действий */}
        <View style={styles.footer}>
          {mode === 'edit' && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isSubmitting}
            >
              <Text style={styles.deleteButtonText}>🗑️ Удалить отзыв</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!rating || comment.trim().length < 10 || isSubmitting) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!rating || comment.trim().length < 10 || isSubmitting}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>Сохранение...</Text>
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === 'edit' ? 'Обновить отзыв' : 'Опубликовать отзыв'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    fontWeight: '600',
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 12,
    fontWeight: '500',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 20,
    marginBottom: 100, // Отступ для фиксированных кнопок
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authRequiredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  authRequiredText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEditReviewScreen;