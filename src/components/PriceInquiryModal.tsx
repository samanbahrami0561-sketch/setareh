import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  MessageCircle, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2, 
  ShoppingBag,
  ExternalLink,
  Phone
} from 'lucide-react';
import { Product } from '../types';
import { ImageLoader } from './ImageLoader';

interface PriceInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export const PriceInquiryModal: React.FC<PriceInquiryModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const whatsappMessage = encodeURIComponent(
    `سلام، وقت بخیر. قصد استعلام قیمت لحظه‌ای و خرید محصول «${product.persianName}» را دارم.`
  );
  const whatsappUrl = `https://wa.me/989131234567?text=${whatsappMessage}`;
  const telegramUrl = `https://t.me/setareh_mobile`;

  const handleRequestCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setPhoneNumber('');
        setUserName('');
        onClose();
      }, 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto font-sans text-right animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 p-4 sm:p-5 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-950/10 rounded-2xl">
              <PhoneCall className="w-5 h-5 text-slate-950 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">
                استعلام قیمت لحظه‌ای و تماس برای خرید
              </h3>
              <p className="text-[11px] font-bold text-slate-900/80">
                ارتباط مستقیم با کارشناسان فروشگاه ستاره مبارکه
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">

          {/* Product Overview Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl">
            <ImageLoader
              src={product.image}
              alt={product.persianName}
              width={64}
              height={64}
              containerClassName="w-16 h-16 shrink-0 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800"
              className="object-contain max-h-full max-w-full"
            />
            <div className="flex-1 space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                {product.persianName}
              </h4>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {product.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  قیمت درج‌شده: {product.priceToman.toLocaleString('fa-IR')} تومان
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
                  استعلام تخفیف روز
                </span>
              </div>
            </div>
          </div>

          {/* Direct 1-Click Actions */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
              کانال‌های ارتباط مستقیم فوری:
            </label>

            {/* Direct Phone Call Button */}
            <a
              href="tel:03152415759"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-between transition shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Phone className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black">تماس مستقیم تلفنی با واحد فروش</span>
                  <span className="block text-[10px] font-mono text-emerald-100 dir-ltr">۰۳۱-۵۲۴۱۵۷۵۹</span>
                </div>
              </div>
              <span className="bg-white/20 px-3 py-1 rounded-xl text-[11px] font-bold group-hover:bg-white/30 transition">
                شماره‌گیری فوری
              </span>
            </a>

            {/* WhatsApp Contact */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-between transition shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black">استعلام قیمت و مشاوره در واتساپ</span>
                  <span className="block text-[10px] font-mono text-emerald-100">پاسخگویی زیر ۳ دقیقه</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white group-hover:scale-110 transition" />
            </a>

            {/* Telegram Contact */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white p-3.5 rounded-2xl font-black text-xs flex items-center justify-between transition shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <span className="block text-xs font-black">ارتباط در تلگرام ستاره موبایل</span>
                  <span className="block text-[10px] font-mono text-sky-100">@setareh_mobile</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white group-hover:scale-110 transition" />
            </a>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">
                یا درخواست تماس تلفنی ثبت کنید
              </span>
            </div>
          </div>

          {/* Callback Request Form */}
          {isSubmitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
              <h5 className="text-xs font-black text-emerald-900 dark:text-emerald-200">
                درخواست تماس شما ثبت شد!
              </h5>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                کارشناسان فروشگاه ستاره مبارکه به زودی جهت اعلام قیمت روز با شما تماس خواهند گرفت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestCallback} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام و نام خانوادگی:
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="مثلاً: علی بهرامی"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره همراه: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0913..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-950 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-500 text-white dark:text-slate-950 py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-400 dark:text-slate-950" />
                <span>ارسال درخواست تماس تلفنی فوری</span>
              </button>
            </form>
          )}

          {/* Additional Cart action */}
          {onAddToCart && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">قصد ثبت سفارش آنلاین دارید؟</span>
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="text-xs font-black text-[#0b57d0] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>افزودن به سبد خرید آنلاین</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2.5 text-center text-[10px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>فروشگاه حضوری ستاره: مبارکه، خیابان حافظ شرقی</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>ساعات کاری: ۹ الی ۲۱:۳۰</span>
          </span>
        </div>

      </div>
    </div>
  );
};
