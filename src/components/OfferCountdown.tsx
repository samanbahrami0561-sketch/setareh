import React, { useState, useEffect } from 'react';
import { Timer, Flame } from 'lucide-react';

interface OfferCountdownProps {
  productId: string;
  variant?: 'compact' | 'detailed';
  className?: string;
}

// Convert numbers to Persian digits
function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// Format double digits (e.g. 5 -> "05")
function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

// Compute deterministic offer end time per product
function getOfferEndTime(productId: string): number {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = (hash * 31 + productId.charCodeAt(i)) % 10000;
  }
  // Offset between 3 hours (10800s) and 18 hours (64800s)
  const offsetSeconds = 10800 + (hash % 54000);
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const currentDayStart = Math.floor(now / dayMs) * dayMs;
  let target = currentDayStart + offsetSeconds * 1000 + (dayMs % offsetSeconds);
  
  if (target <= now) {
    target = now + offsetSeconds * 1000;
  }
  return target;
}

export const OfferCountdown: React.FC<OfferCountdownProps> = ({
  productId,
  variant = 'compact',
  className = '',
}) => {
  const [targetTime] = useState<number>(() => getOfferEndTime(productId));
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setTimeLeft({ hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const hStr = toPersianDigits(padZero(timeLeft.hours));
  const mStr = toPersianDigits(padZero(timeLeft.minutes));
  const sStr = toPersianDigits(padZero(timeLeft.seconds));

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 shadow-sm ${className}`}>
        <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce shrink-0" />
        <span className="text-rose-800 dark:text-rose-200 font-semibold">مهلت پیشنهاد:</span>
        <span className="font-mono dir-ltr font-bold text-rose-600 dark:text-rose-400">
          {hStr}:{mStr}:{sStr}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 text-white rounded-2xl p-3.5 shadow-md border border-rose-400/30 flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
          <Timer className="w-5 h-5 text-white animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black">
            <Flame className="w-4 h-4 text-amber-200 fill-amber-300 animate-pulse" />
            <span>پیشنهاد ویژه مدیریت ستاره موبایل</span>
          </div>
          <p className="text-[11px] text-rose-100 font-normal mt-0.5">
            فرصت باقیمانده برای خرید با قیمت استثنایی
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 dir-ltr bg-slate-950/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 font-mono">
        <div className="flex flex-col items-center min-w-[32px]">
          <span className="text-sm font-black text-amber-300">{hStr}</span>
          <span className="text-[9px] font-sans text-rose-100 font-normal">ساعت</span>
        </div>
        <span className="text-amber-300 font-bold">:</span>
        <div className="flex flex-col items-center min-w-[32px]">
          <span className="text-sm font-black text-amber-300">{mStr}</span>
          <span className="text-[9px] font-sans text-rose-100 font-normal">دقیقه</span>
        </div>
        <span className="text-amber-300 font-bold">:</span>
        <div className="flex flex-col items-center min-w-[32px]">
          <span className="text-sm font-black text-amber-300">{sStr}</span>
          <span className="text-[9px] font-sans text-rose-100 font-normal">ثانیه</span>
        </div>
      </div>
    </div>
  );
};
