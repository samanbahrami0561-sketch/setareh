import { BlogArticle, ProductQA, Review, UserProfile, Coupon, UserAccount, SiteContentConfig } from '../types';

export const INITIAL_USERS_LIST: UserAccount[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    name: 'سامان بهرامی (مالک اصلی)',
    phone: '09131234567',
    email: 'saman.bahrami0561@gmail.com',
    nationalCode: '1289876543',
    birthDate: '1365/04/12',
    address: 'مبارکه، خیابان حافظ شرقی، پلاک ۱۱۲',
    isIdentityVerified: true,
    role: 'owner',
    status: 'active',
    registeredAt: '۱۴۰۲/۰۱/۱۵',
    walletBalanceToman: 284500000,
    loyaltyPoints: 1250,
    ordersCount: 42
  },
  {
    id: 'usr-1',
    username: 'alireza_b',
    name: 'علیرضا بهرامی',
    phone: '09359876543',
    email: 'alireza.b@gmail.com',
    nationalCode: '1270098234',
    birthDate: '1372/08/20',
    address: 'مبارکه، خیابان شریعتی، کوچه بهار، پلاک ۴',
    isIdentityVerified: true,
    role: 'customer',
    status: 'active',
    registeredAt: '۱۴۰۳/۰۲/۱۰',
    walletBalanceToman: 9400000,
    loyaltyPoints: 380,
    ordersCount: 6
  },
  {
    id: 'usr-2',
    username: 'sara_rezaei',
    name: 'سارا رضایی',
    phone: '09121122334',
    email: 'sara.rezaei@yahoo.com',
    nationalCode: '1290345112',
    birthDate: '1378/11/05',
    address: 'مبارکه، بلوار امام خمینی، مجتمع صدف، واحد ۱۲',
    isIdentityVerified: false,
    role: 'customer',
    status: 'active',
    registeredAt: '۱۴۰۳/۰۴/۰۱',
    walletBalanceToman: 1500000,
    loyaltyPoints: 120,
    ordersCount: 3
  },
  {
    id: 'usr-3',
    username: 'sales_operator',
    name: 'مهدی احمدی (اپراتور فروش)',
    phone: '09139998877',
    email: 'm.ahmadi@setarehmobile.ir',
    nationalCode: '1284567890',
    birthDate: '1370/02/15',
    address: 'مبارکه، میدان انقلاب، خیابان سلمان فارسی',
    isIdentityVerified: true,
    role: 'sales',
    status: 'active',
    registeredAt: '۱۴۰۳/۰۱/۰۵',
    walletBalanceToman: 0,
    loyaltyPoints: 50,
    ordersCount: 0
  }
];

