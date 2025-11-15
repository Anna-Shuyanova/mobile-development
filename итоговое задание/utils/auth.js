// utils/auth.js

// Имитация базы данных пользователей
export const users = [
  {
    id: '1',
    name: 'Тестовый Пользователь',
    email: 'user@example.com',
    password: 'password',
    role: 'user'
  },
  {
    id: '2',
    name: 'Доктор Иванов',
    email: 'doctor@example.com',
    password: 'doctor123',
    role: 'doctor'
  },
  {
    id: '3', 
    name: 'Администратор',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

// Текущий пользователь
export let currentUser = null;

export const authService = {
  // Вход в систему
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          currentUser = user;
          resolve(user);
        } else {
          reject(new Error('Неверный email или пароль'));
        }
      }, 1000);
    });
  },

  // Регистрация
  register: async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('Пользователь с таким email уже существует'));
        } else {
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            role: 'user'
          };
          users.push(newUser);
          currentUser = newUser;
          resolve(newUser);
        }
      }, 1500);
    });
  },

  // Выход
  logout: async () => {
    currentUser = null;
    return Promise.resolve();
  },

  // Проверка авторизации
  isAuthenticated: () => {
    return currentUser !== null;
  },

  // Получение текущего пользователя
  getCurrentUser: () => {
    return currentUser;
  },

  // Проверка роли
  hasRole: (role) => {
    return currentUser && currentUser.role === role;
  }
};