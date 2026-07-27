import React from 'react';
import { Product } from '../types';
import { 
  X, 
  Trash2, 
  Scale, 
  Check, 
  ShoppingBag, 
  Smartphone, 
  Monitor, 
  Cpu, 
  HardDrive, 
  Camera, 
  BatteryCharging 
} from 'lucide-react';

interface PhoneCompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemoveCompare: (productId: string) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product) => void;
}

export const PhoneCompareDrawer: React.FC<PhoneCompareDrawerProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveCompare,
  onClearCompare,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border-2 border-slate-200 shadow-2xl p-6 my-8 text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-slate-950 text-yellow-400 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-950 uppercase tracking-wider">مقایسه تخصصی مشخصات فنی گوشی‌ها</h3>
              <p className="text-xs text-slate-500 font-medium">مقایسه پایاپای تا ۳ مدل گوشی مختلف در ستاره موبایل</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی لیست</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Matrix */}
        {comparedProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-900 font-bold text-sm">هیچ گوشی برای مقایسه انتخاب نشده است.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              از لیست ویترین محصولات روی آیکون مقایسه (ترازو) کلیک کنید تا مشخصات آن‌ها در این بخش تحلیل شود.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <div className="grid grid-cols-12 gap-4 min-w-[650px]">
              
              {/* Labels Column */}
              <div className="col-span-3 space-y-4 pt-32 text-xs text-slate-500 font-extrabold border-l border-slate-200 pl-3">
                <div className="h-12 flex items-center gap-2 text-slate-900">
                  <Monitor className="w-4 h-4 text-slate-950" />
                  <span>صفحه نمایش:</span>
                </div>
                <div className="h-12 flex items-center gap-2 text-slate-900">
                  <Cpu className="w-4 h-4 text-slate-950" />
                  <span>پردازنده اصلی:</span>
                </div>
                <div className="h-12 flex items-center gap-2 text-slate-900">
                  <HardDrive className="w-4 h-4 text-slate-950" />
                  <span>رم و حافظه:</span>
                </div>
                <div className="h-12 flex items-center gap-2 text-slate-900">
                  <Camera className="w-4 h-4 text-slate-950" />
                  <span>دوربین اصلی:</span>
                </div>
                <div className="h-12 flex items-center gap-2 text-slate-900">
                  <BatteryCharging className="w-4 h-4 text-slate-950" />
                  <span>باتری و شارژ:</span>
                </div>
                <div className="h-12 flex items-center gap-2 text-slate-900">
                  <span>قیمت فروشگاه ستاره:</span>
                </div>
              </div>

              {/* Product Columns */}
              <div className="col-span-9 grid grid-cols-3 gap-4">
                {comparedProducts.map((p) => (
                  <div key={p.id} className="space-y-4 bg-slate-50 p-4 border border-slate-200 relative">
                    <button
                      onClick={() => onRemoveCompare(p.id)}
                      className="absolute top-2 left-2 text-slate-400 hover:text-rose-600 p-1 transition"
                      title="حذف"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Image & Title */}
                    <div className="text-center space-y-2 h-28 flex flex-col items-center justify-center">
                      <img
                        src={p.image}
                        alt={p.persianName}
                        className="h-16 object-contain mx-auto"
                        referrerPolicy="no-referrer"
                      />
                      <h4 className="text-xs font-black text-slate-950 line-clamp-1">{p.persianName}</h4>
                    </div>

                    {/* Specs Rows */}
                    <div className="h-12 text-[11px] text-slate-700 font-medium flex items-center justify-center text-center bg-white border border-slate-200 p-2">
                      {p.specs.screen}
                    </div>
                    <div className="h-12 text-[11px] text-slate-700 font-medium flex items-center justify-center text-center bg-white border border-slate-200 p-2">
                      {p.specs.processor}
                    </div>
                    <div className="h-12 text-[11px] text-slate-700 font-medium flex items-center justify-center text-center bg-white border border-slate-200 p-2">
                      {p.specs.ram} - {p.specs.storage}
                    </div>
                    <div className="h-12 text-[11px] text-slate-700 font-medium flex items-center justify-center text-center bg-white border border-slate-200 p-2">
                      {p.specs.camera}
                    </div>
                    <div className="h-12 text-[11px] text-slate-700 font-medium flex items-center justify-center text-center bg-white border border-slate-200 p-2">
                      {p.specs.battery}
                    </div>

                    {/* Price & Buy */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="text-center font-black text-slate-950 text-xs">
                        {p.priceToman.toLocaleString('fa-IR')} تومان
                      </div>
                      <button
                        onClick={() => {
                          onAddToCart(p);
                          onClose();
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs py-2 flex items-center justify-center gap-1 uppercase tracking-wider transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
                        <span>خرید</span>
                      </button>
                    </div>

                  </div>
                ))}

                {/* Empty placeholders if < 3 */}
                {Array.from({ length: 3 - comparedProducts.length }).map((_, idx) => (
                  <div key={idx} className="border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-xs p-6 space-y-2 font-medium">
                    <Smartphone className="w-6 h-6 text-slate-300" />
                    <span>انتخاب گوشی بعدی...</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
