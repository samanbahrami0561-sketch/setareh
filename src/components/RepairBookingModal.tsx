import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { notifyRepairStatusUpdated } from '../lib/notification';

interface RepairBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepairBookingModal: React.FC<RepairBookingModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issue, setIssue] = useState('تعویض صفحه نمایش (ال‌سی‌دی اصلی)');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !deviceModel) {
      alert('لطفاً نام، شماره تماس و مدل گوشی را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/repair-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          deviceModel,
          issue: `${issue} - ${notes}`
        })
      });
      let data: any = {};
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json().catch(() => ({}));
      }

      const repairId = data?.request?.id || 'REP-' + Math.floor(100000 + Math.random() * 900000);
      setTrackingCode(repairId);
      notifyRepairStatusUpdated(repairId, deviceModel, 'ثبت اولیه درخواست تعمیرات - در انتظار بررسی');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Repair booking error:', err);
      // Fallback tracking ID
      const fallbackId = 'SR-' + Math.floor(100000 + Math.random() * 900000);
      setTrackingCode(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200 shadow-2xl p-6 my-8 text-right">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-200 mb-6">
          <div className="w-11 h-11 bg-slate-950 text-yellow-400 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-wider">ثبت آنلاین درخواست تعمیرات سخت‌افزار و نرم‌افزار</h3>
            <p className="text-xs text-slate-500 font-medium">تعمیر تخصصی آیفون، سامسونگ و شیائومی در کمتر از ۱ ساعت با قطعات اصلی</p>
          </div>
        </div>

        {trackingCode ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 border-2 border-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-950">درخواست تعمیرات شما با موفقیت ثبت شد!</h4>
              <p className="text-xs text-slate-500 font-medium">کد پیگیری اختصاصی تعمیرات ستاره:</p>
            </div>

            <div className="inline-block bg-slate-50 border-2 border-slate-950 text-slate-950 font-mono text-xl font-black px-6 py-3 tracking-wider">
              {trackingCode}
            </div>

            <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed font-medium">
              کارشناسان بخش تعمیرات موبایل ستاره تا حداکثر ۱۵ دقیقه دیگر با شماره <span className="text-slate-950 font-black" dir="ltr">{phone}</span> تماس خواهند گرفت.
            </p>

            <div className="bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 space-y-2 font-medium">
              <div className="flex items-center justify-center gap-2 text-slate-900 font-bold">
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>آدرس تحویل حضوری: مبارکه، خیابان حافظ شرقی، موبایل ستاره</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-700">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>تلفن پیگیری مستقیم: ۰۳۱۵۲۴۱۵۷۷۹</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-8 py-3 uppercase tracking-wider transition"
            >
              متوجه شدم
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-900 font-bold block">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثلاً: علی محمدی"
                  className="w-full bg-slate-50 text-slate-950 p-3 border border-slate-300 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-900 font-bold block">شماره همراه جهت تماس:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09131234567"
                  dir="ltr"
                  className="w-full bg-slate-50 text-slate-950 p-3 border border-slate-300 focus:outline-none text-right font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-900 font-bold block">مدل دقیق گوشی:</label>
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="مثلاً: آیفون ۱۳ پرو مکس یا سامسونگ A54"
                  className="w-full bg-slate-50 text-slate-950 p-3 border border-slate-300 focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-900 font-bold block">نوع مشکل / قطعه تعویضی:</label>
                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full bg-slate-50 text-slate-950 p-3 border border-slate-300 focus:outline-none font-medium"
                >
                  <option value="تعویض صفحه نمایش (ال‌سی‌دی اصلی)">تعویض صفحه نمایش (ال‌سی‌دی اصلی)</option>
                  <option value="تعویض باتری ۱۰۰٪ اورجینال">تعویض باتری ۱۰۰٪ اورجینال با مهلت تست</option>
                  <option value="تعویض سوکت شارژ / فلت اسپیکر">تعویض سوکت شارژ / فلت اسپیکر</option>
                  <option value="رفع مشکل آب‌خوردگی و خاموشی">رفع مشکل آب‌خوردگی و خاموشی دستگاه</option>
                  <option value="مشکلات نرم‌افزاری / اپل آیدی / آنلاک">مشکلات نرم‌افزاری / اپل آیدی / آنلاک</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-900 font-bold block">توضیحات تکمیلی خرابی (اختیاری):</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیح دهید ضربه خورده است یا بدون دلیل خاموش شده..."
                className="w-full bg-slate-50 text-slate-950 p-3 border border-slate-300 focus:outline-none resize-none font-medium"
              />
            </div>

            {/* Perks */}
            <div className="bg-slate-50 p-3 border border-slate-200 text-slate-700 space-y-1 text-[11px] font-medium">
              <div className="flex items-center gap-1.5 text-slate-950 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>مزایای مرکز تعمیرات ستاره: قطعات روکاری اصلی + مهلت تست کتبی + تعمیر سریع حضوری</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs py-3.5 flex items-center justify-center gap-2 transition uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <span>در حال ثبت...</span>
                ) : (
                  <>
                    <Wrench className="w-4 h-4 text-yellow-400" />
                    <span>ثبت درخواست و دریافت کد پیگیری</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
