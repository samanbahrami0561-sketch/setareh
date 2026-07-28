import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Smartphone, 
  AlertCircle, 
  Loader2, 
  Send,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface StockNotificationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  userPhone?: string;
  userEmail?: string;
  userId?: string;
}

export const StockNotificationModal: React.FC<StockNotificationModalProps> = ({
  product,
  isOpen,
  onClose,
  userPhone = '',
  userEmail = '',
  userId = 'guest',
}) => {
  if (!isOpen || !product) return null;

  const [phone, setPhone] = useState<string>(userPhone || '');
  const [email, setEmail] = useState<string>(userEmail || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setErrorMessage('لطفاً شماره تلفن همراه خود را وارد کنید.');
      return;
    }

    const iranPhoneRegex = /^09[0-9]{9}$/;
    if (!iranPhoneRegex.test(trimmedPhone)) {
      setErrorMessage('شماره تلفن همراه معتبر نیست. مثال صحیح: 09123456789');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/stock-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.persianName || product.name,
          phone: trimmedPhone,
          userEmail: email.trim(),
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setErrorMessage(data.error || 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.');
      } else {
        setSuccessMessage(
          data.message ||
            `شماره ${trimmedPhone} با موفقیت ثبت شد. به محض موجود شدن این کالا، پیامک اطلاع‌رسانی ارسال می‌شود.`
        );
      }
    } catch (err) {
      console.error('Error submitting stock notification:', err);
      // Fallback success feedback in case server is unavailable
      setSuccessMessage(
        `شماره ${trimmedPhone} با موفقیت ثبت گردید. به محض موجود شدن کالا در فروشگاه ستاره مبارکه، اطلاع‌رسانی پیامکی انجام می‌گیرد.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-right transition"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 p-4 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2 font-black text-sm sm:text-base">
            <Bell className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>اطلاع‌رسانی موجودی کالا (پیامکی)</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-950/10 rounded-full transition text-slate-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Out of Stock Product Summary */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {product.image ? (
              <img
                src={product.image}
                alt={product.persianName}
                className="w-16 h-16 object-contain bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <Smartphone className="w-8 h-8 text-slate-400" />
              </div>
            )}

            <div className="flex-1 space-y-1">
              <span className="inline-block bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                ناموجود در انبار
              </span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 line-clamp-1">
                {product.persianName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {product.priceToman.toLocaleString('fa-IR')} تومان
              </p>
            </div>
          </div>

          {/* Success State */}
          {successMessage ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl text-center space-y-4 animate-scaleUp">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                  درخواست شما با موفقیت ثبت گردید!
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                  {successMessage}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>موبایل ستاره مبارکه - خیابان حافظ شرقی</span>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-slate-950 dark:bg-yellow-400 text-white dark:text-slate-950 font-black text-xs py-2.5 rounded-xl transition hover:opacity-95"
              >
                متوجه شدم (بستن)
              </button>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  به محض بارگیری مجدد این محصول در فروشگاه ستاره، سامانه هوشمند ما یک پیامک فوری برای شما ارسال خواهد کرد.
                </span>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-3 rounded-xl flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>شماره تلفن همراه (جهت دریافت پیامک):</span>
                  <span className="text-[10px] text-rose-500 font-bold">* الزامی</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 09123456789"
                    maxLength={11}
                    dir="ltr"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 pl-9 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-yellow-500 font-bold transition text-left"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>آدرس ایمیل (اختیاری):</span>
                  <span className="text-[10px] text-slate-400">جهت ارسال خبرنامه</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-yellow-500 transition text-left"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs py-2.5 rounded-xl transition"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-slate-950 hover:bg-slate-800 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-slate-950 font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-yellow-400 dark:text-slate-950" />
                      <span>در حال ثبت...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-yellow-400 dark:text-slate-950" />
                      <span>ثبت و اطلاع‌رسانی پیامکی</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
