import { getActiveUsers, getUserWithPosts, findUserByEmail } from './userFunctions.js';
import { getRecentPosts, getPostsByTitleSearch, getPostsStats } from './orderFunctions.js';
import { simulateLoading, withTimeout, retryOperation } from './utils.js';
async function main() {
    console.log('=== НАЧАЛО АСИНХРОННОЙ ДЕМОНСТРАЦИИ ===\n');

    try {
        // 1. Демонстрация последовательной работы с задержкой
        console.log('1. Последовательная работа:');
        await simulateLoading(1000); // Ждем 1 секунду

        // 2. Получение списка активных пользователей
        console.log('\n2. Получаем активных пользователей...');
        const activeUsers = await getActiveUsers();
        console.log('Активные пользователи (ID кратен 2):', activeUsers.map(u => `${u.name} (ID:${u.id})`));

        await simulateLoading(500);

        // 3. Получение детальной информации о первом пользователе (включая его посты)
        console.log('\n3. Получаем данные первого активного пользователя и его посты...');
        if (activeUsers.length > 0) {
            const firstUserWithPosts = await getUserWithPosts(activeUsers[0].id);
            console.log(`Пользователь: ${firstUserWithPosts.name}`);
            console.log(`Количество постов: ${firstUserWithPosts.posts.length}`);
            console.log(`Последний пост: "${firstUserWithPosts.posts[0]?.title}"`);
        } else {
            console.log('Активные пользователи не найдены для демонстрации.');
        }

        await simulateLoading(500);

        // 4. Демонстрация параллельных операций с помощью Promise.all
        console.log('\n4. Параллельная загрузка последних постов и статистики...');
        const [recentPosts, stats] = await Promise.all([
            getRecentPosts(3),
            getPostsStats()
        ]);
        console.log('Последние 3 поста:', recentPosts.map(p => p.title));
        console.log('Статистика:', stats);

        await simulateLoading(500);

        // 5. Поиск постов
        console.log('\n5. Поиск постов по заголовку "aut"...');
        const foundPosts = await getPostsByTitleSearch('aut');
        console.log(`Найдено постов: ${foundPosts.length}`);

        // 6. Демонстрация withTimeout и retry
        console.log('\n6. Демонстрация withTimeout...');
        try {

            const slowFetch = fetch('https://jsonplaceholder.typicode.com/users?delay=2000'); // Этот параметр delay не сработает, это просто пример
            const result = await withTimeout(slowFetch, 1000); // Даем всего 1 секунду
            console.log('Запрос выполнен в срок!');
        } catch (timeoutError) {
            console.error('Таймаут:', timeoutError.message);
        }

    } catch (error) {
        console.error('\n!!! КРИТИЧЕСКАЯ ОШИБКА В ПРОЦЕССЕ ВЫПОЛНЕНИЯ:', error.message);
    } finally {
        console.log('\n=== ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА ===');
    }
}

main();
