import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService } from '../utils/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    setLoading(true);

    try {
      await authService.login(email, password);
      Alert.alert('Успех', 'Вход выполнен!');
      navigation.navigate('DoctorsList');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleQuickLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Вход в систему</Text>
        <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>📧 Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите ваш email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>🔒 Пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите ваш пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Вход...' : 'Войти'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>или</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Создать аккаунт</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Забыли пароль?</Text>
        </TouchableOpacity>
      </View>

      {/* Тестовые данные для быстрого входа */}
      <View style={styles.testDataSection}>
        <Text style={styles.testDataTitle}>Тестовые данные для быстрого входа:</Text>
        
        <TouchableOpacity 
          style={styles.testAccountButton}
          onPress={() => handleQuickLogin('user@example.com', 'password')}
          disabled={loading}
        >
          <Text style={styles.testAccountText}>👤 Основной тестовый аккаунт</Text>
          <Text style={styles.testAccountDetails}>user@example.com / password</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testAccountButton}
          onPress={() => handleQuickLogin('doctor@example.com', 'doctor123')}
          disabled={loading}
        >
          <Text style={styles.testAccountText}>👨‍⚕️ Аккаунт врача</Text>
          <Text style={styles.testAccountDetails}>doctor@example.com / doctor123</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.testAccountButton}
          onPress={() => handleQuickLogin('admin@example.com', 'admin123')}
          disabled={loading}
        >
          <Text style={styles.testAccountText}>⚙️ Аккаунт администратора</Text>
          <Text style={styles.testAccountDetails}>admin@example.com / admin123</Text>
        </TouchableOpacity>
      </View>

      {/* Информация о приложении */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Doctor Reviews</Text>
        <Text style={styles.infoText}>
          Платформа для поиска врачей и оставления отзывов. 
          Создавайте честные отзывы о врачах и помогайте другим пациентам.
        </Text>
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666666',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#1A1A1A',
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
  testDataSection: {
    backgroundColor: '#FFF3CD',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  testDataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  testAccountButton: {
    backgroundColor: '#FFFDF6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  testAccountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 2,
  },
  testAccountDetails: {
    fontSize: 12,
    color: '#856404',
    opacity: 0.8,
  },
  infoSection: {
    backgroundColor: '#E8F5E8',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;