import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { Product, CartItem, UserProfile, UserAccount, SiteContentConfig, UsedPhone, Coupon } from './types';
import { STORE_PRODUCTS } from './data/products';
import { INITIAL_USER_PROFILE, INITIAL_USERS_LIST, INITIAL_SITE_CONTENT } from './data/mockData';
import { USED_PHONES_LIST } from './data/usedPhonesData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PhoneCompareDrawer } from './components/PhoneCompareDrawer';
import { InstallmentCalculator } from './components/InstallmentCalculator';
import { RepairBookingModal } from './components/RepairBookingModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { TargetCursor } from './components/TargetCursor';
import { AdvancedPhoneFinderModal } from './components/AdvancedPhoneFinderModal';
import { TechHubModal } from './components/TechHubModal';
import { BundleBuilderModal } from './components/BundleBuilderModal';
import { Interactive360Modal } from './components/Interactive360Modal';
import { Showroom3DModal } from './components/Showroom3DModal';
import { StoreMapLocation } from './components/StoreMapLocation';
import { ReviewsSection } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ProductSkeleton } from './components/ProductSkeleton';
import { LogoutOverlay } from './components/LogoutOverlay';
import { 
  Smartphone, 
  Search, 
  Filter, 
  Sparkles, 
  CreditCard, 
  Wrench, 
  Star, 
  ArrowUpDown, 
  SlidersHorizontal,
  Check,
  RotateCw,
  PackagePlus,
  Sliders,
  Newspaper,
  Loader2
} from 'lucide-react';

// Lazy-load AdminDashboardModal (~100KB) for optimized performance and bundle splitting
const AdminDashboardModal = React.lazy(() => import('./components/AdminDashboardModal'));

