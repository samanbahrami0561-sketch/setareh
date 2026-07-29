import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  Sliders, 
  Cpu, 
  HardDrive, 
  BatteryCharging, 
  ShieldCheck, 
  Wifi, 
  Sparkles, 
  Check, 
  Smartphone, 
  ShoppingBag, 
  Camera, 
  Gamepad2, 
  GraduationCap, 
  Video, 
  Zap,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';

interface AdvancedPhoneFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const AdvancedPhoneFinderModal: React.FC<AdvancedPhoneFinderModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart = () => {},
  onSelectProduct
}) => {
  // Budget
  const [maxPriceToman, setMaxPriceToman] = useState<number>(100000000);
  // Usage persona
  const [selectedUsage, setSelectedUsage] = useState<string>('all');
  // Specs filters
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minRam, setMinRam] = useState<string>('all');
  const [minStorage, setMinStorage] = useState<string>('all');
  const [require5G, setRequire5G] = useState<boolean>(false);
  const [requireeSIM, setRequireeSIM] = useState<boolean>(false);
  const [requireWaterproof, setRequireWaterproof] = useState<boolean>(false);
  const [fastChargeOnly, setFastChargeOnly] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const usageOptions = [
    { id: 'all', label: 'همه کاربردها', icon: Smartphone },
    { id: 'gaming', label: 'گیمینگ و بازی سنگین', icon: Gamepad2 },
    { id: 'photography', label: 'عکاسی و دوربین حرفه‌ای', icon: Camera },
    { id: 'content_creation', label: 'تولید محتوا و ویدئو', icon: Video },
    { id: 'student', label: 'دانشجویی و اقتصادی', icon: GraduationCap },
  ];

  const filteredMatches = products.filter((p) => {
    if (p.category !== 'smartphones') return false;

    // Price
    if (p.priceToman > maxPriceToman) return false;

    // Brand
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;

    // Usage
    if (selectedUsage !== 'all') {
      if (!p.usageTags || !p.usageTags.includes(selectedUsage as any)) return false;
    }

    // RAM
    if (minRam !== 'all') {
      if (!p.specs.ram.includes(minRam)) return false;
    }

    // Storage
    if (minStorage !== 'all') {
      if (!p.specs.storage.includes(minStorage)) return false;
    }

    // 5G
    if (require5G && !p.specs.has5G) return false;

    // eSIM
    if (requireeSIM && !p.specs.hasedSIM) return false;

    // Waterproof
    if (requireWaterproof && !p.specs.waterproof) return false;

    // Fast charging (> 40W)
    if (fastChargeOnly) {
      if (!p.specs.chargingSpeed || parseInt(p.specs.chargingSpeed, 10) < 40) return false;
    }

    return true;
  });

  const handleReset = () => {
    setMaxPriceToman(100000000);
    setSelectedUsage('all');
    setSelectedBrand('all');
    setMinRam('all');
    setMinStorage('all');
    setRequire5G(false);
    setRequireeSIM(false);
    setRequireWaterproof(false);
    setFastChargeOnly(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div ref={modalRef} className="relative w-full max-w-5xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right flex flex-col max-h-[90vh] transition-all">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                ابزار پیشرفته پیشنهاد و انتخاب گوشی
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5">
                  فیلتر تخصصی
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                مشخصات فنی، بودجه و نیاز خود را تعیین کنید تا مناسب‌ترین گوشی را پیدا کنیم
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-900 text-slate-300 hover:text-yellow-400 text-xs font-bold flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی فیلترها</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-900 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-4">
          
          {/* Usage Selector */}
          <div>
            <label className="text-slate-950 font-black block mb-2">۱. اولویت و نوع کاربرد مورد نظر شما:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {usageOptions.map((opt) => {
                const Icon = opt.icon;
                const isSel = selectedUsage === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedUsage(opt.id)}
                    className={`p-2.5 flex items-center justify-center gap-2 font-bold transition border ${
                      isSel 
                        ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-950'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSel ? 'text-yellow-400' : 'text-slate-500'}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Range Slider */}
          <div className="bg-white p-3 border border-slate-300 space-y-2">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>۲. سقف بودجه خرید شما:</span>
              <span className="font-mono text-slate-950 font-black text-sm">
                تا {maxPriceToman.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <input
              type="range"
              min={15000000}
              max={100000000}
              step={5000000}
              value={maxPriceToman}
              onChange={(e) => setMaxPriceToman(Number(e.target.value))}
              className="w-full accent-slate-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono font-medium">
              <span>۱۵ میلیون تومان</span>
              <span>۵۰ میلیون تومان</span>
              <span>۱۰۰ میلیون تومان</span>
            </div>
          </div>

          {/* Advanced Technical Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            
            {/* Brand */}
            <div>
              <label className="text-slate-800 font-bold block mb-1">برند سازنده:</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white text-slate-950 border border-slate-300 p-2 font-bold focus:outline-none"
              >
                <option value="all">همه برندها</option>
                <option value="Apple">Apple (آیفون)</option>
                <option value="Samsung">Samsung (سامسونگ)</option>
                <option value="Xiaomi">Xiaomi (شیائومی)</option>
              </select>
            </div>

            {/* RAM */}
            <div>
              <label className="text-slate-800 font-bold block mb-1">حداقل حافظه رم (RAM):</label>
              <select
                value={minRam}
                onChange={(e) => setMinRam(e.target.value)}
                className="w-full bg-white text-slate-950 border border-slate-300 p-2 font-bold focus:outline-none"
              >
                <option value="all">فرقی ندارد</option>
                <option value="۸">۸ گیگابایت به بالا</option>
                <option value="۱۲">۱۲ گیگابایت به بالا</option>
                <option value="۱۶">۱۶ گیگابایت (فوق‌حرفه‌ای)</option>
              </select>
            </div>

            {/* Storage */}
            <div>
              <label className="text-slate-800 font-bold block mb-1">حداقل حافظه داخلی:</label>
              <select
                value={minStorage}
                onChange={(e) => setMinStorage(e.target.value)}
                className="w-full bg-white text-slate-950 border border-slate-300 p-2 font-bold focus:outline-none"
              >
                <option value="all">فرقی ندارد</option>
                <option value="۲۵۶">۲۵۶ گیگابایت</option>
                <option value="۵۱۲">۵۱۲ گیگابایت</option>
              </select>
            </div>

            {/* Extra Toggles */}
            <div className="space-y-1.5 pt-4">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none">
                <input
                  type="checkbox"
                  checked={require5G}
                  onChange={(e) => setRequire5G(e.target.checked)}
                  className="accent-slate-950"
                />
                <span>پشتیبانی از شبکه 5G</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold select-none">
                <input
                  type="checkbox"
                  checked={requireWaterproof}
                  onChange={(e) => setRequireWaterproof(e.target.checked)}
                  className="accent-slate-950"
                />
                <span>بدنه ضد آب (IP67/IP68)</span>
              </label>
            </div>

          </div>

        </div>

        {/* Results Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="font-black text-slate-950 text-sm">
              گوشی‌های پیشنهادی ستاره مطابق فیلتر شما ({filteredMatches.length} مورد)
            </h4>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Smartphone className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm text-slate-900">هیچ گوشی با این ترکیب فیلترها پیدا نشد.</p>
              <button
                onClick={handleReset}
                className="text-xs text-blue-600 font-bold underline hover:text-blue-800"
              >
                کاهش فیلترها و مشاهده تمام گزینه‌ها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((p) => (
                <div 
                  key={p.id}
                  className="bg-slate-50 border border-slate-200 p-4 flex gap-4 items-center hover:border-slate-950 transition"
                >
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-contain bg-white p-2 border border-slate-200" />
                  
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h5 className="font-black text-slate-950 text-sm truncate">{p.persianName}</h5>
                    
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-600 font-medium">
                      <span className="bg-white px-1.5 py-0.5 border border-slate-200">{p.specs.processor}</span>
                      <span className="bg-white px-1.5 py-0.5 border border-slate-200">{p.specs.ram} / {p.specs.storage}</span>
                      {p.specs.waterproof && <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 font-bold">ضد آب</span>}
                    </div>

                    <div className="font-black text-slate-950 text-xs font-mono">
                      {p.priceToman.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="bg-slate-950 hover:bg-slate-800 text-white font-black px-3 py-2 text-xs flex items-center gap-1 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
                      <span>خرید</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 font-bold px-3 py-1.5 text-[11px]"
                    >
                      جزئیات
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
