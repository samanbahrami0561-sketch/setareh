import React from 'react';
import { 
  Star, 
  MapPin, 
  PhoneCall, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Wrench, 
  Navigation, 
  ChevronLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SiteContentConfig } from '../types';

interface HeroBannerProps {
  onOpenAiAdvisor: () => void;
  onOpenInstallment: () => void;
  onOpenRepair: () => void;
  onNavigateAddress?: () => void;
  onOpenPhoneFinder?: () => void;
  onOpenBundleBuilder?: () => void;
  onOpenShowroom?: () => void;
  siteContent?: SiteContentConfig;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAiAdvisor,
  onOpenInstallment,
  onOpenRepair,
  onNavigateAddress = () => {},
  onOpenPhoneFinder,
  onOpenBundleBuilder,
  onOpenShowroom = () => {},
  siteContent
}) => {
  const heroTitle = siteContent?.heroTitle || 'مرکز تخصصی فروش و تعمیرات موبایل ستاره مبارکه';
  const heroSubtitle = siteContent?.heroSubtitle || 'مرجع رسمی جدیدترین گوشی‌های آیفون، سامسونگ، شیائومی، لوازم جانبی اورجینال و خدمات تخصصی تعمیرات سخت‌افزار و نرم‌افزار در شهر مبارکه استان اصفهان.';
  const bannerImage = siteContent?.heroBannerImage || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800';
  const storePhone = siteContent?.storePhone || '031 5241 5779';
  const storeAddress = siteContent?.storeAddress || 'اصفهان، مبارکه، خیابان حافظ شرقی (کد پلاس: 8GR3+VW6)';

  return (
    <div className="relative overflow-hidden bg-slate-50 border-b border-slate-200 pt-10 pb-14">
      {/* Abstract Tech Visual Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Verified Google Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 bg-white border border-slate-200 p-1.5 pr-3 pl-4 shadow-sm text-xs">
              <span className="px-2.5 py-1 bg-yellow-400 text-[10px] font-black uppercase tracking-tight text-slate-900 rounded">
                PREMIUM STORE
              </span>
              <div className="flex items-center gap-1 text-slate-900 font-bold">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>۴.۸</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">(۱۲ نظر مشتریان مبارکه)</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                <span className="text-slate-950 underline decoration-yellow-400 decoration-8 underline-offset-8">
                  {heroTitle}
                </span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
                {heroSubtitle}
              </p>
            </div>

            {/* Store Features Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="flex items-center gap-2 bg-white border-r-4 border-slate-950 border-y border-l border-slate-200 p-3 shadow-sm text-slate-900 font-bold">
                <CreditCard className="w-4 h-4 text-slate-950 shrink-0" />
                <span>فروش اقساطی</span>
              </div>
              <div className="flex items-center gap-2 bg-white border-r-4 border-blue-500 border-y border-l border-slate-200 p-3 shadow-sm text-slate-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>گارانتی ۱۸ ماهه</span>
              </div>
              <div className="flex items-center gap-2 bg-white border-r-4 border-slate-950 border-y border-l border-slate-200 p-3 shadow-sm text-slate-900 font-bold">
                <Truck className="w-4 h-4 text-slate-950 shrink-0" />
                <span>ارسال فوری</span>
              </div>
              <div className="flex items-center gap-2 bg-white border-r-4 border-yellow-400 border-y border-l border-slate-200 p-3 shadow-sm text-slate-900 font-bold">
                <Wrench className="w-4 h-4 text-yellow-500 shrink-0" />
                <span>تعمیرات ۱ ساعته</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenShowroom}
                className="btn-clipped flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-yellow-400 border border-yellow-400/40 font-black text-sm px-6 py-3.5 shadow-lg hover:border-yellow-400 transition duration-200"
              >
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span>نمایشگاه ۳ بعدی گوشی‌های دست دوم</span>
              </button>

              <button
                onClick={onOpenAiAdvisor}
                className="btn-clipped flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-950 text-white font-bold text-sm px-6 py-3.5 shadow-lg hover:bg-slate-800 transition duration-200"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>مشاوره هوشمند AI</span>
              </button>

              <button
                onClick={onOpenInstallment}
                className="btn-clipped flex-1 sm:flex-none flex items-center justify-center gap-2 bg-yellow-400 text-slate-950 font-bold text-sm px-6 py-3.5 shadow-md hover:bg-yellow-300 transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>محاسبه اقساط</span>
              </button>
            </div>

            {/* Quick Contact & Google Map Direct Link */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>اصفهان، مبارکه، خیابان حافظ شرقی (کد پلاس: <code className="text-slate-900 font-mono bg-white px-2 py-0.5 border border-slate-200">8GR3+VW6</code>)</span>
              </div>
              <button
                onClick={onNavigateAddress}
                className="flex items-center gap-1 text-slate-950 hover:text-blue-600 font-bold underline underline-offset-4"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>مسیریابی روی نقشه</span>
              </button>
            </div>

          </div>

          {/* Hero Visual Card / Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white border-2 border-slate-200 rounded-[2.5rem] p-6 shadow-xl overflow-hidden group">
              
              {/* Store Offer Badge */}
              <div className="absolute top-4 left-4 bg-yellow-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-none uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                <span>پیشنهاد ویژه ستاره</span>
              </div>

              {/* Product Visual */}
              <div className="relative my-6 text-center">
                <div className="w-48 h-48 mx-auto relative rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center p-4 overflow-hidden group-hover:scale-105 transition duration-500">
                  <img
                    src={bannerImage}
                    alt="موبایل ستاره مبارکه"
                    className="object-contain h-full w-full drop-shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating Specs */}
                <div className="mt-4 space-y-1">
                  <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">آیفون ۱۶ پرو مکس ۲۵۶ گیگ</span>
                  <h3 className="text-xl font-black text-slate-900">iPhone 16 Pro Max</h3>
                  <div className="flex items-center justify-center gap-2 text-xs pt-1">
                    <span className="line-through text-slate-400 font-light">۹۸,۰۰۰,۰۰۰</span>
                    <span className="text-slate-950 font-black text-base bg-yellow-400/50 px-2 py-0.5 rounded">۹۴,۵۰۰,۰۰۰ تومان</span>
                  </div>
                </div>
              </div>

              {/* Quick Perks */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2 text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">تحویل فوری مبارکه:</span>
                  <span className="text-emerald-700 font-bold">کمتر از ۳۰ دقیقه</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">شرایط اقساطی:</span>
                  <span className="text-slate-900 font-bold">پیش‌پرداخت ۳۰٪ + چک صیادی</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">تلفن تماس:</span>
                  <a href={`tel:${storePhone}`} className="text-slate-950 font-bold hover:underline" dir="ltr">{storePhone}</a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
