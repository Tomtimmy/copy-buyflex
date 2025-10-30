import { Order } from '../types';
import { productsData } from './products';
import { usersData } from './users';

const defaultAddress = {
    fullName: 'Mock User',
    street: '123 Mockingbird Lane',
    city: 'Faketown',
    state: 'CA',
    zip: '90210',
    country: 'USA',
    phone: '555-555-5555'
};

export const ordersData: Order[] = [
  {
    id: 'BFX-001',
    customerId: 101,
    customerName: usersData.find(u => u.id === 101)?.name || 'Unknown',
    date: '2023-10-28',
    status: 'Delivered',
    items: [
      { product: productsData[0], quantity: 1 },
      { product: productsData[5], quantity: 2 },
    ],
    total: productsData[0].price * 1 + productsData[5].price * 2,
    shippingAddress: usersData.find(u => u.id === 101)?.address || defaultAddress,
    carrier: { name: 'FedEx', trackingUrl: 'https://www.fedex.com/apps/fedextrack/?tracknumbers=' },
    trackingNumber: 'FX123456789',
    estimatedDelivery: '2023-10-31',
  },
  {
    id: 'BFX-002',
    customerId: 102,
    customerName: usersData.find(u => u.id === 102)?.name || 'Unknown',
    date: '2023-10-29',
    status: 'Shipped',
    items: [
      { product: productsData[2], quantity: 1 },
    ],
    total: productsData[2].price * 1,
    shippingAddress: usersData.find(u => u.id === 102)?.address || defaultAddress,
    carrier: { name: 'UPS', trackingUrl: 'https://www.ups.com/track?tracknum=' },
    trackingNumber: 'UPS987654321',
    estimatedDelivery: '2023-11-02',
  },
  {
    id: 'BFX-003',
    customerId: 101,
    customerName: usersData.find(u => u.id === 101)?.name || 'Unknown',
    date: '2023-10-30',
    status: 'Processing',
    items: [
      { product: productsData[3], quantity: 1 },
      { product: productsData[6], quantity: 1 },
    ],
    total: productsData[3].price * 1 + productsData[6].price * 1,
    shippingAddress: usersData.find(u => u.id === 101)?.address || defaultAddress,
    estimatedDelivery: '2023-11-05',
  },
  {
    id: 'BFX-004',
    customerId: 103,
    customerName: usersData.find(u => u.id === 103)?.name || 'Unknown',
    date: '2023-10-25',
    status: 'Cancelled',
    items: [
      { product: productsData[7], quantity: 1 },
    ],
    total: productsData[7].price * 1,
    shippingAddress: usersData.find(u => u.id === 103)?.address || defaultAddress,
  },
];