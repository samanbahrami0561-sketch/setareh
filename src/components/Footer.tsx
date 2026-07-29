import React from 'react';
import { 
  Star, 
  MapPin, 
  PhoneCall, 
  Instagram, 
  CreditCard, 
  Wrench, 
  MessageCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f0f4f9] dark:bg-[#18191c] border-t border-[#e1e3e1] dark:border-[#33353b] text-[#444746] dark:text-[#c4c7c5] text-xs text-right mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Col 1: Store Intro */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0b57d0] text-white rounded-full flex items-center justify-center font-bold">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1f1f1f] dark:text-white">
                  موبایل <span className="text-[#0b57d0] dark:text-[#a8c7fa]">ستاره</span> مبارکه
                </h3>
                <p className="text-[11px] text-[#747775] font-mono">SETAREH MOBILE ELECTRONICS</p>
              </div>
            </div>

            <p className="text-[#444746] dark:text-[#c4c7c5] leading-relaxed font-normal">
              فروشگاه تخصصی موبایل ستاره مرجع رسمی فروش جدیدترین گوشی‌های آیفون، سامسونگ، شیائومی، لوازم جانبی اصلی و ارائه خدمات تخصصی تعمیرات نرم‌افزاری و سخت‌افزاری در مبارکه استان اصفهان.
            </p>

            <div className="space-y-2 text-[#444746] dark:text-[#c4c7c5]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
                <span>استان اصفهان، مبارکه، خیابان حافظ شرقی (کد پلاس: <code className="text-[#1f1f1f] dark:text-white font-mono bg-white dark:bg-[#28292e] px-2 py-0.5 border border-[#c4c7c5] rounded">8GR3+VW6</code>)</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
                <span>تلفن تماس: <a href="tel:03152415779" className="text-[#1f1f1f] dark:text-white font-bold hover:text-[#0b57d0]" dir="ltr">031 5241 5779</a></span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#1f1f1f] dark:text-white border-b border-[#e1e3e1] dark:border-[#33353b] pb-2">دسته‌بندی‌های اصلی</h4>
            <ul className="space-y-2 text-[#444746] dark:text-[#c4c7c5] font-medium">
              <li><a href="#catalog" className="hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] transition">گوشی‌های آیفون (iPhone 16 / 15)</a></li>
              <li><a href="#catalog" className="hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] transition">گوشی‌های سامسونگ سری S و A</a></li>
              <li><a href="#catalog" className="hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] transition">گوشی‌های شیائومی و پوکو</a></li>
              <li><a href="#catalog" className="hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] transition">ساعت هوشمند و ایرپاد اورجینال</a></li>
              <li><a href="#catalog" className="hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] transition">شارژر و پاوربانک انکر (Anker)</a></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-[#1f1f1f] dark:text-white border-b border-[#e1e3e1] dark:border-[#33353b] pb-2">خدمات ویژه فروشگاه ستاره</h4>
            <div className="space-y-2">
              <div className="bg-white dark:bg-[#1e1f23] p-3.5 rounded-2xl border border-[#e1e3e1] dark:border-[#33353b] space-y-1">
                <span className="text-[#0b57d0] dark:text-[#a8c7fa] font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  خرید اقساطی بدون ضامن
                </span>
                <p className="text-[11px] text-[#747775] font-normal">
                  امکان دریافت گوشی با چک صیادی و اقساط ۳ تا ۲۴ ماهه با کارمزد منصفانه.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1e1f23] p-3.5 rounded-2xl border border-[#e1e3e1] dark:border-[#33353b] space-y-1">
                <span className="text-[#0b57d0] dark:text-[#a8c7fa] font-bold flex items-center gap-1.5">
                  <Wrench className="w-4 h-4" />
                  تعمیرات سریع ۱ ساعته
                </span>
                <p className="text-[11px] text-[#747775] font-normal">
                  تعویض ال‌سی‌دی و باتری اصلی آیفون و سامسونگ در حضور مشتری.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Social & External Links */}
        <div className="pt-6 border-t border-[#e1e3e1] dark:border-[#33353b] flex flex-wrap items-center justify-between gap-4 text-[#747775]">
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#1f1f1f] dark:text-[#e3e2e6] hover:text-[#0b57d0] transition font-medium"
            >
              <Instagram className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa]" />
              <span>صفحه اینستاگرام</span>
            </a>

            <a 
              href="https://wa.me/989130000000" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#1f1f1f] dark:text-[#e3e2e6] hover:text-[#0b57d0] transition font-medium"
            >
              <MessageCircle className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa]" />
              <span>پشتیبانی واتساپ</span>
            </a>

            <a 
              href="https://www.google.com/maps/search/?api=1&query=8GR3%2BVW6+Mobarakeh" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#1f1f1f] dark:text-[#e3e2e6] hover:text-[#0b57d0] transition font-medium"
            >
              <MapPin className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa]" />
              <span>ثبت‌شده در گوگل مپ</span>
            </a>
          </div>

          <div className="text-[11px] text-[#747775] font-normal">
            © ۱۴۰۳ - کلیه حقوق این وب‌سایت متعلق به <span className="text-[#1f1f1f] dark:text-white font-bold">فروشگاه موبایل ستاره مبارکه</span> می‌باشد.
          </div>
        </div>

      </div>
    </footer>
  );
};
