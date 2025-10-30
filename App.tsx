
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Data
import { productsData } from './data/products';
import { ordersData } from './data/orders';
import { usersData } from './data/users';
import { reviewsData } from './data/reviews';
import { contactMessagesData } from './data/contactMessages';

// Types
import { Product, CartItem, FilterState, User, Order, Review, ContactMessage, Address, MeetingRequest, WarrantyClaim } from './types';

// Components
import { Header } from './components/Header';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { AdminDashboard } from './components/AdminDashboard';
import { QuickViewModal } from './components/QuickViewModal';
import { Toast } from './components/Toast';
import { InfoModal } from './components/InfoModal';
import { BookingModal } from './components/BookingModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { ProductAuthModal } from './components/ProductAuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WarrantyClaimForm } from './components/WarrantyClaimForm';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';

// Dummy static info for modals
const aboutUsContent = (
    <>
        <p>Buyflex is your premier destination for the latest and greatest in tech accessories. Founded in 2023, our mission is to provide high-quality, innovative products that enhance your digital lifestyle.</p>
        <p>From crystal-clear audio to non-stop power on the go, we've curated a collection of gadgets designed to be both functional and stylish. We believe in quality you can trust and prices you'll love.</p>
    </>
);
const termsContent = <p>By using this website, you agree to our terms of service... (Content for Terms of Use)</p>;
const privacyContent = <p>Your privacy is important to us... (Content for Privacy Policy)</p>;
const careersContent = <p>Join our team! We are currently hiring for... (Content for Careers)</p>;
const shippingGuideContent = <p>We offer free standard shipping on orders over $50... (Content for Shipping Guide)</p>;


