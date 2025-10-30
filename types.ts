import { ReactNode } from "react";

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
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
  whatsapp?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'Customer';
  status: 'Active' | 'Pending Setup' | 'Inactive';
  registeredAt: string;
  address?: Address;
}

export interface FilterState {
  category: string;
  price: number;
  rating: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  date: string;
  status: OrderStatus;
  items: {
    product: Product;
    quantity: number;
  }[];
  total: number;
  shippingAddress: Address;
  carrier?: {
      name: string;
      trackingUrl: string; // URL with a placeholder for the tracking number, e.g., 'https://carrier.com/track?id='
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'Unread' | 'Read' | 'Archived';
}

export interface MeetingRequest {
    id: number;
    name:string;
    email: string;
    date: string;
    time: string;
    topic: string;
    status: 'Pending' | 'Accepted' | 'Declined';
}

export interface WarrantyClaim {
  id: number;
  productName: string;
  purchaseDate: string;
  issueDescription: string;
  fileName?: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Rejected';
}