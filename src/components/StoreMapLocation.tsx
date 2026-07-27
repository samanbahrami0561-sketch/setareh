import React, { useState } from 'react';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  Instagram, 
  Navigation, 
  Copy, 
  Check, 
  Star, 
  Truck, 
  ShieldCheck, 
  Share2, 
  Bookmark,
  ExternalLink
} from 'lucide-react';

export const StoreMapLocation: React.FC = () => {
  const [copiedPlusCode, setCopiedPlusCode] = useState(false);

  const plusCode = "8GR3+VW6";

  const handleCopyPlusCode = () => {
    navigator.clipboard.writeText(plusCode);
    setCopiedPlusCode(true);
    setTimeout(() => setCopiedPlusCode(false), 2000);
  };

  const mapLinks = {
    google: `https://www.google.com/maps/search/?api=1&query=8GR3%2BVW6+Mobarakeh`,
    neshan: `https://neshan.org/maps/search/8GR3%2BVW6`,
    balad: `https://balad.ir/search?q=8GR3%2BVW6`
  };

  return (
    <div id="address" className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-950 text-white flex items-center justify-center">
            <MapPin className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">مکان‌نما و آدرس حضوری موبایل ستاره</h3>
              <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                کسب‌وکار ثبت‌شده و معتبر
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">اصفهان، مبارکه، خیابان حافظ شرقی</p>
          </div>
        </div>

        {/* Rating badge */}
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 border border-slate-200 text-xs">
          <div className="flex items-center gap-1 text-slate-950 font-bold">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>۴.۸</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">(۱۲ نظر گوگل)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Top Interactive Info */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Address Box */}
          <div className="bg-slate-50 p-4 border border-slate-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-slate-950 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 block font-medium">نشانی دقیق فروشگاه:</span>
                <p className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                  استان اصفهان، مبارکه، خیابان حافظ شرقی
                </p>
              </div>
            </div>

            {/* Plus Code Copy */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">کد اختصاصی گوگل (Plus Code):</span>
              <button
                onClick={handleCopyPlusCode}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 font-mono font-bold px-3 py-1.5 rounded transition"
              >
                {copiedPlusCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>8GR3+VW6</span>
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-slate-50 p-4 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <PhoneCall className="w-4 h-4 text-slate-950" />
                تلفن تماس ثابت:
              </span>
              <a
                href="tel:03152415779"
                className="text-slate-950 font-black text-sm hover:underline"
                dir="ltr"
              >
                031 5241 5779
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Instagram className="w-4 h-4 text-pink-600" />
                اینستاگرام رسمی:
              </span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 hover:text-pink-600 font-bold flex items-center gap-1"
              >
                <span>instagram.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-slate-950" />
                خدمات ارسال:
              </span>
              <span className="text-emerald-700 font-bold">ارسال سریع در شهر مبارکه و سراسر استان اصفهان</span>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-950" />
                ساعات کاری فروشگاه:
              </span>
              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-bold">
                🟢 ۱۰:۳۰ الی ۲۱:۳۰
              </span>
            </div>
            
            <div className="space-y-1 text-slate-600 font-medium pr-2 border-r-2 border-slate-950">
              <p>شنبه تا پنج‌شنبه: ۱۰:۳۰ صبح الی ۲۱:۳۰ شب (یکسره)</p>
              <p>جمعه‌ها: ۱۴:۰۰ الی ۲۰:۰۰ (بخش آنلاین فعال است)</p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="space-y-2">
            <span className="text-xs text-slate-500 block font-medium">مسیریابی هوشمند مستقیم:</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <a
                href={mapLinks.google}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold p-2.5 flex items-center justify-center gap-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-950" />
                <span>گوگل مپ</span>
              </a>

              <a
                href={mapLinks.neshan}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold p-2.5 flex items-center justify-center gap-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>نشان</span>
              </a>

              <a
                href={mapLinks.balad}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold p-2.5 flex items-center justify-center gap-1.5 transition"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>بلد</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Map Visual Display */}
        <div className="lg:col-span-7 bg-slate-950 text-white border-2 border-slate-950 overflow-hidden relative min-h-[340px] flex flex-col justify-between p-6">
          
          {/* Simulated Interactive Map Display */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

          {/* Top Map Card Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200 font-bold">موقعیت آنلاین روی نقشه خیابان حافظ شرقی</span>
            </div>

            <a
              href={mapLinks.google}
              target="_blank"
              rel="noreferrer"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs px-3 py-1.5 flex items-center gap-1 shadow-sm transition uppercase tracking-wider"
            >
              <span>بازکردن در نقشه بزرگ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Center Location Pin Graphic */}
          <div className="relative z-10 my-auto text-center py-8 space-y-3">
            <div className="relative inline-block">
              <div className="w-16 h-16 bg-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <MapPin className="w-8 h-8 fill-slate-950 text-yellow-400" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">فروشگاه موبایل ستاره (Setareh Mobile)</h4>
              <p className="text-xs text-yellow-400 font-bold">مبارکه، خیابان حافظ شرقی</p>
              <p className="text-[11px] text-slate-400 font-mono">Plus Code: 8GR3+VW6</p>
            </div>
          </div>

          {/* Bottom Store Snapshot Info */}
          <div className="relative z-10 bg-slate-900/90 border border-slate-800 p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
            <div>
              <span className="text-slate-400 block">شهر / استان:</span>
              <span className="font-bold text-slate-100">مبارکه، استان اصفهان</span>
            </div>
            <div>
              <span className="text-slate-400 block">خیابان اصلی:</span>
              <span className="font-bold text-slate-100">حافظ شرقی</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">تحویل حضوری:</span>
              <span className="font-bold text-emerald-400">امکان‌پذیر است</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
