import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  User, 
  Wallet, 
  Award, 
  Gift, 
  Share2, 
  ShoppingBag, 
  Heart, 
  CheckCircle, 
  Copy, 
  LogOut, 
  CreditCard,
  Printer,
  ChevronLeft,
  Smartphone,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  Edit3,
  Save,
  MapPin,
  Mail,
  FileText,
  CheckCircle2,
  Wrench,
  Search,
  Loader2,
  Activity,
  AlertCircle,
  PhoneCall,
  Check,
  Camera,
  Upload,
  Trash2,
  RefreshCw,
  UserCheck,
  Video,
  Zap,
  KeyRound,
  Truck,
  PackageCheck,
  ExternalLink,
  Box,
  Filter,
  RotateCcw,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserProfile, Product, Order } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  currentUser?: UserProfile;
  user?: any;
  onLogout?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
  wishlistProducts?: Product[];
  onRemoveFromWishlist?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  onOpenAuth?: () => void;
  isLoggedIn?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  startInEditMode?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile: propUserProfile,
  currentUser,
  onLogout = () => {},
  onUpdateProfile = () => {},
  wishlistProducts = [],
  onRemoveFromWishlist = () => {},
  onAddToCart = () => {},
  onOpenAuth = () => {},
  isLoggedIn = false,
  startInEditMode = false
}) => {
  const defaultProfile: UserProfile = {
    name: 'مهمان',
    phone: '',
    walletBalanceToman: 0,
    loyaltyPoints: 0,
    loyaltyTier: 'برنز',
    referralCode: 'SETAREH100',
    wishlistIds: [],
    orders: [],
    coupons: []
  };

  const userProfile: UserProfile = propUserProfile || defaultProfile;

  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'loyalty' | 'orders' | 'wishlist' | 'coupons' | 'repair'>('profile');
  const [chargeAmount, setChargeAmount] = useState<string>('500000');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Orders History Filtering & Tracking States
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'در حال پردازش' | 'تایید شده' | 'ارسال شده' | 'تحویل گردیده'>('all');
  const [copiedTrackingCode, setCopiedTrackingCode] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Repair Tracking States
  const [repairCodeInput, setRepairCodeInput] = useState<string>('SR-882104');
  const [isSearchingRepair, setIsSearchingRepair] = useState<boolean>(false);
  const [repairSearchResult, setRepairSearchResult] = useState<any | null>(null);
  const [repairSearchError, setRepairSearchError] = useState<string | null>(null);

  const handleTrackRepair = async (codeToSearch?: string) => {
    const code = (codeToSearch || repairCodeInput || '').trim();
    if (!code) {
      setRepairSearchError('لطفاً کد رهگیری تعمیرات را وارد کنید.');
      return;
    }
    setRepairSearchError(null);
    setIsSearchingRepair(true);

    try {
      const res = await fetch(`/api/repair-request/track/${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.repair) {
          setRepairSearchResult(data.repair);
        } else {
          setRepairSearchError('کد رهگیری وارد شده در سیستم تعمیرات یافت نشد.');
          setRepairSearchResult(null);
        }
      } else {
        setRepairSearchError('خطا در دریافت اطلاعات وضعیت تعمیر.');
        setRepairSearchResult(null);
      }
    } catch (err) {
      console.error('Error tracking repair:', err);
      setRepairSearchError('خطا در برقراری ارتباط با سرور.');
      setRepairSearchResult(null);
    } finally {
      setIsSearchingRepair(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'repair' && !repairSearchResult) {
      handleTrackRepair('SR-882104');
    }
  }, [activeTab]);

  // Orders History Filtering & Helper Logic
  const filteredOrders = useMemo(() => {
    return (userProfile.orders || []).filter((order) => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const q = orderSearchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;
      const matchesId = (order.id || '').toLowerCase().includes(q);
      const matchesTracking = (order.trackingCode || '').toLowerCase().includes(q);
      const matchesItems = (order.items || []).some((item) =>
        (item.product?.persianName || '').toLowerCase().includes(q) ||
        (item.product?.name || '').toLowerCase().includes(q) ||
        (item.product?.brand || '').toLowerCase().includes(q)
      );
      return matchesStatus && (matchesId || matchesTracking || matchesItems);
    });
  }, [userProfile.orders, orderStatusFilter, orderSearchQuery]);

  const handleCopyTrackingCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedTrackingCode(code);
    setTimeout(() => setCopiedTrackingCode(null), 2500);
  };

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        onAddToCart(item.product);
        count++;
      }
    });
    setOrderToast(`تعداد ${count} محصول مجدداً به سبد خرید شما اضافه شد.`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  // Edit Profile & Avatar States
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(startInEditMode);
  const [avatar, setAvatar] = useState<string>(userProfile.avatar || '');
  const [isContactVerified, setIsContactVerified] = useState<boolean>(userProfile.isContactVerified ?? true);

  const [profileForm, setProfileForm] = useState({
    name: userProfile.name || '',
    phone: userProfile.phone || '',
    secondaryPhone: userProfile.secondaryPhone || '',
    email: userProfile.email || '',
    city: userProfile.city || 'مبارکه',
    address: userProfile.address || '',
    postalCode: userProfile.postalCode || '',
    nationalCode: userProfile.nationalCode || ''
  });

  // Webcam & Avatar Capture States
  const [isWebcamOpen, setIsWebcamOpen] = useState<boolean>(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contact Verification OTP States
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string>('5821');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && startInEditMode) {
      setActiveTab('profile');
      setIsEditingProfile(true);
    }
  }, [isOpen, startInEditMode]);

  useEffect(() => {
    setProfileForm({
      name: userProfile.name || '',
      phone: userProfile.phone || '',
      secondaryPhone: userProfile.secondaryPhone || '',
      email: userProfile.email || '',
      city: userProfile.city || 'مبارکه',
      address: userProfile.address || '',
      postalCode: userProfile.postalCode || '',
      nationalCode: userProfile.nationalCode || ''
    });
    setAvatar(userProfile.avatar || '');
    setIsContactVerified(userProfile.isContactVerified ?? true);
  }, [userProfile]);

  // Clean up webcam stream if modal is unmounted or closed
  useEffect(() => {
    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [webcamStream]);

  // Webcam Handlers
  const handleStartWebcam = async () => {
    setWebcamError(null);
    setCapturedPhoto(null);
    setIsWebcamOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      setWebcamStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Error opening webcam:', err);
      setWebcamError('امکان دسترسی به دوربین وبکم مقدور نشد. لطفاً مجوز دسترسی دوربین را در مرورگر تأیید کنید یا از آپلود فایل عکس استفاده کنید.');
    }
  };

  const handleStopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setIsWebcamOpen(false);
    setCapturedPhoto(null);
    setWebcamError(null);
  };

  const handleCaptureWebcam = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror horizontally for natural selfie view
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setCapturedPhoto(dataUrl);
      }
    }
  };

  const handleConfirmWebcamPhoto = () => {
    if (capturedPhoto) {
      setAvatar(capturedPhoto);
      handleStopWebcam();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم تصویر نباید بیشتر از ۵ مگابایت باشد.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result as string;
        if (res) {
          setAvatar(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
  };

  // Contact Verification OTP Handlers
  const handleSendOtpCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtpCode(code);
    setOtpInput('');
    setShowOtpModal(true);
  };

  const handleConfirmOtpCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingOtp(true);

    setTimeout(() => {
      if (otpInput.trim() === generatedOtpCode || otpInput.trim() === '1234' || otpInput.trim() === '5821') {
        setIsContactVerified(true);
        setShowOtpModal(false);
        setOtpSuccessMsg('اطلاعات تماس و شماره همراه شما با موفقیت در سامانه تأیید شد.');
        setTimeout(() => setOtpSuccessMsg(null), 4000);
      } else {
        alert(`کد وارد شده صحیح نیست. (کد آزمایشی ارسال شده: ${generatedOtpCode})`);
      }
      setIsVerifyingOtp(false);
    }, 600);
  };

  if (!isOpen) return null;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`کد دعوت من در موبایل ستاره: ${userProfile.referralCode}\nبا این کد ۱۰۰ هزار تومان تخفیف هدیه بگیرید!`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleSaveProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      alert('لطفاً نام و نام خانوادگی را وارد کنید.');
      return;
    }
    if (!profileForm.phone.trim()) {
      alert('لطفاً شماره همراه را وارد کنید.');
      return;
    }

    setIsSavingProfile(true);
    const updatedProfile: UserProfile = {
      ...userProfile,
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      secondaryPhone: profileForm.secondaryPhone?.trim(),
      email: profileForm.email.trim(),
      city: profileForm.city.trim(),
      address: profileForm.address.trim(),
      postalCode: profileForm.postalCode.trim(),
      nationalCode: profileForm.nationalCode.trim(),
      avatar: avatar,
      isContactVerified: isContactVerified
    };

    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (currentUser as any)?.id || 'current-user',
          ...profileForm,
          avatar,
          isContactVerified
        })
      });
    } catch (err) {
      console.log('Local profile sync update:', err);
    }

    onUpdateProfile(updatedProfile);
    setIsSavingProfile(false);
    setIsEditingProfile(false);
    setSaveSuccessMessage('اطلاعات شخصی، آواتار و شماره تماس شما با موفقیت ذخیره شد.');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleChargeWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(chargeAmount, 10);
    if (!amt || amt <= 0) return;
    
    onUpdateProfile({
      ...userProfile,
      walletBalanceToman: userProfile.walletBalanceToman + amt,
      loyaltyPoints: userProfile.loyaltyPoints + Math.floor(amt / 100000)
    });
    alert(`کیف پول شما به مبلغ ${amt.toLocaleString('fa-IR')} تومان با موفقیت شارژ شد.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                حساب کاربری و باشگاه مشتریان ستاره
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 uppercase">
                  {userProfile.loyaltyTier}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {isLoggedIn ? `خوش آمدید، ${userProfile.name} (${userProfile.phone})` : 'مهمان عزیز، جهت ثبت سفارش وارد شوید'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow"
                title="خروج از حساب کاربری"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج از حساب</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 bg-slate-900 text-slate-400 hover:text-white transition rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 flex items-center gap-1.5 transition ${
              activeTab === 'profile' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>اطلاعات کاربری</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-2 flex items-center gap-1.5 transition ${
              activeTab === 'wallet' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-yellow-400" />
            <span>کیف پول ({userProfile.walletBalanceToman.toLocaleString('fa-IR')} تومان)</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-3 py-2 flex items-center gap-1.5 transition ${
              activeTab === 'loyalty' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>باشگاه مشتریان ({userProfile.loyaltyPoints} امتیاز)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 flex items-center gap-1.5 transition ${
              activeTab === 'orders' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>تاریخچه سفارشات ({userProfile.orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-3 py-2 flex items-center gap-1.5 transition ${
              activeTab === 'wishlist' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>علاقه‌مندی‌ها ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3 py-2 flex items-center gap-1.5 transition ${
              activeTab === 'coupons' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>کوپن‌ها ({userProfile.coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('repair')}
            className={`px-3 py-2 flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'repair' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-yellow-500 animate-bounce" />
            <span>پیگیری لحظه‌ای تعمیرات</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {saveSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 flex items-center justify-between text-xs font-bold rounded-none shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                  <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-950">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Top Banner and Toggle Edit Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100 border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {userProfile.avatar || avatar ? (
                      <img
                        src={userProfile.avatar || avatar}
                        alt="User Avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow-md"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-slate-950 text-yellow-400 font-black text-xl rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-md">
                        {userProfile.name ? userProfile.name.charAt(0) : 'ک'}
                      </div>
                    )}
                    {isContactVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white" title="اطلاعات تماس تأیید شده">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-950">{userProfile.name || 'کاربر گرامی'}</h4>
                      {isContactVerified ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          تأیید شده
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          در انتظار تأیید شماره
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono" dir="ltr">{userProfile.phone || 'شماره ثبت نشده'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`px-4 py-2 text-xs font-black flex items-center gap-2 transition border shadow-sm ${
                    isEditingProfile 
                      ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' 
                      : 'bg-yellow-400 border-yellow-500 text-slate-950 hover:bg-yellow-300'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingProfile ? 'انصراف از ویرایش' : 'ویرایش اطلاعات و تصویر'}</span>
                </button>
              </div>

              {/* EDIT FORM MODE */}
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfileForm} className="bg-slate-50 border-2 border-slate-900 p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-yellow-500" />
                      <h4 className="font-black text-sm text-slate-950 uppercase tracking-wider">ویرایش پروفایل و عکس شخصی</h4>
                    </div>
                  </div>

                  {/* AVATAR SELECTION & WEBCAM BLOCK */}
                  <div className="bg-white border-2 border-slate-200 p-4 rounded-xl space-y-3">
                    <label className="text-slate-800 font-black block text-xs flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-yellow-500" />
                      <span>تصویر آواتار شخصی (عکاسی مستقیم با وبکم یا بارگذاری فایل)</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar Preview Box */}
                      <div className="relative shrink-0">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt="Avatar Preview"
                            className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 shadow-md"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-slate-950 text-yellow-400 text-2xl font-black flex items-center justify-center border-4 border-yellow-400 shadow-md">
                            {profileForm.name ? profileForm.name.charAt(0) : 'ک'}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex-1 space-y-2 text-center sm:text-right">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <button
                            type="button"
                            onClick={handleStartWebcam}
                            className="bg-slate-950 hover:bg-slate-800 text-yellow-400 font-bold px-3.5 py-2 text-xs flex items-center gap-1.5 transition border border-slate-800 shadow-sm"
                          >
                            <Camera className="w-4 h-4 text-yellow-400" />
                            <span>عکاسی آنلاین با وبکم</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 text-xs flex items-center gap-1.5 transition border border-slate-300"
                          >
                            <Upload className="w-4 h-4 text-slate-600" />
                            <span>انتخاب عکس از دستگاه</span>
                          </button>

                          {avatar && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 text-xs flex items-center gap-1 transition border border-rose-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف تصویر</span>
                            </button>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          تصویر به فرمت JPG یا PNG با حداکثر حجم ۵ مگابایت. می‌توانید مستقیماً از وبکم عکس گرفته یا فایل را آپلود کنید.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PERSONAL & CONTACT INFORMATION */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block text-xs">نام و نام خانوادگی <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-bold text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="مثال: سامان بهرامی"
                        />
                      </div>
                    </div>

                    {/* Primary Phone */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block text-xs">شماره همراه اصلی <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          required
                          dir="ltr"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-mono font-bold text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="۰۹۱۳۱۲۳۴۵۶۷"
                        />
                      </div>
                    </div>

                    {/* Secondary Phone */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block text-xs">شماره تماس ثانویه / ثابت (جهت هماهنگی تحویل)</label>
                      <div className="relative">
                        <PhoneCall className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          dir="ltr"
                          value={profileForm.secondaryPhone}
                          onChange={(e) => setProfileForm({ ...profileForm, secondaryPhone: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-mono font-bold text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="۰۳۱۵۲۴۱۰۰۰۰ یا شماره همراه دوم"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block text-xs">پست الکترونیک (ایمیل)</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="email"
                          dir="ltr"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-mono text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block text-xs">شهر / استان</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-bold text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="مثال: مبارکه، اصفهان"
                        />
                      </div>
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block text-xs">کد پستی ۱۰ رقمی</label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          dir="ltr"
                          maxLength={10}
                          value={profileForm.postalCode}
                          onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-mono text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="۸۴۸۱۶۱۲۳۴۵"
                        />
                      </div>
                    </div>

                    {/* National Code */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-700 font-bold block text-xs">کد ملی جهت صدور فاکتور و ضمانتنامه قانونی</label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                        <input
                          type="text"
                          dir="ltr"
                          maxLength={10}
                          value={profileForm.nationalCode}
                          onChange={(e) => setProfileForm({ ...profileForm, nationalCode: e.target.value })}
                          className="w-full bg-white border border-slate-300 pr-9 pl-3 py-2 text-xs font-mono text-slate-950 focus:border-slate-950 focus:outline-none"
                          placeholder="۱۲۷۰۰۰۰۰۰۰"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1 pt-1">
                    <label className="text-slate-700 font-bold block text-xs">آدرس کامل پستی (جهت تحویل سریع سفارشات)</label>
                    <textarea
                      rows={2}
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-white border border-slate-300 p-3 text-xs font-bold text-slate-950 focus:border-slate-950 focus:outline-none"
                      placeholder="مثال: مبارکه، خیابان بهشتی، خیابان حافظ شرقی، پلاک ۱۲..."
                    />
                  </div>

                  {/* CONTACT VERIFICATION CARD */}
                  <div className="bg-slate-100 border border-slate-300 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-5 h-5 ${isContactVerified ? 'text-emerald-600' : 'text-amber-500'}`} />
                        <span className="font-black text-xs text-slate-900">وضعیت احراز و تأیید اطلاعات تماس</span>
                      </div>

                      {isContactVerified ? (
                        <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تأیید شده
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtpCode}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 transition rounded"
                        >
                          ارسال SMS و تأیید شماره
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {isContactVerified
                        ? 'شماره تماس و اطلاعات ارتباطی شما در پایگاه داده فروشگاه مبارکه به ثبت و تأیید کامل رسیده است.'
                        : 'برای افزایش امنیت حساب و دریافت سریع‌تر پیامک‌های رهگیری مرسولات، شماره همراه خود را تأیید کنید.'}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 text-xs flex items-center gap-2 transition shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingProfile ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات و آواتار'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2.5 text-xs transition"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              ) : (
                /* DISPLAY READ MODE */
                <div className="space-y-4">
                  {otpSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 flex items-center gap-2 text-xs font-bold animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{otpSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">نام و نام خانوادگی</span>
                      <p className="text-sm font-black text-slate-950">{userProfile.name || 'ثبت نشده'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">شماره همراه اصلی</span>
                      <p className="text-sm font-black text-slate-950 font-mono" dir="ltr">{userProfile.phone || 'ثبت نشده'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">شماره ثانویه / ثابت</span>
                      <p className="text-sm font-black text-slate-950 font-mono" dir="ltr">{userProfile.secondaryPhone || 'ثبت نشده'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">وضعیت احراز هویت تماس</span>
                      <div className="flex items-center justify-between">
                        {isContactVerified ? (
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            اطلاعات تماس تأیید شده
                          </span>
                        ) : (
                          <button
                            onClick={handleSendOtpCode}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black px-2.5 py-1 transition rounded"
                          >
                            تأیید سریع شماره (SMS)
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">سطح عضویت باشگاه</span>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                        <p className="text-sm font-black text-slate-950">سطح {userProfile.loyaltyTier}</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">پست الکترونیک (ایمیل)</span>
                      <p className="text-xs font-bold text-slate-950 font-mono" dir="ltr">{userProfile.email || 'ثبت نشده'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">شهر / استان</span>
                      <p className="text-xs font-bold text-slate-950">{userProfile.city || 'مبارکه'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">کد پستی</span>
                      <p className="text-xs font-bold text-slate-950 font-mono" dir="ltr">{userProfile.postalCode || 'ثبت نشده'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1">
                      <span className="text-slate-500 font-bold block text-[11px]">کد ملی</span>
                      <p className="text-xs font-bold text-slate-950 font-mono" dir="ltr">{userProfile.nationalCode || 'ثبت نشده'}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 space-y-1 md:col-span-3">
                      <span className="text-slate-500 font-bold block text-[11px]">آدرس ثبت شده جهت تحویل سفارش</span>
                      <p className="text-xs font-bold text-slate-950">{userProfile.address || 'هنوز آدرسی وارد نکرده‌اید. با کلیک روی «ویرایش اطلاعات حساب» آدرس خود را تکمیل کنید.'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Referral Section */}
              <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white p-6 border-2 border-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-black text-sm uppercase tracking-wider">دعوت از دوستان و دریافت ۱۰۰ هزار تومان هدیه</h4>
                  </div>
                  <span className="bg-yellow-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5">
                    نامحدود
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-medium">
                  با ارسال کد اختصاصی خود به دوستان و آشنایان، با اولین خرید آن‌ها ۱۰۰ هزار تومان هدیه کیف پول دریافت کنید و دوست شما نیز ۱۰۰ هزار تومان تخفیف می‌گیرد.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <div className="bg-slate-900 border border-slate-700 px-4 py-2 font-mono text-yellow-400 font-black text-sm tracking-wider">
                    {userProfile.referralCode}
                  </div>
                  <button
                    onClick={handleCopyReferral}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-4 py-2 flex items-center gap-1.5 transition"
                  >
                    {copiedReferral ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedReferral ? 'کپی شد!' : 'کپی لینک دعوت'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WALLET TAB */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="bg-slate-950 text-white p-6 border-2 border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">موجودی فعلی کیف پول ستاره:</span>
                  <div className="text-3xl font-black text-yellow-400 font-mono">
                    {userProfile.walletBalanceToman.toLocaleString('fa-IR')} <span className="text-sm text-white font-sans font-normal">تومان</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 font-medium">
                  <p className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    قابل استفاده در تمام خریدهای آنلاین و حضوری
                  </p>
                  <p className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    بدون تاریخ انقضا و بازگشت نقدی آنی
                  </p>
                </div>
              </div>

              {/* Charge Form */}
              <div className="bg-slate-50 border border-slate-200 p-6 space-y-4">
                <h4 className="font-black text-slate-950 text-sm">افزایش اعتبار / شارژ آنلاین کیف پول</h4>
                
                <form onSubmit={handleChargeWallet} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold block">مبلغ شارژ به تومان:</label>
                    <input
                      type="number"
                      value={chargeAmount}
                      onChange={(e) => setChargeAmount(e.target.value)}
                      className="w-full bg-white text-slate-950 border border-slate-300 p-3 font-mono text-base font-bold focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[200000, 500000, 1000000, 2000000, 5000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setChargeAmount(amt.toString())}
                        className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 px-3 py-1.5 font-bold transition"
                      >
                        +{amt.toLocaleString('fa-IR')} تومان
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-slate-800 text-white font-black px-6 py-3 uppercase tracking-wider flex items-center gap-2 transition"
                  >
                    <CreditCard className="w-4 h-4 text-yellow-400" />
                    <span>پرداخت آنلاین و شارژ کیف پول</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* LOYALTY CLUB TAB */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border-2 border-amber-500/40 p-6 text-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-600" />
                    <h4 className="font-black text-base">امتیاز باشگاه مشتریان ستاره: {userProfile.loyaltyPoints} امتیاز</h4>
                  </div>
                  <span className="bg-slate-950 text-yellow-400 font-black px-3 py-1 text-xs">
                    سطح فعلی: {userProfile.loyaltyTier}
                  </span>
                </div>

                <p className="text-slate-700 font-medium leading-relaxed">
                  به ازای هر ۱۰۰ هزار تومان خرید از فروشگاه ستاره، ۱ امتیاز به باشگاه مشتریان شما اضافه می‌شود. با ارتقا به سطح طلایی و الماسی از تخفیف‌های ویژه روز تولد و اولویت تعمیرات رایگان بهره‌مند شوید.
                </p>
              </div>

              {/* Tiers list */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { name: 'برنز', min: 0, perk: 'تخفیف ۱٪ خدمات تعمیرات' },
                  { name: 'نقره‌ای', min: 200, perk: 'ارسال رایگان سفارشات' },
                  { name: 'طلایی', min: 400, perk: 'گلس رایگان + کوپن ۵۰۰ تومانی' },
                  { name: 'الماسی', min: 1000, perk: '۵٪ تخفیف دائمی خریدهای جانبی' }
                ].map((tier) => (
                  <div 
                    key={tier.name}
                    className={`p-4 border-2 text-center space-y-2 ${
                      userProfile.loyaltyTier === tier.name
                        ? 'bg-slate-950 text-white border-yellow-400 shadow-md'
                        : 'bg-slate-50 text-slate-900 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-black block">{tier.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">از {tier.min} امتیاز</span>
                    <p className="text-[11px] font-medium pt-1 border-t border-slate-800/20">{tier.perk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS TAB (Enhanced Order History & Tracking) */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              
              {/* Toast Notification */}
              {orderToast && (
                <div className="bg-emerald-950 text-emerald-300 border border-emerald-500/50 p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{orderToast}</span>
                </div>
              )}

              {/* Order Search & Status Filter Controls */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="جستجو بر اساس شناسه سفارش، کد رهگیری یا نام گوشی..."
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-yellow-500 font-medium transition"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    {orderSearchQuery && (
                      <button
                        onClick={() => setOrderSearchQuery('')}
                        className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    <Box className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold">تعداد کل سفارشات: {userProfile.orders.length.toLocaleString('fa-IR')}</span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {[
                    { key: 'all', label: 'همه سفارشات' },
                    { key: 'در حال پردازش', label: 'در حال پردازش' },
                    { key: 'تایید شده', label: 'تایید شده' },
                    { key: 'ارسال شده', label: 'ارسال شده' },
                    { key: 'تحویل گردیده', label: 'تحویل گردیده' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setOrderStatusFilter(tab.key as any)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap text-[11px] ${
                        orderStatusFilter === tab.key
                          ? 'bg-slate-950 text-white dark:bg-yellow-400 dark:text-slate-950 shadow-sm'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order List */}
              {filteredOrders.length === 0 ? (
                <div className="py-12 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-500 dark:text-slate-400 font-bold space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm">هیچ سفارشی مطابق با فیلتر جستجوی شما یافت نشد.</p>
                  {(orderSearchQuery || orderStatusFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setOrderSearchQuery('');
                        setOrderStatusFilter('all');
                      }}
                      className="bg-slate-950 dark:bg-slate-800 text-white dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>حذف فیلترها</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  // Order Status Stepper Stage (1 to 4)
                  let currentStep = 1;
                  if (order.status === 'تایید شده') currentStep = 2;
                  if (order.status === 'ارسال شده') currentStep = 3;
                  if (order.status === 'تحویل گردیده') currentStep = 4;

                  return (
                    <div
                      key={order.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition"
                    >
                      {/* Order Header */}
                      <div className="p-4 bg-slate-50/80 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-slate-950 text-white dark:bg-slate-800 font-mono text-xs font-bold px-2.5 py-1 rounded-lg">
                            {order.id}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{order.date}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${
                              order.status === 'تحویل گردیده'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                                : order.status === 'ارسال شده'
                                ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800'
                                : order.status === 'تایید شده'
                                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
                                : 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {order.status === 'تحویل گردیده' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                            {order.status === 'ارسال شده' && <Truck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                            {order.status === 'تایید شده' && <PackageCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                            {order.status === 'در حال پردازش' && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                            <span>{order.status}</span>
                          </span>

                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition"
                            title="جزئیات بیشتر"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Visual Order Shipping Progress Stepper */}
                      <div className="px-4 py-3 bg-slate-50/30 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="grid grid-cols-4 gap-1 relative text-center">
                          {[
                            { step: 1, title: 'ثبت سفارش', icon: Clock },
                            { step: 2, title: 'تایید و پردازش', icon: PackageCheck },
                            { step: 3, title: 'تحویل به پست/پیک', icon: Truck },
                            { step: 4, title: 'تحویل نهایی', icon: CheckCircle2 },
                          ].map((s) => {
                            const isDone = currentStep >= s.step;
                            const isCurrent = currentStep === s.step;
                            const IconComponent = s.icon;

                            return (
                              <div key={s.step} className="flex flex-col items-center space-y-1 relative z-10">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition border ${
                                    isDone
                                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                                  }`}
                                >
                                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <IconComponent className="w-3.5 h-3.5" />}
                                </div>
                                <span
                                  className={`text-[10px] font-bold leading-tight ${
                                    isCurrent
                                      ? 'text-slate-950 dark:text-yellow-400'
                                      : isDone
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-slate-400 dark:text-slate-500'
                                  }`}
                                >
                                  {s.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Itemized Products List */}
                      <div className="p-4 space-y-3">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                          اقلام سفارش شده:
                        </span>

                        <div className="space-y-2.5">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800"
                            >
                              <div className="flex items-center gap-3">
                                {item.product.image ? (
                                  <img
                                    src={item.product.image}
                                    alt={item.product.persianName}
                                    className="w-10 h-10 object-contain bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                                    <Smartphone className="w-5 h-5 text-slate-400" />
                                  </div>
                                )}
                                <div>
                                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                                    {item.product.persianName}
                                  </span>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                                    <span>رنگ: {item.selectedColor}</span>
                                    <span>•</span>
                                    <span>تعداد: {item.quantity.toLocaleString('fa-IR')}</span>
                                  </div>
                                </div>
                              </div>

                              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                                {(item.product.priceToman * item.quantity).toLocaleString('fa-IR')} تومان
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Extra Details (If Expanded or Always Visible) */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                          {order.shippingAddress && (
                            <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>آدرس تحویل: {order.shippingAddress}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 dark:text-slate-400 font-medium">نحوه پرداخت:</span>
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px] px-2 py-0.5 rounded-md">
                                {order.paymentMethod || 'پرداخت آنلاین'}
                              </span>
                            </div>

                            {/* Tracking Code Section */}
                            {order.trackingCode && (
                              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">کد رهگیری پستی:</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                                  {order.trackingCode}
                                </span>
                                <button
                                  onClick={() => handleCopyTrackingCode(order.trackingCode)}
                                  className="text-slate-400 hover:text-yellow-500 transition p-0.5"
                                  title="کپی کد رهگیری"
                                >
                                  {copiedTrackingCode === order.trackingCode ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">مبلغ پرداختی:</span>
                            <span className="text-sm font-black text-slate-950 dark:text-yellow-400 font-mono">
                              {order.finalAmountToman.toLocaleString('fa-IR')} تومان
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Postal Tracking Link */}
                            {order.trackingCode && (
                              <a
                                href={`https://tracking.post.ir/?id=${order.trackingCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                                <span>سامانه رهگیری پست</span>
                              </a>
                            )}

                            {/* Reorder Button */}
                            <button
                              onClick={() => handleReorder(order)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px] shadow-sm"
                            >
                              <RotateCcw className="w-3 h-3 text-slate-950" />
                              <span>سفارش مجدد</span>
                            </button>

                            {/* Print Invoice */}
                            <button
                              onClick={() => setSelectedOrderForInvoice(order)}
                              className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition text-[11px]"
                            >
                              <Printer className="w-3.5 h-3.5 text-yellow-400" />
                              <span>فاکتور رسمی</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}

            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-bold space-y-2">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p>لیست علاقه‌مندی‌های شما خالی است.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="bg-slate-50 border border-slate-200 p-3 flex gap-3 items-center">
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-contain bg-white p-1" />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h5 className="font-bold text-slate-950 truncate">{p.persianName}</h5>
                        <p className="font-mono text-slate-950 font-black">{p.priceToman.toLocaleString('fa-IR')} تومان</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => onAddToCart(p)}
                          className="bg-slate-950 text-white font-bold px-2.5 py-1 text-[11px]"
                        >
                          خرید
                        </button>
                        <button
                          onClick={() => onRemoveFromWishlist(p.id)}
                          className="text-rose-600 hover:text-rose-800 text-[10px] font-bold"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProfile.coupons.map((coupon, idx) => (
                <div key={idx} className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-950 text-yellow-400 font-mono font-black text-sm px-2.5 py-1">
                      {coupon.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">انقضا: {coupon.expiresAt}</span>
                  </div>
                  <p className="text-slate-800 font-bold">{coupon.description}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    حداقل سفارش: {coupon.minOrderToman.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* REPAIR TRACKING TAB */}
          {activeTab === 'repair' && (
            <div className="space-y-6 font-['Vazirmatn']">
              {/* Top Banner & Search Box */}
              <div className="bg-slate-950 text-white p-5 rounded-2xl border-2 border-yellow-400/40 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl flex items-center justify-center font-bold">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        سامانه پیگیری لحظه‌ای تعمیرات موبایل ستاره
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        کد پیگیری برگه تحویل (مثلاً SR-882104) را جهت مشاهده مراحل عیب‌یابی و تعمیر وارد کنید.
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:03152415779"
                    className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-yellow-400 border border-slate-700 px-3 py-2 rounded-xl transition self-start sm:self-auto font-bold"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>پشتیبانی: ۰۳۱۵۲۴۱۵۷۷۹</span>
                  </a>
                </div>

                {/* Input & Search Button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTrackRepair();
                  }}
                  className="flex flex-col sm:flex-row items-stretch gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={repairCodeInput}
                      onChange={(e) => setRepairCodeInput(e.target.value)}
                      placeholder="کد پیگیری تعمیرات (مانند: SR-882104)"
                      className="w-full bg-slate-900 border-2 border-slate-700 focus:border-yellow-400 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white font-mono placeholder:font-sans placeholder:text-slate-500 focus:outline-none transition"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearchingRepair}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSearchingRepair ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال استعلام...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-4 h-4" />
                        <span>استعلام وضعیت</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Sample Tracking Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="text-slate-400">کدهای نمونه جهت تست سریع:</span>
                  {[
                    { code: 'SR-882104', label: 'سامسونگ S23 (در حال تعمیر)' },
                    { code: 'SR-941205', label: 'شیائومی Poco (آماده تحویل)' },
                    { code: 'SR-512093', label: 'آیفون 13 (عیب‌یابی اولیه)' }
                  ].map((sample) => (
                    <button
                      key={sample.code}
                      type="button"
                      onClick={() => {
                        setRepairCodeInput(sample.code);
                        handleTrackRepair(sample.code);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 px-2.5 py-1 rounded-lg font-mono transition flex items-center gap-1 hover:text-yellow-400 cursor-pointer"
                    >
                      <span className="text-yellow-400 font-bold">{sample.code}</span>
                      <span className="text-[10px] text-slate-400">({sample.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Alert */}
              {repairSearchError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{repairSearchError}</span>
                </div>
              )}

              {/* Repair Result & Stepped Timeline */}
              {repairSearchResult && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Summary Card */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-[11px] text-slate-400">شناسه سفارش تعمیر:</div>
                        <div className="font-mono font-extrabold text-base text-yellow-400">
                          {repairSearchResult.trackingCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">وضعیت کلی:</span>
                        <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-3 py-1 rounded-xl text-xs font-black">
                          {repairSearchResult.steps?.[repairSearchResult.currentStepIndex]?.title || 'در حال انجام'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 block text-[11px]">دستگاه و مدل:</span>
                        <strong className="text-white block mt-0.5">{repairSearchResult.deviceModel}</strong>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 block text-[11px]">عیب اعلام‌شده / خدمات:</span>
                        <strong className="text-slate-200 block mt-0.5 text-[11px]">{repairSearchResult.issue}</strong>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 block text-[11px]">کارشناس مسئول:</span>
                        <strong className="text-yellow-400 block mt-0.5">{repairSearchResult.technicianName}</strong>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 block text-[11px]">مبلغ تخمینی:</span>
                        <strong className="text-emerald-400 block mt-0.5 font-mono">{repairSearchResult.estimatedCost}</strong>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 block text-[11px]">زمان تحویل پیش‌بینی‌شده:</span>
                        <strong className="text-white block mt-0.5">{repairSearchResult.estimatedCompletion}</strong>
                      </div>

                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 block text-[11px]">مشتری:</span>
                        <strong className="text-slate-300 block mt-0.5">{repairSearchResult.customerName} ({repairSearchResult.phone})</strong>
                      </div>
                    </div>
                  </div>

                  {/* STEPPED PROGRESS DIAGRAM / TIMELINE CHART */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-yellow-400" />
                        <span>نمودار مرحله‌بندی پیشرفت تعمیر</span>
                      </h4>
                      <span className="text-xs text-slate-400">
                        مرحله {repairSearchResult.currentStepIndex + 1} از {repairSearchResult.steps?.length || 5}
                      </span>
                    </div>

                    {/* Stepped Progress Bar (Horizontal for MD+, Vertical for Mobile) */}
                    <div className="relative my-4">
                      
                      {/* Desktop Progress Connecting Line */}
                      <div className="hidden md:block absolute top-5 right-8 left-8 h-1 bg-slate-800 z-0">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-700"
                          style={{
                            width: `${(repairSearchResult.currentStepIndex / ((repairSearchResult.steps?.length || 5) - 1)) * 100}%`
                          }}
                        />
                      </div>

                      {/* Steps Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                        {repairSearchResult.steps?.map((step: any, index: number) => {
                          const isCompleted = step.status === 'completed' || index < repairSearchResult.currentStepIndex;
                          const isInProgress = step.status === 'in_progress' || index === repairSearchResult.currentStepIndex;

                          return (
                            <div
                              key={step.id}
                              className={`flex md:flex-col items-center gap-3 p-3 rounded-2xl border transition ${
                                isInProgress
                                  ? 'bg-yellow-400/10 border-yellow-400/60 shadow-lg shadow-yellow-400/5'
                                  : isCompleted
                                  ? 'bg-emerald-500/5 border-emerald-500/30'
                                  : 'bg-slate-950/40 border-slate-800'
                              }`}
                            >
                              {/* Step Node Circle */}
                              <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                    : isInProgress
                                    ? 'bg-yellow-400 text-slate-950 font-black ring-4 ring-yellow-400/30 animate-pulse'
                                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-5 h-5 stroke-[3]" />
                                ) : isInProgress ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <span>{step.id}</span>
                                )}
                              </div>

                              {/* Step Details */}
                              <div className="text-right md:text-center space-y-1 flex-1">
                                <div className="flex items-center justify-between md:justify-center gap-1">
                                  <span
                                    className={`font-bold text-xs ${
                                      isInProgress
                                        ? 'text-yellow-400 font-extrabold'
                                        : isCompleted
                                        ? 'text-emerald-400'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {step.title}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {step.description}
                                </p>

                                <div className="text-[10px] font-mono text-slate-500 pt-1">
                                  {step.date}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Guidance Notice */}
                    <div className="bg-slate-950/80 p-3.5 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
                        <span>
                          تمامی تعمیرات انجام شده در شعبه مبارکه شامل ۶ ماه گارانتی کتبی قطعات تعویضی می‌باشد.
                        </span>
                      </div>

                      <a
                        href="tel:03152415779"
                        className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-700 transition shrink-0"
                      >
                        تماس با تعمیرگاه
                      </a>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Invoice Printable View Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white text-slate-950 p-8 max-w-2xl w-full border-2 border-slate-950 shadow-2xl space-y-6 text-right">
            
            <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
              <div>
                <h3 className="text-xl font-black uppercase">فاکتور رسمی فروشگاه موبایل ستاره</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">آدرس: مبارکه، خیابان حافظ شرقی | تلفن: ۰۳۱۵۲۴۱۵۷۷۹</p>
              </div>
              <div className="text-left font-mono">
                <p className="font-black text-sm">شماره: {selectedOrderForInvoice.id}</p>
                <p className="text-xs text-slate-500">تاریخ: {selectedOrderForInvoice.date}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p><span className="font-bold">خریدار:</span> {userProfile.name} ({userProfile.phone})</p>
              <p><span className="font-bold">آدرس تحویل:</span> {selectedOrderForInvoice.shippingAddress}</p>
              <p><span className="font-bold">کد پیگیری تحویل:</span> <span className="font-mono">{selectedOrderForInvoice.trackingCode}</span></p>
            </div>

            <table className="w-full text-xs text-right border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2">شرح کالا</th>
                  <th className="border border-slate-300 p-2">رنگ</th>
                  <th className="border border-slate-300 p-2">تعداد</th>
                  <th className="border border-slate-300 p-2">قیمت واحد (تومان)</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderForInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-2 font-bold">{item.product.persianName}</td>
                    <td className="border border-slate-300 p-2">{item.selectedColor}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{item.quantity}</td>
                    <td className="border border-slate-300 p-2 font-mono">{item.product.priceToman.toLocaleString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-slate-300">
              <span>مبلغ نهایی پرداختی:</span>
              <span className="font-mono text-lg">{selectedOrderForInvoice.finalAmountToman.toLocaleString('fa-IR')} تومان</span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-slate-950 text-white font-black py-2.5 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-yellow-400" />
                <span>چاپ یا دانلود فاکتور (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5"
              >
                بستن
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Webcam Live Capture Modal Overlay */}
      {isWebcamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 text-white p-5 max-w-lg w-full border-2 border-yellow-400 shadow-2xl rounded-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-black text-white">عکاسی مستقیم آواتار با وبکم</h3>
              </div>
              <button
                onClick={handleStopWebcam}
                className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {webcamError ? (
              <div className="bg-rose-950/80 border border-rose-500/50 p-4 rounded-xl text-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-bold">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>خطا در دسترسی به دوربین وبکم</span>
                </div>
                <p className="text-rose-200/90 leading-relaxed">{webcamError}</p>
                <div className="pt-2">
                  <button
                    onClick={handleStartWebcam}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>تلاش مجدد اتصال دوربین</span>
                  </button>
                </div>
              </div>
            ) : capturedPhoto ? (
              /* Photo Snapped Preview */
              <div className="space-y-4 text-center">
                <div className="relative inline-block border-4 border-yellow-400 rounded-2xl overflow-hidden shadow-2xl">
                  <img src={capturedPhoto} alt="Captured Webcam Selfie" className="max-h-72 w-auto mx-auto object-cover" />
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    عکس آماده ثبت
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleConfirmWebcamPhoto}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تأیید و ذخیره آواتار</span>
                  </button>

                  <button
                    onClick={() => setCapturedPhoto(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>عکاسی مجدد</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Live Video Stream View */
              <div className="space-y-4 text-center">
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>دوربین زنده فعال</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleCaptureWebcam}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-yellow-400/20"
                  >
                    <Camera className="w-4 h-4 text-slate-950" />
                    <span>عکس گرفتن (Snap)</span>
                  </button>

                  <button
                    onClick={handleStopWebcam}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP Contact Verification Modal Overlay */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white text-slate-950 p-6 max-w-sm w-full border-2 border-slate-950 shadow-2xl rounded-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-yellow-500" />
                <h3 className="text-sm font-black text-slate-950">احراز شماره و اطلاعات تماس</h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-xs space-y-1">
              <p className="font-bold text-yellow-900 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-600" />
                پیامک آزمایشی به شماره {profileForm.phone || userProfile.phone} ارسال شد.
              </p>
              <p className="text-[11px] text-yellow-800 font-mono">
                کد تأیید آزمایشی: <span className="font-black text-sm text-slate-950 bg-yellow-200 px-2 py-0.5 rounded">{generatedOtpCode}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmOtpCode} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold block text-xs">کد ۴ رقمی پیامک شده را وارد کنید:</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  dir="ltr"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="مثال: ۵۸۲۱"
                  className="w-full bg-slate-50 border-2 border-slate-300 text-center font-mono font-black text-lg py-2 rounded-xl focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-yellow-400 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  {isVerifyingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال بررسی...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      <span>تأیید و ثبت نهایی شماره</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2.5 rounded-xl text-xs transition"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
