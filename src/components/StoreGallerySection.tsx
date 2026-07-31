import React, { useState } from 'react';
import { 
  Camera, 
  Store, 
  Users, 
  Wrench, 
  ShieldCheck, 
  X, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  PhoneCall,
  Clock
} from 'lucide-react';
import { ImageLoader } from './ImageLoader';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'interior' | 'customers' | 'services' | 'stock';
  categoryLabel: string;
  image: string;
  description: string;
  date?: string;
  tag?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'ویترین اصلی و بخش گوشی‌های پرچمدار آیفون و سامسونگ',
    category: 'interior',
    categoryLabel: 'فضای فروشگاه',
    image: 'https://images.unsplash.com/photo-1556742049-0a670fc8078a?auto=format&fit=crop&w=1200&q=80',
    description: 'نمای کامل از فضای مدرن و ویترین گوشی‌های هوشمند با گارانتی اصلی در شعبه مبارکه اصفهان.',
    date: 'تیر ۱۴۰۵',
    tag: 'شعبه مرکزی'
  },
  {
    id: 'g2',
    title: 'تحویل اقساطی آیفون ۱۶ پرو مکس به مشتری عزیز از مبارکه',
    category: 'customers',
    categoryLabel: 'مشتریان رضایتمند',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
    description: 'تحویل فوری دستگاه با طرح اقساطی سفته‌ای بدون ضامن در کمتر از ۱۵ دقیقه.',
    date: 'مرداد ۱۴۰۵',
    tag: 'خرید اقساطی'
  },
  {
    id: 'g3',
    title: 'میز تخصصی مشاوره خرید و تست ارگونومی گوشی‌ها',
    category: 'services',
    categoryLabel: 'مشاوره و خدمات',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    description: 'کارشناسان ما به صورت حضوری بهترین پیشنهاد را متناسب با بودجه شما ارائه می‌دهند.',
    date: 'تیر ۱۴۰۵',
    tag: 'مشاوره رایگان'
  },
  {
    id: 'g4',
    title: 'ورودی پارت جدید لوازم جانبی اورجینال انکر و اپل',
    category: 'stock',
    categoryLabel: 'موجودی وبار جدید',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
    description: 'تخلیه بار جدید شارژرهای اصلی ۲۵ وات و ۲۰ وات با کد اصالت کالا.',
    date: 'مرداد ۱۴۰۵',
    tag: 'تضمین اصالت'
  },
  {
    id: 'g5',
    title: 'تحویل اقساطی سامسونگ S25 Ultra به همشهری محترم',
    category: 'customers',
    categoryLabel: 'مشتریان رضایتمند',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    description: 'لبخند رضایت مشتری گرامی پس از تست نهایی و فعال‌سازی رجیستری در حضور مشتری.',
    date: 'تیر ۱۴۰۵',
    tag: 'تحویل با رجیستری'
  },
  {
    id: 'g6',
    title: 'دپارتمان سخت‌افزار و تعمیرات تخصصی ستاره مبارکه',
    category: 'services',
    categoryLabel: 'مشاوره و خدمات',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    description: 'تعویض ال‌سی‌دی و باتری اصلی انواع گوشی با مهلت تست و گارانتی تعویض قطعه.',
    date: 'خرداد ۱۴۰۵',
    tag: 'تعمیرات فوری'
  }
];

export const StoreGallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const openLightbox = (item: GalleryItem) => {
    setSelectedPhoto(item);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedPhoto(filteredItems[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedPhoto(filteredItems[prevIndex]);
  };

  return (
    <section id="store-gallery" className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-black">
              <Camera className="w-3.5 h-3.5" />
              <span>محیط واقعی فروشگاه و رضایت مشتریان</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">
              گالری تصاویر اختصاصی موبایل ستاره مبارکه
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              مشاهده فضای داخل فروشگاه، ویترین محصولات، تحویل اقساطی گوشی‌ها و بخش تعمیرات تخصصی
            </p>
          </div>

          {/* Quick Info Badge */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="block text-xs font-black text-slate-900 dark:text-white">دارای جواز رسمی کسب</span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-bold">مبارکه، خیابان حافظ شرقی</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            همه تصاویر ({GALLERY_ITEMS.length})
          </button>
          
          <button
            onClick={() => setActiveCategory('interior')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'interior'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>فضای داخل مغازه</span>
          </button>

          <button
            onClick={() => setActiveCategory('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'customers'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>تحویل اقساطی به مشتریان</span>
          </button>

          <button
            onClick={() => setActiveCategory('services')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'services'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-sky-500" />
            <span>میز مشاوره و تعمیرات</span>
          </button>

          <button
            onClick={() => setActiveCategory('stock')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'stock'
                ? 'bg-slate-900 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ورودی بار و موجودی جدید</span>
          </button>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Box */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <ImageLoader
                  src={item.image}
                  alt={item.title}
                  quality={85}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Overlays & Badges */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                    {item.tag || item.categoryLabel}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-amber-500/90 px-3 py-1.5 rounded-xl shadow-lg">
                    <Camera className="w-4 h-4" />
                    <span>مشاهده تصویر بزرگ‌تر</span>
                  </span>
                </div>
              </div>

              {/* Photo Caption */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/50 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>موبایل ستاره مبارکه</span>
                  </span>
                  {item.date && (
                    <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                      {item.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Container */}
            <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Photo Display */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[450px]">
                <ImageLoader
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  quality={90}
                  containerClassName="w-full h-full flex items-center justify-center"
                  className="max-h-[70vh] w-auto object-contain"
                />

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute right-3 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white transition cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextPhoto}
                  className="absolute left-3 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-80 p-6 bg-slate-900 text-right flex flex-col justify-between space-y-4 border-t md:border-t-0 md:border-r border-slate-800">
                <div className="space-y-3">
                  <span className="inline-block bg-amber-500/20 text-amber-400 text-[11px] font-black px-3 py-1 rounded-full">
                    {selectedPhoto.tag || selectedPhoto.categoryLabel}
                  </span>

                  <h3 className="text-base font-black text-white leading-snug">
                    {selectedPhoto.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {selectedPhoto.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400 font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>تضمین مراجعه حضوری و اطمینان از کالا</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>آدرس: مبارکه، خیابان حافظ شرقی</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>ساعات حضور: ۹ الی ۲۱:۳۰</span>
                    </div>
                  </div>
                </div>

                {/* Direct Call Button in Lightbox */}
                <a
                  href="tel:03152415759"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تماس با فروشگاه مبارکه (۰۳۱۵۲۴۱۵۷۵۹)</span>
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
