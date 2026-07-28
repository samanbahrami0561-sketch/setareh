import React, { useState, useEffect } from 'react';
import { X, RotateCw, Palette, Eye, ShieldCheck, Sparkles, Check, Upload, Camera, Smartphone, Trash2, FlipHorizontal, Loader2, Cloud } from 'lucide-react';
import { Product } from '../types';
import { 
  uploadCustomPhoneImageToStorage, 
  loadUserCustomImagesFromStorage, 
  deleteCustomPhoneImageFromStorage 
} from '../services/storageService';

interface Interactive360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  currentUserId?: string;
}

export const Interactive360Modal: React.FC<Interactive360ModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUserId = 'current_user'
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedColorHex, setSelectedColorHex] = useState<string>('');
  
  // Custom uploaded photos for this product
  const [customFrontPhoto, setCustomFrontPhoto] = useState<string | null>(null);
  const [customBackPhoto, setCustomBackPhoto] = useState<string | null>(null);
  const [activeSide, setActiveSide] = useState<'360' | 'front' | 'back'>('360');

  // Loading indicator states for Firebase Storage upload
  const [isUploadingFront, setIsUploadingFront] = useState<boolean>(false);
  const [isUploadingBack, setIsUploadingBack] = useState<boolean>(false);
  const [storageToast, setStorageToast] = useState<string | null>(null);

  // Load persistent photos from Firebase Storage & Firestore whenever modal opens
  useEffect(() => {
    if (!isOpen || !product) return;

    async function loadSavedPhotos() {
      try {
        const savedMap = await loadUserCustomImagesFromStorage(currentUserId);
        const itemPhotos = savedMap[product.id];
        if (itemPhotos) {
          if (itemPhotos.front) setCustomFrontPhoto(itemPhotos.front);
          if (itemPhotos.back) setCustomBackPhoto(itemPhotos.back);
        }
      } catch (err) {
        console.error('Error loading custom photos from Firebase Storage:', err);
      }
    }

    loadSavedPhotos();
  }, [isOpen, product, currentUserId]);

  if (!isOpen || !product) return null;

  const images = product.images360 && product.images360.length > 0 
    ? product.images360 
    : [product.image];

  const activeImageIndex = Math.floor((rotationAngle / 360) * images.length) % images.length;

  // Determine displayed image based on rotation or custom uploads
  const getDisplayImage = () => {
    if (activeSide === 'front' && customFrontPhoto) {
      return customFrontPhoto;
    }
    if (activeSide === 'back' && customBackPhoto) {
      return customBackPhoto;
    }
    // Angle based calculation: if near 180° and custom back image exists, prefer back image
    if (customBackPhoto && rotationAngle >= 135 && rotationAngle <= 225) {
      return customBackPhoto;
    }
    if (customFrontPhoto && (rotationAngle <= 45 || rotationAngle >= 315)) {
      return customFrontPhoto;
    }
    return images[activeImageIndex] || product.image;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    if (side === 'front') setIsUploadingFront(true);
    else setIsUploadingBack(true);

    try {
      // Direct Upload to Firebase Storage with Firestore Link
      const uploadedUrl = await uploadCustomPhoneImageToStorage(currentUserId, product.id, side, file);

      if (side === 'front') {
        setCustomFrontPhoto(uploadedUrl);
        setActiveSide('front');
      } else {
        setCustomBackPhoto(uploadedUrl);
        setActiveSide('back');
      }

      setStorageToast(`تصویر ${side === 'front' ? 'جلو' : 'پشت'} با موفقیت در Firebase Storage ذخیره شد!`);
      setTimeout(() => setStorageToast(null), 3500);
    } catch (err) {
      console.error('Upload to Firebase Storage failed:', err);
    } finally {
      if (side === 'front') setIsUploadingFront(false);
      else setIsUploadingBack(false);
    }
  };

  const handleRemovePhoto = async (side: 'front' | 'back') => {
    if (!product) return;

    if (side === 'front') {
      setCustomFrontPhoto(null);
    } else {
      setCustomBackPhoto(null);
    }

    try {
      await deleteCustomPhoneImageFromStorage(currentUserId, product.id, side);
      setStorageToast(`تصویر حذف گردید.`);
      setTimeout(() => setStorageToast(null), 2500);
    } catch (e) {
      console.error('Error removing photo:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans text-right">
      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 rounded-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center font-black rounded-xl shadow">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                نمایش ۳۶۰ درجه و آپلود عکس جلو و پشت
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                  <Cloud className="w-3 h-3" /> FIREBASE STORAGE
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {product.persianName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 text-slate-400 hover:text-white transition rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Viewer Body */}
        <div className="p-6 sm:p-8 bg-slate-50 flex flex-col items-center justify-center space-y-6">
          
          {/* Main Image Box */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white border-2 border-slate-200 p-6 flex items-center justify-center shadow-xl rounded-2xl group transition">
            <img 
              src={getDisplayImage()} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain transition duration-200"
            />

            <div className="absolute bottom-3 left-3 bg-slate-950/80 text-yellow-400 px-3 py-1 text-[11px] font-mono font-bold flex items-center gap-1.5 rounded-lg backdrop-blur-sm">
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>زاویه دید: {rotationAngle}°</span>
            </div>

            {/* Indicator badge for custom uploads */}
            {(customFrontPhoto || customBackPhoto) && (
              <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-0.5 text-[10px] font-bold rounded-full shadow flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>ذخیره دائمی در Firebase</span>
              </div>
            )}
          </div>

          {/* Preset Angle Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <button
              onClick={() => {
                setRotationAngle(0);
                if (customFrontPhoto) setActiveSide('front');
              }}
              className={`px-3 py-1.5 rounded-lg border transition ${
                rotationAngle === 0 ? 'bg-slate-950 text-yellow-400 border-slate-950' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              نمای جلو (روبرو - ۰°)
            </button>

            <button
              onClick={() => {
                setRotationAngle(180);
                if (customBackPhoto) setActiveSide('back');
              }}
              className={`px-3 py-1.5 rounded-lg border transition ${
                rotationAngle === 180 ? 'bg-slate-950 text-yellow-400 border-slate-950' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              نمای پشت (قاب و دوربین - ۱۸۰°)
            </button>

            <button
              onClick={() => setRotationAngle(90)}
              className={`px-3 py-1.5 rounded-lg border transition ${
                rotationAngle === 90 ? 'bg-slate-950 text-yellow-400 border-slate-950' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              زاویه کناری (۹۰°)
            </button>
          </div>

          {/* 360 Slider */}
          <div className="w-full max-w-md space-y-2 text-center">
            <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
              <span>چرخش دستی ۳۶۰ درجه:</span>
              <span className="font-mono text-slate-950">{rotationAngle} درجه</span>
            </div>
            <input
              type="range"
              min={0}
              max={359}
              value={rotationAngle}
              onChange={(e) => {
                setRotationAngle(Number(e.target.value));
                setActiveSide('360');
              }}
              className="w-full accent-slate-950 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* CUSTOM PHOTO UPLOADER SECTION WITH FIREBASE STORAGE */}
          <div className="w-full max-w-lg bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-950 text-xs flex items-center gap-2">
                <Camera className="w-4 h-4 text-yellow-600" />
                <span>آپلود عکس اختصاصی رو و پشت (ذخیره دائمی در Firebase Storage)</span>
              </h4>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                حفظ عکس بعد از رفرش و لاگاوت
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Front Photo Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-center">
                <span className="text-[11px] font-bold text-slate-700 block">۱. عکس روی گوشی (صفحه جلو)</span>
                
                {customFrontPhoto ? (
                  <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-emerald-500" />
                      ذخیره شد
                    </span>
                    <button 
                      onClick={() => handleRemovePhoto('front')} 
                      className="text-rose-600 hover:text-rose-700 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      حذف
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer bg-slate-950 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition text-[11px]">
                    {isUploadingFront ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                        <span>در حال آپلود به Storage...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-yellow-400" />
                        <span>انتخاب عکس جلو</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      disabled={isUploadingFront}
                      onChange={(e) => handleFileUpload(e, 'front')} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {/* Back Photo Upload */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-center">
                <span className="text-[11px] font-bold text-slate-700 block">۲. عکس پشت گوشی (قاب)</span>
                
                {customBackPhoto ? (
                  <div className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-emerald-500" />
                      ذخیره شد
                    </span>
                    <button 
                      onClick={() => handleRemovePhoto('back')} 
                      className="text-rose-600 hover:text-rose-700 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      حذف
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer bg-slate-950 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 transition text-[11px]">
                    {isUploadingBack ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                        <span>در حال آپلود به Storage...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-yellow-400" />
                        <span>انتخاب عکس پشت</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      disabled={isUploadingBack}
                      onChange={(e) => handleFileUpload(e, 'back')} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Color Variants Selector */}
          <div className="w-full max-w-md pt-3 border-t border-slate-200 space-y-2">
            <h4 className="font-black text-slate-950 text-xs flex items-center gap-1.5 justify-center">
              <Palette className="w-4 h-4 text-slate-700" />
              <span>رنگ‌بندی‌های رسمی موجود در انبار ستاره:</span>
            </h4>

            <div className="flex justify-center items-center gap-2 flex-wrap">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorHex(c.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-bold transition rounded-lg ${
                    selectedColorHex === c.hex
                      ? 'border-slate-950 bg-slate-950 text-white shadow'
                      : 'border-slate-300 bg-white text-slate-950 hover:border-slate-400'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-slate-400" 
                    style={{ backgroundColor: c.hex }} 
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* STORAGE TOAST NOTIFICATION */}
      {storageToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-yellow-400 border-2 border-yellow-400 font-bold px-6 py-3 text-xs flex items-center gap-2 shadow-2xl rounded-2xl animate-bounce">
          <Cloud className="w-4 h-4 text-emerald-400" />
          <span>{storageToast}</span>
        </div>
      )}
    </div>
  );
};
