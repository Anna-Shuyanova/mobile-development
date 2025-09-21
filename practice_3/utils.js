// 1. simulateLoading - имитация загрузки данных (асинхронная)
export function simulateLoading(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Загрузка завершена (${delay}ms)`);
      resolve();
    }, delay);
  });
}

// 2. withTimeout - выполнение операции с таймаутом (асинхронная)
export async function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Операция превысила таймаут ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// 3. retryOperation - повторение операции при ошибке (асинхронная)
export async function retryOperation(operation, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Попытка ${attempt} не удалась:`, error.message);
      
      if (attempt === maxRetries) break;
      
      const delay = 1000 * Math.pow(2, attempt - 1);
      console.log(`Следующая попытка через ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
