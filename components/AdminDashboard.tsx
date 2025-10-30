import React, { useState } from 'react';
import { Product, Order, User, OrderStatus, Review, ContactMessage, MeetingRequest } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { ProductsIcon } from './icons/ProductsIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { InboxIcon } from './icons/InboxIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { AdminOverview, AdminProducts, AdminOrders, AdminUsers, AdminMessages, AdminBookings } from './AdminViews';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  users: User[];
  contactMessages: ContactMessage[];
  meetingRequests: MeetingRequest[];
  currentUser: User;
  onAddProduct: (product: Omit<Product, 'id' | 'reviews' | 'rating'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateUserRole: (userId: number, role: 'Admin' | 'Customer') => void;
  onAddAdmin: (newAdmin: Omit<User, 'id' | 'status' | 'registeredAt'>) => void;
  onUpdateReviewStatus: (reviewId: number, productId: number, status: Review['status']) => void;
  onUpdateMessageStatus: (messageId: number, status: ContactMessage['status']) => void;
  onUpdateBookingStatus: (bookingId: number, status: MeetingRequest['status']) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'messages' | 'bookings';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
}> = ({ icon, label, isActive, onClick, badgeCount }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 relative ${
      isActive
        ? 'bg-green-500 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
    {badgeCount && badgeCount > 0 ? (
      <span className="absolute right-2 top-1/2 -translate-y-1/2 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{badgeCount}</span>
    ) : null}
  </button>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const pendingMessagesCount = props.contactMessages.filter(m => m.status === 'Unread').length;
  const pendingBookingsCount = props.meetingRequests.filter(b => b.status === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <ProductsIcon className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <PackageIcon className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <InboxIcon className="w-5 h-5" />, badge: pendingMessagesCount },
    { id: 'bookings', label: 'Bookings', icon: <CalendarIcon className="w-5 h-5" />, badge: pendingBookingsCount },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview orders={props.orders} users={props.users} products={props.products} />;
      case 'products':
        return <AdminProducts 
                  products={props.products}
                  onAddProduct={props.onAddProduct}
                  onUpdateProduct={props.onUpdateProduct}
                  onDeleteProduct={props.onDeleteProduct}
                  onUpdateReviewStatus={props.onUpdateReviewStatus}
                />;
      case 'orders':
        return <AdminOrders orders={props.orders} onUpdateStatus={props.onUpdateOrderStatus} />;
      case 'users':
        return <AdminUsers 
                  users={props.users} 
                  currentUser={props.currentUser}
                  onUpdateUserRole={props.onUpdateUserRole} 
                  onAddAdmin={props.onAddAdmin} 
               />;
      case 'messages':
        return <AdminMessages messages={props.contactMessages} onUpdateStatus={props.onUpdateMessageStatus} />;
      case 'bookings':
        return <AdminBookings requests={props.meetingRequests} onUpdateStatus={props.onUpdateBookingStatus} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="sticky top-24 bg-gray-800 p-4 rounded-lg space-y-2">
            {navItems.map(item => (
              <NavItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                badgeCount={item.badge}
              />
            ))}
          </div>
        </aside>

        <div className="w-full md:w-3/4 lg:w-4/5">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};