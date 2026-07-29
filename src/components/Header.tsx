import React, { useState, useEffect, useRef } from 'react';
import { SearchWithRecent } from './SearchWithRecent';
import { 
  Smartphone, 
  Search, 
  ShoppingBag, 
  Heart,
  Sparkles, 
  PhoneCall, 
  MapPin, 
  Scale, 
  Wrench, 
  Calculator, 
  Star,
  Menu,
  X,
  User,
  Sliders,
  Newspaper,
  PackagePlus,
  Lock,
  Wallet,
  LogIn,
  LogOut,
  Crown,
  Box,
  Layers,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Edit3,
  Wrench as WrenchIcon,
  ShoppingBag as OrderIcon,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { requestNotificationPermission } from '../lib/notification';
import { SiteContentConfig, UserAccount } from '../types';

interface HeaderProps {
  cartCount: number;
  compareCount: number;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  onOpenCart: () => void;
  onOpenCompare: () => void;
  onOpenAiAdvisor: () => void;
  onOpenRepair: () => void;
  onOpenInstallment: () => void;
  onOpenUserProfile?: () => void;
  onOpenProfile?: () => void;
  onOpenProfileEdit?: () => void;
  onOpenPhoneFinder: () => void;
  onOpenTechHub: () => void;
  onOpenGiftAssistant?: () => void;
  onOpenBundleBuilder: () => void;
  onOpenAdmin: () => void;
  onOpenShowroom?: () => void;
  onOpenFullCatalog?: () => void;
  onOpenAuth?: () => void;
  onOpenAuthModal?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  walletBalance?: number;
  siteContent?: SiteContentConfig;
  currentUser: UserAccount | null;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  compareCount,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenCart,
  onOpenCompare,
  onOpenAiAdvisor,
  onOpenRepair,
  onOpenInstallment,
  onOpenUserProfile,
  onOpenProfile,
  onOpenProfileEdit,
  onOpenPhoneFinder,
  onOpenTechHub,
  onOpenGiftAssistant = () => {},
  onOpenBundleBuilder,
  onOpenAdmin,
  onOpenShowroom = () => {},
  onOpenFullCatalog = () => {},
  onOpenAuth,
  onOpenAuthModal,
  searchQuery = '',
  setSearchQuery = () => {},
  activeSection = 'catalog',
  setActiveSection = () => {},
  walletBalance = 0,
  siteContent,
  currentUser,
  onLogout = () => {},
  isDarkMode = false,
  onToggleDarkMode = () => {}
}) => {
  const handleOpenAuth = onOpenAuthModal || onOpenAuth || (() => {});
  const handleOpenProfile = onOpenUserProfile || onOpenProfile || (() => {});
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown states for decluttered UI
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toolsList = [
    { id: 'ai', label: 'مشاور هوشمند خرید (AI)', icon: Sparkles, action: onOpenAiAdvisor, highlight: true },
    { id: 'gift', label: 'دستیار هوشمند انتخاب هدیه 🎁', icon: Gift, action: onOpenGiftAssistant, highlight: true },
    { id: 'finder', label: 'ابزار پیشنهاد گوشی', icon: Sliders, action: onOpenPhoneFinder },
    { id: 'installment', label: 'محاسبه اقساط آنلاین', icon: Calculator, action: onOpenInstallment },
    { id: 'repair', label: 'رزرو تعمیرات تخصصی', icon: Wrench, action: onOpenRepair },
    { id: 'bundle', label: 'باندل سفارشی (۱۰٪ تخفیف)', icon: PackagePlus, action: onOpenBundleBuilder },
    { id: 'compare', label: 'مقایسه تخصصی گوشی‌ها', icon: Scale, action: onOpenCompare, badge: compareCount },
    { id: 'techhub', label: 'مجله تکنولوژی و آنباکس', icon: Newspaper, action: onOpenTechHub },
  ];

  const topBannerText = siteContent?.topBannerText || 'موبایل ستاره مبارکه (امتیاز ۴.۸ از ۵)';
  const storePhone = siteContent?.storePhone || '031 5241 5779';

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-2' 
        : 'bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-2.5'
    }`}>
      {/* Google Store Style Top Announcement Bar */}
      <div className="bg-[#f0f4f9] dark:bg-[#1e1f23] text-[#1f1f1f] dark:text-[#e3e2e6] border-b border-[#e1e3e1] dark:border-[#33353b] py-2 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#0b57d0] dark:text-[#a8c7fa] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#0b57d0] text-[#0b57d0] dark:fill-[#a8c7fa] dark:text-[#a8c7fa]" />
              {topBannerText}
            </span>
            <span className="hidden md:inline text-[#c4c7c5]">|</span>
            <span className="hidden md:flex items-center gap-1 text-[#444746] dark:text-[#c4c7c5]">
              <MapPin className="w-3.5 h-3.5 text-[#0b57d0] dark:text-[#a8c7fa]" />
              خیابان حافظ شرقی، مبارکه | تماس: {storePhone}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Switcher Pill */}
            <button
              onClick={onToggleDarkMode}
              className="text-[#444746] dark:text-[#c4c7c5] hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] font-medium text-xs flex items-center gap-1.5 transition bg-white dark:bg-[#28292e] border border-[#c4c7c5] dark:border-[#444746] px-2.5 py-1 rounded-full shadow-sm"
              title={isDarkMode ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">روز</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">شب</span>
                </>
              )}
            </button>

            <button
              onClick={async () => {
                const res = await requestNotificationPermission();
                if (res === 'granted') {
                  alert('اعلان‌های مرورگر با موفقیت فعال شدند!');
                } else if (res === 'denied') {
                  alert('دسترسی اعلان‌ها مسدود است.');
                }
              }}
              className="text-[#444746] dark:text-[#c4c7c5] hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] font-medium text-xs flex items-center gap-1.5 transition bg-white dark:bg-[#28292e] border border-[#c4c7c5] dark:border-[#444746] px-2.5 py-1 rounded-full shadow-sm"
            >
              <Bell className="w-3.5 h-3.5 text-[#0b57d0] dark:text-[#a8c7fa]" />
              <span className="hidden sm:inline">اعلان</span>
            </button>

            {currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner') && (
              <button
                onClick={onOpenAdmin}
                className="text-[#0b57d0] dark:text-[#a8c7fa] font-semibold text-xs flex items-center gap-1 transition bg-[#d3e3fd] dark:bg-[#0842a0] px-2.5 py-1 rounded-full"
              >
                <Lock className="w-3 h-3" />
                <span>پنل مدیریت</span>
              </button>
            )}

            <a 
              href="tel:03152415779" 
              className="flex items-center gap-1 text-[#0b57d0] dark:text-[#a8c7fa] font-semibold transition text-xs"
              dir="ltr"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              031 5241 5779
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveSection('catalog')} 
              className="flex items-center gap-3 group text-right focus:outline-none"
            >
              <div className="w-10 h-10 bg-[#0b57d0] rounded-full flex items-center justify-center text-white shadow-sm group-hover:bg-[#0842a0] transition shrink-0">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#1f1f1f] dark:text-[#e3e2e6] tracking-tight">
                    موبایل <span className="text-[#0b57d0] dark:text-[#a8c7fa]">ستاره</span>
                  </h1>
                  <span className="bg-[#d3e3fd] dark:bg-[#004d7a] text-[#041e49] dark:text-[#7fcfff] text-[10px] font-medium px-2 py-0.5 rounded-full">
                    مبارکه
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Clean Primary Navigation Links (Desktop Material 3 Pills) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#f0f4f9] dark:bg-[#1e1f23] p-1.5 rounded-full border border-[#e1e3e1] dark:border-[#33353b] text-xs font-medium">
            <button
              onClick={() => {
                setActiveSection('catalog');
                const elem = document.getElementById('catalog');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition ${
                activeSection === 'catalog' 
                  ? 'bg-[#0b57d0] text-white dark:bg-[#a8c7fa] dark:text-[#062e6f] font-semibold shadow-sm' 
                  : 'text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>فروشگاه و محصولات</span>
            </button>

            <button
              onClick={onOpenShowroom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition"
            >
              <Box className="w-3.5 h-3.5 text-yellow-500" />
              <span>نمایشگاه ۳بعدی</span>
              <span className="bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 text-[9px] px-1 rounded font-mono">
                کارکرده
              </span>
            </button>

            {/* SERVICES & TOOLS DROPDOWN MENU */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-400/10 dark:bg-yellow-400/20 text-slate-900 dark:text-yellow-300 hover:bg-yellow-400/20 font-black transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                <span>خدمات و ابزارها</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Content */}
              {isToolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold px-3 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                    ابزارهای هوشمند خرید و خدمات
                  </div>

                  {toolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          tool.action();
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition text-right ${
                          tool.highlight
                            ? 'bg-yellow-400/10 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-400/20'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${tool.highlight ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span>{tool.label}</span>
                        </div>
                        {tool.badge !== undefined && tool.badge > 0 && (
                          <span className="bg-yellow-400 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar (Compact & Sleek with Recent Searches) */}
          <div className="hidden lg:block flex-1 max-w-xs relative">
            <SearchWithRecent
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                if (val) onOpenFullCatalog();
              }}
              onSearchSubmit={(term) => {
                onOpenFullCatalog();
                const elem = document.getElementById('catalog');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              placeholder="جستجوی سریع..."
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* USER ACCOUNT DROPDOWN OR LOGIN BUTTON */}
            {currentUser ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 bg-slate-950 text-white dark:bg-slate-800 dark:text-yellow-400 font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-800 transition border border-slate-800 shadow-sm"
                >
                  <User className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* USER DROPDOWN MENU */}
                {isUserDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-right text-xs font-bold space-y-1 animate-fadeIn">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl mb-1 border border-slate-100 dark:border-slate-800">
                      <div className="text-slate-900 dark:text-white font-black truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono" dir="ltr">{currentUser.phone}</div>
                    </div>

                    {/* EDIT PROFILE DIRECT BUTTON */}
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenProfileEdit) {
                          onOpenProfileEdit();
                        } else {
                          handleOpenProfile();
                        }
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-yellow-600 dark:text-yellow-400 hover:bg-yellow-400/10 transition text-right"
                    >
                      <Edit3 className="w-4 h-4 text-yellow-500" />
                      <span>ویرایش اطلاعات و شناسنامه</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        handleOpenProfile();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-emerald-500" />
                        <span>کیف پول و اعتبار</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold">
                        {walletBalance.toLocaleString('fa-IR')}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        handleOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <OrderIcon className="w-4 h-4 text-blue-500" />
                      <span>تاریخچه سفارشات</span>
                    </button>

                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner') && (
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>پنل مدیریت ارشد</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>خروج از حساب کاربری</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleOpenAuth}
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs px-3 py-2 transition rounded-xl shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}

            {/* Wishlist Button with Badge */}
            <button
              onClick={onOpenWishlist || handleOpenProfile}
              className="relative flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition group"
              title="لیست علاقه‌مندی‌ها"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-md border-2 border-white dark:border-slate-900 animate-pulse">
                  {wishlistCount.toLocaleString('fa-IR')}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 dark:bg-yellow-400 dark:hover:bg-yellow-300 text-white dark:text-slate-950 font-black px-3.5 py-2 transition rounded-xl"
            >
              <ShoppingBag className="w-4 h-4 text-yellow-400 dark:text-slate-950" />
              <span className="hidden sm:inline text-xs">سبد</span>
              {cartCount > 0 && (
                <span className="bg-yellow-400 text-slate-950 dark:bg-slate-950 dark:text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 pb-3 space-y-3 font-bold text-xs">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی کالای مورد نظر..."
                className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl pr-9 pl-4 py-2 border border-slate-200 dark:border-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveSection('catalog');
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-right flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-yellow-500" />
                <span>فروشگاه اصلی</span>
              </button>

              <button
                onClick={() => {
                  onOpenShowroom();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-right flex items-center gap-2"
              >
                <Box className="w-4 h-4 text-yellow-500" />
                <span>نمایشگاه ۳بعدی</span>
              </button>
            </div>

            <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
              خدمات و ابزارها:
            </div>

            <div className="grid grid-cols-2 gap-2">
              {toolsList.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      tool.action();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-right"
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


