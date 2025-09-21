const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Общая функция для выполнения запросов с обработкой ошибок
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Ошибка запроса к ${endpoint}:`, error);
        throw error; // Пробрасываем ошибку дальше, чтобы обработать её в других функциях
    }
}

// 1. Получение списка всех пользователей
export async function fetchUsers() {
    return fetchFromAPI('/users');
}

// 2. Получение конкретного пользователя по ID
export async function fetchUserById(id) {
    return fetchFromAPI(`/users/${id}`);
}

// 3. Получение всех постов
export async function fetchPosts() {
    return fetchFromAPI('/posts');
}

// 4. Получение постов конкретного пользователя
export async function fetchPostsByUserId(userId) {
    return fetchFromAPI(`/posts?userId=${userId}`);
}