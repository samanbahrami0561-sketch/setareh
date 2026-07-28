import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BatteryCharging, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  ChevronRight, 
  ChevronLeft,
  Smartphone,
  Eye,
  Award,
  Upload,
  Trash2,
  Camera,
  Share2,
  Check,
  RotateCw,
  Calculator,
  Layers,
  PhoneCall,
  CheckCircle,
  Loader2,
  Cloud
} from 'lucide-react';
import { UsedPhone, Product } from '../types';
import { USED_PHONES_LIST } from '../data/usedPhonesData';
import { 
  uploadCustomPhoneImageToStorage, 
  loadUserCustomImagesFromStorage, 
  deleteCustomPhoneImageFromStorage 
} from '../services/storageService';

interface Showroom3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  onOpenInstallment?: (price: number) => void;
  usedPhones?: UsedPhone[];
  currentUserId?: string;
}

export const Showroom3DModal: React.FC<Showroom3DModalProps> = ({
  isOpen,
  onClose,
  onAddToCart = () => {},
  onOpenInstallment = () => {},
  usedPhones = USED_PHONES_LIST,
  currentUserId = 'current_user'
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [activePhoneIndex, setActivePhoneIndex] = useState<number>(0);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [selectedPhoneDetailModal, setSelectedPhoneDetailModal] = useState<UsedPhone | null>(null);

  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [addedToCartToast, setAddedToCartToast] = useState<boolean>(false);
  const [storageToast, setStorageToast] = useState<string | null>(null);

  // Custom Uploaded Photos per Phone ID { [phoneId]: { front?: string; back?: string } }
  const [phoneCustomImages, setPhoneCustomImages] = useState<{ [phoneId: string]: { front?: string; back?: string } }>({});
  
  // Loading indicators for uploads
  const [isUploadingFront, setIsUploadingFront] = useState<boolean>(false);
  const [isUploadingBack, setIsUploadingBack] = useState<boolean>(false);

  // Load persistent photos from Firebase Storage & Firestore whenever modal opens or user changes
  useEffect(() => {
    if (!isOpen) return;

    async function loadSavedCustomPhotos() {
      try {
        const savedPhotosMap = await loadUserCustomImagesFromStorage(currentUserId);
        setPhoneCustomImages(savedPhotosMap);
      } catch (err) {
        console.error('Error loading custom phone photos from Firebase Storage:', err);
      }
    }

    loadSavedCustomPhotos();
  }, [isOpen, currentUserId]);

  // Filtered used phones
  const phonesList = useMemo(() => {
    const list = usedPhones && usedPhones.length > 0 ? usedPhones : USED_PHONES_LIST;
    if (selectedBrand === 'all') return list;
    return list.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
  }, [selectedBrand, usedPhones]);

  const currentPhone = phonesList[activePhoneIndex] || phonesList[0];
  const currentCustomImages = currentPhone ? (phoneCustomImages[currentPhone.id] || {}) : {};

  if (!isOpen) return null;

  // Photo upload handlers using Firebase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file || !currentPhone) return;

    if (side === 'front') setIsUploadingFront(true);
    else setIsUploadingBack(true);

    try {
      // Direct Upload to Firebase Cloud Storage with Firestore Persistence
      const uploadedUrl = await uploadCustomPhoneImageToStorage(currentUserId, currentPhone.id, side, file);

      setPhoneCustomImages(prev => ({
        ...prev,
        [currentPhone.id]: {
          ...prev[currentPhone.id],
          [side]: uploadedUrl
        }
      }));
      setViewSide(side);

      setStorageToast(`عکس ${side === 'front' ? 'صفحه جلو' : 'پشت قاب'} با موفقیت در Firebase Storage ذخیره شد!`);
      setTimeout(() => setStorageToast(null), 3500);
    } catch (err) {
      console.error('Error uploading image to Firebase Storage:', err);
    } finally {
      if (side === 'front') setIsUploadingFront(false);
      else setIsUploadingBack(false);
    }
  };

  const handleRemovePhoto = async (side: 'front' | 'back') => {
    if (!currentPhone) return;

    setPhoneCustomImages(prev => {
      const updated = { ...prev[currentPhone.id] };
      delete updated[side];
      return { ...prev, [currentPhone.id]: updated };
    });

    try {
      await deleteCustomPhoneImageFromStorage(currentUserId, currentPhone.id, side);
      setStorageToast(`تصویر اختصاصی حذف گردید.`);
      setTimeout(() => setStorageToast(null), 2500);
    } catch (e) {
      console.error('Error removing custom photo:', e);
    }
  };

  const handleAddToCart = (phone: UsedPhone) => {
    const formattedProduct: Product = {
      id: phone.id,
      name: phone.name,
      persianName: phone.persianName,
      category: 'smartphones',
      brand: phone.brand as any,
      priceToman: phone.priceToman,
      originalPriceToman: phone.originalPriceToman,
      image: currentCustomImages.front || phone.image,
      colors: [{ name: phone.color, hex: phone.colorHex }],
      specs: phone.specs,
      rating: 4.9,
      reviewsCount: 24,
      stock: 1,
      warranty: phone.guarantee,
      description: phone.description
    };

    onAddToCart(formattedProduct);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  };

  const handleShare = (phone: UsedPhone) => {
    navigator.clipboard.writeText(`گوشی کارکرده ${phone.persianName} - قیمت: ${phone.priceToman.toLocaleString('fa-IR')} تومان | موبایل ستاره مبارکه`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Get active display image for current phone
  const activeDisplayImage = viewSide === 'front' 
    ? (currentCustomImages.front || currentPhone?.image)
    : (currentCustomImages.back || currentPhone?.image);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto font-sans text-right select-none animate-fadeIn">
      
      {/* MAIN CONTAINER CARD */}
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 font-black flex items-center justify-center rounded-2xl shadow-lg shadow-yellow-400/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  نمایشگاه هوشمند <span className="text-yellow-400">گوشی‌های کارکرده</span>
                </h2>
                <span className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2D FAST SHOWROOM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                بررسی سریع، روان و بدون هنگ + آپلود تصاویر اختصاصی روی گوشی و پشت قاب
              </p>
            </div>
          </div>

          {/* BRAND TABS */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 border border-slate-800 p-1 flex items-center gap-1 text-xs rounded-2xl">
              {[
                { id: 'all', label: 'همه برندها' },
                { id: 'apple', label: 'آیفون' },
                { id: 'samsung', label: 'سامسونگ' },
                { id: 'xiaomi', label: 'شیائومی' }
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBrand(b.id);
                    setActivePhoneIndex(0);
                  }}
                  className={`px-3 py-1.5 font-bold transition rounded-xl ${
                    selectedBrand === b.id
                      ? 'bg-yellow-400 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="w-10 h-10 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition flex items-center justify-center rounded-2xl border border-slate-700"
              title="بستن نمایشگاه"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SHOWROOM MAIN CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {currentPhone ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: INTERACTIVE IMAGE VIEWER & PHOTO UPLOADERS */}
              <div className="lg:col-span-6 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-between space-y-5">
                
                {/* VIEW SIDE SWITCHER (Front / Back) */}
                <div className="w-full flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-yellow-400" />
                    <span>زاویه نمایش تصویر:</span>
                  </span>

                  <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
                    <button
                      onClick={() => setViewSide('front')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                        viewSide === 'front' 
                          ? 'bg-yellow-400 text-slate-950 shadow font-black' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>روی گوشی (صفحه)</span>
                      {currentCustomImages.front && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>

                    <button
                      onClick={() => setViewSide('back')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                        viewSide === 'back' 
                          ? 'bg-yellow-400 text-slate-950 shadow font-black' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>پشت گوشی (قاب و دوربین)</span>
                      {currentCustomImages.back && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* MAIN PHONE DISPLAY STAGE */}
                <div className="relative w-full h-72 sm:h-80 bg-slate-900 border-2 border-slate-800/80 rounded-2xl p-6 flex items-center justify-center overflow-hidden group shadow-inner">
                  
                  {/* Ambient Glow */}
                  <div 
                    className="absolute inset-0 opacity-20 transition duration-500 blur-2xl"
                    style={{ backgroundColor: currentPhone.colorHex || '#facc15' }}
                  />

                  {/* Phone Image */}
                  <img
                    src={activeDisplayImage}
                    alt={currentPhone.persianName}
                    className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Battery Health Badge */}
                  <div className="absolute top-3 right-3 z-20 bg-slate-950/90 border border-yellow-400/40 text-yellow-400 px-3 py-1 text-xs font-bold rounded-xl flex items-center gap-1.5 backdrop-blur-md">
                    <BatteryCharging className="w-4 h-4 text-emerald-400" />
                    <span>سلامت باتری: {currentPhone.batteryHealth}٪</span>
                  </div>

                  {/* Custom Photo Applied Indicator */}
                  {((viewSide === 'front' && currentCustomImages.front) || (viewSide === 'back' && currentCustomImages.back)) && (
                    <div className="absolute bottom-3 right-3 z-20 bg-emerald-500 text-slate-950 px-2.5 py-1 text-[10px] font-black rounded-lg flex items-center gap-1 shadow">
                      <Check className="w-3.5 h-3.5" />
                      <span>تصویر اختصاصی آپلود شده</span>
                    </div>
                  )}

                  {/* Carousel Prev / Next Overlay Buttons */}
                  <button
                    onClick={() => setActivePhoneIndex((prev) => (prev > 0 ? prev - 1 : phonesList.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-slate-950/80 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 rounded-full border border-slate-700 flex items-center justify-center transition shadow-lg"
                    title="گوشی قبلی"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setActivePhoneIndex((prev) => (prev < phonesList.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-slate-950/80 hover:bg-yellow-400 hover:text-slate-950 text-slate-200 rounded-full border border-slate-700 flex items-center justify-center transition shadow-lg"
                    title="گوشی بعدی"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* UPLOAD CUSTOM PHOTOS ACCORDION / BOXES */}
                <div className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-yellow-400 flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      <span>آپلود عکس‌های اختصاصی این گوشی:</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-emerald-400" />
                      ذخیره دائمی در Firebase Storage
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    
                    {/* Front Upload Box */}
                    <div className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg flex flex-col items-center justify-between text-center space-y-2">
                      <span className="text-[11px] font-bold text-slate-300">عکس روی گوشی (صفحه)</span>
                      
                      {currentCustomImages.front ? (
                        <div className="w-full flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Cloud className="w-3 h-3 text-emerald-400" />
                            ذخیره در Storage
                          </span>
                          <button
                            onClick={() => handleRemovePhoto('front')}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="حذف عکس روی گوشی"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-2 border border-slate-700 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition">
                          {isUploadingFront ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
                              <span>در حال ذخیره...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3 text-yellow-400" />
                              <span>انتخاب فایل</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingFront}
                            onChange={(e) => handlePhotoUpload(e, 'front')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Back Upload Box */}
                    <div className="bg-slate-950 p-2.5 border border-slate-800 rounded-lg flex flex-col items-center justify-between text-center space-y-2">
                      <span className="text-[11px] font-bold text-slate-300">عکس پشت گوشی (قاب)</span>

                      {currentCustomImages.back ? (
                        <div className="w-full flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-700">
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <Cloud className="w-3 h-3 text-emerald-400" />
                            ذخیره در Storage
                          </span>
                          <button
                            onClick={() => handleRemovePhoto('back')}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="حذف عکس پشت گوشی"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-1.5 px-2 border border-slate-700 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition">
                          {isUploadingBack ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-yellow-400" />
                              <span>در حال ذخیره...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3 text-yellow-400" />
                              <span>انتخاب فایل</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingBack}
                            onChange={(e) => handlePhotoUpload(e, 'back')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: PHONE PASSPORT & DETAILS */}
              <div className="lg:col-span-6 space-y-5">
                
                {/* Title & Badges */}
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      تست کامل سخت‌افزاری ستاره
                    </span>

                    <span className="bg-yellow-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded">
                      رتبه ظاهری: {currentPhone.conditionGrade}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {currentPhone.persianName}
                  </h3>

                  <p className="text-xs text-slate-400">
                    رنگ: <span className="text-white font-bold">{currentPhone.color}</span> | پارت نامبر: <span className="text-yellow-400 font-bold">{currentPhone.partNumber || 'اصلی LLA/ZA'}</span>
                  </p>
                </div>

                {/* Specs Table */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <div>
                    <span className="text-slate-500 block mb-0.5">ظرفیت حافظه:</span>
                    <span className="text-white font-black text-sm">{currentPhone.storage}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">سلامت باتری:</span>
                    <span className="text-emerald-400 font-black text-sm">{currentPhone.batteryHealth}٪</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">گارانتی ستاره:</span>
                    <span className="text-slate-200 font-bold">{currentPhone.guarantee}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-0.5">وضعیت جعبه:</span>
                    <span className="text-slate-200 font-bold">
                      {currentPhone.boxAndAccessories ? 'دارای جعبه و لوازم فابریک' : 'بدون جعبه (فاکتور رسمی)'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-950/60 p-4 border border-slate-800/80 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-yellow-400 block">توضیحات کارشناسی ستاره:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentPhone.description || currentPhone.conditionText}
                  </p>
                </div>

                {/* PRICE & ACTIONS */}
                <div className="bg-slate-950 p-4 border-2 border-yellow-400/40 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">قیمت نهایی کارکرده:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-yellow-400">
                          {currentPhone.priceToman.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">تومان</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenInstallment(currentPhone.priceToman)}
                      className="bg-slate-900 hover:bg-slate-800 text-yellow-400 border border-yellow-400/30 px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>محاسبه اقساط</span>
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleAddToCart(currentPhone)}
                      className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 px-4 text-xs rounded-xl shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>افزودن به سبد خرید</span>
                    </button>

                    <button
                      onClick={() => handleShare(currentPhone)}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 py-3 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Share2 className="w-4 h-4 text-yellow-400" />
                      <span>اشتراک‌گذاری اطلاعات</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              هیچ گوشی کارکرده‌ای در این برند پیدا نشد.
            </div>
          )}

          {/* THUMBNAILS CAROUSEL BOTTOM STRIP */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>لیست گوشی‌های کارکرده آماده تحویل ({phonesList.length} دستگاه):</span>
              <span>برای انتخاب کلیک کنید</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {phonesList.map((phone, idx) => {
                const isActive = idx === activePhoneIndex;
                const customImg = phoneCustomImages[phone.id]?.front;

                return (
                  <button
                    key={phone.id}
                    onClick={() => {
                      setActivePhoneIndex(idx);
                      setViewSide('front');
                    }}
                    className={`shrink-0 w-24 sm:w-28 bg-slate-950 p-2 rounded-xl border-2 transition text-right flex flex-col items-center space-y-1 ${
                      isActive 
                        ? 'border-yellow-400 bg-slate-900 shadow-lg scale-105' 
                        : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                      <img 
                        src={customImg || phone.image} 
                        alt={phone.persianName} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>

                    <span className="text-[10px] font-bold text-white line-clamp-1 w-full text-center">
                      {phone.persianName}
                    </span>

                    <span className="text-[9px] font-bold text-yellow-400">
                      {(phone.priceToman / 1000000).toFixed(1)} میلیون
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* TOAST NOTIFICATIONS */}
      {addedToCartToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-6 py-3 text-xs flex items-center gap-2 shadow-2xl animate-bounce rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>گوشی کارکرده با موفقیت به سبد خرید اضافه شد!</span>
        </div>
      )}

      {copiedToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-slate-950 font-black px-6 py-3 text-xs flex items-center gap-2 shadow-2xl rounded-2xl">
          <Check className="w-5 h-5 text-slate-950" />
          <span>اطلاعات گوشی کپی گردید!</span>
        </div>
      )}

      {storageToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-yellow-400 border-2 border-yellow-400 font-bold px-6 py-3 text-xs flex items-center gap-2 shadow-2xl rounded-2xl animate-bounce">
          <Cloud className="w-4 h-4 text-emerald-400" />
          <span>{storageToast}</span>
        </div>
      )}

    </div>
  );
};
