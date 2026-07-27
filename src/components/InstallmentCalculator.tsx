import React, { useState } from 'react';
import { 
  Calculator, 
  CreditCard, 
  CheckCircle2, 
  PhoneCall, 
  FileText, 
  Sparkles, 
  X,
  HelpCircle
} from 'lucide-react';

interface InstallmentCalculatorProps {
  initialPrice?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const InstallmentCalculator: React.FC<InstallmentCalculatorProps> = ({
  initialPrice = 30000000,
  isOpen = true,
  onClose
}) => {
  if (isOpen === false) return null;

  const [priceToman, setPriceToman] = useState<number>(initialPrice);
  const [downPercent, setDownPercent] = useState<number>(30); // 30% default
  const [months, setMonths] = useState<number>(12); // 12 months default

  const downPaymentToman = Math.round((priceToman * downPercent) / 100);
  const loanAmountToman = priceToman - downPaymentToman;
  
  // Rate: ~2.5% monthly interest standard in Iran market for digital goods
  const monthlyInterestRate = 0.025;
  const totalInterestToman = Math.round(loanAmountToman * monthlyInterestRate * months);
  const totalPayableLoan = loanAmountToman + totalInterestToman;
  const monthlyPaymentToman = Math.round(totalPayableLoan / months);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg relative text-right">
      
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-slate-950 flex items-center justify-center text-white">
          <Calculator className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">محاسبه‌گر اقساط موبایل ستاره</h3>
          <p className="text-xs text-slate-500 font-medium">محاسبه دقیق پیش‌پرداخت، اقساط ماهانه و چک‌های صیادی مبارکه</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sliders & Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Price Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <label>قیمت گوشی یا کالای درخواستی (تومان):</label>
              <span className="text-slate-950 text-sm font-black bg-yellow-400/50 px-2 py-0.5 rounded">
                {priceToman.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            
            <input
              type="range"
              min={5000000}
              max={120000000}
              step={1000000}
              value={priceToman}
              onChange={(e) => setPriceToman(Number(e.target.value))}
              className="w-full accent-slate-950 cursor-pointer h-2 bg-slate-200"
            />

            <div className="flex items-center gap-2 pt-1">
              {[15000000, 30000000, 60000000, 90000000].map((quick) => (
                <button
                  key={quick}
                  onClick={() => setPriceToman(quick)}
                  className={`text-[10px] px-2.5 py-1 border font-bold transition ${
                    priceToman === quick
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-950'
                  }`}
                >
                  {(quick / 1000000).toLocaleString('fa-IR')} میلیون
                </button>
              ))}
            </div>
          </div>

          {/* Down Payment % */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <label>درصد پیش‌پرداخت نقدی:</label>
              <span className="text-slate-950 font-black">
                ٪{downPercent.toLocaleString('fa-IR')} ({downPaymentToman.toLocaleString('fa-IR')} تومان)
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              {[20, 30, 40, 50].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setDownPercent(percent)}
                  className={`py-2 border font-bold transition ${
                    downPercent === percent
                      ? 'bg-slate-950 border-slate-950 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-950'
                  }`}
                >
                  ٪{percent.toLocaleString('fa-IR')}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Months */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">مدت زمان بازپرداخت اقساط:</label>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {[3, 6, 12, 18, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`py-2 border font-bold transition ${
                    months === m
                      ? 'bg-slate-950 border-slate-950 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-950'
                  }`}
                >
                  {m.toLocaleString('fa-IR')} ماهه
                </button>
              ))}
            </div>
          </div>

          {/* Terms info */}
          <div className="bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
            <h5 className="font-bold text-slate-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              مدارک و شرایط لازم برای خرید اقساطی از فروشگاه ستاره:
            </h5>
            <ul className="space-y-1.5 text-slate-600 font-medium pr-5 list-disc">
              <li>داشتن دسته چک صیادی بنفش (بنام خریدار یا ضامن معتبر)</li>
              <li>ارائه کارت ملی هوشمند و شناسنامه</li>
              <li>تحویل فوری گوشی و جعبه با گارانتی ۱۸ ماهه در خیابان حافظ شرقی</li>
              <li>ثبت چک‌ها به صورت ماهانه یا ۲ ماه یک‌بار</li>
            </ul>
          </div>

        </div>

        {/* Calculation Summary Card */}
        <div className="lg:col-span-5 bg-slate-950 text-white border-2 border-slate-950 p-6 flex flex-col justify-between space-y-4 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400">قیمت اصلی کالا:</span>
              <span className="text-slate-100 font-bold">{priceToman.toLocaleString('fa-IR')} تومان</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400">پیش‌پرداخت نقدی (در فروشگاه):</span>
              <span className="text-yellow-400 font-black">{downPaymentToman.toLocaleString('fa-IR')} تومان</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400">مبلغ باقیمانده (تسهیلات):</span>
              <span className="text-slate-100 font-bold">{loanAmountToman.toLocaleString('fa-IR')} تومان</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400">تعداد اقساط:</span>
              <span className="text-slate-100 font-bold">{months.toLocaleString('fa-IR')} قسط ماهانه</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium block">مبلغ هر قسط ماهانه:</span>
              <div className="text-2xl font-black text-yellow-400">
                {monthlyPaymentToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-300">تومان</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href={`https://wa.me/989130000000?text=${encodeURIComponent(`سلام، درخواست خرید اقساطی برای کالایی به مبلغ ${priceToman.toLocaleString('fa-IR')} تومان با پیش پرداخت ${downPaymentToman.toLocaleString('fa-IR')} تومان و اقساط ${months} ماهه دارم.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs py-3.5 flex items-center justify-center gap-2 shadow-sm transition uppercase tracking-wider"
            >
              <CreditCard className="w-4 h-4" />
              <span>ثبت درخواست اقساط در واتساپ ستاره</span>
            </a>

            <a
              href="tel:03152415779"
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs py-3 flex items-center justify-center gap-2 border border-slate-800 transition"
              dir="ltr"
            >
              <PhoneCall className="w-4 h-4 text-yellow-400" />
              <span>031 5241 5779 (مشاوره تلفنی اقساط)</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
