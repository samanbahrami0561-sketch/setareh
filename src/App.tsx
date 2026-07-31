import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { SearchWithRecent } from './components/SearchWithRecent';
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
import { AdvancedPhoneFinderModal } from './components/AdvancedPhoneFinderModal';
import { TechHubModal } from './components/TechHubModal';
import { BundleBuilderModal } from './components/BundleBuilderModal';
import { Interactive360Modal } from './components/Interactive360Modal';
import { Showroom3DModal } from './components/Showroom3DModal';
import { StoreMapLocation } from './components/StoreMapLocation';
import { StoreGallerySection } from './components/StoreGallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { StockNotificationModal } from './components/StockNotificationModal';
import { Footer } from './components/Footer';
import { ProductSkeleton } from './components/ProductSkeleton';
import { LogoutOverlay } from './components/LogoutOverlay';
import { GiftAssistantModal } from './components/GiftAssistantModal';
import { SEOHead } from './components/SEOHead';
import { PriceInquiryModal } from './components/PriceInquiryModal';
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
  Loader2,
  ArrowRight,
  SearchX,
  Tag
} from 'lucide-react';

// Helper for precise search text normalization (Persian digits & characters)
const normalizeSearchText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/۰/g, '0').replace(/۱/g, '1').replace(/۲/g, '2').replace(/۳/g, '3').replace(/۴/g, '4')
    .replace(/۵/g, '5').replace(/۶/g, '6').replace(/۷/g, '7').replace(/۸/g, '8').replace(/۹/g, '9')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
};

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
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const savedUserStr = localStorage.getItem('setareh_current_user');
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        return {
          ...INITIAL_USER_PROFILE,
          name: u.name || 'کاربر',
          phone: u.phone || '',
          walletBalanceToman: u.walletBalanceToman || 0
        };
      }
    } catch (e) {
      console.error('Error loading saved profile:', e);
    }
    return {
      name: 'مهمان',
      phone: '',
      walletBalanceToman: 0,
      loyaltyPoints: 0,
      loyaltyTier: 'برنز',
      referralCode: 'SETAREH-GUEST',
      wishlistIds: [],
      coupons: [],
      orders: []
    };
  });

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
  const [stockNotifyProduct, setStockNotifyProduct] = useState<Product | null>(null);
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
    return null; // Guest user by default (no admin access without login)
  });
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
  const [isProfileEditDirect, setIsProfileEditDirect] = useState<boolean>(false);
  const [isPhoneFinderOpen, setIsPhoneFinderOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isTechHubOpen, setIsTechHubOpen] = useState<boolean>(false);
  const [isBundleBuilderOpen, setIsBundleBuilderOpen] = useState<boolean>(false);
  const [isGiftAssistantOpen, setIsGiftAssistantOpen] = useState<boolean>(false);
  const [isShowroomOpen, setIsShowroomOpen] = useState<boolean>(false);
  const [selectedProductFor360, setSelectedProductFor360] = useState<Product | null>(null);
  const [priceInquiryProduct, setPriceInquiryProduct] = useState<Product | null>(null);

  // Fetch real products from Firestore API
  useEffect(() => {
    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const dbProds = await res.json().catch(() => null);
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
        }
      } catch (err) {
        console.error('Error loading products from server:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    async function loadSiteConfig() {
      try {
        const res = await fetch('/api/site-config');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.config) {
            setSiteContent((prev) => ({ ...prev, ...data.config }));
          }
        }
      } catch (err) {
        console.error('Error loading site config:', err);
      }
    }

    loadProducts();
    loadSiteConfig();
  }, []);

  const handleUpdateSiteContent = async (content: SiteContentConfig) => {
    setSiteContent(content);
    try {
      await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
    } catch (err) {
      console.error('Error saving site config:', err);
    }
  };

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
    setIsGiftAssistantOpen(false);
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

  // Persistent Global Back Handler (works across all modals, drawers, filters, and pages)
  const handleGlobalBack = () => {
    if (selectedProductDetail) {
      setSelectedProductDetail(null);
      return;
    }
    if (selectedProductFor360) {
      setSelectedProductFor360(null);
      return;
    }
    if (isAdminOpen) {
      setIsAdminOpen(false);
      return;
    }
    if (isUserProfileOpen) {
      setIsUserProfileOpen(false);
      setIsProfileEditDirect(false);
      return;
    }
    if (isAuthOpen) {
      setIsAuthOpen(false);
      return;
    }
    if (isCartOpen) {
      setIsCartOpen(false);
      return;
    }
    if (isCompareOpen) {
      setIsCompareOpen(false);
      return;
    }
    if (isPhoneFinderOpen) {
      setIsPhoneFinderOpen(false);
      return;
    }
    if (isGiftAssistantOpen) {
      setIsGiftAssistantOpen(false);
      return;
    }
    if (isTechHubOpen) {
      setIsTechHubOpen(false);
      return;
    }
    if (isBundleBuilderOpen) {
      setIsBundleBuilderOpen(false);
      return;
    }
    if (isShowroomOpen) {
      setIsShowroomOpen(false);
      return;
    }
    if (isInstallmentModalOpen) {
      setIsInstallmentModalOpen(false);
      return;
    }
    if (isRepairOpen) {
      setIsRepairOpen(false);
      return;
    }
    if (isAiAdvisorOpen) {
      setIsAiAdvisorOpen(false);
      return;
    }

    if (selectedCategory !== 'all' || searchQuery || selectedBrand !== 'all' || onlyOffers || onlyInstallment || onlyInStock || showFullCatalog) {
      setSelectedCategory('all');
      setSearchQuery('');
      setSelectedBrand('all');
      setOnlyOffers(false);
      setOnlyInstallment(false);
      setOnlyInStock(false);
      setShowFullCatalog(false);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getGlobalBackLabel = () => {
    if (
      selectedProductDetail ||
      selectedProductFor360 ||
      isAdminOpen ||
      isUserProfileOpen ||
      isAuthOpen ||
      isCartOpen ||
      isCompareOpen ||
      isPhoneFinderOpen ||
      isTechHubOpen ||
      isBundleBuilderOpen ||
      isShowroomOpen ||
      isInstallmentModalOpen ||
      isRepairOpen ||
      isAiAdvisorOpen
    ) {
      return 'بازگشت / بستن پنجره';
    }
    if (selectedCategory !== 'all' || searchQuery || selectedBrand !== 'all' || onlyOffers || onlyInstallment || onlyInStock || showFullCatalog) {
      return 'بازگشت به همه محصولات';
    }
    return 'بازگشت به بالای صفحه';
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

  // Products matching all search & non-category filters (used for dynamic Category Chips)
  const searchMatchedProductsBeforeCategory = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    const queryTerms = query ? query.split(/\s+/).filter(Boolean) : [];

    return products.filter((product) => {
      let matchSearch = true;
      if (queryTerms.length > 0) {
        const normPersianName = normalizeSearchText(product.persianName);
        const normEnglishName = normalizeSearchText(product.name);
        const normBrand = normalizeSearchText(product.brand);
        const normCategory = normalizeSearchText(product.category);
        const normDesc = normalizeSearchText(product.description || '');

        matchSearch = queryTerms.every((term) =>
          normPersianName.includes(term) ||
          normEnglishName.includes(term) ||
          normBrand.includes(term) ||
          normCategory.includes(term) ||
          normDesc.includes(term)
        );
      }

      const matchBrand = selectedBrand === 'all' || product.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchInstallment = !onlyInstallment || product.isInstallment;
      const matchOffers = !onlyOffers || product.isOffer;
      const matchMaxPrice = maxPriceFilter >= 120000000 || product.priceToman <= maxPriceFilter;
      const matchInStock = !onlyInStock || (product.stock && product.stock > 0);

      return matchSearch && matchBrand && matchInstallment && matchOffers && matchMaxPrice && matchInStock;
    });
  }, [products, searchQuery, selectedBrand, onlyInstallment, onlyOffers, maxPriceFilter, onlyInStock]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searchMatchedProductsBeforeCategory.length };
    searchMatchedProductsBeforeCategory.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [searchMatchedProductsBeforeCategory]);

  // Filtered Products Calculation (Precise & Strict Matching)
  const filteredProducts = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    const queryTerms = query ? query.split(/\s+/).filter(Boolean) : [];

    return products.filter((product) => {
      // Precise multi-term Search
      let matchSearch = true;
      if (queryTerms.length > 0) {
        const normPersianName = normalizeSearchText(product.persianName);
        const normEnglishName = normalizeSearchText(product.name);
        const normBrand = normalizeSearchText(product.brand);
        const normCategory = normalizeSearchText(product.category);
        const normDesc = normalizeSearchText(product.description || '');

        // Every search word/term must match at least one field of the product
        matchSearch = queryTerms.every((term) =>
          normPersianName.includes(term) ||
          normEnglishName.includes(term) ||
          normBrand.includes(term) ||
          normCategory.includes(term) ||
          normDesc.includes(term)
        );
      }

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
    <div className="relative min-h-screen bg-[#f8f9fa] dark:bg-[#121316] text-[#1f1f1f] dark:text-[#e3e2e6] font-['Vazirmatn',sans-serif] selection:bg-[#d3e3fd] selection:text-[#041e49] overflow-x-hidden">
      <SEOHead />
      
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Header */}
      <Header
        products={products}
        onSelectProduct={(product) => setSelectedProductDetail(product)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        compareCount={comparedProducts.length}
        wishlistCount={userProfile.wishlistIds.length}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q.trim()) setShowFullCatalog(true);
        }}
        onOpenWishlist={() => {
          setIsProfileEditDirect(false);
          setIsUserProfileOpen(true);
        }}
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
        onOpenGiftAssistant={() => setIsGiftAssistantOpen(true)}
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
        onOpenGiftAssistant={() => setIsGiftAssistantOpen(true)}
        onOpenBundleBuilder={() => setIsBundleBuilderOpen(true)}
        onOpenShowroom={() => setIsShowroomOpen(true)}
      />

      {/* Main Catalog View */}
      <main id="catalog" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* HOMEPAGE FEATURED VIEW vs FULL CATALOG VIEW */}
        {!showFullCatalog && !searchQuery.trim() && selectedCategory === 'all' && selectedBrand === 'all' ? (
          <div className="space-y-8 bg-white dark:bg-[#1e1f23] p-6 sm:p-8 rounded-3xl border border-[#e1e3e1] dark:border-[#33353b] shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e1] dark:border-[#33353b] pb-6">
              <div>
                <span className="text-xs font-semibold text-[#0b57d0] dark:text-[#a8c7fa] bg-[#d3e3fd]/60 dark:bg-[#0842a0]/60 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                  پیشنهاد ویژه مدیریت ستاره
                </span>
                <h2 className="text-2xl font-bold text-[#1f1f1f] dark:text-white flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-[#0b57d0] dark:text-[#a8c7fa]" />
                  <span>محصولات منتخب صفحه اصلی</span>
                </h2>
                <p className="text-xs text-[#747775] dark:text-[#c4c7c5] mt-1">
                  کالاهای منتخب و پیشنهادی ویژه مدیریت فروشگاه ستاره موبایل مبارکه
                </p>
              </div>

              <button
                onClick={() => {
                  setShowFullCatalog(true);
                  const elem = document.getElementById('catalog');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-xs px-6 py-3.5 rounded-full shadow-sm transition flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-white" />
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
                  onOpenStockNotify={(p) => setStockNotifyProduct(p)}
                />
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setShowFullCatalog(true)}
                className="bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#d3e3fd] text-white dark:text-[#062e6f] font-medium text-xs px-8 py-3.5 rounded-full shadow-sm transition flex items-center justify-center gap-2 mx-auto"
              >
                <span>نمایش ویترین و محصولات بیشتر</span>
                <span className="bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                  <h2 className="text-2xl font-bold text-[#1f1f1f] dark:text-white flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-[#0b57d0] dark:text-[#a8c7fa]" />
                    <span>ویترین کامل محصولات ستاره</span>
                  </h2>

                  <button
                    onClick={() => {
                      setShowFullCatalog(false);
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                    }}
                    className="text-xs bg-[#f0f4f9] dark:bg-[#28292e] text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] font-medium px-3.5 py-1.5 rounded-full transition border border-[#e1e3e1] dark:border-[#33353b]"
                  >
                    نمایش اولیه صفحه اصلی
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#747775]">
                  <span>تعداد پیدا شده:</span>
                  <span className="bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {filteredProducts.length.toLocaleString('fa-IR')}
                  </span>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-white dark:bg-[#1e1f23] p-5 border border-[#e1e3e1] dark:border-[#33353b] rounded-3xl space-y-4 shadow-sm">
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const count = categoryCounts[cat.id] || 0;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowFullCatalog(true);
                        }}
                        className={`px-4 py-2 text-xs font-medium transition rounded-full flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0b57d0] text-white dark:bg-[#a8c7fa] dark:text-[#062e6f] shadow-sm font-semibold'
                            : 'bg-[#f0f4f9] dark:bg-[#28292e] text-[#444746] dark:text-[#c4c7c5] border border-[#e1e3e1] dark:border-[#33353b] hover:bg-[#e1e3e1]'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {count > 0 && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-white/20 dark:bg-[#062e6f]/20 font-bold'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {count.toLocaleString('fa-IR')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Brand Filter & Search */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#e1e3e1] dark:border-[#33353b]">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-medium text-[#747775] shrink-0">برند:</span>
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => {
                          setSelectedBrand(b);
                          setShowFullCatalog(true);
                        }}
                        className={`px-3.5 py-1.5 text-xs font-medium transition rounded-full ${
                          selectedBrand === b
                            ? 'bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] font-bold'
                            : 'bg-white dark:bg-[#28292e] border border-[#e1e3e1] dark:border-[#33353b] text-[#444746] dark:text-[#c4c7c5] hover:border-[#0b57d0]'
                        }`}
                      >
                        {b === 'all' ? 'همه' : b}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar with Recent Searches */}
                  <div className="relative flex-1 max-w-xs">
                    <SearchWithRecent
                      value={searchQuery}
                      onChange={(val) => {
                        setSearchQuery(val);
                        setShowFullCatalog(true);
                      }}
                      onSearchSubmit={(term) => {
                        setShowFullCatalog(true);
                        const elem = document.getElementById('catalog');
                        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      placeholder="جستجوی نام، برند یا مشخصات..."
                    />
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

            {/* Dynamic Quick Category Chips Bar for Search / Filter Results */}
            {searchQuery.trim() && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-amber-500/5 dark:to-transparent border border-amber-500/25 dark:border-amber-500/30 rounded-2xl p-4 space-y-3 animate-fadeIn mb-2 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 dark:text-amber-300">
                    <Tag className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>دسته‌بندی‌های سریع نتایج برای «<span className="text-amber-600 dark:text-amber-400 font-extrabold">{searchQuery.trim()}</span>»:</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium font-mono">
                    کل نتایج این عبارت: {searchMatchedProductsBeforeCategory.length.toLocaleString('fa-IR')} کالا
                  </span>
                </div>

                {/* Chips List */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {categories.map((cat) => {
                    const count = categoryCounts[cat.id] || 0;
                    if (cat.id !== 'all' && count === 0) return null; // Hide categories with 0 count for this search term
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowFullCatalog(true);
                        }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/50 scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950 font-bold'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                          {count.toLocaleString('fa-IR')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Grid */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#f0f4f9] dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-sm animate-fadeIn">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                  <SearchX className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#1f1f1f] dark:text-white">
                    پیدا نشد!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#444746] dark:text-[#c4c7c5] max-w-md mx-auto leading-relaxed font-medium">
                    {searchQuery.trim() ? (
                      <>
                        هیچ محصولی با عبارت «<span className="font-extrabold text-rose-600 dark:text-rose-400">{searchQuery.trim()}</span>» در فروشگاه ستاره یافت نشد.
                      </>
                    ) : (
                      <>هیچ محصولی مطابق با فیلترهای انتخابی شما در فروشگاه یافت نشد.</>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedBrand('all');
                      setMaxPriceFilter(120000000);
                      setOnlyInStock(false);
                      setOnlyOffers(false);
                      setOnlyInstallment(false);
                    }}
                    className="bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#d3e3fd] text-white dark:text-[#062e6f] font-semibold text-xs px-6 py-3 rounded-full shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>پاک کردن عبارت جستجو و فیلترها</span>
                  </button>

                  <button
                    onClick={() => setIsAiAdvisorOpen(true)}
                    className="bg-[#f0f4f9] dark:bg-[#28292e] border border-[#c4c7c5] dark:border-[#444746] text-[#1f1f1f] dark:text-white hover:bg-[#e1e3e1] font-semibold text-xs px-6 py-3 rounded-full shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>سوال از مشاور هوشمند (AI)</span>
                  </button>
                </div>
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
                    onOpenStockNotify={(p) => setStockNotifyProduct(p)}
                    onOpenPriceInquiry={(p) => setPriceInquiryProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Real Store Photo Gallery Section */}
        <StoreGallerySection />

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
            onUpdateSiteContent={handleUpdateSiteContent}
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
          currentUserId={currentUser?.phone || userProfile.phone || 'guest'}
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
        currentUserId={currentUser?.phone || userProfile.phone || 'guest'}
      />

      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onOpenInstallmentForProduct={handleOpenInstallmentForProduct}
        userPhone={userProfile.phone}
        onOpenStockNotify={(p) => setStockNotifyProduct(p)}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
        currentUser={currentUser}
        onOpenPriceInquiry={(p) => setPriceInquiryProduct(p)}
      />

      <PriceInquiryModal
        product={priceInquiryProduct}
        isOpen={Boolean(priceInquiryProduct)}
        onClose={() => setPriceInquiryProduct(null)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      <StockNotificationModal
        product={stockNotifyProduct}
        isOpen={Boolean(stockNotifyProduct)}
        onClose={() => setStockNotifyProduct(null)}
        userPhone={userProfile.phone}
        userEmail={userProfile.email}
        userId={currentUser?.phone || userProfile.phone || 'guest'}
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

      <GiftAssistantModal
        isOpen={isGiftAssistantOpen}
        onClose={() => setIsGiftAssistantOpen(false)}
        products={products}
        onAddToCart={handleAddToCart}
        onSelectProductDetail={(p) => setSelectedProductDetail(p)}
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

      {/* ALWAYS FIXED GLOBAL BACK BUTTON Across All Stages & Modals */}
      <button
        type="button"
        onClick={handleGlobalBack}
        title={getGlobalBackLabel()}
        className="fixed bottom-6 left-6 z-[99999] bg-slate-950 hover:bg-slate-900 text-yellow-400 border-2 border-yellow-400 font-black text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none backdrop-blur-md"
      >
        <ArrowRight className="w-4 h-4 text-yellow-400 group-hover:-translate-x-1 transition-transform" />
        <span className="tracking-tight">{getGlobalBackLabel()}</span>
      </button>

      {/* Footer */}
      <Footer />
    </div>
  );
}
