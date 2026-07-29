import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { 
  X, 
  Gift, 
  Sparkles, 
  ChevronLeft, 
  RotateCcw, 
  ShoppingBag, 
  Check, 
  Heart, 
  Award, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  PackageCheck,
  Eye,
  Info
} from 'lucide-react';

interface GiftAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, selectedColor?: string) => void;
  onSelectProductDetail: (product: Product) => void;
}

export const GiftAssistantModal: React.FC<GiftAssistantModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onSelectProductDetail
}) => {
  const [step, setStep] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>('');
  const [interest, setInterest] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [preferredBrand, setPreferredBrand] = useState<string>('any');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  // Question options
  const recipientOptions = [
    { id: 'partner', label: 'همسر / پارتنر', icon: '💖', desc: 'هدیه‌ای شیک، ماندگار و چشم‌گیر' },
    { id: 'parent', label: 'پدر / مادر', icon: '👨‍👩‍👧', desc: 'صفحه باکیفیت، کاربری آسان و باتری قوی' },
    { id: 'youth', label: 'فرزند / جوان / دانشجو', icon: '⚡', desc: 'دوربین عالی، سرعت بالا و طراحی مدرن' },
    { id: 'friend', label: 'دوست / همکار', icon: '🤝', desc: 'لوازم جانبی یا گوشی ارزشمند و کاربردی' }
  ];

  const interestOptions = [
    { id: 'camera', label: 'عکاسی و تولید محتوا', icon: '📸', desc: 'دوربین باکیفیت و ثبت ویدیوهای شفاف' },
    { id: 'gaming', label: 'گیمینگ و بازی‌های سنگین', icon: '🎮', desc: 'پردازنده قوی و نرخ نوسازی بالا' },
    { id: 'luxury', label: 'پرچم‌دار، شیک و لوکس', icon: '👑', desc: 'طراحی خاص، بدنه تیتانیومی و برند معتبر' },
    { id: 'daily', label: 'شارژدهی بالا و کاربری روزمره', icon: '🔋', desc: 'باتری ماندگار، سرعت شارژ بالا و دوام زیاد' },
    { id: 'accessories', label: 'موسیقی و لوازم جانبی', icon: '🎧', desc: 'هندزفری بی‌سیم، پاوربانک مگ‌سیف یا شارژر اصلی' }
  ];

  const budgetOptions = [
    { id: 'under5m', label: 'زیر ۵ میلیون تومان', desc: 'هندزفری بی‌سیم، کاور مگ‌سیف، گلس اصلی و پاوربانک', min: 0, max: 5000000 },
    { id: '5to15m', label: '۵ تا ۱۵ میلیون تومان', desc: 'گوشی‌های اقتصادی ارزشمند و هندزفری‌های پرچم‌دار', min: 5000000, max: 15000000 },
    { id: '15to35m', label: '۱۵ تا ۳۵ میلیون تومان', desc: 'گوشی‌های میان‌رده فوق‌العاده قوی و تبلت', min: 15000000, max: 35000000 },
    { id: '35to70m', label: '۳۵ تا ۷۰ میلیون تومان', desc: 'قاتل پرچم‌دارها و مدل‌های برتر آیفون و سامسونگ', min: 35000000, max: 70000000 },
    { id: 'above70m', label: 'بالای ۷۰ میلیون تومان', desc: 'پرچم‌داران لوکس بازار (S25 Ultra / iPhone 16 Pro Max)', min: 70000000, max: 999000000 }
  ];

  const brandOptions = [
    { id: 'any', label: 'فرقی نمی‌کند (بهترین پیشنهاد)' },
    { id: 'Apple', label: 'اپل (Apple)' },
    { id: 'Samsung', label: 'سامسونگ (Samsung)' },
    { id: 'Xiaomi', label: 'شیائومی (Xiaomi)' },
    { id: 'Anker', label: 'انکر / بیسوس (Anker & Baseus)' }
  ];

  // Filtering algorithm with Admin Gift Metadata support
  const getRecommendedProducts = () => {
    const selectedBudgetObj = budgetOptions.find((b) => b.id === budget) || budgetOptions[2];
    
    let filtered = products.filter((p) => {
      // Budget check
      const withinPrice = p.priceToman >= selectedBudgetObj.min && p.priceToman <= selectedBudgetObj.max;
      
      // Brand check
      let brandMatch = true;
      if (preferredBrand !== 'any') {
        if (preferredBrand === 'Anker') {
          brandMatch = p.brand === 'Anker' || p.brand === 'Baseus';
        } else {
          brandMatch = p.brand === preferredBrand;
        }
      }

      return withinPrice && brandMatch;
    });

    // If budget filter returned no results, relax budget constraint but keep brand preference if any
    if (filtered.length === 0) {
      filtered = products.filter((p) => {
        if (preferredBrand !== 'any') {
          return preferredBrand === 'Anker' ? (p.brand === 'Anker' || p.brand === 'Baseus') : p.brand === preferredBrand;
        }
        return true;
      });
    }

    // Score and rank products with high precision
    const scored = filtered.map((p) => {
      let score = 65;
      let reason = '';

      const recLabel = recipientOptions.find(r => r.id === recipient)?.label || 'عزیزانتان';
      const interestLabel = interestOptions.find(i => i.id === interest)?.label || 'کاربرد مد نظر شما';

      // 1. Check explicit giftMetadata configured by admin in panel
      let hasExplicitRecipientTag = false;
      let hasExplicitPersonalityTag = false;

      if (p.giftMetadata?.recipients && recipient) {
        if (p.giftMetadata.recipients.includes(recipient as any)) {
          score += 20;
          hasExplicitRecipientTag = true;
        }
      }

      if (p.giftMetadata?.personalities && interest) {
        if (p.giftMetadata.personalities.includes(interest as any)) {
          score += 20;
          hasExplicitPersonalityTag = true;
        }
      }

      // If custom gift note is set by admin, prioritize it as recommendation reason
      if (p.giftMetadata?.customGiftNote && p.giftMetadata.customGiftNote.trim().length > 0) {
        reason = p.giftMetadata.customGiftNote;
      }

      // 2. Dynamic scoring based on category, specs, and usageTags
      if (interest === 'camera') {
        if (p.usageTags?.includes('photography') || p.specs?.camera?.includes('MP') || p.name.includes('Ultra') || p.brand === 'Apple') {
          score += 15;
          if (!reason) reason = `انتخابی فوق‌العاده برای ${recLabel} جهت ثبت لحظات زیبا با دوربین شفاف باکیفیت`;
        }
      } else if (interest === 'gaming') {
        if (p.usageTags?.includes('gaming') || p.specs?.screen?.includes('120Hz') || p.specs?.processor?.includes('Snapdragon')) {
          score += 15;
          if (!reason) reason = `گزینه‌ای عالی برای ${recLabel} جهت اجرای روان بازی‌ها و پردازش سنگین بدون افت فریم`;
        }
      } else if (interest === 'luxury') {
        if (p.priceToman > 30000000 || p.brand === 'Apple' || p.name.includes('Ultra') || p.name.includes('Pro')) {
          score += 15;
          if (!reason) reason = `هدیه‌ای پرچمدار، مجلل و ماندگار که حس ارزشمندی فوق‌العاده‌ای به ${recLabel} می‌بخشد`;
        }
      } else if (interest === 'daily') {
        if (p.usageTags?.includes('daily') || p.specs?.battery || p.category === 'smartphones') {
          score += 15;
          if (!reason) reason = `انتخابی هوشمندانه و پرکاربرد برای ${recLabel} با شارژدهی بالا و استفاده راحت روزمره`;
        }
      } else if (interest === 'accessories') {
        if (p.category === 'headphones' || p.category === 'chargers' || p.category === 'accessories' || p.category === 'smartwatches') {
          score += 18;
          if (!reason) reason = `هدایای جانبی کاربردی و اصلی با کیفیت صدای شفاف و ماندگاری برای ${recLabel}`;
        }
      }

      // Fallback reason if none assigned
      if (!reason) {
        reason = `پیشنهاد ویژه دستیار هدیه برای ${recLabel} متناسب با سلیقه ${interestLabel}`;
      }

      // Ratings & Offers bonus
      if (p.isOffer) score += 3;
      if (p.rating >= 4.8) score += 3;
      if (preferredBrand !== 'any' && (p.brand === preferredBrand || (preferredBrand === 'Anker' && p.brand === 'Baseus'))) {
        score += 5;
      }

      // Calculate final match percentage between 88% and 99%
      const matchPercent = Math.min(99, Math.max(88, score));

      return {
        product: p,
        matchPercent,
        reason,
        isExplicitMatch: hasExplicitRecipientTag || hasExplicitPersonalityTag
      };
    });

    // Sort by explicit match first, then score
    scored.sort((a, b) => {
      if (a.isExplicitMatch !== b.isExplicitMatch) {
        return a.isExplicitMatch ? -1 : 1;
      }
      return b.matchPercent - a.matchPercent;
    });

    return scored.slice(0, 4);
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product, product.colors[0]?.name || '');
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const resetQuiz = () => {
    setStep(1);
    setRecipient('');
    setInterest('');
    setBudget('');
    setPreferredBrand('any');
  };

  const recommendations = step === 5 ? getRecommendedProducts() : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div ref={modalRef} className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden my-6 text-right transition-all">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Gift className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>دستیار هوشمند انتخاب هدیه</span>
                <Sparkles className="w-4 h-4 text-amber-200 fill-amber-300" />
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                یافتن بهترین گوشی یا اکسسوری متناسب با بودجه و سلیقه عزیزانتان
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        {step <= 4 && (
          <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>مرحله {step} از ۴</span>
              <span className="text-amber-500">•</span>
              <span>
                {step === 1 && 'گیرنده هدیه'}
                {step === 2 && 'علاقه و کاربرد'}
                {step === 3 && 'محدوده بودجه'}
                {step === 4 && 'برند ترجیحی'}
              </span>
            </div>
            <div className="flex gap-1.5 dir-ltr">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i <= step ? 'w-6 bg-amber-500' : 'w-2 bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6">
          {/* STEP 1: Recipient */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center sm:text-right">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  هدیه را برای چه کسی خریداری می‌کنید؟
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  ارتباط شما با گیرنده هدیه به ما در ارائه پیشنهاد مناسب‌تر کمک می‌کند.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {recipientOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setRecipient(opt.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border-2 text-right transition-all flex items-start gap-3 hover:shadow-md ${
                      recipient === opt.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Interest */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    مهم‌ترین اولویت و علاقه گیرنده هدیه چیست؟
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ویژگی که او را بیش از همه خوشحال می‌کند انتخاب کنید.
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>قبلی</span>
                </button>
              </div>

              <div className="space-y-2.5 pt-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setInterest(opt.id);
                      setStep(3);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 text-right transition-all flex items-center justify-between hover:shadow-md ${
                      interest === opt.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Budget */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    محدوده بودجه شما چقدر است؟
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    محصولات دقیقاً منطبق با سقف بودجه انتخابی شما نمایش داده خواهند شد.
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>قبلی</span>
                </button>
              </div>

              <div className="space-y-2.5 pt-2">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setBudget(opt.id);
                      setStep(4);
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 text-right transition-all flex items-center justify-between hover:shadow-md ${
                      budget === opt.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-400">{opt.label}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Brand */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    آیا برند خاصی مد نظر دارید؟
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    در صورت علاقه به یک برند مشخص، آن را انتخاب کنید یا گزینه همه برندها را بگذارید.
                  </p>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>قبلی</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {brandOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPreferredBrand(opt.id);
                      setStep(5);
                    }}
                    className={`p-4 rounded-2xl border-2 text-right font-bold text-xs transition-all flex items-center justify-between ${
                      preferredBrand === opt.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: RESULTS */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-md">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      بهترین پیشنهادهای هدیه ستاره موبایل
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      بر اساس بودجه، ویژگی‌ها و معیارهای انتخابی هوشمند شما
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetQuiz}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-800/80 transition shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>تغییر معیارهای هدیه</span>
                </button>
              </div>

              {/* Gift Service Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-xl shrink-0 shadow-md">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-slate-800 dark:text-slate-200">
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 block text-xs">🎁 کادوپیچی و بسته بندی هدیه رایگان ستاره</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">تمامی خریدهای این بخش همراه با جعبه کادویی شیک و کارت تبریک اختصاصی تحویل می‌گردند.</span>
                  </div>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendations.map(({ product, matchPercent, reason }) => {
                  const isAdded = Boolean(addedIds[product.id]);

                  return (
                    <div
                      key={product.id}
                      className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden transform hover:-translate-y-1"
                    >
                      {/* Match Badge */}
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white font-mono font-black text-[10px] px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-white animate-pulse" />
                        <span>٪{matchPercent} تطابق هدیه</span>
                      </div>

                      {/* Explicit Tag Badge if available */}
                      {product.giftMetadata?.customGiftNote && (
                        <div className="absolute top-3 right-3 z-10 bg-slate-900/90 text-amber-300 text-[9.5px] font-black px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>پیشنهاد ویژه کارشناس</span>
                        </div>
                      )}

                      <div>
                        {/* Image Container with Hover Zoom */}
                        <div
                          onClick={() => {
                            onClose();
                            onSelectProductDetail(product);
                          }}
                          className="cursor-pointer w-full h-40 bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-3 relative group/img border border-slate-100 dark:border-slate-800"
                        >
                          <img
                            src={product.image}
                            alt={product.persianName}
                            className="max-h-full max-w-full object-contain group-hover/img:scale-110 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                            <span className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-amber-500" />
                              <span>مشاهده سریع</span>
                            </span>
                          </div>
                        </div>

                        {/* Brand & Title */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                            {product.brand}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {product.warranty || 'گارانتی اصلی'}
                          </span>
                        </div>

                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProductDetail(product);
                          }}
                          className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 hover:text-amber-500 transition cursor-pointer"
                        >
                          {product.persianName}
                        </h4>

                        {/* Recommendation Reason */}
                        <div className="mt-2 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-slate-950 dark:to-slate-950 p-2.5 rounded-2xl border border-amber-200/60 dark:border-slate-800">
                          <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium flex items-start gap-1.5">
                            <span className="text-amber-500 shrink-0 text-sm">💡</span>
                            <span>{reason}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions & Price */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">قیمت نهایی:</span>
                          <div className="text-left">
                            {product.originalPriceToman && product.originalPriceToman > product.priceToman && (
                              <div className="text-[10px] text-slate-400 line-through">
                                {product.originalPriceToman.toLocaleString('fa-IR')}
                              </div>
                            )}
                            <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
                              {product.priceToman.toLocaleString('fa-IR')}{' '}
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">تومان</span>
                            </div>
                          </div>
                        </div>

                        {/* Distinct Interactive Buttons Grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* 1. View Details Button */}
                          <button
                            onClick={() => {
                              onClose();
                              onSelectProductDetail(product);
                            }}
                            className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>مشاهده جزئیات</span>
                          </button>

                          {/* 2. Add to Cart / Buy Gift Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                              isAdded
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-amber-500/20'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-4 h-4 text-white animate-bounce" />
                                <span>افزوده شد</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4 text-white" />
                                <span>افزودن به سبد</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
