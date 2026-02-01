
import React, { useState, useEffect, useRef } from 'react';
import WearView from './views/WearView';
import CareView from './views/CareView';
import ShareView from './views/ShareView';
import LoopPathView from './views/LoopPathView';
import ProfileView from './views/ProfileView';
import OrdersView from './views/OrdersView';
import CartView from './views/CartView';
import { Home, Shirt, Scissors, Repeat, Menu, X, Leaf, User as UserIcon, ShoppingBag, LogOut, ChevronRight, ChevronLeft, Globe, MessageCircle, Send, Sparkles, Map, Moon, Sun, ArrowLeft, UserPlus, LogIn, AlertCircle, LayoutGrid, Map as MapIcon, Trash2, CheckCircle2, CreditCard, Package, ShieldCheck } from 'lucide-react';
import { User, CartItem, Garment, Order } from './types';
import { getAssistantChat } from './services/geminiService';
import { registerUserAPI, loginUserAPI, updateUserProfileAPI } from './services/apiService';

const LoomiIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3c3 3 5 6 5 9s-2 6-5 9" />
    <path d="M12 3c-3 3-5 6-5 9s2 6 5 9" />
    <path d="M3 12c3 3 6 5 9 5s6-2 9-5" />
    <path d="M3 12c3-3 6-5 9-5s6 2 9 5" />
    <path d="M19 19c1.5 1.5 3 0.5 3-1" />
  </svg>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'wear' | 'care' | 'share' | 'loop' | 'profile' | 'orders' | 'cart'>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Checkout & Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8291',
      itemId: 'm1',
      itemName: "Vintage Levi's 501",
      itemImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400&h=400&auto=format&fit=crop",
      price: "$45 CAD",
      date: "2023-10-24",
      status: 'Shipped',
      type: 'Sale',
      counterparty: 'Marcus J.',
      shippingAddress: '123 Eco Way, Vancouver, BC V6B 1A1',
      trackingNumber: 'LP-77281902',
      transitHistory: [
        { status: 'Order Placed', time: 'Oct 24, 09:00 AM', location: 'Vancouver, BC', completed: true },
        { status: 'Processing', time: 'Oct 24, 11:30 AM', location: 'Vancouver Hub', completed: true },
        { status: 'Shipped', time: 'Oct 25, 08:00 AM', location: 'Vancouver Hub', completed: true },
        { status: 'In Transit', time: 'Oct 25, 02:00 PM', location: 'Burnaby, BC', completed: false },
        { status: 'Delivered', time: '--', location: '--', completed: false }
      ]
    }
  ]);

  // Auth Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as any;
      if (['home', 'wear', 'care', 'share', 'loop', 'profile', 'orders', 'cart'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (tab: any) => {
    window.location.hash = tab;
    setActiveTab(tab);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLoginSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginEmail.trim()) {
      setAuthError('Email address is required.');
      return;
    }
    if (!emailRegex.test(loginEmail)) {
      setAuthError('Please enter a valid email address (e.g., user@example.com).');
      return;
    }
    if (loginPassword.length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
    }

    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const result = await loginUserAPI(loginEmail, loginPassword);

      if (result.success) {
        setCurrentUser(result.user);
        setIsLoginModalOpen(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setAuthError(result.message);
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignupSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupEmail.trim()) {
      setAuthError('Email address is required.');
      return;
    }
    if (!emailRegex.test(signupEmail)) {
      setAuthError('Please enter a valid email address (e.g., user@example.com).');
      return;
    }
    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const profile = {
        name: signupName || signupEmail.split('@')[0],
        firstName: signupName.split(' ')[0] || '',
        lastName: signupName.split(' ').slice(1).join(' ') || '',
        phone: signupPhone,
        dob: signupDob
      };

      const result = await registerUserAPI(signupEmail, signupPassword, profile);

      if (result.success) {
        setCurrentUser(result.user);
        setIsLoginModalOpen(false);
        // Clear signup form
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setSignupName('');
        setSignupPhone('');
        setSignupDob('');
      } else {
        setAuthError(result.message);
      }
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    navigate('cart');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');
      return acc + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleOpenPayment = () => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthError(null);
      setIsLoginModalOpen(true);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const incrementUserLevel = () => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, currentLevel: prev.currentLevel + 1 } : null);
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessingCheckout(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newPurchases: Order[] = cart.map(item => ({
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      itemId: item.id,
      itemName: item.name,
      itemImage: item.imageUrl,
      price: item.price || '$0 CAD',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
      type: 'Purchase',
      counterparty: item.originalOwner || 'EcoLooper',
      shippingAddress: 'My Home Address, Vancouver, BC',
      trackingNumber: `LP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      transitHistory: [
        { status: 'Order Placed', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), location: 'User Checkout', completed: true },
        { status: 'Processing', time: '--', location: 'Partner Warehouse', completed: false },
        { status: 'Shipped', time: '--', location: '--', completed: false },
        { status: 'In Transit', time: '--', location: '--', completed: false },
        { status: 'Delivered', time: '--', location: '--', completed: false }
      ]
    }));

    setOrders(prev => [...newPurchases, ...prev]);
    setIsProcessingCheckout(false);
    setIsCheckoutSuccess(true);
    setCart([]);
    
    // Increment the ECO Maze progress level after a successful purchase
    incrementUserLevel();
    
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      setIsPaymentModalOpen(false);
      navigate('orders');
    }, 2500);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const pendingSalesCount = orders.filter(o => o.type === 'Sale' && o.status === 'Pending').length;
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const SidebarContent = ({ isCollapsed = false, isMobile = false }) => (
    <div className={`flex flex-col h-full ${isCollapsed ? 'items-center' : ''} transition-all duration-300`}>
      <div className={`p-6 border-b border-zinc-100 dark:border-white/5 flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="bg-[#4a5d4e] dark:bg-[#8ea894] p-1.5 rounded-lg text-white dark:text-black flex-shrink-0">
          <Shirt size={20} />
        </div>
        {!isCollapsed && <h2 className="text-xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif tracking-tight truncate">ECOthread</h2>}
      </div>
      
      <nav className={`flex-1 p-4 space-y-2 w-full ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {[
          { tab: 'home', icon: Home, label: 'Home' },
          { tab: 'loop', icon: MapIcon, label: 'ECO Maze' },
          { tab: 'cart', icon: ShoppingBag, label: 'Loop Cart', badge: cartItemsCount },
          { tab: 'orders', icon: Package, label: 'Orders', badge: pendingSalesCount },
          { tab: 'profile', icon: UserIcon, label: 'My Profile' }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => navigate(item.tab as any)}
            title={isCollapsed ? item.label : ""}
            className={`flex items-center gap-4 p-3 rounded-2xl font-bold transition-all group relative w-full ${
              isCollapsed ? 'justify-center w-12 h-12 p-0' : 'px-4 py-3'
            } ${
              activeTab === item.tab 
                ? 'bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black shadow-lg' 
                : 'text-gray-600 dark:text-zinc-400 hover:bg-[#4a5d4e]/5 dark:hover:bg-white/5'
            }`}
          >
            <item.icon size={20} className={activeTab === item.tab ? '' : 'group-hover:scale-110 transition-transform flex-shrink-0'} />
            {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
            {item.badge ? (
              <span className={`${isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm`}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t border-zinc-100 dark:border-white/5 w-full ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {currentUser ? (
          <div className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center' : ''}`}>
            <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex-shrink-0" alt="Avatar" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-black dark:text-white truncate">{currentUser.name}</p>
                {/* Level info removed as requested */}
              </div>
            )}
            {!isCollapsed && (
              <button onClick={handleLogout} className="text-red-500 hover:scale-110 transition-transform"><LogOut size={18} /></button>
            )}
          </div>
        ) : (
          <button 
            onClick={() => { setAuthMode('login'); setAuthError(null); setIsLoginModalOpen(true); setIsSidebarOpen(false); }}
            className={`w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center ${
              isCollapsed ? 'w-10 h-10 rounded-full p-0' : 'py-4 rounded-2xl'
            }`}
          >
            {isCollapsed ? <LogIn size={20} /> : "Sign In"}
          </button>
        )}
      </div>

      {!isMobile && (
        <button 
          onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
          className="p-4 border-t border-zinc-100 dark:border-white/5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white flex items-center justify-center w-full transition-colors"
        >
          {isDesktopSidebarCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={18} /><span className="text-xs font-bold uppercase tracking-widest">Collapse</span></div>}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#fcfbf7] dark:bg-black transition-colors duration-500 overflow-hidden">
      
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-white/5 h-screen sticky top-0 transition-all duration-300 ${
          isDesktopSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <SidebarContent isCollapsed={isDesktopSidebarCollapsed} />
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="absolute top-0 left-0 w-72 h-full bg-[#fcfbf7] dark:bg-zinc-900 shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent isMobile={true} />
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-6 right-6 p-2 text-zinc-400 dark:text-zinc-500"><X /></button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-[#fcfbf7]/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-100 dark:border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#4a5d4e] dark:text-[#8ea894] p-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <nav className="flex items-center gap-1 md:gap-3">
              {[
                { tab: 'wear', icon: Shirt, label: 'Wear' },
                { tab: 'care', icon: Scissors, label: 'Care' },
                { tab: 'share', icon: Repeat, label: 'Share' },
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => navigate(item.tab as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-bold text-sm md:text-base ${
                    activeTab === item.tab 
                    ? 'bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black shadow-md scale-105' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-[#4a5d4e]/10 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-[#4a5d4e] dark:text-[#8ea894] hover:bg-[#4a5d4e]/10 dark:hover:bg-white/5 rounded-full transition-colors w-10 h-10 flex items-center justify-center"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full pb-32 md:pb-12">
            {activeTab === 'home' && <HomeHero onStart={() => navigate('share')} />}
            {activeTab === 'wear' && <WearView />}
            {activeTab === 'care' && <CareView />}
            {activeTab === 'share' && <ShareView user={currentUser} onAddToCart={addToCart} onLoginRequest={() => { setAuthMode('login'); setAuthError(null); setIsLoginModalOpen(true); }} onProgress={incrementUserLevel} />}
            {activeTab === 'orders' && <OrdersView user={currentUser} orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} onLoginRequest={() => { setAuthMode('login'); setAuthError(null); setIsLoginModalOpen(true); }} />}
            {activeTab === 'loop' && <LoopPathView user={currentUser} onUpdateUser={(newLevel) => setCurrentUser(prev => prev ? { ...prev, currentLevel: newLevel } : null)} onLoginRequest={() => { setAuthMode('login'); setAuthError(null); setIsLoginModalOpen(true); }} />}
            {activeTab === 'profile' && <ProfileView user={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onLoginRequest={() => { setAuthMode('login'); setAuthError(null); setIsLoginModalOpen(true); }} />}
            {activeTab === 'cart' && (
              <CartView 
                cart={cart} 
                onUpdateQuantity={updateCartQuantity} 
                onRemove={removeFromCart} 
                onCheckout={handleOpenPayment}
                total={calculateTotal()}
              />
            )}
          </div>
        </main>
      </div>

      {/* Secure Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => !isProcessingCheckout && setIsPaymentModalOpen(false)}></div>
          <div className="relative bg-[#fcfbf7] dark:bg-zinc-900 w-full max-w-lg rounded-[48px] p-10 shadow-2xl animate-in zoom-in-95 transition-colors overflow-hidden border border-white dark:border-white/5">
            {isCheckoutSuccess ? (
              <div className="text-center py-10 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white serif mb-2">Payment Successful!</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Your loop has begun. Redirecting to Orders...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4a5d4e]/10 dark:bg-[#8ea894]/10 rounded-xl text-[#4a5d4e] dark:text-[#8ea894]">
                      <CreditCard size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white serif">Payment</h2>
                  </div>
                  <button onClick={() => setIsPaymentModalOpen(false)} disabled={isProcessingCheckout} className="p-2 dark:text-white"><X /></button>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-black p-6 rounded-3xl border dark:border-white/5 space-y-4 shadow-sm">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="4242 4242 4242 4242" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50"
                          value={cardDetails.number}
                          onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()})}
                          maxLength={19}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                          <div className="w-6 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                          <div className="w-6 h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM / YY" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none"
                          value={cardDetails.expiry}
                          onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••" 
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none"
                          value={cardDetails.cvv}
                          onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-amber-600 dark:text-amber-400 shrink-0" size={18} />
                    <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">Your connection is encrypted. ECOthread loop ensures all transactions are circular and secure.</p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-zinc-500">Order Total</span>
                      <span className="text-zinc-900 dark:text-white">${calculateTotal()} CAD</span>
                    </div>
                    <button 
                      onClick={handleProcessPayment}
                      disabled={isProcessingCheckout || !cardDetails.number}
                      className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-5 rounded-2xl font-bold text-lg shadow-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isProcessingCheckout ? (
                        <><LoaderIcon className="animate-spin" /> Processing...</>
                      ) : (
                        <>Pay & Finalize Loop</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loomi Chat Floating Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[60] bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-[#fcfbf7] dark:border-zinc-900"
      >
        {isChatOpen ? <X size={24} /> : <LoomiIcon size={32} className="animate-pulse" />}
      </button>

      {isChatOpen && <ChatAssistant onClose={() => setIsChatOpen(false)} />}

      {/* Auth Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="relative bg-[#fcfbf7] dark:bg-zinc-900 w-full max-w-lg rounded-[48px] p-10 shadow-2xl animate-in zoom-in-95 transition-colors">
            <h2 className="text-4xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif mb-8">
              {authMode === 'login' ? 'Welcome Back' : 'Join the Loop'}
            </h2>
            
            {authError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-sm text-red-600 dark:text-red-400 font-bold">{authError}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-1">Email Address</label>
                <input
                  type="email"
                  placeholder="hello@looper.com"
                  className={`w-full bg-white dark:bg-black border ${authError && authError.includes('email') ? 'border-red-500' : 'border-zinc-200 dark:border-white/10'} rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50`}
                  value={authMode === 'login' ? loginEmail : signupEmail}
                  onChange={e => {
                    if (authMode === 'login') {
                      setLoginEmail(e.target.value);
                    } else {
                      setSignupEmail(e.target.value);
                    }
                    if (authError) setAuthError(null);
                  }}
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50"
                      value={signupPhone}
                      onChange={e => setSignupPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-1">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50"
                      value={signupDob}
                      onChange={e => setSignupDob(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-white dark:bg-black border ${authError && authError.includes('Password') ? 'border-red-500' : 'border-zinc-200 dark:border-white/10'} rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50`}
                  value={authMode === 'login' ? loginPassword : signupPassword}
                  onChange={e => {
                    if (authMode === 'login') {
                      setLoginPassword(e.target.value);
                    } else {
                      setSignupPassword(e.target.value);
                    }
                  }}
                />
              </div>

              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block px-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-white dark:bg-black border ${authError && authError.includes('match') ? 'border-red-500' : 'border-zinc-200 dark:border-white/10'} rounded-2xl px-5 py-4 text-black dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#4a5d4e]/50`}
                    value={signupConfirmPassword}
                    onChange={e => setSignupConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                onClick={authMode === 'login' ? handleLoginSubmit : handleSignupSubmit}
                disabled={isAuthLoading}
                className="w-full bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthLoading ? (
                  <><LoaderIcon className="animate-spin inline mr-2" /> {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}</>
                ) : (
                  authMode === 'login' ? 'Sign In to ECOthread' : 'Create My Account'
                )}
              </button>

              <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(null); }} className="w-full text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-widest">
                {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Activity Nav */}
      <footer className="md:hidden fixed bottom-6 left-6 right-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-100 dark:border-white/5 px-6 py-4 rounded-[32px] flex justify-between items-center z-50 shadow-2xl">
        {[
          { tab: 'loop', icon: MapIcon, label: 'Maze' },
          { tab: 'cart', icon: ShoppingBag, label: 'Cart', badge: cartItemsCount },
          { tab: 'orders', icon: Package, label: 'Orders', badge: pendingSalesCount },
          { tab: 'profile', icon: UserIcon, label: 'Profile' }
        ].map(item => (
          <button key={item.tab} onClick={() => navigate(item.tab as any)} className={`flex flex-col items-center gap-1.5 relative transition-colors ${activeTab === item.tab ? 'text-[#4a5d4e] dark:text-[#8ea894]' : 'text-zinc-400'}`}>
            <item.icon size={22} className={activeTab === item.tab ? 'scale-110' : ''} />
            <span className="text-[9px] uppercase font-bold tracking-tight">{item.label}</span>
            {item.badge ? (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[8px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </footer>
    </div>
  );
};

const LoaderIcon = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const ChatAssistant: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hi! I'm Loomi. I can help you fix a snag, find a shop, or style a vintage piece. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = getAssistantChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const msg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);
    try {
      const result = await chatRef.current.sendMessageStream({ message: msg });
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      for await (const chunk of result) {
        fullText += chunk.text;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1].text = fullText;
          return next;
        });
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Oops! My threads got tangled. Try again?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-32 right-6 md:bottom-28 md:right-8 w-[calc(100%-3rem)] md:w-96 h-[500px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl z-[70] flex flex-col border border-zinc-100 dark:border-white/5 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
      <div className="p-4 bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LoomiIcon size={24} />
          <h4 className="text-sm font-bold">Loomi Assistant</h4>
        </div>
        <button onClick={onClose} className="hover:bg-black/10 rounded-full p-1"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#fcfbf7] dark:bg-black">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-[#4a5d4e] text-white rounded-tr-none' : 'bg-white dark:bg-zinc-800 text-black dark:text-white rounded-tl-none shadow-sm border dark:border-white/5'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t dark:border-white/5 bg-white dark:bg-zinc-900 flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask Loomi..." className="flex-1 bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-black dark:text-white focus:outline-none" />
        <button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black p-2 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-md"><Send size={18} /></button>
      </div>
    </div>
  );
};

const HomeHero: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="px-6 py-20 text-center flex flex-col items-center gap-10">
    <div className="relative group">
      <div className="absolute inset-0 bg-[#4a5d4e] dark:bg-[#8ea894] rounded-[48px] blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
      <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800" className="relative w-full max-w-lg rounded-[48px] shadow-2xl transition-transform group-hover:scale-[1.02] duration-1000" alt="Slow Fashion" />
    </div>
    <div className="max-w-2xl space-y-6">
      <h2 className="text-5xl md:text-7xl font-bold text-[#2d3a30] dark:text-[#fcfbf7] serif leading-[1.1] tracking-tight">
        Style without <span className="italic text-[#4a5d4e] dark:text-[#8ea894]">waste</span>.
      </h2>
      <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md mx-auto">Join the loop. Wear, care, and share your favorite pieces forever in our community.</p>
      <button onClick={onStart} className="bg-[#4a5d4e] dark:bg-[#8ea894] text-white dark:text-black px-12 py-6 rounded-[32px] font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-[#4a5d4e]/20 dark:shadow-[#8ea894]/10 active:scale-95">
        Start Your Loop
      </button>
    </div>
  </div>
);

export default App;
