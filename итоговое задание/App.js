import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DoctorsListScreen from './screens/DoctorsListScreen';
import DoctorDetailScreen from './screens/DoctorDetailScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import AddEditReviewScreen from './screens/AddEditReviewScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyReviewsScreen from './screens/MyReviewsScreen';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Вход' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Регистрация' }}
        />
        <Stack.Screen 
          name="DoctorsList" 
          component={DoctorsListScreen}
          options={{ title: 'Наши врачи' }}
        />
        <Stack.Screen 
          name="DoctorDetail" 
          component={DoctorDetailScreen}
          options={{ title: 'Детали врача' }}
        />
        <Stack.Screen 
          name="Reviews" 
          component={ReviewsScreen}
          options={{ title: 'Отзывы' }}
        />
        <Stack.Screen 
          name="AddEditReview" 
          component={AddEditReviewScreen}
          options={{ title: 'Отзыв' }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ title: 'Профиль' }}
        />
        <Stack.Screen 
          name="MyReviews" 
          component={MyReviewsScreen}
          options={{ title: 'Мои отзывы' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;