
import React, { useState, useMemo, useCallback } from 'react';
import { Product, Order, User, Review, ContactMessage, MeetingRequest, WarrantyClaim, MessageStatus } from '../types';
import { ProductForm } from './ProductForm';
import { Modal } from './Modal';
import { Pagination } from './Pagination';

// A generic table component for reusability
const Table: React.FC<{ columns: string[], data: any[], renderRow: (item: any, index: number) => JSX.Element }> = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map(col => (
              <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

// Individual View Components
export const DashboardView: React.FC<{ products: Product[], orders: Order[], users: User[] }> = ({ products, orders, users }) => {
  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Processing').length;
  const newUsers = users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
  const lowStockItems = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-green-400' },
    { label: 'Pending Orders', value: pendingOrders, color: 'text-yellow-400' },
    { label: 'New Users (Last 30d)', value: newUsers, color: 'text-blue-400' },
    { label: 'Low Stock Items', value: lowStockItems, color: 'text-red-400' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-gray-800 p-6 rounded-lg">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductsView: React.FC<{ products: Product[], onAddProduct: (p: any) => void, onUpdateProduct: (p: any) => void, onDeleteProduct: (id: number) => void }> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (productData: Omit<Product, 'id' | 'reviews' | 'rating'> | Product) => {
    if ('id' in productData) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    handleCloseModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button onClick={() => handleOpenModal()} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Add Product</button>
      </div>
      <Table
        columns={['Name', 'Category', 'Price', 'Stock', 'Actions']}
        data={products}
        renderRow={(product, index) => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{product.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button onClick={() => handleOpenModal(product)} className="text-blue-400 hover:text-blue-300">Edit</button>
              <button onClick={() => onDeleteProduct(product.id)} className="text-red-400 hover:text-red-300">Delete</button>
            </td>
          </tr>
        )}
      />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <ProductForm product={editingProduct} onSubmit={handleSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};

export const OrdersView: React.FC<{ orders: Order[], onUpdateOrderStatus: (orderId: string, status: Order['status']) => void }> = ({ orders, onUpdateOrderStatus }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
        <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
        <Table
            columns={['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions']}
            data={paginatedOrders}
            renderRow={(order) => (
                <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         <select 
                            value={order.status} 
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                        >
                            <option>Processing</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                    </td>
                </tr>
            )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};


export const UsersView: React.FC<{ users: User[], onUpdateUserRole: (userId: number, role: User['role']) => void }> = ({ users, onUpdateUserRole }) => {
  return (
    <div>
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
        <Table
            columns={['Name', 'Email', 'Role', 'Actions']}
            data={users}
            renderRow={(user) => (
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                            value={user.role}
                            onChange={(e) => onUpdateUserRole(user.id, e.target.value as User['role'])}
                            className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white text-xs"
                            disabled={user.role === 'SuperAdmin'}
                        >
                            <option>Customer</option>
                            <option>Admin</option>
                        </select>
                    </td>
                </tr>
            )}
        />
    </div>
  );
};

export const InboxView: React.FC<{ messages: ContactMessage[], onUpdateStatus: (id: number, status: MessageStatus) => void }> = ({ messages, onUpdateStatus }) => {
    // ... Implementation for Inbox view
    return <div>Inbox View Content</div>;
};
