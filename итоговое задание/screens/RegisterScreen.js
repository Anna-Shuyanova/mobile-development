import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService } from '../utils/auth';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Имя обязательно для заполнения';
        if (value.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email обязателен для заполнения';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Введите корректный email';
        return '';
      
      case 'password':
        if (!value) return 'Пароль обязателен для заполнения';
        if (value.length < 6) return 'Пароль должен содержать минимум 6 символов';
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) return 'Пароль должен содержать буквы разного регистра';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Подтверждение пароля обязательно';
        if (value !== formData.password) return 'Пароли не совпадают';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Ошибка', 'Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setLoading(true);

    try {
      await authService.register(formData.name, formData.email, formData.password);
      Alert.alert(
        'Успех', 
        'Регистрация завершена! Добро пожаловать в Doctor Reviews!',
        [{ text: 'OK', onPress: () => navigation.navigate('DoctorsList') }]
      );
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '#E0E0E0' };
    
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      1: { text: 'Слабый', color: '#FF3B30' },
      2: { text: 'Слабый', color: '#FF3B30' },
      3: { text: 'Средний', color: '#FF9500' },
      4: { text: 'Хороший', color: '#34C759' },
      5: { text: 'Отличный', color: '#32D74B' }
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Регистрация</Text>
        <Text style={styles.subtitle}>Создайте новый аккаунт</Text>
      </View>

      <View style={styles.section}>
        {/* Имя */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>👤 Имя и фамилия</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Введите ваше имя и фамилию"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            editable={!loading}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>📧 Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Введите ваш email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Пароль */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>🔒 Пароль</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Придумайте пароль"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            secureTextEntry
            editable={!loading}
          />
          
          {/* Индикатор сложности пароля */}
          {formData.password ? (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor: level <= passwordStrength.strength 
                          ? passwordStrength.color 
                          : '#E0E0E0'
                      }
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                {passwordStrength.text}
              </Text>
            </View>
          ) : null}
          
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          
          <View style={styles.passwordHints}>
            <Text style={styles.hintTitle}>Пароль должен содержать:</Text>
            <Text style={[styles.hint, formData.password.length >= 6 && styles.hintValid]}>
              ✓ Минимум 6 символов
            </Text>
            <Text style={[styles.hint, /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) && styles.hintValid]}>
              ✓ Буквы разного регистра
            </Text>
          </View>
        </View>

        {/* Подтверждение пароля */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>✅ Подтверждение пароля</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            secureTextEntry
            editable={!loading}
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <Text style={styles.successText}>✅ Пароли совпадают</Text>
          )}
        </View>

        {/* Кнопка регистрации */}
        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Text>
        </TouchableOpacity>

        {/* Ссылка на вход */}
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.linkButtonText}>Уже есть аккаунт? Войти</Text>
        </TouchableOpacity>
      </View>

      {/* Информация о преимуществах */}
      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>🎯 Преимущества регистрации</Text>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>💾</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Сохранение отзывов</Text>
            <Text style={styles.benefitDescription}>Все ваши отзывы будут сохранены в вашем аккаунте</Text>
          </View>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>⭐</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Рейтинг доверия</Text>
            <Text style={styles.benefitDescription}>Повышайте свой рейтинг за полезные отзывы</Text>
          </View>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🔔</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Уведомления</Text>
            <Text style={styles.benefitDescription}>Получайте ответы на ваши отзывы</Text>
          </View>
        </View>
        
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🏆</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Статус эксперта</Text>
            <Text style={styles.benefitDescription}>Станьте доверенным экспертом сообщества</Text>
          </View>
        </View>
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
    padding: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: '#1A1A1A',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 4,
    marginLeft: 4,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBar: {
    flex: 1,
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    marginHorizontal: 1,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  passwordHints: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 2,
  },
  hintValid: {
    color: '#34C759',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 16,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  benefitsSection: {
    backgroundColor: '#E8F4FD',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B6DEF7',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
});

export default RegisterScreen;