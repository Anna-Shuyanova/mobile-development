import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Главная страница</Text>
      <Text>✅ HomeScreen работает!</Text>
    </View>
  );
};

export default HomeScreen;