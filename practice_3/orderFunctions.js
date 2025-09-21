import { fetchPosts, fetchUsers } from './api.js';

// 1. getRecentPosts — получение последних постов
export async function getRecentPosts(limit = 5) {
    try {
        const allPosts = await fetchPosts();
        const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
        return sortedPosts.slice(0, limit);
    } catch (error) {
        console.error('Ошибка при получении последних постов:', error);
        return [];
    }
}

// 2. getPostsByTitleSearch — поиск постов по заголовку
export async function getPostsByTitleSearch(searchTerm) {
    try {
        const allPosts = await fetchPosts();
        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filteredPosts;
    } catch (error) {
        console.error('Ошибка при поиске постов:', error);
        return [];
    }
}

// 3. getPostsStats — получение статистики по постам
export async function getPostsStats() {
    try {
        const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);

        const totalPosts = posts.length;
        const totalUsers = users.length;
        const avgPostsPerUser = totalPosts / totalUsers;

        return {
            totalPosts,
            totalUsers,
            avgPostsPerUser: avgPostsPerUser.toFixed(2)
        };
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        return {};
    }
}