export const INITIAL_SITE_CONTENT: SiteContentConfig = {
  topBannerText: 'فروشگاه موبایل ستاره مبارکه (امتیاز ۴.۸ از ۵)',
  storePhone: '031 5241 5779',
  storePhone2: '09131112233',
  workingHours: 'هم‌اکنون باز است (۱۰:۳۰ الی ۲۱:۳۰)',
  isOpenNow: true,
  heroTitle: 'مرکز تخصصی فروش اقساطی گوشی و لوازم جانبی در مبارکه',
  heroSubtitle: 'خرید مستقیم جدیدترین گوشی‌های آیفون، سامسونگ و شیائومی با تضمین اصالت کالا، ۱۸ ماه گارانتی شرکتی و اقساط فوری بدون ضامن',
  heroBannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
  heroBadgeText: '⭐️ معتبرترین مرجع دیجیتال مبارکه',
  primaryCtaText: 'مشاهده ویترین و قیمت‌ها',
  secondaryCtaText: 'محاسبه سریع اقساط',
  feature1Title: 'گارانتی ۱۸ ماهه اصلی',
  feature1Desc: 'تمام گوشی‌ها با کد رجیستری معتبر و گارانتی رسمی',
  feature2Title: 'خرید اقساطی فوری',
  feature2Desc: 'شرایط آسان بدون ضامن با کمترین چک یا سفته',
  feature3Title: 'تحویل فوری در مبارکه',
  feature3Desc: 'ارسال مجانی و پیک اختصاصی در کمتر از ۲ ساعت',
  feature4Title: 'پشتیبانی و تعمیرات',
  feature4Desc: 'ارائه قطعات اورجینال و تعمیرات سخت‌افزاری معتبر',
  catalogTitle: 'جدیدترین گوشی‌ها و لوازم جانبی',
  catalogSubtitle: 'بهترین قیمت روز در بازار مبارکه و اصفهان با تحویل فوری',
  storeAddress: 'اصفهان، مبارکه، خیابان حافظ شرقی، روبروی بانک ملی، فروشگاه موبایل ستاره',
  instagramHandle: 'setareh_mobile_mobarakeh',
  telegramHandle: 'setarehmobile_official',
  whatsappNumber: '09130000000',
  neshanMapLink: 'https://neshan.org/maps/search/8GR3%2BVW6',
  baladMapLink: 'https://balad.ir/search?q=8GR3%2BVW6',
  googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=8GR3%2BVW6+Mobarakeh',
  productCtaMode: 'inquiry_modal',
  productCtaButtonText: 'استعلام قیمت لحظه‌ای',
  productCtaCustomLink: 'https://wa.me/989130000000',
  heroSliders: [
    {
      id: 'slider-1',
      title: 'پرچم‌داران سری آیفون ۱۶ و ۱۵ با گارانتی اصلی',
      subtitle: 'ارسال فوری در مبارکه + مهلت تست ۷ روزه ستاره',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1200',
      badgeText: 'پیشنهاد ویژه',
      isActive: true
    },
    {
      id: 'slider-2',
      title: 'فروش اقساطی بدون ضامن با کمترین پیش‌پرداخت',
      subtitle: 'تنها با چک صیادی در اقساط ۳ تا ۲۴ ماهه',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1200',
      badgeText: 'شرایط اقساطی',
      isActive: true
    }
  ],
  promoBanners: [
    {
      id: 'promo-1',
      title: 'جشنواره تخفیف‌های طلایی لوازم جانبی اورجینال انکر و سامسونگ',
      subtitle: 'شارژر اصلی، هندزفری بی‌سیم و کاورهای ضدضربه با قیمت عمده',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
      badgeText: 'حراج ویژه جانبی',
      isActive: true
    }
  ]
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'سامان بهرامی',
  phone: '۰۹۱۳۴۵۶۷۸۹۰',
  walletBalanceToman: 1250000,
  loyaltyPoints: 480,
  loyaltyTier: 'طلایی',
  referralCode: 'SETAREH-7890',
  wishlistIds: ['p-1', 'p-4', 'p-8'],
  coupons: [
    {
      code: 'WELCOME100',
      discountAmountToman: 100000,
      description: 'هدیه خوش‌آمدگویی باشگاه مشتریان موبایل ستاره',
      minOrderToman: 500000,
      expiresAt: '۱۴۰۳/۱۲/۲۹'
    },
    {
      code: 'VIPGIFT500',
      discountAmountToman: 500000,
      description: 'کوپن تخفیف اختصاصی سطح طلایی ستاره',
      minOrderToman: 10000000,
      expiresAt: '۱۴۰۴/۰۱/۱۵'
    }
  ],
  orders: [
    {
      id: 'ORD-98214',
      date: '۱۴۰۳/۰۵/۱۲',
      items: [
        {
          product: {
            id: 'p-8',
            name: 'Anker PowerBank 20000mAh 87W',
            persianName: 'پاوربانک انکر ۲۰۰۰۰ میلی‌آمپر ۸۷ وات فست',
            category: 'chargers',
            brand: 'Anker',
            priceToman: 3850000,
            image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&q=80&w=800',
            colors: [{ name: 'مشکی مات', hex: '#1a1a1a' }],
            specs: {
              screen: 'نمایشگر دیجیتال',
              processor: 'MultiProtect',
              ram: '-',
              storage: '-',
              camera: '-',
              battery: '20000mAh'
            },
            rating: 4.9,
            reviewsCount: 62,
            stock: 15,
            warranty: '۱۸ ماه گارانتی انکر',
            description: 'پاوربانک حرفه‌ای انکر'
          },
          quantity: 1,
          selectedColor: 'مشکی مات'
        }
      ],
      totalAmountToman: 3850000,
      discountToman: 100000,
      finalAmountToman: 3750000,
      status: 'تحویل گردیده',
      shippingAddress: 'مبارکه، بلوار شهید بهشتی، پلاک ۱۲',
      paymentMethod: 'کیف پول ستاره',
      trackingCode: '382910482019'
    }
  ]
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'b-1',
    title: 'مقایسه سیر تا پیاز آیفون ۱۶ پرو مکس با S25 اولترا؛ پرچمدار کدام برند برنده است؟',
    category: 'بررسی تخصصی',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    date: '۲ مرداد ۱۴۰۳',
    readTime: '۶ دقیقه مطالعه',
    summary: 'تحلیل دقیق دوربین، پردازنده، شارژدهی باتری و هوش مصنوعی در جدیدترین دوئل سال ۲۰۲۵.',
    content: `در این مقاله تخصصی از وبلاگ موبایل ستاره، دو غول صنعت موبایل جهان یعنی آیفون ۱۶ پرو مکس و سامسونگ گلکسی S25 اولترا را در سناریوهای واقعی بررسی می‌کنیم. از توان پردازشی تراشه A18 Pro و اسنپدراگون ۸ الیت تا عملکرد دوربین ۲۰۰ مگاپیکسلی و قابلیت‌های هوش مصنوعی Galaxy AI و Apple Intelligence...`,
    views: 1420
  },
  {
    id: 'b-2',
    title: 'ویدئو و گزارش آنباکسینگ شیائومی ۱۵ پرو ۵۱۲ گیگ با گارانتی رسمی ستاره',
    category: 'ویدئو آنباکس',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
    date: '۲۸ تیر ۱۴۰۳',
    readTime: '۴ دقیقه ویدئو',
    summary: 'جعبه‌گشایی کامل پرچمدار جدید شیائومی، بررسی لنزهای دوربین لایکا و شارژر ۹۰ واتی داخل جعبه.',
    content: `در این ویدئو جعبه شیائومی ۱۵ پرو را باز می‌کنیم. اقلام همراه شامل کابل شارژ فست، کلگی شارژر، قاب محافظ ژله‌ای اصلی و دفترچه‌ها بررسی می‌شوند.`,
    views: 980
  },
  {
    id: 'b-3',
    title: '۱۰ ترفند طلایی افزایش طول عمر باتری آیفون و سامسونگ در فصل تابستان',
    category: 'آموزش و ترفند',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800',
    date: '۲۰ تیر ۱۴۰۳',
    readTime: '۵ دقیقه مطالعه',
    summary: 'چگونه از سلامت باتری (Battery Health) گوشی خود در دمای بالای تابستان محافظت کنیم؟',
    content: `گرما دشمن شماره یک باتری‌های لیتیوم-یونی است. در این مطلب ساده‌ترین تنظیماتی که بار پردازشی و حرارت گوشی را کاهش می‌دهند آموزش داده شده است.`,
    views: 2310
  }
];

