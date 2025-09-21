import { fetchUsers, fetchUserById, fetchPostsByUserId } from './api.js';

// 1. getActiveUsers — получение активных пользователей
export async function getActiveUsers() {
    try {
        const allUsers = await fetchUsers();
        // Фильтруем пользователей. Критерий: ID кратен 2 (четный)
        const activeUsers = allUsers.filter(user => user.id % 2 === 0);
        return activeUsers;
    } catch (error) {
        console.error('Ошибка при получении активных пользователей:', error);
        return [];
    }
}

// 2. getUserWithPosts — получение пользователя и его постов
export async function getUserWithPosts(userId) {
    try {
        const [user, posts] = await Promise.all([
            fetchUserById(userId),
            fetchPostsByUserId(userId)
        ]);

        return {
            ...user,
            posts
        };
    } catch (error) {
        console.error(`Ошибка при получении данных пользователя ${userId}:`, error);
        throw error;
    }
}

// 3. findUserByEmail — поиск пользователя по email
export async function findUserByEmail(email) {
    try {
        const allUsers = await fetchUsers();
        const user = allUsers.find(user => user.email === email);
        return user || null;
    } catch (error) {
        console.error('Ошибка при поиске пользователя по email:', error);
        return null;
    }
}