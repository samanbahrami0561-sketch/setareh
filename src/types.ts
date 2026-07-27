export interface ProductSpecs {
  screen: string;
  processor: string;
  ram: string;
  storage: string;
  camera: string;
  battery: string;
  refreshRate?: string;
  chargingSpeed?: string;
  waterproof?: string;
  has5G?: boolean;
  hasedSIM?: boolean;
}

export interface Product {
  id: string;
  name: string;
  persianName: string;
  category: 'smartphones' | 'accessories' | 'smartwatches' | 'headphones' | 'chargers';
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Anker' | 'Baseus' | 'JBL' | 'Huawei';
  priceToman: number;
  originalPriceToman?: number;
  image: string;
  images360?: string[];
  colors: { name: string; hex: string }[];
  specs: ProductSpecs;
  isTopSeller?: boolean;
  isOffer?: boolean;
  isInstallment?: boolean;
  isFeaturedOnHome?: boolean;
  rating: number;
  reviewsCount: number;
  stock: number;
  warranty: string;
  description: string;
  unboxingVideoUrl?: string;
  usageTags?: ('gaming' | 'photography' | 'student' | 'content_creation' | 'daily')[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  location?: string;
  verified?: boolean;
  likes?: number;
  dislikes?: number;
  userImage?: string;
}

export interface ProductQA {
  id: string;
  productId: string;
  author: string;
  date: string;
  question: string;
  answers: {
    id: string;
    author: string;
    isStaff?: boolean;
    date: string;
    text: string;
  }[];
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmountToman?: number;
  description: string;
  minOrderToman: number;
  expiresAt: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmountToman: number;
  discountToman: number;
  finalAmountToman: number;
  status: 'در حال پردازش' | 'تایید شده' | 'ارسال شده' | 'تحویل گردیده';
  shippingAddress: string;
  paymentMethod: 'کیف پول ستاره' | 'پرداخت آنلاین' | 'پرداخت در محل (مبارکه)';
  trackingCode: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  secondaryPhone?: string;
  email?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  nationalCode?: string;
  avatar?: string;
  isContactVerified?: boolean;
  walletBalanceToman: number;
  loyaltyPoints: number;
  loyaltyTier: 'برنز' | 'نقره‌ای' | 'طلایی' | 'الماسی';
  referralCode: string;
  wishlistIds: string[];
  coupons: Coupon[];
  orders: Order[];
}

export interface BlogArticle {
  id: string;
  title: string;
  category: 'بررسی تخصصی' | 'ویدئو آنباکس' | 'اخبار موبایل' | 'آموزش و ترفند';
  image: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  views: number;
}

export interface RepairBooking {
  id?: string;
  customerName: string;
  phone: string;
  deviceModel: string;
  issue: string;
  preferredTime?: string;
  status?: string;
}

export type UserRole = 'owner' | 'admin' | 'sales' | 'support' | 'customer';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  phone: string;
  email?: string;
  nationalCode?: string;
  birthDate?: string;
  address?: string;
  isIdentityVerified?: boolean;
  role: UserRole;
  status: 'active' | 'suspended' | 'banned';
  registeredAt: string;
  walletBalanceToman: number;
  loyaltyPoints?: number;
  ordersCount: number;
  referralCode?: string;
}

export interface SiteContentConfig {
  topBannerText: string;
  storePhone: string;
  workingHours: string;
  isOpenNow: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerImage: string;
  heroBadgeText: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  catalogTitle: string;
  catalogSubtitle: string;
  storeAddress: string;
  instagramHandle: string;
  whatsappNumber: string;
}

export interface InstallmentCalcResult {
  priceToman: number;
  downPaymentPercent: number;
  downPaymentToman: number;
  loanAmountToman: number;
  months: number;
  monthlyPaymentToman: number;
  totalPayableToman: number;
}

export interface UsedPhone {
  id: string;
  name: string;
  persianName: string;
  brand: 'Apple' | 'Samsung' | 'Xiaomi' | 'Google' | 'Huawei';
  priceToman: number;
  originalPriceToman?: number;
  batteryHealth: number; // e.g. 92
  conditionGrade: 'A+' | 'A' | 'A-'; // Grade
  conditionText: string; // e.g. 'در حد آکبند - بدون حتی یک خط و خش'
  color: string;
  colorHex: string;
  storage: string;
  ram: string;
  partNumber?: string; // e.g. 'LL/A' or 'CH/A' or 'TH/A'
  guarantee: string; // e.g. 'مهلت تست ۷ روزه ستاره + ۱ ماه گارانتی مغازه'
  boxAndAccessories: boolean;
  boxItems: string[];
  repairsHistory: string; // e.g. 'تمام قطعات فابریک و بدون تعویضی'
  description: string;
  image: string;
  '3dColorHex': string;
  specs: ProductSpecs;
  serialNumber: string;
  viewsCount?: number;
}

