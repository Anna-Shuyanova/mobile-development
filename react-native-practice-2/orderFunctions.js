// Функции для работы с заказами

// Импортируем массив orders из data.js
import { orders } from './data.js';

// 1. Функция getUserOrders - получение заказов пользователя
export function getUserOrders(userId) {
  // Используем filter для поиска всех заказов пользователя
  return orders.filter(order => order.userId === userId);
}

// 2. Функция addProductToOrder - добавление товара в заказ
export function addProductToOrder(orderId, newProduct) {
  // Находим заказ по ID
  const order = orders.find(order => order.id === orderId);
  
  // Если заказ не найден, возвращаем null
  if (!order) {
    return null;
  }
  
  // Добавляем новый товар в массив products с помощью spread-оператора
  order.products = [...order.products, newProduct];
  
  // Возвращаем обновленный заказ
  return order;
}

// 3. Функция getOrderSummary - получение сводки по заказу
export function getOrderSummary(orderId) {
  // Находим заказ по ID
  const order = orders.find(order => order.id === orderId);
  
  // Если заказ не найден, возвращаем null
  if (!order) {
    return null;
  }
  
  // Используем деструктуризацию для извлечения нужных полей
  const { products, total, status, userId } = order;
  
  // Возвращаем объект с преобразованными данными
  return {
    productsCount: products.length, // количество товаров
    total: `$${total.toFixed(2)}`,  // общая сумма в формате "$XX.XX"
    status: status.toUpperCase(),   // статус в верхнем регистре
    userId                          // ID пользователя
  };
}