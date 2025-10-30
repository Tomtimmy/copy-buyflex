
import React, { useState } from 'react';
import { Product, Order, User, Review, ContactMessage, MeetingRequest, WarrantyClaim, UserRole, OrderStatus } from '../types';
import { DashboardView, ProductsView, OrdersView, UsersView, InboxView } from './AdminViews';
import { DashboardIcon } from './icons/DashboardIcon';
import { ProductsIcon } from './icons/ProductsIcon';
import { PackageIcon } from './icons/PackageIcon';
import { UsersIcon } from './icons/UsersIcon';
import { InboxIcon } from './icons/InboxIcon';
import { XIcon } from './icons/XIcon';


type AdminView = 'dashboard' | 'products' | 'orders' | 'users' | 'inbox';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  users: User[];
  reviews: Review[];
  contactMessages: ContactMessage[];
  meetingRequests: MeetingRequest[];
  warrantyClaims: WarrantyClaim[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateUserRole: (userId: number, role: UserRole) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
        {icon}
        <span className="ml-3">{label}</span>
    </button>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    isOpen, 
    onClose, 
    products, 
    orders,
    users,
    contactMessages,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct,
    onUpdateOrderStatus,
    onUpdateUserRole,
}) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  
  if (!isOpen) return null;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView products={products} orders={orders} users={users} />;
      case 'products':
        return <ProductsView products={products} onAddProduct={onAddProduct} onUpdateProduct={onUpdateProduct} onDeleteProduct={onDeleteProduct} />;
      case 'orders':
        return <OrdersView orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />;
      case 'users':
        return <UsersView users={users} onUpdateUserRole={onUpdateUserRole} />;
      case 'inbox':
        return <InboxView messages={contactMessages} onUpdateStatus={()=>{}} />;
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <ProductsIcon className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <PackageIcon className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex" onClick={onClose}>
        <div className="flex h-full w-full" onClick={e => e.stopPropagation()}>
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-bold text-green-400">Admin Panel</h2>
                   <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-gray-700"><XIcon className="w-6 h-6" /></button>
                </div>
                <nav className="flex-grow space-y-2">
                   {navItems.map(item => (
                     <NavItem 
                        key={item.id}
                        icon={item.icon} 
                        label={item.label} 
                        isActive={activeView === item.id} 
                        onClick={() => setActiveView(item.id)} 
                     />
                   ))}
                </nav>
                <div>
                  <button onClick={onClose} className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
                    <XIcon className="w-5 h-5 mr-3 transform rotate-90" />
                    Close Panel
                  </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-gray-900 text-white">
                {renderView()}
            </main>
        </div>
    </div>
  );
};
