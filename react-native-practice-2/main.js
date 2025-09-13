// Файл: main.js
// Главный файл приложения - демонстрация работы всех функций

// Импортируем все необходимые модули
import { users, orders } from './data.js';
import { createUser, findUserById, updateUser } from './userFunctions.js';
import { getUserOrders, addProductToOrder, getOrderSummary } from './orderFunctions.js';
import { calculateTotal, formatUserInfo, logAllParams } from './utils.js';

console.log('=== ДЕМОНСТРАЦИЯ РАБОТЫ ВСЕХ ФУНКЦИЙ ===\n');

// 1. Демонстрация работы с пользователями
console.log('1. РАБОТА С ПОЛЬЗОВАТЕЛЯМИ');
console.log('Исходные пользователи:', users);

// Создаем нового пользователя
const newUser = createUser({ 
  name: 'Екатерина', 
  email: 'kate@yandex.ru' 
});
console.log('\nСоздан новый пользователь:', newUser);

// Ищем пользователя по ID
const foundUser = findUserById(2);
console.log('Найден пользователь с ID 2:', foundUser);

// Обновляем пользователя
const updatedUser = updateUser(1, { 
  name: 'Алиса Петрова', 
  isActive: false 
});
console.log('Обновлен пользователь с ID 1:', updatedUser);

// 2. Демонстрация работы с заказами
console.log('\n2. РАБОТА С ЗАКАЗАМИ');

// Получаем заказы пользователя
const userOrders = getUserOrders(1);
console.log('Заказы пользователя с ID 1:', userOrders);

// Добавляем товар в заказ
const updatedOrder = addProductToOrder(101, 'Карандаш');
console.log('Добавлен товар в заказ 101:', updatedOrder);

// Получаем сводку по заказу
const orderSummary = getOrderSummary(103);
console.log('Сводка по заказу 103:', orderSummary);

// 3. Демонстрация вспомогательных функций
console.log('\n3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ');

// Вычисляем общую сумму
const total = calculateTotal(10.50, 5.75, 3.25, 15.00);
console.log('Общая сумма (10.50 + 5.75 + 3.25 + 15.00):', total);

// Форматируем информацию о пользователе
const userInfo = formatUserInfo(users[0]);
console.log('Форматированная информация о пользователе:', userInfo);

// Демонстрация rest-оператора
console.log('\n4. ДЕМОНСТРАЦИЯ REST-ОПЕРАТОРА');
logAllParams('параметр1', 42, true, { key: 'value' }, ['массив']);

console.log('\n=== ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА ===');