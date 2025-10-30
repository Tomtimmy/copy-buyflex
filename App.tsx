import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Cart } from './components/Cart';
import { Chatbot } from './components/Chatbot';
import { AdminDashboard } from './components/AdminDashboard';
import { productsData } from './data/products';
import { usersData } from './data/users';
import { ordersData } from './data/orders';
import { reviewsData } from './data/reviews';
import { contactMessagesData } from './data/contactMessages';
import { Product, CartItem, User, FilterState, Order, OrderStatus, Review, ContactMessage, MeetingRequest, Address, WarrantyClaim } from './types';
import { Shop } from './components/Shop';
import { ProductDetail } from './components/ProductDetail';
import { Wishlist } from './components/Wishlist';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { Toast } from './components/Toast';
import { QuickViewModal } from './components/QuickViewModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { ProductAuthModal } from './components/ProductAuthModal';
import { InfoModal } from './components/InfoModal';
import { CheckoutModal } from './components/CheckoutModal';
import { WarrantyClaimForm } from './components/WarrantyClaimForm';

// Helper to calculate average rating from approved reviews
const calculateAverageRating = (reviews: Review[]) => {
  const approvedReviews = reviews.filter(r => r.status === 'Approved');
  if (approvedReviews.length === 0) return 0;
  const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / approvedReviews.length).toFixed(1));
};

