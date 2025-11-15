import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const UserAvatar = ({ 
  userName, 
  avatarUrl, 
  size = 80, 
  onPress,
  showEdit = false 
}) => {
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleAvatarPress = () => {
    if (onPress) {
      onPress();
    } else if (showEdit) {
      Alert.alert('Смена аватара', 'Функция будет доступна в следующем обновлении');
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.avatarContainer,
        { width: size, height: size, borderRadius: size / 2 }
      ]} 
      onPress={handleAvatarPress}
      disabled={!onPress && !showEdit}
    >
      {avatarUrl ? (
        <Text>🖼️</Text> // Здесь будет Image компонент для реального фото
      ) : (
        <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>
          {getInitials(userName)}
        </Text>
      )}
      
      {showEdit && (
        <View style={styles.editBadge}>
          <Text style={styles.editText}>✏️</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  editText: {
    fontSize: 12,
  },
});

export default UserAvatar;