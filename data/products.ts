import { Product } from '../types';
import { reviewsData } from './reviews';

// Helper to calculate average rating from approved reviews
const calculateAverageRating = (productId: number) => {
  const productReviews = reviewsData.filter(r => r.productId === productId && r.status === 'Approved');
  if (productReviews.length === 0) return 0;
  const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / productReviews.length).toFixed(1));
};

export const productsData: Product[] = [
  {
    id: 1,
    name: 'FreePods Pro',
    category: 'Earbuds',
    price: 89.99,
    imageUrl: 'https://picsum.photos/seed/freepods/400/400',
    description: 'Active Noise Cancellation earbuds with immersive sound and a comfortable fit.',
    rating: calculateAverageRating(1),
    reviews: reviewsData.filter(r => r.productId === 1),
    stock: 150,
    manufacturingDate: '2023-08-15',
  },
  {
    id: 2,
    name: 'Powerank 20K',
    category: 'Power Banks',
    price: 45.50,
    imageUrl: 'https://picsum.photos/seed/powerbank/400/400',
    description: 'A massive 20,000mAh power bank with fast charging capabilities to keep all your devices running.',
    rating: calculateAverageRating(2),
    reviews: reviewsData.filter(r => r.productId === 2),
    stock: 300,
    manufacturingDate: '2023-09-01',
  },
  {
    id: 3,
    name: 'WatchFit 2',
    category: 'Smart Watches',
    price: 120.00,
    imageUrl: 'https://picsum.photos/seed/watchfit/400/400',
    description: 'A sleek smartwatch with health tracking, GPS, and a vibrant AMOLED display.',
    rating: calculateAverageRating(3),
    reviews: reviewsData.filter(r => r.productId === 3),
    stock: 80,
    manufacturingDate: '2023-07-20',
  },
  {
    id: 4,
    name: 'BoomBass Speaker',
    category: 'Speakers',
    price: 65.99,
    imageUrl: 'https://picsum.photos/seed/speaker/400/400',
    description: 'Portable waterproof bluetooth speaker with deep bass and a 24-hour battery life.',
    rating: calculateAverageRating(4),
    reviews: reviewsData.filter(r => r.productId === 4),
    stock: 120,
    manufacturingDate: '2023-10-05',
  },
  {
    id: 5,
    name: 'ChargeFast Trio',
    category: 'Chargers',
    price: 39.99,
    imageUrl: 'https://picsum.photos/seed/charger/400/400',
    description: 'A 3-in-1 wireless charging station for your phone, watch, and earbuds.',
    rating: calculateAverageRating(5),
    reviews: reviewsData.filter(r => r.productId === 5),
    stock: 250,
    manufacturingDate: '2023-09-22',
  },
  {
    id: 6,
    name: 'Aero Headset',
    category: 'Headphones',
    price: 150.75,
    imageUrl: 'https://picsum.photos/seed/headset/400/400',
    description: 'Over-ear headphones with studio-quality audio and supreme comfort for long listening sessions.',
    rating: calculateAverageRating(6),
    reviews: reviewsData.filter(r => r.productId === 6),
    stock: 65,
    manufacturingDate: '2023-06-10',
  },
  {
    id: 7,
    name: 'CableWrap Kit',
    category: 'Accessories',
    price: 15.00,
    imageUrl: 'https://picsum.photos/seed/cablekit/400/400',
    description: 'A complete set of magnetic cable organizers to keep your desk tidy.',
    rating: calculateAverageRating(7),
    reviews: reviewsData.filter(r => r.productId === 7),
    stock: 500,
    manufacturingDate: '2023-11-01',
  },
  {
    id: 8,
    name: 'DriveMount Pro',
    category: 'Accessories',
    price: 25.00,
    imageUrl: 'https://picsum.photos/seed/carmount/400/400',
    description: 'A sturdy and reliable car mount for your phone with quick-release mechanism.',
    rating: calculateAverageRating(8),
    reviews: reviewsData.filter(r => r.productId === 8),
    stock: 400,
    manufacturingDate: '2023-10-15',
  },
];