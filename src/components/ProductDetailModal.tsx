import React, { useState, useEffect, useRef } from 'react';
import { Product, UserAccount } from '../types';
import { STORE_PRODUCTS } from '../data/products';
import { OfferCountdown } from './OfferCountdown';
import { ProductReviewsAndQA } from './ProductReviewsAndQA';
import { SEOHead } from './SEOHead';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard, 
  Check, 
  Star, 
  MapPin, 
  Smartphone,
  Cpu,
  HardDrive,
  Camera,
  BatteryCharging,
  Monitor,
  Bell,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Share2,
  Copy,
  Headphones,
  Plus,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Move,
  PhoneCall
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string) => void;
  onOpenInstallmentForProduct: (productPrice: number) => void;
  userPhone?: string;
  onOpenStockNotify?: (product: Product) => void;
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
  currentUser?: UserAccount | null;
  onOpenPriceInquiry?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenInstallmentForProduct,
  userPhone = '',
  onOpenStockNotify,
  allProducts = STORE_PRODUCTS,
  onSelectProduct,
  currentUser,
  onOpenPriceInquiry
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [notifyPhone, setNotifyPhone] = useState<string>(userPhone || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [addedAccIds, setAddedAccIds] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Fullscreen Gallery & Zoom State
  const [isFullscreenGalleryOpen, setIsFullscreenGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Prepare gallery images list
  const galleryImages = [
    product.image,
    ...(product.images360 || [])
  ].filter((url, index, self) => Boolean(url) && self.indexOf(url) === index);

  const handleOpenFullscreen = (index = 0) => {
    setActiveImageIndex(index);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsFullscreenGalleryOpen(true);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleToggleZoom = () => {
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      setZoomLevel(2.2);
    }
  };

  // Drag handlers when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard Navigation inside Fullscreen Gallery
  useEffect(() => {
    if (!isFullscreenGalleryOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreenGalleryOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1));
        handleResetZoom();
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0));
        handleResetZoom();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenGalleryOpen, galleryImages.length]);

  useEffect(() => {
    if (product && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [product?.id]);

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock !== undefined && product.stock > 0 && product.stock < 3;

  const discountPercent = product.originalPriceToman
    ? Math.round(((product.originalPriceToman - product.priceToman) / product.originalPriceToman) * 100)
    : 0;

  // Filter suggested accessories
  const accessories = (allProducts || STORE_PRODUCTS)
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === 'accessories' || p.category === 'chargers' || p.category === 'headphones')
    )
    .sort((a, b) => {
      const aBrandMatch = a.brand === product.brand ? -1 : 1;
      const bBrandMatch = b.brand === product.brand ? -1 : 1;
      return aBrandMatch - bBrandMatch;
    })
    .slice(0, 4);

  const handleAddAccessory = (acc: Product) => {
    onAddToCart(acc, acc.colors[0]?.name || '');
    setAddedAccIds((prev) => ({ ...prev, [acc.id]: true }));
    setTimeout(() => {
      setAddedAccIds((prev) => ({ ...prev, [acc.id]: false }));
    }, 2000);
  };

  const handleShare = async () => {
    const shareTitle = product.persianName;
    const shareText = `📱 ${product.persianName} (${product.brand})\n💰 قیمت: ${product.priceToman.toLocaleString('fa-IR')} تومان\n🛒 فروشگاه موبایل ستاره مبارکه`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } catch (err) {
        console.error('Error copying share text:', err);
      }
    }
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifyError(null);
    setNotifySuccess(null);

    const trimmedPhone = notifyPhone.trim();
    if (!trimmedPhone) {
      setNotifyError('لطفاً شماره تلفن همراه خود را وارد کنید.');
      return;
    }

    if (!/^09[0-9]{9}$/.test(trimmedPhone)) {
      setNotifyError('شماره تلفن همراه معتبر نیست (مثال: 09123456789)');
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
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setNotifyError(data.error || 'خطا در ثبت درخواست');
      } else {
        setNotifySuccess(
          data.message || `شماره ${trimmedPhone} با موفقیت ثبت شد. به محض موجود شدن پیامک ارسال خواهد شد.`
        );
      }
    } catch (err) {
      console.error('Error in notify submission:', err);
      setNotifySuccess(
        `شماره ${trimmedPhone} با موفقیت ثبت گردید. به محض موجود شدن کالا، پیامک اطلاع‌رسانی ارسال می‌شود.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <SEOHead product={product} />
      <div ref={modalRef} className="relative w-full max-w-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right transition-all">
        
        {/* Header Action Buttons */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 transition rounded-full text-xs font-bold shadow-sm"
            title="اشتراک‌گذاری این محصول"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">لینک کپی شد</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#0b57d0]" />
                <span className="hidden sm:inline">اشتراک‌گذاری</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition rounded-full shadow-sm"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          
          {/* Left / Top: Image View */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 p-6 rounded-xl">
            <div
              onClick={() => handleOpenFullscreen(0)}
              className="relative group cursor-zoom-in w-full h-64 flex items-center justify-center bg-white rounded-xl border border-slate-200 p-3 overflow-hidden shadow-sm hover:shadow-md transition"
              title="برای نمایی تمام صفحه و زوم کلیک کنید"
            >
              <img
                src={product.image}
                alt={product.persianName}
                className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5 bg-slate-950/80 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-lg flex items-center gap-1.5 text-[11px] px-3 font-bold border border-slate-700">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>تمام‌صفحه و زوم</span>
              </div>
            </div>

            {/* Gallery thumbnails if gallery > 1 */}
            {galleryImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3 w-full overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenFullscreen(idx)}
                    className="w-12 h-12 rounded-lg border border-slate-200 hover:border-amber-500 bg-white p-1 transition overflow-hidden shrink-0 shadow-sm"
                    title={`مشاهده تصویر ${idx + 1}`}
                  >
                    <img src={imgUrl} alt="Gallery" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Colors picker */}
            <div className="mt-6 text-center w-full">
              <span className="text-xs text-slate-500 block mb-2 font-bold">انتخاب رنگ کالا:</span>
              <div className="flex items-center justify-center gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-bold transition ${
                      selectedColor === c.name
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info & Specs */}
          <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="bg-slate-100 font-bold px-2 py-0.5 text-slate-800 uppercase">
                  {product.brand}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1 text-slate-950 font-bold">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating.toLocaleString('fa-IR')}</span>
                  <span className="text-slate-400">({product.reviewsCount.toLocaleString('fa-IR')} نظر)</span>
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {product.persianName}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">{product.name}</p>

              {/* Special Offer Countdown Timer */}
              {!isOutOfStock && (product.isOffer || discountPercent > 0) && (
                <div className="mt-3">
                  <OfferCountdown productId={product.id} variant="detailed" />
                </div>
              )}

              {/* Warranty & Availability */}
              <div className="mt-3 space-y-1.5 text-xs bg-slate-50 border border-slate-200 p-3 text-slate-700 font-medium">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{product.warranty}</span>
                </div>
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>کالا در حال حاضر در انبار موجود نیست</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-rose-700 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                    <span>فقط تعداد محدود باقیمانده ({product.stock?.toLocaleString('fa-IR')} عدد در انبار)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>موجود در فروشگاه مبارکه (خیابان حافظ شرقی) - تحویل آنی</span>
                  </div>
                )}
              </div>

              {/* Out of stock inline notification form */}
              {isOutOfStock && (
                <div className="mt-3 bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl space-y-2 text-right">
                  <div className="flex items-center gap-2 text-slate-950 font-black text-xs">
                    <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
                    <span>موجود شد خبرم کن! (اطلاع‌رسانی پیامکی)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    با ثبت شماره تلفن همراه خود، به محض موجود شدن این کالا در فروشگاه ستاره مبارکه پیامک دریافت کنید.
                  </p>

                  {notifySuccess ? (
                    <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{notifySuccess}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="space-y-2 pt-1">
                      {notifyError && (
                        <p className="text-[11px] text-rose-600 font-bold">{notifyError}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          value={notifyPhone}
                          onChange={(e) => setNotifyPhone(e.target.value)}
                          placeholder="شماره همراه (مثال: 09123456789)"
                          maxLength={11}
                          dir="ltr"
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 text-left"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>ثبت شماره</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Specs Grid */}
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">مشخصات فنی کلیدی:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
                    <Monitor className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span className="truncate">{product.specs.screen}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
                    <Cpu className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span className="truncate">{product.specs.processor}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
                    <HardDrive className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span className="truncate">{product.specs.ram} / {product.specs.storage}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200 flex items-center gap-2 text-slate-700 font-medium">
                    <Camera className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span className="truncate">{product.specs.camera}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">قیمت نهایی با احتساب مالیات:</span>
                <div className="text-left">
                  {!isOutOfStock && product.originalPriceToman && (
                    <div className="text-xs text-slate-400 line-through">
                      {product.originalPriceToman.toLocaleString('fa-IR')}
                    </div>
                  )}
                  <div className="text-lg font-black text-slate-950">
                    {product.priceToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-500">تومان</span>
                  </div>
                </div>
              </div>

              {/* Direct Fast Inquiry Banner Button */}
              {!isOutOfStock && (
                <button
                  onClick={() => {
                    if (onOpenPriceInquiry) {
                      onOpenPriceInquiry(product);
                    } else {
                      window.open(`https://wa.me/989131234567?text=${encodeURIComponent(`سلام، استعلام قیمت روز محصول ${product.persianName}`)}`, '_blank');
                    }
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-between shadow-sm cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 animate-bounce text-white" />
                    <span>استعلام قیمت لحظه‌ای و تماس مستقیم با فروشگاه</span>
                  </div>
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[11px] font-mono dir-ltr">
                    ۰۳۱-۵۲۴۱۵۷۵۹
                  </span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {isOutOfStock ? (
                    <button
                      onClick={() => {
                        if (onOpenStockNotify) {
                          onClose();
                          onOpenStockNotify(product);
                        }
                      }}
                      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 uppercase tracking-wider transition shadow-sm rounded-lg cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
                      <span>خبرم کن (پیامکی)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onAddToCart(product, selectedColor);
                        onClose();
                      }}
                      className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs py-3 uppercase tracking-wider transition shadow-sm rounded-lg cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-yellow-400" />
                      <span>افزودن به سبد خرید</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onOpenInstallmentForProduct(product.priceToman);
                    }}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-950 text-slate-950 font-extrabold text-xs py-3 transition rounded-lg cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>محاسبه اقساط کالا</span>
                  </button>
                </div>

                <button
                  onClick={handleShare}
                  className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg transition flex items-center justify-center shrink-0 cursor-pointer"
                  title="اشتراک‌گذاری این محصول"
                >
                  {shareCopied ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Share2 className="w-5 h-5 text-[#0b57d0]" />
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Suggested Accessories Section */}
        {accessories.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#0b57d0]/10 rounded-lg text-[#0b57d0]">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>لوازم جانبی پیشنهادی ستاره</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal">
                    کاور، گلس، شارژر و هندزفری‌های اصلی سازگار با این کالا
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                پیشنهاد هوشمند
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {accessories.map((acc) => {
                const accDiscount = acc.originalPriceToman
                  ? Math.round(((acc.originalPriceToman - acc.priceToman) / acc.originalPriceToman) * 100)
                  : 0;
                const isAdded = Boolean(addedAccIds[acc.id]);

                return (
                  <div
                    key={acc.id}
                    className="group bg-white border border-slate-200 hover:border-[#0b57d0] rounded-xl p-3 flex flex-col justify-between transition shadow-sm hover:shadow-md"
                  >
                    <div
                      onClick={() => onSelectProduct ? onSelectProduct(acc) : null}
                      className="cursor-pointer space-y-2"
                    >
                      <div className="w-full h-24 bg-slate-50 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={acc.image}
                          alt={acc.persianName}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{acc.brand}</span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#0b57d0] transition">
                          {acc.persianName}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {accDiscount > 0 && acc.originalPriceToman && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {acc.originalPriceToman.toLocaleString('fa-IR')}
                          </div>
                        )}
                        <div className="text-xs font-extrabold text-slate-900">
                          {acc.priceToman.toLocaleString('fa-IR')} <span className="text-[9px] font-normal text-slate-500">تومان</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddAccessory(acc)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0b57d0] hover:bg-[#0842a0] text-white'
                        }`}
                        title="افزودن به سبد خرید"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">افزوده شد</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">افزودن</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews, Star Ratings & Q&A Section */}
        <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
          <ProductReviewsAndQA product={product} currentUser={currentUser} />
        </div>

      </div>

      {/* FULLSCREEN IMAGE GALLERY MODAL WITH ZOOM */}
      {isFullscreenGalleryOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between text-white select-none animate-fadeIn"
          onMouseUp={handleMouseUp}
        >
          {/* Top Bar */}
          <div className="p-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 z-20">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-extrabold text-slate-200 line-clamp-1">
                {product.persianName}
              </h3>
              <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                تصویر {activeImageIndex + 1} از {galleryImages.length}
              </span>
            </div>

            {/* Zoom Controls Bar */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition disabled:opacity-40"
                  title="کاهش بزرگ‌نمایی (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetZoom}
                  className="px-2.5 py-1 text-xs font-mono font-bold text-amber-400 hover:bg-slate-800 rounded-lg transition"
                  title="بازنشانی زوم"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>

                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 4}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition disabled:opacity-40"
                  title="افزایش بزرگ‌نمایی (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={handleResetZoom}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition border-r border-slate-800 mr-0.5"
                  title="اندازه عادی"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsFullscreenGalleryOpen(false)}
                className="p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl transition border border-rose-500/30 cursor-pointer"
                title="بستن (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Canvas area */}
          <div 
            className="relative flex-1 overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onWheel={(e) => {
              if (e.deltaY < 0) handleZoomIn();
              else handleZoomOut();
            }}
            onDoubleClick={handleToggleZoom}
          >
            {/* Previous Image Button */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                  handleResetZoom();
                }}
                className="absolute right-4 z-20 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700/80 shadow-2xl transition cursor-pointer"
                title="تصویر قبلی"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Main Zoomable Image Container */}
            <div
              className="transition-transform ease-out flex items-center justify-center"
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                maxWidth: '90vw',
                maxHeight: '80vh'
              }}
            >
              <img
                src={galleryImages[activeImageIndex] || product.image}
                alt={product.persianName}
                className="max-h-[75vh] max-w-[85vw] object-contain drop-shadow-2xl pointer-events-none select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Image Button */}
            {galleryImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                  handleResetZoom();
                }}
                className="absolute left-4 z-20 p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full border border-slate-700/80 shadow-2xl transition cursor-pointer"
                title="تصویر بعدی"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Hint overlay at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-full text-xs text-slate-300 font-bold flex items-center gap-2 pointer-events-none shadow-xl">
              <Move className="w-4 h-4 text-amber-400" />
              <span>دو بار کلیک یا اسکرول موس برای زوم | برای جابه‌جایی تصویر را بکشید</span>
            </div>
          </div>

          {/* Thumbnails strip at bottom if gallery has items */}
          {galleryImages.length > 1 && (
            <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-center gap-2 z-20">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    handleResetZoom();
                  }}
                  className={`w-14 h-14 rounded-xl border-2 p-1 bg-white overflow-hidden transition cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