function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    // Initial calculation of ratings based on default review statuses
    return productsData.map(p => ({
      ...p,
      rating: calculateAverageRating(p.reviews)
    }));
  });
  const [users, setUsers] = useState<User[]>(usersData);
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(contactMessagesData);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>([]);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'shop' | 'admin'>('shop');
  
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [initialBookingTopic, setInitialBookingTopic] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    price: 200,
    rating: 0,
  });
  const [sortBy, setSortBy] = useState('featured');
  
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // State for new modals
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [isProductAuthModalOpen, setIsProductAuthModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // FIX: Explicitly type `content` as React.ReactNode to prevent type inference issues.
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; content: React.ReactNode }>({ title: '', content: <></> });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);


  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  // Effect to clear toast message
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleLogin = (role: User['role']) => {
    let user;
    if (role === 'SuperAdmin') {
      const email = window.prompt("Enter Super Admin Email:");
      const password = window.prompt("Enter Super Admin Password:");
      if (email === 'super@buyflex.com' && password === 'super123') {
        user = users.find(u => u.role === 'SuperAdmin');
      } else {
        alert("Invalid Super Admin credentials.");
        return;
      }
    } else {
      // Find the first user that matches the role, for simplicity
      user = users.find(u => u.role === role);
    }
    
    setCurrentUser(user || null);
    setSelectedProduct(null);
    if(user && (user.role === 'Admin' || user.role === 'SuperAdmin')) {
      setCurrentView('admin');
    } else {
      setCurrentView('shop');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('shop');
    setSelectedProduct(null);
  };

  const handleNavigate = (view: 'shop' | 'admin') => {
    setSelectedProduct(null);
    if (view === 'admin' && (currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin')) {
      setCurrentView('admin');
    } else {
      setCurrentView('shop');
    }
  };

  // Product CRUD Handlers
  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'manufacturingDate'>) => {
    const newProduct: Product = { 
        ...newProductData, 
        id: Date.now(), 
        reviews: [], 
        rating: 0, 
        manufacturingDate: new Date().toISOString().split('T')[0] 
    };
    setProducts(prev => [...prev, newProduct]);
  };
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
  };
  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Admin Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };
  const handleUpdateUserRole = (userId: number, role: 'Admin' | 'Customer') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };
  const handleAddAdmin = (newAdminData: Omit<User, 'id' | 'status' | 'registeredAt'>) => {
    const newAdmin: User = {
      ...newAdminData,
      id: Date.now(),
      status: 'Active',
      registeredAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newAdmin]);
  };
   const handleUpdateReviewStatus = (reviewId: number, productId: number, status: Review['status']) => {
    setProducts(prevProducts => {
        return prevProducts.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.reviews.map(r => r.id === reviewId ? { ...r, status } : r);
                const newRating = calculateAverageRating(updatedReviews);
                return { ...p, reviews: updatedReviews, rating: newRating };
            }
            return p;
        });
    });
  };
  const handleUpdateMessageStatus = (messageId: number, status: ContactMessage['status']) => {
    setContactMessages(prev => prev.map(m => m.id === messageId ? { ...m, status } : m));
  };
  const handleBookingRequest = (request: Omit<MeetingRequest, 'id' | 'status'>) => {
    const newRequest: MeetingRequest = { ...request, id: Date.now(), status: 'Pending' };
    setMeetingRequests(prev => [newRequest, ...prev]);
    setIsBookingModalOpen(false);
    setToastMessage('Meeting request received! We will respond shortly.');
  };
  const handleUpdateBookingStatus = (bookingId: number, status: MeetingRequest['status']) => {
      setMeetingRequests(prev => prev.map(r => r.id === bookingId ? { ...r, status } : r));
  };


  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const itemInCart = prev.find(item => item.id === product.id);
      if (itemInCart) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(`${product.name} added to cart!`);
  };
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };
  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: number) => {
    const isWishlisted = wishlist.includes(productId);
    if (isWishlisted) {
        setWishlist(prev => prev.filter(id => id !== productId));
        setToastMessage('Removed from wishlist');
    } else {
        setWishlist(prev => [...prev, productId]);
        setToastMessage('Added to wishlist!');
    }
  };
  const handleRemoveFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };
  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product.id);
  };
  
  // Checkout and Order Placement
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const handlePlaceOrder = (shippingAddress: Address) => {
    if (!currentUser) {
        setToastMessage("Please log in to place an order.");
        return;
    }
    const newOrder: Order = {
        id: `BFX-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Processing',
        items: cartItems.map(item => ({ product: products.find(p => p.id === item.id)!, quantity: item.quantity })),
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) < 50 ? 5 : 0),
        shippingAddress: shippingAddress,
    };
    setOrders(prev => [newOrder, ...prev]);
    // Update user's address in state
    setUsers(prev => prev.map(u => u.id === currentUser.id ? {...u, address: shippingAddress} : u));
    setCurrentUser(prev => prev ? {...prev, address: shippingAddress} : null);

    setCartItems([]);
    setIsCheckoutOpen(false);
    setToastMessage("Order placed successfully!");
  };

  // Misc Handlers
  const handleReportIssue = (serial: string) => {
    setIsProductAuthModalOpen(false);
    setInitialBookingTopic(`Issue with Serial Number: ${serial}`);
    setIsBookingModalOpen(true);
  };
  
  const handleWarrantyClaimSubmit = (claimData: Omit<WarrantyClaim, 'id' | 'status'>) => {
    const newClaim: WarrantyClaim = {
        ...claimData,
        id: Date.now(),
        status: 'Pending',
    };
    setWarrantyClaims(prev => [newClaim, ...prev]);
    setToastMessage('Warranty claim submitted successfully!');
    setIsInfoModalOpen(false);
  };
  
  const handleSubscription = (email: string) => {
    console.log('New subscription from:', email);
    setToastMessage('Thanks for subscribing to our newsletter!');
  }

  // Modal Handlers for Footer Links
  const handleOpenWarrantyModal = () => {
    setInfoModalContent({
      title: 'Warranty & Support',
      content: (
        <>
          <h3 className="text-lg font-bold text-green-400">1-Year Limited Warranty</h3>
          <p>All Buyflex products come with a 1-year limited warranty against manufacturing defects. This warranty is valid from the date of original purchase.</p>
          <h4 className="font-semibold text-white mt-4">What's Covered:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Faulty materials or workmanship.</li>
            <li>Failure to operate under normal use.</li>
            <li>Battery issues (not holding a charge as specified).</li>
          </ul>
           <h4 className="font-semibold text-white mt-4">What's Not Covered:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Accidental damage (drops, spills, etc.).</li>
            <li>Damage from misuse, abuse, or unapproved modifications.</li>
            <li>Normal wear and tear.</li>
            <li>Products purchased from unauthorized resellers.</li>
          </ul>
          <div className="border-t border-gray-700 mt-6 pt-6">
            <h3 className="text-xl font-bold text-green-400 mb-4">Submit a Warranty Claim</h3>
            <WarrantyClaimForm onSubmit={handleWarrantyClaimSubmit} />
          </div>
        </>
      ),
    });
    setIsInfoModalOpen(true);
  };

  const handleOpenShippingGuideModal = () => {
    setInfoModalContent({
      title: 'Online Shipping Guide',
      content: (
         <>
          <h3 className="text-lg font-bold text-green-400">Shipping Options & Times</h3>
          <p>We strive to get your products to you as quickly as possible. All orders are processed within 1-2 business days.</p>
          <div className="mt-4">
            <h4 className="font-semibold text-white">Standard Shipping</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Delivery Time: 5-7 business days.</li>
              <li>Cost: $5.00 flat rate.</li>
              <li><span className="text-green-400 font-bold">FREE</span> on orders over $50.</li>
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold text-white">Express Shipping</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Delivery Time: 2-3 business days.</li>
              <li>Cost: $15.00 flat rate.</li>
            </ul>
          </div>
           <h3 className="text-lg font-bold text-green-400 mt-6">Order Tracking</h3>
           <p>Once your order has shipped, you will receive an email confirmation containing your tracking number. You can use this number on the carrier's website to track the progress of your delivery. You can also use our <button onClick={() => {setIsInfoModalOpen(false); setIsTrackOrderModalOpen(true);}} className="text-green-400 underline hover:text-green-300">Order Tracker</button> to check the status.</p>
        </>
      )
    });
    setIsInfoModalOpen(true);
  };
  
  const handleOpenInfoPage = (title: string, content: React.ReactNode) => {
    setInfoModalContent({ title, content });
    setIsInfoModalOpen(true);
  };


  // Filter, Sort, and View Handlers
  const handleFiltersChange = (newFilters: Partial<FilterState>) => setFilters(prev => ({ ...prev, ...newFilters }));
  const handleSortChange = (newSortBy: string) => setSortBy(newSortBy);
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  };
  const handleSearchChange = (query: string) => {
    setSearchInput(query);
  };
  const handleOpenQuickView = (product: Product) => setQuickViewProduct(product);
  const handleCloseQuickView = () => setQuickViewProduct(null);
  
  useEffect(() => {
    if(debouncedSearchQuery) {
      handleNavigate('shop');
      setSelectedProduct(null);
    }
  }, [debouncedSearchQuery]);

  const allCategories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const approvedReviews = useMemo(() => {
    const allApproved = products.flatMap(p => 
      p.reviews
        .filter(r => r.status === 'Approved')
        .map(r => ({ ...r, productName: p.name }))
    );
    return allApproved;
  }, [products]);

  const newArrivals = useMemo(() => [...products].sort((a, b) => b.id - a.id).slice(0, 4), [products]);
  const bestSellers = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const scoreA = a.rating * a.reviews.filter(r => r.status === 'Approved').length;
        const scoreB = b.rating * b.reviews.filter(r => r.status === 'Approved').length;
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [products]);
  
  const displayedProducts = useMemo(() => {
    let result = products
      .filter(p => (filters.category === 'All' || p.category === filters.category))
      .filter(p => p.price <= filters.price)
      .filter(p => p.rating >= filters.rating)
      .filter(p => 
        debouncedSearchQuery.trim() === '' ||
        p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [products, filters, sortBy, debouncedSearchQuery]);

  const wishlistItems = useMemo(() => products.filter(p => wishlist.includes(p.id)), [products, wishlist]);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const isAdminView = currentView === 'admin' && (currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin');

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header 
        cartCount={cartCount} 
        wishlistCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentView={currentView}
        searchQuery={searchInput}
        onSearchChange={handleSearchChange}
      />
      
      <main className="flex-grow">
        {isAdminView && currentUser ? (
           <AdminDashboard 
            products={products}
            orders={orders}
            users={users}
            contactMessages={contactMessages}
            meetingRequests={meetingRequests}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateUserRole={handleUpdateUserRole}
            onAddAdmin={handleAddAdmin}
            onUpdateReviewStatus={handleUpdateReviewStatus}
            onUpdateMessageStatus={handleUpdateMessageStatus}
            onUpdateBookingStatus={handleUpdateBookingStatus}
          />
        ) : selectedProduct ? (
            <ProductDetail
              product={selectedProduct}
              onClose={() => { setSelectedProduct(null); setSearchInput(''); }}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(selectedProduct.id)}
            />
          ) : (
            <Shop
              products={displayedProducts}
              wishlist={wishlist}
              filters={filters}
              sortBy={sortBy}
              searchQuery={debouncedSearchQuery}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onToggleWishlist={handleToggleWishlist}
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              onQuickView={handleOpenQuickView}
              allCategories={allCategories}
              approvedReviews={approvedReviews}
              newArrivals={newArrivals}
              bestSellers={bestSellers}
              onSubscribe={handleSubscription}
            />
          )
        }
      </main>

      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveItem={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
      />
      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onPlaceOrder={handlePlaceOrder}
      />

      <QuickViewModal 
        product={quickViewProduct}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
      />
      
      <Toast message={toastMessage} />

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setInitialBookingTopic(''); }}
        onSubmit={handleBookingRequest}
        initialTopic={initialBookingTopic}
      />
      
      <TrackOrderModal isOpen={isTrackOrderModalOpen} onClose={() => setIsTrackOrderModalOpen(false)} orders={orders} />
      <ProductAuthModal 
        isOpen={isProductAuthModalOpen} 
        onClose={() => setIsProductAuthModalOpen(false)} 
        products={products}
        onReportIssue={handleReportIssue}
      />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title={infoModalContent.title}>
        {infoModalContent.content}
      </InfoModal>

      <Chatbot products={products} />

      <Footer 
        onBookMeetingClick={() => setIsBookingModalOpen(true)} 
        onTrackOrderClick={() => setIsTrackOrderModalOpen(true)}
        onWarrantyClick={handleOpenWarrantyModal}
        onShippingGuideClick={handleOpenShippingGuideModal}
        onProductAuthClick={() => setIsProductAuthModalOpen(true)}
        onAboutClick={() => handleOpenInfoPage('About Buyflex', <p>Buyflex is your one-stop shop for the latest and greatest tech accessories. Quality you can trust, prices you'll love.</p>)}
        onTermsClick={() => handleOpenInfoPage('Terms of Use', <p>By using our website, you agree to our terms of use...</p>)}
        onPrivacyClick={() => handleOpenInfoPage('Privacy Policy', <p>We respect your privacy and are committed to protecting your personal data...</p>)}
        onCareersClick={() => handleOpenInfoPage('Careers', <p>We are always looking for talented individuals to join our team. Check our LinkedIn for openings.</p>)}
      />
    </div>
  );
}

export default App;