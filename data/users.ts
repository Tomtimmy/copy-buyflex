
import { User } from '../types';

export const usersData: User[] = [
  {
    id: 101,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'Customer',
    address: {
      fullName: 'Alice Johnson',
      street: '123 Maple St',
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'USA',
      phone: '555-0101',
    },
    createdAt: '2023-01-15',
  },
  {
    id: 102,
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    role: 'Customer',
    address: {
      fullName: 'Bob Smith',
      street: '456 Oak Ave',
      city: 'Metropolis',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone: '555-0102',
    },
    createdAt: '2023-02-20',
  },
  {
    id: 103,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
    role: 'Customer',
    createdAt: '2023-03-10',
  },
  {
    id: 201,
    name: 'Admin User',
    email: 'admin@buyflex.com',
    password: 'admin123',
    role: 'Admin',
    createdAt: '2023-01-01',
  },
  {
    id: 202,
    name: 'Super Admin',
    email: 'super@buyflex.com',
    password: 'super123',
    role: 'SuperAdmin',
    createdAt: '2023-01-01',
  },
];