const App: React.FC = () => {
    // State management
    const [products, setProducts] = useState<Product[]>(productsData);
    const [orders, setOrders] = useState<Order[]>(ordersData);
    const [users, setUsers] = useState<User[]>(usersData);

    const [currentPage, setCurrentPage] = useState<'shop' | 'productDetail' | 'admin'>('shop');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [filters, setFilters] = useState<FilterState>({ category: 'All', price: 200, rating: 0 });
    const [sortBy, setSortBy] = useState('featured');
    
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [toastMessage, setToastMessage] = useState('');

    // Modal States
    const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
    const [isProductAuthModalOpen, setIsProductAuthModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const [initialBookingTopic, setInitialBookingTopic] = useState('');

    // User State
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleAddToCart = (product: Product, quantity = 1) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
        showToast(`${product.name} added to cart!`);
    };

    const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(productId);
        } else {
            setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
        }
    };
    
    const handleRemoveFromCart = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const handleToggleWishlist = (productId: number) => {
        setWishlist(prev => {
            if (prev.includes(productId)) {
                showToast('Removed from wishlist');
                return prev.filter(id => id !== productId);
            } else {
                showToast('Added to wishlist');
                return [...prev, productId];
            }
        });
    };

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setCurrentPage('productDetail');
        window.scrollTo(0, 0);
    };

    const handleBackToShop = () => {
        setSelectedProduct(null);
        setCurrentPage('shop');
    };

    const handleOpenAuthModal = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleLogin = async (credentials: { email: string; password?: string }) => {
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (user) {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
            showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
        } else {
            throw new Error("Invalid email or password.");
        }
    };
    
    const handleRegister = async (details: { name: string; email: string; password?: string; }) => {
        if (users.some(u => u.email === details.email)) {
            throw new Error("An account with this email already exists.");
        }
        const newUser: User = {
            id: Date.now(),
            ...details,
            role: 'Customer',
            createdAt: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setIsAuthModalOpen(false);
        showToast(`Welcome, ${newUser.name.split(' ')[0]}!`);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        showToast("You've been logged out.");
    };

    const handlePlaceOrder = (shippingDetails: Address) => {
        if (!currentUser) return;
        
        const newOrder: Order = {
            id: `BFX-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
            customerId: currentUser.id,
            customerName: currentUser.name,
            date: new Date().toISOString().split('T')[0],
            status: 'Processing',
            items: cartItems.map(item => ({ product: products.find(p => p.id === item.id)!, quantity: item.quantity })),
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) < 50 ? 5 : 0),
            shippingAddress: shippingDetails,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        setOrders(prev => [newOrder, ...prev]);
        setCartItems([]);
        setIsCheckoutModalOpen(false);
        showToast('Order placed successfully! Thank you!');
    };

    const handleAdminClick = () => {
        setIsAdminDashboardOpen(true);
        setCurrentPage('admin');
    }

    const allCategories = useMemo(() => ['All', ...Array.from(new Set(productsData.map(p => p.category)))], []);
    
    const filteredAndSortedProducts = useMemo(() => {
        let result = products;
        if (searchQuery) {
            result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        } else {
            if (filters.category !== 'All') {
                result = result.filter(p => p.category === filters.category);
            }
            result = result.filter(p => p.price <= filters.price);
            if (filters.rating > 0) {
                result = result.filter(p => p.rating >= filters.rating);
            }
        }
        // sorting...
        return result;
    }, [products, searchQuery, filters, sortBy]);

    const infoModalContent = useMemo(() => {
        switch (activeInfoModal) {
            case 'about': return { title: 'About Us', content: aboutUsContent };
            case 'terms': return { title: 'Terms of Use', content: termsContent };
            case 'privacy': return { title: 'Privacy Policy', content: privacyContent };
            case 'careers': return { title: 'Careers at Buyflex', content: careersContent };
            case 'shipping': return { title: 'Online Shipping Guide', content: shippingGuideContent };
            case 'warranty': return { title: 'Warranty & Support', content: <WarrantyClaimForm onSubmit={(claim) => {showToast("Warranty claim submitted!"); setActiveInfoModal(null);}} /> };
            default: return { title: '', content: null };
        }
    }, [activeInfoModal]);


    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={wishlist.length}
                onCartClick={() => setIsCartOpen(true)}
                onWishlistClick={() => setIsWishlistOpen(true)}
                onSearch={(q) => { setSearchQuery(q); setCurrentPage('shop'); }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentUser={currentUser}
                onAuthClick={handleOpenAuthModal}
                onLogout={handleLogout}
                onAdminClick={handleAdminClick}
                onLogoClick={handleBackToShop}
                onProfileClick={() => setIsUserProfileOpen(true)}
            />

            <main>
                {currentPage === 'shop' && (
                    <Shop
                        products={filteredAndSortedProducts}
                        wishlist={wishlist}
                        filters={filters}
                        sortBy={sortBy}
                        searchQuery={searchQuery}
                        onAddToCart={handleAddToCart}
                        onSelectProduct={handleSelectProduct}
                        onToggleWishlist={handleToggleWishlist}
                        onFiltersChange={(f) => setFilters(prev => ({...prev, ...f}))}
                        onSortChange={setSortBy}
                        onQuickView={setQuickViewProduct}
                        allCategories={allCategories}
                        approvedReviews={[]}
                        newArrivals={products.slice(0,4)}
                        bestSellers={products.slice(4,8)}
                        onSubscribe={(email) => showToast(`${email} has been subscribed!`)}
                    />
                )}
                {currentPage === 'productDetail' && selectedProduct && (
                    <ProductDetail
                        product={selectedProduct}
                        onClose={handleBackToShop}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.includes(selectedProduct.id)}
                    />
                )}
            </main>
            
            <Footer 
                currentUser={currentUser}
                onAboutClick={() => setActiveInfoModal('about')}
                onTermsClick={() => setActiveInfoModal('terms')}
                onPrivacyClick={() => setActiveInfoModal('privacy')}
                onCareersClick={() => setActiveInfoModal('careers')}
                onShippingGuideClick={() => setActiveInfoModal('shipping')}
                onWarrantyClick={() => setActiveInfoModal('warranty')}
                onBookMeetingClick={() => setIsBookingModalOpen(true)}
                onTrackOrderClick={() => setIsTrackOrderModalOpen(true)}
                onProductAuthClick={() => setIsProductAuthModalOpen(true)}
            />

            {/* Modals and Sidebars */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={() => {setIsCartOpen(false); setIsCheckoutModalOpen(true);}} />
            <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={products.filter(p => wishlist.includes(p.id))} onRemoveItem={handleToggleWishlist} onMoveToCart={(p) => {handleAddToCart(p); handleToggleWishlist(p.id);}} />
            <Chatbot products={products} />
            
            <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
            
            <InfoModal isOpen={!!activeInfoModal} onClose={() => setActiveInfoModal(null)} title={infoModalContent.title}>{infoModalContent.content}</InfoModal>

            <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onSubmit={(req) => {showToast('Meeting request submitted!'); setIsBookingModalOpen(false);}} initialTopic={initialBookingTopic} />

            <TrackOrderModal isOpen={isTrackOrderModalOpen} onClose={() => setIsTrackOrderModalOpen(false)} orders={orders} />

            <ProductAuthModal isOpen={isProductAuthModalOpen} onClose={() => setIsProductAuthModalOpen(false)} products={products} onReportIssue={(serial) => {setInitialBookingTopic(`Issue with serial: ${serial}`); setIsProductAuthModalOpen(false); setIsBookingModalOpen(true);}} />

            {currentUser && <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} cartItems={cartItems} currentUser={currentUser} onPlaceOrder={handlePlaceOrder} />}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} onLoginSubmit={handleLogin} onRegisterSubmit={handleRegister} />

            {currentUser && <UserProfile isOpen={isUserProfileOpen} onClose={() => setIsUserProfileOpen(false)} currentUser={currentUser} orders={orders} reviews={reviewsData} />}

            <AdminDashboard 
                isOpen={isAdminDashboardOpen}
                onClose={() => {setIsAdminDashboardOpen(false); setCurrentPage('shop');}}
                products={products}
                orders={orders}
                users={users}
                reviews={[]}
                contactMessages={contactMessagesData}
                meetingRequests={[]}
                warrantyClaims={[]}
                onAddProduct={(p) => {}}
                onUpdateProduct={(p) => {}}
                onDeleteProduct={(id) => {}}
                onUpdateOrderStatus={(id, status) => {}}
                onUpdateUserRole={(id, role) => {}}
            />

            <Toast message={toastMessage} />
        </div>
    );
};

export default App;