export default function App() {
  // Products state fetched from database
  const [products, setProducts] = useState<Product[]>(STORE_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Users CRM & Site Content CMS State
  const [usersList, setUsersList] = useState<UserAccount[]>(INITIAL_USERS_LIST);
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(INITIAL_SITE_CONTENT);
  const [usedPhones, setUsedPhones] = useState<UsedPhone[]>(USED_PHONES_LIST);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_USER_PROFILE.coupons || []);
  const [referralBonusToman, setReferralBonusToman] = useState<number>(50000);

  // User Profile & Loyalty state
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  // Theme state stored in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('setareh_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('setareh_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('setareh_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Navigation & View state
  const [activeSection, setActiveSection] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFullCatalog, setShowFullCatalog] = useState<boolean>(false);
  
  // Category & Brand Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInstallment, setOnlyInstallment] = useState<boolean>(false);
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(120000000);

  // Cart & Compare state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  // Modals state
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);
  const [isRepairOpen, setIsRepairOpen] = useState<boolean>(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState<boolean>(false);
  const [presetInstallmentPrice, setPresetInstallmentPrice] = useState<number>(30000000);

  // Feature Modals & Auth State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('setareh_current_user');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Error loading saved user:', err);
    }
    return INITIAL_USERS_LIST[0]; // Owner default
  });
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
  const [isProfileEditDirect, setIsProfileEditDirect] = useState<boolean>(false);
  const [isPhoneFinderOpen, setIsPhoneFinderOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isTechHubOpen, setIsTechHubOpen] = useState<boolean>(false);
  const [isBundleBuilderOpen, setIsBundleBuilderOpen] = useState<boolean>(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState<boolean>(false);
  const [selectedProductFor360, setSelectedProductFor360] = useState<Product | null>(null);

  // Fetch real products from Firestore API
  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const dbProds = await res.json();
          if (Array.isArray(dbProds) && dbProds.length > 0) {
            // Map DB format to client Product format
            const mapped: Product[] = dbProds.map((p: any) => ({
              id: p.id,
              name: p.title || p.name || 'محصول',
              persianName: p.titleFa || p.persianName || p.title || 'محصول',
              category: p.category || 'smartphones',
              brand: p.brand || 'متفرقه',
              priceToman: p.price || p.priceToman || 0,
              originalPriceToman: p.originalPrice || p.originalPriceToman || p.price || 0,
              image: p.image,
              images360: p.images || [p.image],
              colors: p.colorsDetail || (p.color ? p.color.map((c: string) => ({ name: c, hex: '#111111' })) : [{ name: 'مشکی', hex: '#111111' }]),
              specs: p.specs || {},
              usageTags: p.usageTags || ['daily'],
              isTopSeller: Boolean(p.isBestSeller || p.isTopSeller),
              isOffer: Boolean(p.isNew || p.isOffer),
              isInstallment: true,
              rating: p.rating || 4.8,
              reviewsCount: p.reviewsCount || 10,
              stock: p.stockCount !== undefined ? p.stockCount : (p.stock || 5),
              warranty: p.warranty || '۱۸ ماه گارانتی شرکتی + کد رجیستری',
              description: p.description || ''
            }));
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error('Error loading products from server:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setUserProfile((prev) => ({
      ...prev,
      name: user.name,
      phone: user.phone,
      walletBalanceToman: user.walletBalanceToman
    }));

    try {
      localStorage.setItem('setareh_current_user', JSON.stringify(user));
      localStorage.setItem('setareh_is_logged_in', 'true');
    } catch (err) {
      console.error('Error saving user to localStorage:', err);
    }
  };

  const handleLogout = () => {
    // 1. Show smooth animated logout screen
    setIsLoggingOut(true);

    // 2. Immediately close all active modals & drawers
    setIsUserProfileOpen(false);
    setIsAdminOpen(false);
    setIsAuthOpen(false);
    setIsCartOpen(false);
    setIsCompareOpen(false);
    setIsRepairOpen(false);
    setIsAiAdvisorOpen(false);
    setIsInstallmentModalOpen(false);
    setIsPhoneFinderOpen(false);
    setIsTechHubOpen(false);
    setIsBundleBuilderOpen(false);
    setIsShowroomOpen(false);
    setSelectedProductDetail(null);

    // 3. Reset view to main catalog section and scroll top smoothly
    setActiveSection('catalog');
    setShowFullCatalog(false);
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 4. Properly clear all browser storage (localStorage & sessionStorage)
    try {
      localStorage.removeItem('setareh_current_user');
      localStorage.removeItem('setareh_is_logged_in');
      localStorage.removeItem('setareh_user_token');
      localStorage.removeItem('setareh_auth');
      localStorage.removeItem('setareh_admin_token');
      sessionStorage.clear();
    } catch (err) {
      console.error('Error clearing browser storage on logout:', err);
    }

    // 5. Reset state to guest user
    setCurrentUser(null);
    setUserProfile({
      name: 'مهمان',
      phone: '',
      walletBalanceToman: 0,
      loyaltyPoints: 0,
      loyaltyTier: 'برنز',
      referralCode: 'SETAREH-GUEST',
      wishlistIds: [],
      coupons: [],
      orders: []
    });
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setUsersList((prev) => [newUser, ...prev]);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        walletBalanceToman: updatedProfile.walletBalanceToman
      };
      setCurrentUser(updatedUser);
      setUsersList((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    }
  };

  // Wishlist products calculation
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => userProfile.wishlistIds.includes(p.id));
  }, [products, userProfile.wishlistIds]);

  // Home page featured products selected by admin
  const homeFeaturedProducts = useMemo(() => {
    const featured = products.filter((p) => p.isFeaturedOnHome);
    if (featured.length > 0) return featured;
    return products.slice(0, 4);
  }, [products]);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      const matchSearch = 
        !searchQuery ||
        product.persianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Brand
      const matchBrand = selectedBrand === 'all' || product.brand.toLowerCase() === selectedBrand.toLowerCase();

      // Installment
      const matchInstallment = !onlyInstallment || product.isInstallment;

      // Special Offer
      const matchOffers = !onlyOffers || product.isOffer;

      // Price Range Slider Filter
      const matchMaxPrice = maxPriceFilter >= 120000000 || product.priceToman <= maxPriceFilter;

      // In-Stock Filter
      const matchInStock = !onlyInStock || (product.stock && product.stock > 0);

      return matchSearch && matchCategory && matchBrand && matchInstallment && matchOffers && matchMaxPrice && matchInStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceToman - b.priceToman;
      if (sortBy === 'price-desc') return b.priceToman - a.priceToman;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured / default
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, onlyInstallment, onlyOffers, maxPriceFilter, onlyInStock]);

  const handleAddToCart = (product: Product, selectedColor?: string) => {
    const colorToUse = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : 'پیش‌فرض');
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedColor === colorToUse);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === colorToUse
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedColor: colorToUse }];
    });
    setIsCartOpen(true);
  };

  const handleToggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('حداکثر امکان مقایسه ۳ محصول همزمان وجود دارد.');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleToggleWishlist = (productId: string) => {
    setUserProfile((prev) => {
      const exists = prev.wishlistIds.includes(productId);
      const newWishlist = exists
        ? prev.wishlistIds.filter((id) => id !== productId)
        : [...prev.wishlistIds, productId];
      return { ...prev, wishlistIds: newWishlist };
    });
  };

  const handleOpenInstallmentForProduct = (price: number) => {
    setPresetInstallmentPrice(price);
    setIsInstallmentModalOpen(true);
  };

  const categories = [
    { id: 'all', name: 'همه محصولات' },
    { id: 'smartphones', name: 'گوشی موبایل' },
    { id: 'smartwatches', name: 'ساعت هوشمند' },
    { id: 'headphones', name: 'هندزفری و هدفون' },
    { id: 'chargers', name: 'شارژر و پاوربانک' }
  ];

  const brands = ['all', 'Apple', 'Samsung', 'Xiaomi', 'Anker'];

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-['Vazirmatn',sans-serif] selection:bg-yellow-400 selection:text-slate-950 overflow-x-hidden">
      
      {/* SVG ClipPath Definition for Scalable Clipped Buttons */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="clipped-element-shape" clipPathUnits="objectBoundingBox">
            <path d="M 0.184 0.071 L 0.342 0.071 L 0.342 0.929 L 0.211 0.929 A 0.158 0.429 0 0 1 0.026 0.500 L 0.026 0.500 A 0.158 0.429 0 0 1 0.184 0.071 Z M 0.342 0.071 L 0.658 0.071 L 0.658 0.929 L 0.342 0.929 Z M 0.658 0.071 L 0.816 0.071 A 0.158 0.429 0 0 1 0.974 0.500 A 0.158 0.429 0 0 1 0.816 0.929 L 0.658 0.929 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* TargetCursor from React Bits */}
      <TargetCursor 
        spinDuration={2}
        pulseScale={1.15}
        color="#FACC15"
      />

      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Header */}
      <Header
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        compareCount={comparedProducts.length}
        wishlistCount={userProfile.wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenInstallment={() => {
          setPresetInstallmentPrice(30000000);
          setIsInstallmentModalOpen(true);
        }}
        onOpenRepair={() => setIsRepairOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => {
          setIsProfileEditDirect(false);
          setIsUserProfileOpen(true);
        }}
        onOpenProfileEdit={() => {
          setIsProfileEditDirect(true);
          setIsUserProfileOpen(true);
        }}
        onOpenPhoneFinder={() => setIsPhoneFinderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTechHub={() => setIsTechHubOpen(true)}
        onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
        onOpenShowroom={() => setIsShowroomOpen(true)}
        onOpenFullCatalog={() => setShowFullCatalog(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Hero Banner */}
      <HeroBanner
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenInstallment={() => {
          setPresetInstallmentPrice(50000000);
          setIsInstallmentModalOpen(true);
        }}
        onOpenRepair={() => setIsRepairOpen(true)}
        onOpenPhoneFinder={() => setIsPhoneFinderOpen(true)}
        onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
        onOpenShowroom={() => setIsShowroomOpen(true)}
      />

      {/* Main Catalog View */}
      <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* HOMEPAGE FEATURED VIEW vs FULL CATALOG VIEW */}
        {!showFullCatalog && !searchQuery.trim() && selectedCategory === 'all' && selectedBrand === 'all' ? (
          <div className="space-y-8 bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
              <div>
                <span className="text-xs font-black text-yellow-600 bg-yellow-400/20 px-3 py-1 rounded-full uppercase tracking-wider block w-fit mb-2">
                  پیشنهاد ویژه مدیریت ستاره
                </span>
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-yellow-500" />
                  <span>محصولات منتخب صفحه اصلی</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  کالاهای منتخب و پیشنهادی ویژه مدیریت فروشگاه ستاره موبایل مبارکه
                </p>
              </div>

              <button
                onClick={() => {
                  setShowFullCatalog(true);
                  const elem = document.getElementById('catalog');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-950 hover:bg-slate-800 text-yellow-400 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-yellow-400/30"
              >
                <Search className="w-4 h-4 text-yellow-400" />
                <span>مشاهده و جستجوی کامل محصولات ({products.length} کالا)</span>
              </button>
            </div>

            {/* Featured Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeFeaturedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isCompared={comparedProducts.some((p) => p.id === product.id)}
                  isWishlisted={userProfile.wishlistIds.includes(product.id)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onOpenDetail={(p) => setSelectedProductDetail(p)}
                  onToggleCompare={(p) => handleToggleCompare(p)}
                  onToggleWishlist={(id) => handleToggleWishlist(id)}
                  onOpenInstallment={(p) => handleOpenInstallmentForProduct(p.priceToman)}
                  onOpen360={(p) => setSelectedProductFor360(p)}
                />
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setShowFullCatalog(true)}
                className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white font-bold text-xs px-8 py-4 rounded-2xl border border-slate-800 shadow-xl hover:border-yellow-400 transition flex items-center justify-center gap-2 mx-auto"
              >
                <span>نمایش ویترین و محصولات بیشتر</span>
                <span className="bg-yellow-400 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded-full">
                  +{products.length - homeFeaturedProducts.length} مدل دیگر
                </span>
              </button>
            </div>

          </div>
        ) : (
          /* FULL CATALOG VIEW WITH ALL FILTERS */
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-yellow-500" />
                    <span>ویترین کامل محصولات ستاره</span>
                  </h2>

                  <button
                    onClick={() => {
                      setShowFullCatalog(false);
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                    }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
                  >
                    نمایش اولیه صفحه اصلی
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span>تعداد پیدا شده:</span>
                  <span className="bg-slate-100 text-slate-900 px-2.5 py-1 rounded-full font-mono font-bold">
                    {filteredProducts.length.toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowFullCatalog(true);
                      }}
                      className={`px-4 py-2 text-xs font-bold transition rounded-xl ${
                        selectedCategory === cat.id
                          ? 'bg-slate-950 text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Brand Filter & Search */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-bold text-slate-500 shrink-0">برند:</span>
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setSelectedBrand(b);
                          setShowFullCatalog(true);
                        }}
                        className={`px-3 py-1.5 text-xs font-bold transition rounded-lg ${
                          selectedBrand === b
                            ? 'bg-yellow-400 text-slate-950 shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {b === 'all' ? 'همه' : b}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowFullCatalog(true);
                      }}
                      placeholder="جستجوی نام، برند یا مشخصات..."
                      className="w-full bg-white border border-slate-300 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Advanced Price Range Slider & In-Stock Only Filter */}
                <div className="pt-3 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  
                  {/* Price Range Slider */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4 text-yellow-500" />
                        <span>فیلتر سقف قیمت:</span>
                      </span>
                      <span className="text-slate-950 font-black font-mono bg-yellow-400/20 px-2.5 py-0.5 rounded text-xs">
                        {maxPriceFilter >= 120000000 ? 'بدون محدودیت (تمام قیمت‌ها)' : `${maxPriceFilter.toLocaleString('fa-IR')} تومان`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="5000000"
                      max="120000000"
                      step="2000000"
                      value={maxPriceFilter}
                      onChange={(e) => {
                        setMaxPriceFilter(Number(e.target.value));
                        setShowFullCatalog(true);
                      }}
                      className="w-full accent-slate-950 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                      <span>۵,۰۰۰,۰۰۰ تومان</span>
                      <span>۶۰,۰۰۰,۰۰۰ تومان</span>
                      <span>۱۲۰,۰۰۰,۰۰۰+ تومان</span>
                    </div>
                  </div>

                  {/* Toggles: In-Stock Only, Offers, Installment */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* In Stock Only Checkbox Button */}
                    <button
                      onClick={() => {
                        setOnlyInStock(!onlyInStock);
                        setShowFullCatalog(true);
                      }}
                      className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        onlyInStock
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-extrabold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <Check className={`w-4 h-4 ${onlyInStock ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>فقط کالاهای موجود</span>
                    </button>

                    {/* Special Offers Toggle */}
                    <button
                      onClick={() => {
                        setOnlyOffers(!onlyOffers);
                        setShowFullCatalog(true);
                      }}
                      className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        onlyOffers
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>فروش ویژه / تخفیف‌دار</span>
                    </button>

                    {/* Reset Filters */}
                    {(maxPriceFilter < 120000000 || onlyInStock || onlyOffers || selectedBrand !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                      <button
                        onClick={() => {
                          setMaxPriceFilter(120000000);
                          setOnlyInStock(false);
                          setOnlyOffers(false);
                          setSelectedBrand('all');
                          setSelectedCategory('all');
                          setSearchQuery('');
                        }}
                        className="px-3 py-2.5 text-xs text-rose-600 hover:text-rose-800 font-bold underline transition"
                      >
                        حذف فیلترها
                      </button>
                    )}

                  </div>

                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">هیچ محصولی با مشخصات انتخابی شما یافت نشد.</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  فیلترهای جستجو را بازنشانی کنید یا با مشاور هوشمند AI تماس بگیرید.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-xs font-bold bg-slate-950 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition"
                >
                  بازنشانی فیلترها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isCompared={comparedProducts.some((p) => p.id === product.id)}
                    isWishlisted={userProfile.wishlistIds.includes(product.id)}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onOpenDetail={(p) => setSelectedProductDetail(p)}
                    onToggleCompare={(p) => handleToggleCompare(p)}
                    onToggleWishlist={(id) => handleToggleWishlist(id)}
                    onOpenInstallment={(p) => handleOpenInstallmentForProduct(p.priceToman)}
                    onOpen360={(p) => setSelectedProductFor360(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Store Location Map Section */}
        <StoreMapLocation />
      </main>

      {/* Modals & Drawers */}
      
      {/* Lazy Loaded Admin Modal with Suspense fallback */}
      {isAdminOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md text-white font-['Vazirmatn']">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl">
              <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
              <span className="text-sm font-bold">در حال بارگذاری پنل مدیریت ستاره...</span>
            </div>
          </div>
        }>
          <AdminDashboardModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onViewMainPage={() => setIsAdminOpen(false)}
            products={products}
            onUpdateProducts={(updated) => setProducts(updated)}
            usersList={usersList}
            onUpdateUsersList={(users) => setUsersList(users)}
            siteContent={siteContent}
            onUpdateSiteContent={(content) => setSiteContent(content)}
            usedPhones={usedPhones}
            onUpdateUsedPhones={(phones) => setUsedPhones(phones)}
            coupons={coupons}
            onUpdateCoupons={(c) => setCoupons(c)}
            referralBonusToman={referralBonusToman}
            onUpdateReferralBonusToman={(amt) => setReferralBonusToman(amt)}
          />
        </Suspense>
      )}

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          usersList={usersList}
          onRegisterUser={handleRegisterUser}
        />
      )}

      {isUserProfileOpen && currentUser && (
        <UserProfileModal
          isOpen={isUserProfileOpen}
          onClose={() => {
            setIsUserProfileOpen(false);
            setIsProfileEditDirect(false);
          }}
          user={currentUser}
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          wishlistProducts={wishlistProducts}
          onLogout={handleLogout}
          startInEditMode={isProfileEditDirect}
        />
      )}

      {isPhoneFinderOpen && (
        <AdvancedPhoneFinderModal
          isOpen={isPhoneFinderOpen}
          onClose={() => setIsPhoneFinderOpen(false)}
          products={products}
          onSelectProduct={(product) => {
            setIsPhoneFinderOpen(false);
            setSelectedProductDetail(product);
          }}
        />
      )}

      {isTechHubOpen && (
        <TechHubModal
          isOpen={isTechHubOpen}
          onClose={() => setIsTechHubOpen(false)}
        />
      )}

      {isBundleBuilderOpen && (
        <BundleBuilderModal
          isOpen={isBundleBuilderOpen}
          onClose={() => setIsBundleBuilderOpen(false)}
          products={products}
          onAddToCart={(product) => handleAddToCart(product)}
        />
      )}

      {isShowroomOpen && (
        <Showroom3DModal
          isOpen={isShowroomOpen}
          onClose={() => setIsShowroomOpen(false)}
          usedPhones={usedPhones}
          onAddToCart={(product) => handleAddToCart(product)}
          onOpenInstallment={(price) => {
            setIsShowroomOpen(false);
            setPresetInstallmentPrice(price);
            setIsInstallmentModalOpen(true);
          }}
        />
      )}

      <Interactive360Modal
        isOpen={Boolean(selectedProductFor360)}
        onClose={() => setSelectedProductFor360(null)}
        product={selectedProductFor360}
      />

      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onOpenInstallmentForProduct={handleOpenInstallmentForProduct}
      />

      <PhoneCompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProducts={comparedProducts}
        onRemoveCompare={(id) => setComparedProducts((prev) => prev.filter((p) => p.id !== id))}
        onClearCompare={() => setComparedProducts([])}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {isInstallmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-['Vazirmatn']">
          <div className="w-full max-w-4xl my-8">
            <InstallmentCalculator
              initialPrice={presetInstallmentPrice}
              onClose={() => setIsInstallmentModalOpen(false)}
            />
          </div>
        </div>
      )}

      <RepairBookingModal
        isOpen={isRepairOpen}
        onClose={() => setIsRepairOpen(false)}
      />

      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, q) => {
          if (q <= 0) {
            setCartItems((prev) => prev.filter((item) => item.product.id !== id));
          } else {
            setCartItems((prev) =>
              prev.map((item) => (item.product.id === id ? { ...item, quantity: q } : item))
            );
          }
        }}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((item) => item.product.id !== id))}
        onClearCart={() => setCartItems([])}
      />

      <LogoutOverlay
        isOpen={isLoggingOut}
        onComplete={() => setIsLoggingOut(false)}
        userName={currentUser?.name || 'کاربر'}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
