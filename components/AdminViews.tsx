import React, { useState, Fragment, useMemo, useEffect } from 'react';
import { Product, Order, User, OrderStatus, Review, ContactMessage, MeetingRequest } from '../types';
import { Modal } from './Modal';
import { ProductForm } from './ProductForm';
import { Pagination } from './Pagination';

// =================================================================
// Admin Overview Component
// =================================================================
interface AdminOverviewProps {
  products: Product[];
  orders: Order[];
  users: User[];
}
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300">
        <div className="bg-gray-700 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export const AdminOverview: React.FC<AdminOverviewProps> = ({ products, orders, users }) => {
    const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((sum, order) => sum + order.total, 0);
    const newOrders = orders.filter(o => o.status === 'Processing').length;
    const pendingReviews = products.flatMap(p => p.reviews).filter(r => r.status === 'Pending').length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<span className="text-green-400 text-2xl">$</span>} />
                <StatCard title="New Orders" value={newOrders.toString()} icon={<span className="text-blue-400 text-2xl">📦</span>} />
                <StatCard title="Pending Reviews" value={pendingReviews.toString()} icon={<span className="text-yellow-400 text-2xl">⭐</span>} />
                <StatCard title="Total Products" value={products.length.toString()} icon={<span className="text-purple-400 text-2xl">🛍️</span>} />
                <StatCard title="Registered Users" value={users.length.toString()} icon={<span className="text-indigo-400 text-2xl">👥</span>} />
            </div>
        </div>
    );
};


// =================================================================
// Admin Products Component
// =================================================================
interface AdminProductsProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'reviews' | 'rating'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateReviewStatus: (reviewId: number, productId: number, status: Review['status']) => void;
}
type ProductsView = 'productList' | 'reviewList';
type ReviewStatusFilter = 'All' | Review['status'];

const reviewStatusColors: Record<Review['status'], string> = {
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Approved: 'bg-green-500/20 text-green-300',
    Rejected: 'bg-red-500/20 text-red-300',
};