export const MOCK_PRODUCT_REVIEWS: Record<string, Review[]> = {
  'p-1': [
    {
      id: 'rev-101',
      author: 'امیرحسین رضایی',
      rating: 5,
      date: '۴ مرداد ۱۴۰۳',
      comment: 'گوشی فوق‌العاده‌ایه، رنگ تیتانیوم صحرایی رو حضوری از فروشگاه مبارکه تحویل گرفتم. شارژدهی باتری نسبت به آیفون ۱۵ پرو مکس حداقل ۲۰ درصد بهتر شده و دکمه جدید کنترل دوربین هم واسه عکاسی خیلی کاربردیه.',
      location: 'مبارکه',
      verified: true,
      likes: 18,
      dislikes: 1
    },
    {
      id: 'rev-102',
      author: 'مهدیه خسروی',
      rating: 5,
      date: '۲۸ تیر ۱۴۰۳',
      comment: 'خرید اقساطی بدون ضامن از ستاره خیلی راحت انجام شد. رفتار پرسنل فروشگاه فوق‌العاده محترمانه بود و نیم ساعته رجیستری رو فعال کردن.',
      location: 'مبارکه',
      verified: true,
      likes: 12,
      dislikes: 0
    },
    {
      id: 'rev-103',
      author: 'کامران بابایی',
      rating: 4,
      date: '۱۵ تیر ۱۴۰۳',
      comment: 'کیفیت ساخت و صفحه نمایش محشره. تنها نکته منفی وزنش هست که بعد نیم ساعت عکاسی مداوم کمی دست رو خسته میکنه ولی قدرت پردازنده A18 Pro همه چیو جبران میکنه.',
      location: 'اصفهان',
      verified: true,
      likes: 8,
      dislikes: 2
    }
  ],
  'p-2': [
    {
      id: 'rev-201',
      author: 'سیامک قربانی',
      rating: 5,
      date: '۳ مرداد ۱۴۰۳',
      comment: 'قلم S-Pen و هوش مصنوعی Galaxy AI روی این گوشی غوغا میکنه. دوربین ۲۰۰ مگاپیکسلی تو شب عکسای بی‌پایانی ثبت میکنه. از ستاره ممنونم بابت ارسال ۲ ساعته.',
      location: 'مبارکه',
      verified: true,
      likes: 15,
      dislikes: 0
    },
    {
      id: 'rev-202',
      author: 'زهرا موسوی',
      rating: 5,
      date: '۲۰ تیر ۱۴۰۳',
      comment: 'صفحه نمایش بدون انعکاس نوری این مدل نسبت به S24 اولترا بهبود چشمگیری داشته زیر نور مستقیم خورشید مبارکه راحت دیده میشه.',
      location: 'دیزیچه',
      verified: true,
      likes: 9,
      dislikes: 1
    }
  ],
  'p-8': [
    {
      id: 'rev-801',
      author: 'محمد جواد قاسمی',
      rating: 5,
      date: '۲۹ تیر ۱۴۰۳',
      comment: 'بهترین پاوربانک بازار همینه. لپ‌تاپ مک‌بوک و آیفون رو همزمان با سرعت بالا شارژ میکنه. بدنه مقاومی داره و صفحه نمایش دیجیتالش دقیق درصد شارژ باقی‌مانده رو نشون میده.',
      location: 'طالخونچه',
      verified: true,
      likes: 7,
      dislikes: 0
    }
  ]
};

