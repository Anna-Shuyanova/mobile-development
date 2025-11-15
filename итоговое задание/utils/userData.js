// utils/userData.js
export const currentUser = {
  id: 'currentUser',
  email: 'user@example.com',
  name: 'Иван Иванов',
  phone: '+7 (999) 123-45-67',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  registrationDate: '2024-01-01',
  reviewsCount: 8,
  averageRating: 4.5,
};

export const userReviews = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Иванов Алексей Петрович',
    doctorSpecialty: 'Кардиолог',
    rating: 5,
    comment: 'Очень профессиональный врач, внимательно выслушал все жалобы и назначил эффективное лечение.',
    date: '2024-01-15',
    visitDate: '2024-01-10',
    likes: 12,
    dislikes: 2,
    isVerified: true,
    helpful: 8
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Петрова Мария Владимировна',
    doctorSpecialty: 'Невролог',
    rating: 4,
    comment: 'Хороший специалист, помог справиться с мигренями. Рекомендую.',
    date: '2024-01-12',
    visitDate: '2024-01-08',
    likes: 8,
    dislikes: 1,
    isVerified: true,
    helpful: 5
  },
  // ... больше отзывов
];

export const updateUserProfile = (updatedData) => {
  Object.assign(currentUser, updatedData);
  return currentUser;
};

export const getUserReviews = (userId) => {
  return userReviews.filter(review => review.userId === userId);
};

export const deleteUserReview = (reviewId) => {
  const index = userReviews.findIndex(review => review.id === reviewId);
  if (index !== -1) {
    userReviews.splice(index, 1);
  }
};