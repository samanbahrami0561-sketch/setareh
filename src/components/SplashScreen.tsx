import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrueFocus } from './TrueFocus';
import { SetarehLogo } from './SetarehLogo';
import { Sparkles, ArrowLeft, Store, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  onComplete?: () => void;
  durationSeconds?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  onComplete,
  durationSeconds = 5
}) => {
  const handleFinish = onComplete || onFinish || (() => {});
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Progress bar ticker over durationSeconds
    const totalMs = durationSeconds * 1000;
    const intervalMs = 30;
    const increment = (intervalMs / totalMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + increment;
      });
    }, intervalMs);

    // Timeout to finish
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        handleFinish();
      }, 500); // 500ms fade out transition
    }, totalMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [durationSeconds, handleFinish]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      handleFinish();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-slate-950 text-white overflow-hidden select-none"
          dir="rtl"
        >
          {/* Animated Background Lights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar Info */}
          <div className="w-full max-w-4xl flex items-center justify-between z-10 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Store className="w-3.5 h-3.5 text-yellow-400" />
              <span>فروشگاه حضوری و آنلاین ستاره مبارکه</span>
            </div>

            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-full transition shadow-md group cursor-pointer"
            >
              <span>ورود مستقیم به سایت</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
            </button>
          </div>

          {/* Center Brand Showcase */}
          <div className="flex flex-col items-center justify-center gap-6 my-auto z-10 text-center max-w-3xl">
            
            {/* Logo Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-blue-600/20 rounded-full blur-xl animate-pulse" />
              <SetarehLogo size={96} className="relative z-10" />
            </motion.div>

            {/* Title with TrueFocus Component from React Bits */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <SetarehLogo size={42} className="shrink-0" />
                <TrueFocus
                  sentence="موبایل ستاره مبارکه"
                  borderColor="#f59e0b"
                  glowColor="rgba(245, 158, 11, 0.8)"
                  animationDuration={0.6}
                  pauseBetweenAnimations={0.6}
                />
              </div>

              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto font-medium leading-relaxed">
                مرکز تخصصی فروش آیفون، سامسونگ، شیائومی، لوازم جانبی اورجینال و تعمیرات سخت‌افزار در مبارکه
              </p>
            </div>

            {/* Badge Pill */}
            <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>ویترین آنلاین کالاها و خدمات حضوری مغازه</span>
            </div>

          </div>

          {/* Bottom Loading Progress Bar & Timer */}
          <div className="w-full max-w-md z-10 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                در حال بارگذاری ویترین محصولات...
              </span>
              <span className="font-mono text-yellow-400 font-black">{Math.round(progress)}٪</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-l from-yellow-400 via-amber-500 to-amber-600 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>اصفهان، مبارکه، خیابان حافظ شرقی | تماس: 03152415779</span>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