const AdminReviews: React.FC<{ products: Product[]; onUpdateReviewStatus: AdminProductsProps['onUpdateReviewStatus']}> = ({ products, onUpdateReviewStatus }) => {
    const allReviews = useMemo(() => products.flatMap(p => p.reviews.map(r => ({...r, productName: p.name }))), [products]);
    const [reviewFilter, setReviewFilter] = useState<ReviewStatusFilter>('Pending');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredReviews = useMemo(() => 
        allReviews.filter(r => reviewFilter === 'All' || r.status === reviewFilter)
    , [allReviews, reviewFilter]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [reviewFilter]);

    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredReviews, currentPage]);

    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Manage Reviews</h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="reviewFilter" className="text-sm text-gray-400">Filter by status:</label>
                    <select id="reviewFilter" value={reviewFilter} onChange={e => setReviewFilter(e.target.value as ReviewStatusFilter)} className="bg-gray-700 border border-gray-600 rounded-md text-xs py-1 px-2 text-white focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-900 text-xs text-green-400 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="p-4">Product</th>
                                <th scope="col" className="p-4">Author & Rating</th>
                                <th scope="col" className="p-4">Comment</th>
                                <th scope="col" className="p-4">Status</th>
                                <th scope="col" className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedReviews.length > 0 ? paginatedReviews.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-700/50">
                                    <td className="p-4 font-medium text-white">{review.productName}</td>
                                    <td className="p-4">{review.author} ({review.rating} ★)</td>
                                    <td className="p-4 italic">"{review.comment}"</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${reviewStatusColors[review.status]}`}>
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        {review.status !== 'Approved' && (
                                            <button onClick={() => onUpdateReviewStatus(review.id, review.productId, 'Approved')} className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition-colors text-xs">Approve</button>
                                        )}
                                        {review.status !== 'Rejected' && (
                                            <button onClick={() => onUpdateReviewStatus(review.id, review.productId, 'Rejected')} className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-xs">Reject</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-500">No reviews match the selected filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateReviewStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentProductsView, setCurrentProductsView] = useState<ProductsView>('productList');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        onDeleteProduct(productId);
    }
  };

  const handleFormSubmit = (productData: Omit<Product, 'id' | 'reviews' | 'rating'> | Product) => {
    if ('id' in productData) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    handleCloseModal();
  };
  
  const pendingReviewsCount = products.flatMap(p => p.reviews).filter(r => r.status === 'Pending').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-gray-700 p-1 rounded-lg">
                <button onClick={() => setCurrentProductsView('productList')} className={`px-3 py-1 text-sm rounded-md ${currentProductsView === 'productList' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>Products</button>
                <button onClick={() => setCurrentProductsView('reviewList')} className={`px-3 py-1 text-sm rounded-md relative ${currentProductsView === 'reviewList' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>
                    Reviews
                    {pendingReviewsCount > 0 && (
                        <span className="absolute -top-2 -right-2 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{pendingReviewsCount}</span>
                    )}
                </button>
            </div>
            <button onClick={handleOpenAddModal} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                + Add Product
            </button>
        </div>
      </div>
      {currentProductsView === 'productList' ? (
        <>
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900 text-xs text-green-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="p-4">Product Name</th>
                  <th scope="col" className="p-4">Category</th>
                  <th scope="col" className="p-4">Price</th>
                  <th scope="col" className="p-4">Stock</th>
                  <th scope="col" className="p-4">Rating</th>
                  <th scope="col" className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-700/50">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                      {product.name}
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 font-mono">${product.price.toFixed(2)}</td>
                    <td className="p-4 font-mono">
                        {product.stock}
                        {product.stock < 10 && (
                            <span className="ml-2 text-xs font-bold text-red-400 bg-red-900/50 px-2 py-0.5 rounded-full">LOW</span>
                        )}
                    </td>
                    <td className="p-4">{product.rating.toFixed(1)} ★</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEditModal(product)} className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      ) : (
          <AdminReviews products={products} onUpdateReviewStatus={onUpdateReviewStatus} />
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
      </Modal>
    </div>
  );
};


// =================================================================
// Admin Orders Component
// =================================================================
interface AdminOrdersProps {
    orders: Order[];
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusColors: Record<OrderStatus, string> = {
    Processing: 'bg-blue-500/20 text-blue-300',
    Shipped: 'bg-yellow-500/20 text-yellow-300',
    Delivered: 'bg-green-500/20 text-green-300',
    Cancelled: 'bg-red-500/20 text-red-300',
};

const OrderRow: React.FC<{ order: Order, onUpdateStatus: AdminOrdersProps['onUpdateStatus'] }> = ({ order, onUpdateStatus }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Fragment>
            <tr className="hover:bg-gray-700/50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="p-4 font-medium text-white font-mono">{order.id}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4 font-mono">${order.total.toFixed(2)}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                    </span>
                </td>
                <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                  <select 
                    value={order.status} 
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-gray-700 border border-gray-600 rounded-md text-xs py-1 px-2 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-gray-900/50">
                    <td colSpan={6} className="p-4">
                        <div className="space-y-2">
                            <h4 className="font-bold text-green-400">Order Items:</h4>
                            {order.items.map(({ product, quantity }) => (
                                <div key={product.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                        <span>{product.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p>{quantity} x ${product.price.toFixed(2)}</p>
                                        <p className="font-bold text-white">${(quantity * product.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    );
};


export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateStatus }) => {
    const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
    const [customerSearch, setCustomerSearch] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => statusFilter === 'All' || order.status === statusFilter)
            .filter(order => order.customerName.toLowerCase().includes(customerSearch.toLowerCase()))
            .filter(order => {
                if (!dateRange.start || !dateRange.end) return true;
                const orderDate = new Date(order.date);
                return orderDate >= new Date(dateRange.start) && orderDate <= new Date(dateRange.end);
            });
    }, [orders, statusFilter, customerSearch, dateRange]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, customerSearch, dateRange]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Manage Orders</h1>
            <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap items-center gap-4">
                <div className="flex-grow">
                    <label htmlFor="customerSearch" className="text-sm text-gray-400">Search Customer</label>
                    <input id="customerSearch" type="text" value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="Enter name..." className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm" />
                </div>
                <div>
                    <label htmlFor="statusFilter" className="text-sm text-gray-400">Status</label>
                    <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm">
                        <option value="All">All Statuses</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="startDate" className="text-sm text-gray-400">Start Date</label>
                    <input id="startDate" type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value }))} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm" />
                </div>
                <div>
                    <label htmlFor="endDate" className="text-sm text-gray-400">End Date</label>
                    <input id="endDate" type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value }))} className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm" />
                </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-900 text-xs text-green-400 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="p-4">Order ID</th>
                                <th scope="col" className="p-4">Customer</th>
                                <th scope="col" className="p-4">Date</th>
                                <th scope="col" className="p-4">Total</th>
                                <th scope="col" className="p-4">Status</th>
                                <th scope="col" className="p-4 text-center">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedOrders.map((order) => (
                               <OrderRow key={order.id} order={order} onUpdateStatus={onUpdateStatus} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};


// =================================================================
// Admin Users Component
// =================================================================
interface AdminUsersProps {
    users: User[];
    currentUser: User;
    onUpdateUserRole: (userId: number, role: 'Admin' | 'Customer') => void;
    onAddAdmin: (newAdmin: Omit<User, 'id' | 'status' | 'registeredAt'>) => void;
}

const userStatusColors: Record<User['status'], string> = {
    Active: 'bg-green-500/20 text-green-300',
    'Pending Setup': 'bg-yellow-500/20 text-yellow-300',
    Inactive: 'bg-gray-500/20 text-gray-300',
};

const AddAdminForm: React.FC<{ onAdd: AdminUsersProps['onAddAdmin']; onCancel: () => void }> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && email) {
            onAdd({ name, email, role: 'Admin' });
        }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
          <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
          <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500" />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onCancel} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
          <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Create Admin</button>
        </div>
      </form>
    );
};

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, currentUser, onUpdateUserRole, onAddAdmin }) => {
    const [isAddAdminModalOpen, setAddAdminModalOpen] = useState(false);
    const [userFilter, setUserFilter] = useState<'All' | 'Pending Setup'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    
    const handleAddAdminSubmit = (newAdmin: Omit<User, 'id' | 'status' | 'registeredAt'>) => {
        onAddAdmin(newAdmin);
        setAddAdminModalOpen(false);
    };

    const filteredUsers = useMemo(() => 
        users.filter(u => userFilter === 'All' || u.status === 'Pending Setup')
    , [users, userFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [userFilter]);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Users</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-1 bg-gray-700 p-1 rounded-lg">
                        <button onClick={() => setUserFilter('All')} className={`px-3 py-1 text-sm rounded-md ${userFilter === 'All' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>All Users</button>
                        <button onClick={() => setUserFilter('Pending Setup')} className={`px-3 py-1 text-sm rounded-md ${userFilter === 'Pending Setup' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>Pending Setup</button>
                    </div>
                    {currentUser.role === 'SuperAdmin' && (
                        <button onClick={() => setAddAdminModalOpen(true)} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                            + Create New Admin
                        </button>
                    )}
                </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-900 text-xs text-green-400 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="p-4">User Name</th>
                                <th scope="col" className="p-4">Email</th>
                                <th scope="col" className="p-4">Role</th>
                                <th scope="col" className="p-4">Status</th>
                                <th scope="col" className="p-4">Registered</th>
                                <th scope="col" className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-700/50">
                                    <td className="p-4 font-medium text-white">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 font-semibold">{user.role}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${userStatusColors[user.status]}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{user.registeredAt}</td>
                                    <td className="p-4 text-center">
                                        {(currentUser.role === 'SuperAdmin' && user.id !== currentUser.id && user.role !== 'SuperAdmin') && (
                                            <select 
                                                value={user.role} 
                                                onChange={(e) => onUpdateUserRole(user.id, e.target.value as 'Admin' | 'Customer')}
                                                className="bg-gray-700 border border-gray-600 rounded-md text-xs py-1 px-2 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value="Customer">Customer</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
             <Modal isOpen={isAddAdminModalOpen} onClose={() => setAddAdminModalOpen(false)} title="Create New Admin">
                <AddAdminForm onAdd={handleAddAdminSubmit} onCancel={() => setAddAdminModalOpen(false)} />
            </Modal>
        </div>
    );
};

// =================================================================
// Admin Messages Component
// =================================================================
interface AdminMessagesProps {
    messages: ContactMessage[];
    onUpdateStatus: (messageId: number, status: ContactMessage['status']) => void;
}
const messageStatusColors: Record<ContactMessage['status'], string> = {
    Unread: 'border-l-4 border-green-500',
    Read: 'border-l-4 border-gray-600',
    Archived: 'border-l-4 border-gray-800 opacity-60',
};

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onUpdateStatus }) => {
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const displayedMessages = useMemo(() => {
        return messages
            .filter(msg => 
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [messages, searchTerm, sortOrder]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sortOrder, searchTerm]);

    const paginatedMessages = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return displayedMessages.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [displayedMessages, currentPage]);

    const totalPages = Math.ceil(displayedMessages.length / ITEMS_PER_PAGE);

    const handleArchiveConfirm = (messageId: number) => {
        if (window.confirm('Are you sure you want to archive this message?')) {
            onUpdateStatus(messageId, 'Archived');
            if (selectedMessage?.id === messageId) {
                setSelectedMessage(null); 
            }
        }
    };
    
    const handleArchiveAllRead = () => {
        const readMessages = messages.filter(msg => msg.status === 'Read');
        if (readMessages.length === 0) {
            alert('No read messages to archive.');
            return;
        }
        if (window.confirm(`Are you sure you want to archive all ${readMessages.length} read messages?`)) {
            readMessages.forEach(msg => {
                onUpdateStatus(msg.id, 'Archived');
            });
            setSelectedMessage(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
                <div className="flex items-center gap-2">
                    <button onClick={handleArchiveAllRead} className="bg-gray-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-xs">Archive All Read</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gray-800 rounded-lg shadow-lg p-4 h-[600px] flex flex-col">
                    <div className="space-y-2 border-b border-gray-700 mb-2 pb-2">
                        <input 
                            type="text" 
                            placeholder="Search name or subject..." 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                        />
                        <select 
                            value={sortOrder} 
                            onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <ul className="space-y-2">
                            {paginatedMessages.length > 0 ? paginatedMessages.map(msg => (
                                <li key={msg.id} onClick={() => { setSelectedMessage(msg); if(msg.status === 'Unread') onUpdateStatus(msg.id, 'Read'); }} className={`p-3 rounded-md cursor-pointer transition-colors ${messageStatusColors[msg.status]} ${selectedMessage?.id === msg.id ? 'bg-gray-700' : 'bg-gray-900 hover:bg-gray-700/50'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-white text-sm truncate">{msg.name}</p>
                                                <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{msg.date}</p>
                                            </div>
                                            <p className="text-sm text-gray-300 truncate font-medium">{msg.subject}</p>
                                        </div>
                                        {msg.status === 'Unread' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onUpdateStatus(msg.id, 'Read'); }} 
                                                className="ml-2 flex-shrink-0 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md transition-colors"
                                                title="Mark as Read"
                                            >
                                                ✔️
                                            </button>
                                        )}
                                    </div>
                                </li>
                            )) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No messages found.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                     <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
                <div className="md:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
                    {selectedMessage ? (
                        <div>
                            <div className="pb-4 border-b border-gray-700">
                                <h2 className="text-2xl font-bold text-white">{selectedMessage.subject}</h2>
                                <p className="text-sm text-gray-400">From: <span className="text-green-400">{selectedMessage.name}</span> ({selectedMessage.email})</p>
                                <p className="text-xs text-gray-500">Received: {selectedMessage.date}</p>
                            </div>
                            <div className="mt-4 text-gray-300 whitespace-pre-wrap h-[400px] overflow-y-auto">
                                {selectedMessage.message}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-2">
                                {selectedMessage.status !== 'Unread' && (
                                    <button onClick={() => onUpdateStatus(selectedMessage.id, 'Unread')} className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs">Mark as Unread</button>
                                )}
                                {selectedMessage.status !== 'Archived' && (
                                    <button onClick={() => handleArchiveConfirm(selectedMessage.id)} className="bg-gray-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-gray-700 transition-colors text-xs">Archive</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Select a message to read.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// =================================================================
// Admin Bookings Component
// =================================================================
interface AdminBookingsProps {
    requests: MeetingRequest[];
    onUpdateStatus: (bookingId: number, status: MeetingRequest['status']) => void;
}
const bookingStatusColors: Record<MeetingRequest['status'], string> = {
    Pending: 'bg-yellow-500/20 text-yellow-300',
    Accepted: 'bg-green-500/20 text-green-300',
    Declined: 'bg-red-500/20 text-red-300',
};

export const AdminBookings: React.FC<AdminBookingsProps> = ({ requests, onUpdateStatus }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const paginatedRequests = useMemo(() => {
        const sortedRequests = [...requests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [requests, currentPage]);

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Meeting Bookings</h1>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-300">
                        <thead className="bg-gray-900 text-xs text-green-400 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="p-4">Requester</th>
                                <th scope="col" className="p-4">Topic</th>
                                <th scope="col" className="p-4">Date & Time</th>
                                <th scope="col" className="p-4">Status</th>
                                <th scope="col" className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {paginatedRequests.length > 0 ? paginatedRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-700/50">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{req.name}</p>
                                        <p className="text-xs text-gray-400">{req.email}</p>
                                    </td>
                                    <td className="p-4">{req.topic}</td>
                                    <td className="p-4">{req.date} at {req.time}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bookingStatusColors[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                        {req.status !== 'Accepted' && (
                                            <button onClick={() => onUpdateStatus(req.id, 'Accepted')} className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition-colors text-xs">Accept</button>
                                        )}
                                        {req.status !== 'Declined' && (
                                            <button onClick={() => onUpdateStatus(req.id, 'Declined')} className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition-colors text-xs">Decline</button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-gray-500">No booking requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
};