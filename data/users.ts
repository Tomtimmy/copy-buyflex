import { User } from '../types';

export const usersData: User[] = [
  { id: 0, name: 'Super Admin', email: 'super@buyflex.com', role: 'SuperAdmin', status: 'Active', registeredAt: '2023-01-01' },
  { id: 1, name: 'Admin User', email: 'admin@buyflex.com', role: 'Admin', status: 'Active', registeredAt: '2023-01-15' },
  { 
    id: 101, 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: 'Customer', 
    status: 'Active', 
    registeredAt: '2023-03-20',
    address: {
        fullName: 'Alice Johnson',
        street: '123 Wonder Lane',
        city: 'Themyscira',
        state: 'DC',
        zip: '12345',
        country: 'USA',
        phone: '555-0101'
    } 
  },
  { id: 102, name: 'Bob Smith', email: 'bob@example.com', role: 'Customer', status: 'Active', registeredAt: '2023-04-11' },
  { id: 103, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Customer', status: 'Pending Setup', registeredAt: '2023-05-01' },
  { id: 104, name: 'Diana Prince', email: 'diana@example.com', role: 'Customer', status: 'Inactive', registeredAt: '2023-02-25' },
];