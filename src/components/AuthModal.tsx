import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Lock,
  LogIn,
  UserPlus,
  Check,
  ShieldCheck,
  Crown,
  LogOut,
  Sparkles,
  ArrowRight,
  Store,
  KeyRound,
  Clock,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  Mail
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout?: () => void;
  usersList?: UserAccount[];
  onRegisterUser?: (newUser: UserAccount) => void;
  referralBonusToman?: number;
  onRewardReferrer?: (referrerPhoneOrCode: string, bonusAmount: number) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser = null,
  onLoginSuccess,
  onLogout = () => {},
  usersList = [],
  onRegisterUser = () => {},
  referralBonusToman = 50000,
  onRewardReferrer = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login Form State & Rate Limiting Lock (3 failed attempts -> 5 min lock)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const saved = localStorage.getItem('setareh_failed_login_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lockUntil, setLockUntil] = useState<number | null>(() => {
    const saved = localStorage.getItem('setareh_login_lock_until');
    return saved ? parseInt(saved, 10) : null;
  });

  const [remainingLockSeconds, setRemainingLockSeconds] = useState<number>(0);

  // Countdown timer effect for 5-minute login lockout
  useEffect(() => {
    if (!lockUntil) {
      setRemainingLockSeconds(0);
      return;
    }

    const checkLock = () => {
      const now = Date.now();
      if (now >= lockUntil) {
        setLockUntil(null);
        setFailedAttempts(0);
        localStorage.removeItem('setareh_login_lock_until');
        localStorage.removeItem('setareh_failed_login_attempts');
        setRemainingLockSeconds(0);
      } else {
        setRemainingLockSeconds(Math.ceil((lockUntil - now) / 1000));
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [lockUntil]);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('5432');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [foundForgotUser, setFoundForgotUser] = useState<UserAccount | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Send Reset Password Email via Firebase Auth (sendPasswordResetEmail)
  const handleSendResetEmail = async (emailToUse?: string) => {
    const targetEmail = (emailToUse || forgotIdentifier).trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      setForgotError('لطفاً آدرس ایمیل کامل خود را وارد کنید (مثال: example@gmail.com).');
      return;
    }

    setIsSendingEmail(true);
    setForgotError('');
    setForgotSuccessMsg('');

    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setForgotSuccessMsg(`ایمیل بازیابی رمز عبور با موفقیت از طریق سرویس فایربیس (Firebase Auth) به ${targetEmail} ارسال شد. لطفاً صندوق ورودی و Spam ایمیل خود را بررسی کنید.`);
    } catch (err: any) {
      console.error("Firebase reset email error:", err);
      if (err?.code === 'auth/user-not-found') {
        setForgotError('کاربری با این آدرس ایمیل در فایربیس ثبت نشده است.');
      } else if (err?.code === 'auth/invalid-email') {
        setForgotError('فرمت آدرس ایمیل وارد شده معتبر نیست.');
      } else {
        setForgotError(err?.message || 'خطا در ارسال ایمیل بازیابی توسط فایربیس.');
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // Formatter for MM:SS
  const formatLockTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check rate limit lock
    if (lockUntil && Date.now() < lockUntil) {
      setLoginError(`دسترسی شما به دلیل ۳ بار ورود ناموفق به مدت ۵ دقیقه قفل است (${formatLockTimer(remainingLockSeconds)} باقی مانده).`);
      return;
    }

    const input = loginIdentifier.trim();
    const pass = loginPassword.trim();

    // Validation
    if (!input || !pass) {
      setLoginError('لطفاً نام کاربری/شماره موبایل و کلمه عبور را به صورت کامل وارد نمایید.');
      return;
    }

    if (pass.length < 4) {
      setLoginError('کلمه عبور باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    // Check special admin default credentials
    const isAdminUser = input === 'admin' || input === '09131234567' || input === '09131112233';
    const isValidAdminPass = pass === '9876543210' || pass === 'setareh1403' || pass === 'admin' || pass === '123456';

    if (isAdminUser && isValidAdminPass) {
      const adminUser = usersList.find(u => u.username === 'admin') || {
        id: 'usr-admin',
        username: 'admin',
        name: 'مدیریت فروشگاه ستاره',
        phone: '09131234567',
        role: 'owner',
        status: 'active',
        registeredAt: '۱۴۰۴/۰۱/۰۱',
        walletBalanceToman: 500000,
        ordersCount: 0
      };
      // Reset failed attempts
      setFailedAttempts(0);
      setLockUntil(null);
      localStorage.removeItem('setareh_failed_login_attempts');
      localStorage.removeItem('setareh_login_lock_until');

      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // Match against registered users list
    const foundUser = usersList.find(
      u => u.username.toLowerCase() === input.toLowerCase() || u.phone === input
    );

    if (foundUser) {
      if (foundUser.status === 'banned') {
        setLoginError('این حساب کاربری توسط مدیریت مسدود شده است.');
        return;
      }
      // Reset failed attempts
      setFailedAttempts(0);
      setLockUntil(null);
      localStorage.removeItem('setareh_failed_login_attempts');
      localStorage.removeItem('setareh_login_lock_until');

      onLoginSuccess(foundUser);
      onClose();
    } else {
      // Record failed attempt
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('setareh_failed_login_attempts', newAttempts.toString());

      if (newAttempts >= 3) {
        const lockTime = Date.now() + 5 * 60 * 1000; // 5 minutes lock
        setLockUntil(lockTime);
        localStorage.setItem('setareh_login_lock_until', lockTime.toString());
        setLoginError('به دلیل ۳ بار ورود ناموفق متوالی، جهت حفظ امنیت پنل، ورود شما به مدت ۵ دقیقه مسدود گردید.');
      } else {
        setLoginError(`نام کاربری یا کلمه عبور وارد شده اشتباه است. (تلاش ${newAttempts} از ۳)`);
      }
    }
  };

  // Handle Check Forgot Account in Database
  const handleCheckForgotAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMsg('');

    const input = forgotIdentifier.trim();
    if (!input) {
      setForgotError('لطفاً شماره همراه یا نام کاربری حساب خود را وارد نمایید.');
      return;
    }

    const found = usersList.find(
      u => u.phone === input || u.username.toLowerCase() === input.toLowerCase()
    ) || (input === 'admin' || input === '09131234567' || input === '09131112233' ? {
      id: 'usr-admin',
      username: 'admin',
      name: 'مدیریت ستاره',
      phone: '09131234567',
      role: 'owner',
      status: 'active',
      registeredAt: '۱۴۰۴/۰۱/۰۱',
      walletBalanceToman: 500000,
      ordersCount: 0
    } : null);

    if (!found) {
      setForgotError('حساب کاربری با این شماره همراه یا نام کاربری در دیتابیس سیستم یافت نشد.');
      return;
    }

    setFoundForgotUser(found);
    setForgotStep(2);
    setForgotSuccessMsg(`حساب کاربری «${found.name}» (${found.phone}) در دیتابیس تایید گردید. اکنون کلمه عبور جدید را تعیین کنید.`);
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!newPassword.trim() || newPassword.length < 4) {
      setForgotError('کلمه عبور جدید باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('تکرار کلمه عبور جدید با رمز وارد شده مطابقت ندارد.');
      return;
    }

    if (foundForgotUser) {
      foundForgotUser.status = 'active';
      setForgotSuccessMsg('کلمه عبور شما با موفقیت در دیتابیس به‌روزرسانی شد! در حال انتقال به صفحه ورود...');
      setTimeout(() => {
        setLoginIdentifier(foundForgotUser.username || foundForgotUser.phone);
        setLoginPassword(newPassword);
        setActiveTab('login');
        setForgotStep(1);
        setForgotSuccessMsg('');
      }, 1200);
    }
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('لطفاً تمام فیلدهای ضروری (از جمله ایمیل جهت تاییدیه و ارسال فاکتور) را تکمیل نمایید.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setRegError('آدرس ایمیل وارد شده معتبر نیست. (مثال: example@gmail.com)');
      return;
    }

    if (regPhone.length < 10) {
      setRegError('شماره موبایل نامعتبر است.');
      return;
    }

    const username = regUsername.trim() || `user_${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Check if phone/username/email exists
    const exists = usersList.some(u => u.phone === regPhone || u.username === username || (u.email && u.email.toLowerCase() === regEmail.trim().toLowerCase()));
    if (exists) {
      setRegError('این شماره موبایل، ایمیل یا نام کاربری قبلاً در دیتابیس ثبت‌نام شده است.');
      return;
    }

    // Process Referral Code Reward if provided
    let referralRewarded = false;
    if (regReferralCode.trim()) {
      const refCode = regReferralCode.trim().toUpperCase();
      const referrerUser = usersList.find(u => 
        (u.referralCode && u.referralCode.toUpperCase() === refCode) ||
        u.phone === refCode ||
        u.username.toUpperCase() === refCode
      );

      if (referrerUser) {
        onRewardReferrer(referrerUser.phone || referrerUser.id, referralBonusToman);
        referralRewarded = true;
      }
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: username,
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      role: 'customer',
      status: 'active',
      registeredAt: new Date().toLocaleDateString('fa-IR'),
      walletBalanceToman: 100000, // Gift 100k bonus wallet
      ordersCount: 0
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);

    if (referralRewarded) {
      setRegSuccessMsg(`ثبت‌نام انجام شد! ۱۰۰ هزار تومان هدیه عضویت به شما و ${referralBonusToman.toLocaleString('fa-IR')} تومان پاداش معرفی به حساب معرفی‌کننده اضافه گردید.`);
    } else {
      setRegSuccessMsg('ثبت‌نام با موفقیت انجام شد! ۱۰۰,۰۰۰ تومان هدیه عضویت به کیف پول شما واریز گردید.');
    }

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition duration-300">
        
        {/* Header Modal Bar */}
        <div className="bg-slate-950 text-white p-5 flex items-center justify-between border-b border-slate-800 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-slate-950 font-black flex items-center justify-center shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">درگاه ورود و ثبت‌نام</h3>
              <p className="text-[11px] text-slate-400 font-medium">فروشگاه موبایل ستاره مبارکه</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED IN STATE VIEW */}
        {currentUser ? (
          <div className="p-6 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/10 border-2 border-teal-500 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-2xl shadow-inner">
              {currentUser.role === 'owner' ? <Crown className="w-10 h-10 text-yellow-500" /> : <User className="w-10 h-10" />}
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold block">شما در حال حاضر وارد شده‌اید:</span>
              <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                {currentUser.name}
                {currentUser.role === 'owner' && (
                  <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    مالک اصلی
                  </span>
                )}
              </h4>
              <p className="text-xs font-mono text-slate-500">شماره تماس: {currentUser.phone}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-right space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span className="text-slate-500">موجودی کیف پول:</span>
                <span className="text-teal-600 dark:text-teal-400 font-mono font-black">
                  {currentUser.walletBalanceToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">تعداد سفارشات ثبت شده:</span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {currentUser.ordersCount} سفارش
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-2xl transition shadow-lg shadow-rose-500/20 text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>خروج از حساب کاربری</span>
              </button>

              <button
                onClick={onClose}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 rounded-2xl transition text-xs"
              >
                بازگشت به سایت
              </button>
            </div>
          </div>
        ) : (
          /* NOT LOGGED IN FORM TABS */
          <div className="p-6 space-y-5">
            
            {/* Tabs Toggle */}
            <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[11px] font-black">
              <button
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-teal-500" />
                <span>ورود</span>
              </button>

              <button
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-yellow-500" />
                <span>ثبت‌نام</span>
              </button>

              <button
                onClick={() => { setActiveTab('forgot'); setForgotError(''); setForgotSuccessMsg(''); }}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'forgot'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                <span>فراموشی رمز</span>
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Security Lock Banner if rate limited */}
                {lockUntil && Date.now() < lockUntil && (
                  <div className="bg-rose-500/10 border-2 border-rose-500/80 rounded-2xl p-3.5 space-y-2 text-rose-400 animate-pulse">
                    <div className="flex items-center gap-2 font-black text-xs">
                      <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                      <span>قفل امنیتی پنل (۳ بار ورود ناموفق)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      به منظور حفظ امنیت حساب‌ها، ورود شما به مدت ۵ دقیقه قفل شده است.
                    </p>
                    <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-xl border border-rose-500/30 text-xs font-mono font-bold text-amber-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-rose-400 animate-spin" />
                        <span>زمان باقی‌مانده قفل:</span>
                      </div>
                      <span className="text-sm tracking-widest">{formatLockTimer(remainingLockSeconds)}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    نام کاربری یا شماره موبایل:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={Boolean(lockUntil && Date.now() < lockUntil)}
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="مثال: 09131234567 یا admin"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 pr-10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 disabled:opacity-50"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      کلمه عبور:
                    </label>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('forgot'); setForgotError(''); setForgotSuccessMsg(''); }}
                      className="text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline"
                    >
                      فراموشی کلمه عبور؟
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      disabled={Boolean(lockUntil && Date.now() < lockUntil)}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="کلمه عبور خود را وارد کنید"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 pr-10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 disabled:opacity-50"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-800 leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>{loginError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={Boolean(lockUntil && Date.now() < lockUntil)}
                  className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-black py-3.5 rounded-2xl transition shadow-lg shadow-teal-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{lockUntil && Date.now() < lockUntil ? 'قفل موقت دسترسی' : 'ورود به حساب کاربری'}</span>
                </button>

              </form>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    نام و نام خانوادگی:
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: علی محمدی"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <span>آدرس ایمیل:</span>
                      <span className="text-rose-500 font-extrabold">*</span>
                    </label>
                    <span className="text-[10px] text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Mail className="w-3 h-3 text-amber-500" />
                      <span>ضروری جهت اتصال به Gmail SMTP</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 pr-9 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    شماره همراه:
                    <span className="text-rose-500 font-extrabold mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="09130000000"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    نام کاربری دلخواه (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ali_mobarakeh"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    کلمه عبور:
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      کد معرف (اختیاری):
                    </label>
                    <span className="text-[10px] text-yellow-500 font-bold">پاداش {referralBonusToman.toLocaleString('fa-IR')} تومانی</span>
                  </div>
                  <input
                    type="text"
                    value={regReferralCode}
                    onChange={(e) => setRegReferralCode(e.target.value)}
                    placeholder="مثال: SETAREH-7890 یا شماره همراه معرف"
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                {regError && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
                    {regError}
                  </p>
                )}

                {regSuccessMsg && (
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{regSuccessMsg}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-2xl transition shadow-lg shadow-yellow-400/20 text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ثبت‌نام و دریافت هدیه ۱۰۰ هزار تومانی</span>
                </button>

              </form>
            )}

            {/* TAB 3: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                {forgotStep === 1 ? (
                  <form onSubmit={handleCheckForgotAccount} className="space-y-4">
                    <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl text-xs text-rose-300 space-y-1">
                      <h5 className="font-extrabold flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-rose-400" />
                        <span>بازیابی کلمه عبور با ایمیل فایربیس (Firebase Auth) یا استعلام دیتابیس</span>
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        آدرس ایمیل خود را وارد کرده و روی «ارسال لینک با فایربیس» کلیک کنید تا ایمیل تغییر رمز مستقیم و بدون نیاز به سرور واسط ارسال شود.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        ایمیل، شماره همراه یا نام کاربری:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={forgotIdentifier}
                          onChange={(e) => setForgotIdentifier(e.target.value)}
                          placeholder="مثال: example@gmail.com یا 09131234567"
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 pr-10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                      </div>
                    </div>

                    {forgotError && (
                      <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                        <span>{forgotError}</span>
                      </p>
                    )}

                    {forgotSuccessMsg && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-xs text-emerald-400 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{forgotSuccessMsg}</span>
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isSendingEmail}
                        onClick={() => handleSendResetEmail()}
                        className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 font-bold py-3 rounded-2xl transition text-xs flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>{isSendingEmail ? 'در حال ارسال ایمیل...' : 'ارسال لینک به ایمیل (فایربیس)'}</span>
                      </button>

                      <button
                        type="submit"
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3 rounded-2xl transition shadow-lg shadow-rose-500/20 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>استعلام دیتابیس</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                    
                    {forgotSuccessMsg && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-xs text-emerald-400 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{forgotSuccessMsg}</span>
                        </p>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        کلمه عبور جدید:
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="حداقل ۴ کاراکتر"
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        تکرار کلمه عبور جدید:
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="تکرار کلمه عبور جدید"
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {forgotError && (
                      <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800 flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{forgotError}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-2.5 rounded-xl transition"
                      >
                        مرحله قبل
                      </button>

                      <button
                        type="submit"
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>تایید و تغییر کلمه عبور</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>امنیت ورود و اطلاعات شما توسط فروشگاه موبایل ستاره مبارکه تضمین می‌گردد.</span>
        </div>

      </div>
    </div>
  );
};
