import React from 'react';
import { 
  Star, 
  MapPin, 
  PhoneCall, 
  Instagram, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Wrench, 
  Heart,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t-2 border-slate-900 text-slate-400 text-xs text-right mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Store Intro */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
                <Star className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  موبایل <span className="text-yellow-400">ستاره</span> مبارکه
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">SETAREH MOBILE ELECTRONICS</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed font-normal">
              فروشگاه تخصصی موبایل ستاره مرجع رسمی فروش جدیدترین گوشی‌های آیفون، سامسونگ، شیائومی، لوازم جانبی اصلی و ارائه خدمات تخصصی تعمیرات نرم‌افزاری و سخت‌افزاری در مبارکه استان اصفهان.
            </p>

            <div className="space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>استان اصفهان، مبارکه، خیابان حافظ شرقی (کد پلاس: <code className="text-yellow-400 font-mono">8GR3+VW6</code>)</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تلفن تماس: <a href="tel:03152415779" className="text-white font-bold hover:text-yellow-400" dir="ltr">031 5241 5779</a></span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-white uppercase border-b border-slate-800 pb-2">دسته‌بندی‌های اصلی</h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li><a href="#catalog" className="hover:text-yellow-400 transition">گوشی‌های آیفون (iPhone 16 / 15)</a></li>
              <li><a href="#catalog" className="hover:text-yellow-400 transition">گوشی‌های سامسونگ سری S و A</a></li>
              <li><a href="#catalog" className="hover:text-yellow-400 transition">گوشی‌های شیائومی و پوکو</a></li>
              <li><a href="#catalog" className="hover:text-yellow-400 transition">ساعت هوشمند و ایرپاد اورجینال</a></li>
              <li><a href="#catalog" className="hover:text-yellow-400 transition">شارژر و پاوربانک انکر (Anker)</a></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-black text-white uppercase border-b border-slate-800 pb-2">خدمات ویژه فروشگاه ستاره</h4>
            <div className="space-y-2 text-slate-300">
              <div className="bg-slate-900 p-3 border border-slate-800 space-y-1">
                <span className="text-yellow-400 font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  خرید اقساطی بدون ضامن
                </span>
                <p className="text-[11px] text-slate-400 font-normal">
                  امکان دریافت گوشی با چک صیادی و اقساط ۳ تا ۲۴ ماهه با کارمزد منصفانه.
                </p>
              </div>

              <div className="bg-slate-900 p-3 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  تعمیرات سریع ۱ ساعته
                </span>
                <p className="text-[11px] text-slate-400 font-normal">
                  تعویض ال‌سی‌دی و باتری اصلی آیفون و سامسونگ در حضور مشتری.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Social & External Links */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-slate-500">
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-pink-400 transition font-bold"
            >
              <Instagram className="w-4 h-4" />
              <span>صفحه اینستاگرام</span>
            </a>

            <a 
              href="https://wa.me/989130000000" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>پشتیبانی واتساپ</span>
            </a>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=8GR3%2BVW6+Mobarakeh" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-yellow-400 transition font-bold"
            >
              <MapPin className="w-4 h-4" />
              <span>ثبت‌شده در گوگل مپ</span>
            </a>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            © ۱۴۰۳ - کلیه حقوق این وب‌سایت متعلق به <span className="text-white font-bold">فروشگاه موبایل ستاره مبارکه</span> می‌باشد.
          </div>
        </div>

      </div>
    </footer>
  );
};
