
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type ReviewStatus = 'Approved' | 'Pending' | 'Rejected';
export type UserRole = 'Customer' | 'Admin' | 'SuperAdmin';
export type MessageStatus = 'New' | 'Read' | 'Archived';
export type MeetingStatus = 'Pending' | 'Confirmed' | 'Completed';
export type ClaimStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  reviews: Review[];
  stock: number;
  manufacturingDate: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  address?: Address;
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  carrier?: { name: string; trackingUrl: string };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface FilterState {
  category: string;
  price: number;
  rating: number;
}

export interface MeetingRequest {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  status: MeetingStatus;
}

export interface WarrantyClaim {
  id: number;
  productName: string;
  purchaseDate: string;
  issueDescription: string;
  fileName?: string;
  status: ClaimStatus;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
}
