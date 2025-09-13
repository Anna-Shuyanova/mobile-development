// Модуль с исходными данными о пользователях и заказах

// 1. Массив пользователей
export const users = [
  {
    id: 1,
    name: "Алиса",
    email: "alice@yandex.ru",
    isActive: true
  },
  {
    id: 2,
    name: "Стас", 
    email: "stas@yandex.ru",
    isActive: false
  },
  {
    id: 3,
    name: "Максим",
    email: "maxim@yandex.ru", 
    isActive: true
  }
];

// 2. Массив заказов
export const orders = [
  {
    id: 101,
    userId: 1,
    products: ["Книга", "Ручка"],
    total: 15.50,
    status: "отправлен"
  },
  {
    id: 102, 
    userId: 1,
    products: ["Блокнот"],
    total: 10.00,
    status: "доставлен"
  },
  {
    id: 103,
    userId: 2,
    products: ["Ноутбук", "Чехол"],
    total: 1250.00,
    status: "в обработке"
  },
  {
    id: 104,
    userId: 3,
    products: ["Кофе"],
    total: 5.75,
    status: "отправлен"
  }
];