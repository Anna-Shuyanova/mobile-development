// utils/reviewData.js
export const sampleReviews = [
  {
    id: '1',
    doctorId: '1',
    userId: 'user1',
    userName: 'Анна Иванова',
    rating: 5,
    comment: 'Очень профессиональный врач, внимательно выслушал все жалобы и назначил эффективное лечение. Рекомендую! Очень профессиональный врач, внимательно выслушал все жалобы и назначил эффективное лечение.',
    date: '2024-01-15',
    visitDate: '2024-01-10',
    likes: 12,
    dislikes: 2,
    isVerified: true,
    helpful: 8
  },
  {
    id: '2',
    doctorId: '1',
    userId: 'user2',
    userName: 'Петр Сидоров',
    rating: 4,
    comment: 'Хороший специалист, но приём начался с задержкой в 15 минут. В остальном всё понравилось.',
    date: '2024-01-12',
    visitDate: '2024-01-08',
    likes: 8,
    dislikes: 1,
    isVerified: true,
    helpful: 5
  },
  {
    id: '3',
    doctorId: '1',
    userId: 'user3',
    userName: 'Мария Козлова',
    rating: 5,
    comment: 'Лучший кардиолог в городе! Очень грамотный подход, современные методы диагностики.',
    date: '2024-01-10',
    visitDate: '2024-01-05',
    likes: 15,
    dislikes: 0,
    isVerified: true,
    helpful: 12
  },
  {
    id: '4',
    doctorId: '1',
    userId: 'user4',
    userName: 'Сергей Петров',
    rating: 3,
    comment: 'Врач хороший, но очень дорого. Качество услуг соответствует цене, но не всем по карману.',
    date: '2024-01-08',
    visitDate: '2024-01-03',
    likes: 4,
    dislikes: 3,
    isVerified: false,
    helpful: 2
  },
  {
    id: '5',
    doctorId: '1',
    userId: 'user5',
    userName: 'Ольга Смирнова',
    rating: 5,
    comment: 'Обратилась с проблемой давления, врач подобрал идеальное лечение. Очень благодарна!',
    date: '2024-01-05',
    visitDate: '2024-01-02',
    likes: 10,
    dislikes: 1,
    isVerified: true,
    helpful: 7
  },
  {
    id: '6',
    doctorId: '2',
    userId: 'user6',
    userName: 'Дмитрий Волков',
    rating: 4,
    comment: 'Компетентный невролог, помог справиться с мигренями. Рекомендую.',
    date: '2024-01-14',
    visitDate: '2024-01-09',
    likes: 6,
    dislikes: 0,
    isVerified: true,
    helpful: 4
  },
  // ... больше отзывов для других врачей
];

// Функция для получения отзывов с пагинацией
export const getReviewsByDoctorId = (doctorId, page = 1, limit = 5, sortBy = 'date') => {
  let filtered = sampleReviews.filter(review => review.doctorId === doctorId);
  
  // Сортировка
  switch (sortBy) {
    case 'date':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'relevant':
      filtered.sort((a, b) => {
        const scoreA = (a.helpful || 0) + (a.likes || 0) - (a.dislikes || 0);
        const scoreB = (b.helpful || 0) + (b.likes || 0) - (b.dislikes || 0);
        return scoreB - scoreA;
      });
      break;
    case 'helpful':
      filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
      break;
  }
  
  const startIndex = (page - 1) * limit;
  const paginatedReviews = filtered.slice(startIndex, startIndex + limit);
  
  return {
    reviews: paginatedReviews,
    total: filtered.length,
    hasMore: startIndex + limit < filtered.length,
    currentPage: page,
    totalPages: Math.ceil(filtered.length / limit)
  };
};

// Расчет рейтинга врача
export const calculateDoctorRating = (doctorId) => {
  const doctorReviews = sampleReviews.filter(review => review.doctorId === doctorId);
  if (doctorReviews.length === 0) return 0;
  
  const totalRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / doctorReviews.length).toFixed(1);
};

// Получение распределения оценок
export const getRatingDistribution = (doctorId) => {
  const doctorReviews = sampleReviews.filter(review => review.doctorId === doctorId);
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  doctorReviews.forEach(review => {
    distribution[review.rating]++;
  });
  
  return distribution;
};

// Получение общего количества отзывов
export const getTotalReviewsCount = (doctorId) => {
  return sampleReviews.filter(review => review.doctorId === doctorId).length;
};