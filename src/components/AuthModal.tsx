import React, { useState } from 'react';
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
  Store
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

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
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const input = loginIdentifier.trim();
    const pass = loginPassword.trim();

    if (!input || !pass) {
      setLoginError('لطفاً نام کاربری/شماره موبایل و کلمه عبور را وارد نمایید.');
      return;
    }

    // Check special admin default
    if ((input === 'admin' || input === '09131234567') && pass === '9876543210') {
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
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // Match against user list
    const foundUser = usersList.find(
      u => u.username.toLowerCase() === input.toLowerCase() || u.phone === input
    );

    if (foundUser) {
      if (foundUser.status === 'banned') {
        setLoginError('این حساب کاربری مسدود شده است.');
        return;
      }
      onLoginSuccess(foundUser);
      onClose();
    } else {
      setLoginError('کاربری با این مشخصات یافت نشد. می‌توانید ثبت‌نام کنید.');
    }
  };

  // Handle Quick Admin Login
  const handleQuickAdminLogin = () => {
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
    onLoginSuccess(adminUser);
    onClose();
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError('لطفاً تمام فیلدهای ضروری را تکمیل نمایید.');
      return;
    }

    if (regPhone.length < 10) {
      setRegError('شماره موبایل نامعتبر است.');
      return;
    }

    const username = regUsername.trim() || `user_${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Check if phone/username exists
    const exists = usersList.some(u => u.phone === regPhone || u.username === username);
    if (exists) {
      setRegError('این شماره موبایل یا نام کاربری قبلاً ثبت‌نام شده است.');
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
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-black">
              <button
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4 text-teal-500" />
                <span>ورود به حساب</span>
              </button>

              <button
                onClick={() => { setActiveTab('register'); setRegError(''); }}
                className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4 text-yellow-500" />
                <span>ثبت‌نام جدید</span>
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    نام کاربری یا شماره موبایل:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="مثال: 09131234567 یا admin"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 pr-10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    کلمه عبور:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="کلمه عبور خود را وارد کنید"
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 pr-10 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-800">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-3.5 rounded-2xl transition shadow-lg shadow-teal-500/20 text-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ورود به حساب کاربری</span>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    شماره همراه:
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
