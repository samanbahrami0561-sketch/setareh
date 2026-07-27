import React, { useState } from 'react';
import { X, PackagePlus, Check, ShoppingBag, Percent, Sparkles, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface BundleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddBundleToCart?: (items: Product[]) => void;
  onAddToCart?: (product: Product) => void;
}

export const BundleBuilderModal: React.FC<BundleBuilderModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddBundleToCart,
  onAddToCart
}) => {
  const phoneList = products.filter((p) => p.category === 'smartphones');
  const accessoryList = products.filter((p) => p.category === 'chargers' || p.category === 'headphones');

  const [selectedPhone, setSelectedPhone] = useState<Product | null>(phoneList[0] || null);
  const [selectedCharger, setSelectedCharger] = useState<Product | null>(
    accessoryList.find((p) => p.category === 'chargers') || null
  );
  const [selectedHeadphone, setSelectedHeadphone] = useState<Product | null>(
    accessoryList.find((p) => p.category === 'headphones') || null
  );
  const [includeGlassAndCase, setIncludeGlassAndCase] = useState<boolean>(true);

  if (!isOpen) return null;

  const rawTotal = 
    (selectedPhone ? selectedPhone.priceToman : 0) +
    (selectedCharger ? selectedCharger.priceToman : 0) +
    (selectedHeadphone ? selectedHeadphone.priceToman : 0) +
    (includeGlassAndCase ? 750000 : 0);

  // 10% Bundle Discount
  const bundleDiscount = Math.round(rawTotal * 0.10);
  const finalBundlePrice = rawTotal - bundleDiscount;

  const handleAddBundle = () => {
    const bundleItems: Product[] = [];
    if (selectedPhone) bundleItems.push(selectedPhone);
    if (selectedCharger) bundleItems.push(selectedCharger);
    if (selectedHeadphone) bundleItems.push(selectedHeadphone);
    
    if (onAddBundleToCart) {
      onAddBundleToCart(bundleItems);
    } else if (onAddToCart) {
      bundleItems.forEach(item => onAddToCart(item));
    }
    alert('باندل اختصاصی با ۱۰٪ تخفیف ویژه به سبد خرید شما اضافه گردید.');
    onClose();
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                سازنده باندل اقتصادی ستاره (موبایل + تجهیزات کامل)
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5">
                  ۱۰٪ تخفیف پک کامل
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                گوشی دلخواه + شارژر + ایرپاد + گلس را با هم ست کنید و ۱۰ درصد تخفیف کل بگیرید
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Builder Options */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
          
          {/* Step 1: Select Phone */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-950 text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 bg-slate-950 text-yellow-400 flex items-center justify-center text-[11px] font-mono">۱</span>
              انتخاب گوشی اصلی:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {phoneList.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPhone(p)}
                  className={`p-3 border-2 cursor-pointer transition flex items-center gap-3 ${
                    selectedPhone?.id === p.id 
                      ? 'bg-slate-950 text-white border-yellow-400 shadow-md' 
                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-white p-1" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h5 className="font-bold truncate text-xs">{p.persianName}</h5>
                    <p className="font-mono font-black text-[11px]">{p.priceToman.toLocaleString('fa-IR')} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Select Fast Charger */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-950 text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 bg-slate-950 text-yellow-400 flex items-center justify-center text-[11px] font-mono">۲</span>
              شارژر اصلی فست انکر / سامسونگ:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accessoryList.filter((a) => a.category === 'chargers').map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCharger(c)}
                  className={`p-3 border-2 cursor-pointer transition flex items-center gap-3 ${
                    selectedCharger?.id === c.id 
                      ? 'bg-slate-950 text-white border-yellow-400 shadow-md' 
                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={c.image} alt={c.name} className="w-10 h-10 object-contain bg-white p-1" />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h5 className="font-bold truncate text-xs">{c.persianName}</h5>
                    <p className="font-mono font-black text-[11px]">{c.priceToman.toLocaleString('fa-IR')} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Add Glass + Case Package */}
          <div className="bg-amber-500/10 border-2 border-amber-500/30 p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-black text-slate-950 block text-xs">پک محافظتی شامل گلس آنتی‌اسپای + قاب سیلیکونی اصلی:</span>
              <p className="text-[11px] text-slate-600 font-medium">به صورت خودکار با مدل گوشی انتخابی شما هماهنگ می‌شود</p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-slate-950">
              <input
                type="checkbox"
                checked={includeGlassAndCase}
                onChange={(e) => setIncludeGlassAndCase(e.target.checked)}
                className="w-4 h-4 accent-slate-950"
              />
              <span>افزودن پک (۷۵۰,۰۰۰ تومان)</span>
            </label>
          </div>

        </div>

        {/* Total & Checkout Bar */}
        <div className="p-4 bg-slate-950 text-white border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-right">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <span>قیمت اقلام به صورت جداگانه:</span>
              <span className="line-through font-mono text-slate-400">{rawTotal.toLocaleString('fa-IR')} تومان</span>
              <span className="bg-emerald-500 text-white font-bold text-[10px] px-1.5 py-0.5">
                تخفیف پک: {bundleDiscount.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <div className="text-xl font-black text-yellow-400 font-mono">
              قیمت نهایی باندل: {finalBundlePrice.toLocaleString('fa-IR')} تومان
            </div>
          </div>

          <button
            onClick={handleAddBundle}
            className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>افزودن تمام باندل به سبد خرید</span>
          </button>
        </div>

      </div>
    </div>
  );
};
