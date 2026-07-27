import React, { useEffect, useState } from 'react';
import { LogOut, CheckCircle2, ShieldAlert, Loader2, Sparkles, Home } from 'lucide-react';

interface LogoutOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  userName?: string;
}

export const LogoutOverlay: React.FC<LogoutOverlayProps> = ({
  isOpen,
  onComplete,
  userName = 'کاربر'
}) => {
  const [phase, setPhase] = useState<'clearing' | 'success'>('clearing');
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    if (!isOpen) {
      setPhase('clearing');
      setProgress(10);
      return;
    }

    // Step 1: Clearing storage & session (0ms - 900ms)
    setPhase('clearing');
    setProgress(15);

    const timer1 = setTimeout(() => {
      setProgress(65);
    }, 300);

    const timer2 = setTimeout(() => {
      setPhase('success');
      setProgress(100);
    }, 1000);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 font-['Vazirmatn'] animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-slate-950/80 relative overflow-hidden">
        
        {/* Background Glowing Gradients */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Animated Icon Circle */}
          <div className="flex justify-center">
            <div className="relative">
              {phase === 'clearing' ? (
                <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/40 rounded-3xl flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10 animate-pulse">
                  <LogOut className="w-9 h-9 stroke-[2.5]" />
                  <div className="absolute -top-1 -right-1">
                    <Loader2 className="w-6 h-6 text-rose-400 animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-400/60 rounded-3xl flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
              )}
            </div>
          </div>

          {/* Titles & Messages */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center justify-center gap-2">
              {phase === 'clearing' ? (
                <>
                  <span>در حال خروج از حساب کاربری...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span className="text-emerald-400">خروج با موفقیت انجام شد</span>
                </>
              )}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
              {phase === 'clearing' ? (
                <span>
                  در حال پاکسازی نشست فعال <strong className="text-yellow-400">{userName}</strong> و حافظه مرورگر...
                </span>
              ) : (
                <span>
                  اطلاعات حساب کاربری پاکسازی شد. در حال هدایت به صفحه اصلی فروشگاه...
                </span>
              )}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  phase === 'success' ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-rose-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
              <span>{phase === 'clearing' ? 'پاکسازی Storage' : 'صفحه اصلی'}</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0" />
            <span>توکن و داده‌های محلی با امنیت کامل پاک گردیدند.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
