// Вспомогательные функции

// 1. Функция calculateTotal - вычисление общей суммы
export function calculateTotal(...prices) {
  // Используем reduce для суммирования всех переданных аргументов
  return prices.reduce((total, price) => total + price, 0);
}

// 2. Функция formatUserInfo - форматирование информации о пользователе
export function formatUserInfo(user) {
  // Используем деструктуризацию для извлечения нужных полей
  const { name, email, isActive } = user;
  
  // Определяем статусную строку на основе isActive
  const statusText = isActive ? 'Active' : 'Inactive';
  
  // Возвращаем отформатированную строку
  return `Пользователь: ${name} (${email}). Status: ${statusText}`;
}

// 3. Дополнительная полезная функция для демонстрации rest-оператора
export function logAllParams(...params) {
  console.log('Все переданные параметры:', params);
  console.log('Количество параметров:', params.length);
}