import React, { useState } from 'react';
import { Product } from '../types';
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
  Monitor
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string) => void;
  onOpenInstallmentForProduct: (productPrice: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenInstallmentForProduct
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          
          {/* Left / Top: Image View */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 p-6">
            <div className="w-full h-64 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.persianName}
                className="max-h-full max-w-full object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

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

              {/* Warranty & Availability */}
              <div className="mt-3 space-y-1.5 text-xs bg-slate-50 border border-slate-200 p-3 text-slate-700 font-medium">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>موجود در فروشگاه مبارکه (خیابان حافظ شرقی) - تحویل آنی</span>
                </div>
              </div>

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
                  {product.originalPriceToman && (
                    <div className="text-xs text-slate-400 line-through">
                      {product.originalPriceToman.toLocaleString('fa-IR')}
                    </div>
                  )}
                  <div className="text-lg font-black text-slate-950">
                    {product.priceToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-500">تومان</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedColor);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs py-3 uppercase tracking-wider transition shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-yellow-400" />
                  <span>افزودن به سبد خرید</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenInstallmentForProduct(product.priceToman);
                  }}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-950 text-slate-950 font-extrabold text-xs py-3 transition"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>محاسبه اقساط کالا</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