export const MOCK_PRODUCT_QAS: ProductQA[] = [
  {
    id: 'qa-1',
    productId: 'p-1',
    author: 'حسین احمدی',
    date: '۱ مرداد ۱۴۰۳',
    question: 'آیا آیفون ۱۶ پرو مکس موجود در ستاره کد رجیستری معتبر دارد و در شبکه همتا فعال می‌شود؟',
    answers: [
      {
        id: 'ans-1',
        author: 'پشتیبانی فنی موبایل ستاره',
        isStaff: true,
        date: '۱ مرداد ۱۴۰۳',
        text: 'سلام وقت بخیر. بله تمام گوشی‌های آیفون ستاره دارای کد رجیستری معتبر و ۱۸ ماه گارانتی شرکتی همراه با مهلت تست هستند.'
      }
    ]
  },
  {
    id: 'qa-2',
    productId: 'p-2',
    author: 'رضا مرادی',
    date: '۲۵ تیر ۱۴۰۳',
    question: 'بین این مدل و S24 Ultra برای گیمینگ شدید کدومش خنک‌تر می‌مونه؟',
    answers: [
      {
        id: 'ans-2',
        author: 'مهندس امینی (کارشناس ستاره)',
        isStaff: true,
        date: '۲۶ تیر ۱۴۰۳',
        text: 'S25 Ultra به دلیل محفظه بخار (Vapor Chamber) ۱.۵ برابر بزرگتر و تراشه ۳ نانومتری Snapdragon 8 Elite پایداری فریم‌ریت بالاتری در پابجی و کالاف دیوتی دارد.'
      }
    ]
  },
  {
    id: 'qa-3',
    productId: 'p-1',
    author: 'محمد کشاورز',
    date: '۲۹ تیر ۱۴۰۳',
    question: 'امکان خرید اقساطی با سفته صیادی هم وجود داره یا حتما باید چک صیادی بنفش ارائه بدیم؟',
    answers: [
      {
        id: 'ans-3',
        author: 'بخش اعتبارات اقساطی ستاره',
        isStaff: true,
        date: '۳۰ تیر ۱۴۰۳',
        text: 'سلام کاربر عزیز. هر دو حالت چک صیادی بنفش و سفته الکترونیک بانکی امکان‌پذیر است. جهت استعلام دقیق می‌توانید دکمه "محاسبه اقساط" را بزنید یا با شماره فروشگاه ۵۲۴۱NTc5 تماس بگیرید.'
      }
    ]
  }
];
