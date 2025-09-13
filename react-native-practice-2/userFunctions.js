// Функции для работы с пользователями

// Импортируем массив users из data.js
import { users } from './data.js';

// 1. Функция createUser - создание нового пользователя
export function createUser({ name, email, isActive = true }) {
  // Находим максимальный ID среди существующих пользователей
  const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
  
  // Создаем нового пользователя
  const newUser = {
    id: maxId + 1, // Генерируем новый ID
    name,
    email,
    isActive
  };
  
  // Добавляем нового пользователя в массив
  users.push(newUser);
  
  // Возвращаем созданного пользователя
  return newUser;
}

// 2. Функция findUserById - поиск пользователя по ID
export function findUserById(id) {
  // Находим пользователя по ID
  const user = users.find(user => user.id === id);
  
  // Если пользователь не найден, возвращаем null
  if (!user) {
    return null;
  }
  
  // Используем деструктуризацию для возврата только name и email
  const { name, email } = user;
  return { name, email };
}

// 3. Функция updateUser - обновление данных пользователя
export function updateUser(id, updatedFields) {
  // Находим индекс пользователя в массиве
  const userIndex = users.findIndex(user => user.id === id);
  
  // Если пользователь не найден, возвращаем null
  if (userIndex === -1) {
    return null;
  }
  
  // Обновляем пользователя с помощью spread-оператора
  users[userIndex] = {
    ...users[userIndex], // Копируем существующие поля
    ...updatedFields     // Обновляем переданными полями
  };
  
  // Возвращаем обновленного пользователя
  return users[userIndex];
}