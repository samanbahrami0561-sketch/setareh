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
  Sparkles,
  Gift
} from 'lucide-react';
import { SiteContentConfig } from '../types';

interface HeroBannerProps {
  onOpenAiAdvisor: () => void;
  onOpenInstallment: () => void;
  onOpenRepair: () => void;
  onNavigateAddress?: () => void;
  onOpenPhoneFinder?: () => void;
  onOpenGiftAssistant?: () => void;
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
  onOpenGiftAssistant,
  onOpenBundleBuilder,
  onOpenShowroom = () => {},
  siteContent
}) => {
  const heroTitle = siteContent?.heroTitle || 'مرکز تخصصی فروش و تعمیرات موبایل ستاره مبارکه';
  const heroSubtitle = siteContent?.heroSubtitle || 'مرجع رسمی جدیدترین گوشی‌های آیفون، سامسونگ، شیائومی، لوازم جانبی اورجینال و خدمات تخصصی تعمیرات سخت‌افزار و نرم‌افزار در شهر مبارکه استان اصفهان.';
  const bannerImage = siteContent?.heroBannerImage || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800';
  const storePhone = siteContent?.storePhone || '031 5241 5779';

  return (
    <div className="relative overflow-hidden bg-[#f8f9fa] dark:bg-[#121316] border-b border-[#e1e3e1] dark:border-[#33353b] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Verified Google Store Badge */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-[#1e1f23] border border-[#c4c7c5] dark:border-[#444746] px-3.5 py-1.5 rounded-full shadow-sm text-xs">
              <span className="px-2.5 py-0.5 bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] text-[11px] font-semibold rounded-full">
                فروشگاه تایید شده
              </span>
              <div className="flex items-center gap-1 text-[#1f1f1f] dark:text-[#e3e2e6] font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>۴.۸</span>
              </div>
              <span className="text-[#c4c7c5]">•</span>
              <span className="text-[#444746] dark:text-[#c4c7c5] font-medium">(۱۲ نظر مشتریان مبارکه)</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1f1f1f] dark:text-white tracking-tight leading-tight">
                {heroTitle}
              </h2>
              <p className="text-[#444746] dark:text-[#c4c7c5] text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
                {heroSubtitle}
              </p>
            </div>

            {/* Store Features Material Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] p-3 rounded-2xl shadow-sm text-[#1f1f1f] dark:text-[#e3e2e6] font-medium">
                <CreditCard className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
                <span>فروش اقساطی</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] p-3 rounded-2xl shadow-sm text-[#1f1f1f] dark:text-[#e3e2e6] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
                <span>گارانتی ۱۸ ماهه</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] p-3 rounded-2xl shadow-sm text-[#1f1f1f] dark:text-[#e3e2e6] font-medium">
                <Truck className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
                <span>ارسال فوری</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] p-3 rounded-2xl shadow-sm text-[#1f1f1f] dark:text-[#e3e2e6] font-medium">
                <Wrench className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
                <span>تعمیرات ۱ ساعته</span>
              </div>
            </div>

            {/* Google Store Style Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenShowroom}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#d3e3fd] text-white dark:text-[#062e6f] font-medium text-sm px-6 py-3.5 rounded-full shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>نمایشگاه ۳ بعدی کارکرده</span>
              </button>

              {onOpenGiftAssistant && (
                <button
                  onClick={onOpenGiftAssistant}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium text-sm px-6 py-3.5 rounded-full shadow-md transition transform hover:-translate-y-0.5"
                >
                  <Gift className="w-4 h-4 text-white animate-bounce" />
                  <span>دستیار هوشمند هدیه 🎁</span>
                </button>
              )}

              <button
                onClick={onOpenAiAdvisor}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#c2e7ff] dark:bg-[#004d7a] text-[#001d33] dark:text-[#c2e7ff] hover:bg-[#a8c7fa] font-medium text-sm px-6 py-3.5 rounded-full transition"
              >
                <Sparkles className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa]" />
                <span>مشاوره هوشمند AI</span>
              </button>

              <button
                onClick={onOpenInstallment}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#1e1f23] border border-[#747775] text-[#1f1f1f] dark:text-[#e3e2e6] font-medium text-sm px-6 py-3.5 rounded-full hover:bg-[#f0f4f9] dark:hover:bg-[#28292e] transition"
              >
                <CreditCard className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa]" />
                <span>محاسبه اقساط</span>
              </button>
            </div>

            {/* Quick Contact & Google Map Direct Link */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-[#444746] dark:text-[#c4c7c5] border-t border-[#e1e3e1] dark:border-[#33353b]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa]" />
                <span>اصفهان، مبارکه، خیابان حافظ شرقی (کد پلاس: <code className="text-[#1f1f1f] dark:text-white font-mono bg-white dark:bg-[#28292e] px-2 py-0.5 border border-[#c4c7c5] rounded">8GR3+VW6</code>)</span>
              </div>
              <button
                onClick={onNavigateAddress}
                className="flex items-center gap-1 text-[#0b57d0] dark:text-[#a8c7fa] hover:underline font-medium"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>مسیریابی روی نقشه</span>
              </button>
            </div>

          </div>

          {/* Hero Visual Card / Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] rounded-3xl p-6 shadow-sm overflow-hidden group">
              
              {/* Store Offer Badge */}
              <div className="absolute top-4 right-4 bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] font-medium text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0b57d0] dark:bg-[#a8c7fa]"></span>
                <span>پیشنهاد ویژه ستاره</span>
              </div>

              {/* Product Visual */}
              <div className="relative my-6 text-center">
                <div className="w-48 h-48 mx-auto relative rounded-2xl bg-[#f0f4f9] dark:bg-[#28292e] flex items-center justify-center p-4 overflow-hidden group-hover:scale-105 transition duration-300">
                  <img
                    src={bannerImage}
                    alt="موبایل ستاره مبارکه"
                    className="object-contain h-full w-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating Specs */}
                <div className="mt-4 space-y-1">
                  <span className="text-xs text-[#0b57d0] dark:text-[#a8c7fa] font-semibold uppercase tracking-wider">آیفون ۱۶ پرو مکس ۲۵۶ گیگ</span>
                  <h3 className="text-xl font-bold text-[#1f1f1f] dark:text-white">iPhone 16 Pro Max</h3>
                  <div className="flex items-center justify-center gap-2 text-xs pt-1">
                    <span className="line-through text-[#747775]">۹۸,۰۰۰,۰۰۰</span>
                    <span className="text-[#0b57d0] dark:text-[#a8c7fa] font-bold text-base bg-[#d3e3fd]/60 dark:bg-[#0842a0]/60 px-2.5 py-0.5 rounded-full">۹۴,۵۰۰,۰۰۰ تومان</span>
                  </div>
                </div>
              </div>

              {/* Quick Perks */}
              <div className="bg-[#f0f4f9] dark:bg-[#28292e] rounded-2xl p-3.5 border border-[#e1e3e1] dark:border-[#33353b] text-xs space-y-2 text-[#444746] dark:text-[#c4c7c5]">
                <div className="flex items-center justify-between">
                  <span>تحویل فوری مبارکه:</span>
                  <span className="text-[#0b57d0] dark:text-[#a8c7fa] font-semibold">کمتر از ۳۰ دقیقه</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>شرایط اقساطی:</span>
                  <span className="text-[#1f1f1f] dark:text-white font-semibold">پیش‌پرداخت ۳۰٪ + چک صیادی</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>تلفن تماس:</span>
                  <a href={`tel:${storePhone}`} className="text-[#0b57d0] dark:text-[#a8c7fa] font-bold hover:underline" dir="ltr">{storePhone}</a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
