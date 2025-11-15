// screens/ProfileScreen.js
import React, { useState } from 'react';
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
import { currentUser, updateUserProfile } from '../utils/userData';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(currentUser);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleEditProfile = () => {
    setEditedUser({ ...user });
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    // Валидация
    if (!editedUser.name.trim()) {
      Alert.alert('Ошибка', 'Введите имя');
      return;
    }

    if (!editedUser.email.trim()) {
      Alert.alert('Ошибка', 'Введите email');
      return;
    }

    // Обновляем данные пользователя
    const updatedUser = updateUserProfile(editedUser);
    setUser(updatedUser);
    setEditModalVisible(false);
    
    Alert.alert('Успех', 'Профиль обновлен');
  };

  const handleAvatarChange = () => {
    Alert.alert(
      'Смена аватара',
      'Выберите действие',
      [
        {
          text: 'Сделать фото',
          onPress: () => console.log('Take photo'),
        },
        {
          text: 'Выбрать из галереи',
          onPress: () => console.log('Choose from gallery'),
        },
        {
          text: 'Удалить аватар',
          onPress: () => {
            const updatedUser = updateUserProfile({ ...user, avatar: null });
            setUser(updatedUser);
          },
          style: 'destructive',
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  const formatRegistrationDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Шапка профиля */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleAvatarChange}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'П'}
                  </Text>
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Text style={styles.avatarEditText}>✏️</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>✏️ Редактировать профиль</Text>
          </TouchableOpacity>
        </View>

        {/* Статистика */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.reviewsCount}</Text>
              <Text style={styles.statLabel}>Отзывов</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.averageRating}</Text>
              <Text style={styles.statLabel}>Средний рейтинг</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.round(user.reviewsCount * user.averageRating)}
              </Text>
              <Text style={styles.statLabel}>Всего оценок</Text>
            </View>
          </View>
        </View>

        {/* Информация о профиле */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Телефон</Text>
              <Text style={styles.infoValue}>{user.phone || 'Не указан'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Дата регистрации</Text>
              <Text style={styles.infoValue}>{formatRegistrationDate(user.registrationDate)}</Text>
            </View>
          </View>
        </View>

        {/* Быстрые действия */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Действия</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('MyReviews')}
            >
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.actionText}>Мои отзывы</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('DoctorsList')}
            >
              <Text style={styles.actionEmoji}>👨‍⚕️</Text>
              <Text style={styles.actionText}>Найти врача</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Уведомления', 'Раздел в разработке')}
            >
              <Text style={styles.actionEmoji}>🔔</Text>
              <Text style={styles.actionText}>Уведомления</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Настройки', 'Раздел в разработке')}
            >
              <Text style={styles.actionEmoji}>⚙️</Text>
              <Text style={styles.actionText}>Настройки</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Недавние отзывы (превью) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Недавние отзывы</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyReviews')}>
              <Text style={styles.seeAllText}>Все отзывы</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.reviewPreview}
            onPress={() => navigation.navigate('MyReviews')}
          >
            <Text style={styles.reviewPreviewText}>
              📝 Вы оставили {user.reviewsCount} отзывов
            </Text>
            <Text style={styles.reviewPreviewSubtext}>
              Нажмите для просмотра и управления
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Модальное окно редактирования профиля */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактирование профиля</Text>
            
            <Text style={styles.modalLabel}>Имя и фамилия *</Text>
            <TextInput
              style={styles.textInput}
              value={editedUser.name}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, name: text }))}
              placeholder="Введите ваше имя"
            />
            
            <Text style={styles.modalLabel}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={editedUser.email}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, email: text }))}
              placeholder="Введите ваш email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.modalLabel}>Телефон</Text>
            <TextInput
              style={styles.textInput}
              value={editedUser.phone}
              onChangeText={(text) => setEditedUser(prev => ({ ...prev, phone: text }))}
              placeholder="+7 (999) 123-45-67"
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Сохранить</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarEditText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  infoList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  reviewPreview: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  reviewPreviewSubtext: {
    fontSize: 14,
    color: '#666666',
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
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
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
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;