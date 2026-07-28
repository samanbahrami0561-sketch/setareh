import React, { useState } from 'react';
import { CartItem } from '../types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  CheckCircle2, 
  Plus, 
  Minus, 
  AlertCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { notifyNewOrderPlaced } from '../lib/notification';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [deliveryMethod, setDeliveryMethod] = useState<'peyk' | 'post' | 'hazoori'>('peyk');
  const [coupon, setCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [orderId, setOrderId] = useState<string | null>(null);

  // Confirmation dialog state for item deletion
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);

  const subtotalToman = cartItems.reduce((acc, item) => acc + item.product.priceToman * item.quantity, 0);
  const shippingFeeToman = deliveryMethod === 'post' ? 45000 : 0;
  const grandTotalToman = Math.max(0, subtotalToman + shippingFeeToman - discountAmount);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'SETAREH10' || code === 'EID1403' || code === 'OFF100K') {
      if (code === 'SETAREH10') setDiscountAmount(Math.round(subtotalToman * 0.10));
      else if (code === 'EID1403') setDiscountAmount(Math.round(subtotalToman * 0.05));
      else if (code === 'OFF100K') setDiscountAmount(100000);
      setCouponApplied(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('کد تخفیف معتبر نیست. کدهای فعال: SETAREH10, EID1403, OFF100K');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName || customerName.trim().length < 2) {
      setErrorMessage('لطفاً نام و نام خانوادگی خود را کامل وارد کنید.');
      return;
    }
    if (!phone || !/^09[0-9]{9}$/.test(phone)) {
      setErrorMessage('لطفاً شماره تلفن همراه معتبر (مثال: 09123456789) وارد کنید.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          deliveryAddress: deliveryMethod === 'hazoori' ? 'تحویل حضوری در فروشگاه خیابان حافظ' : address,
          discountCode: coupon,
          items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            color: item.selectedColor
          }))
        })
      });

      let data: any = {};
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}));
      }

      const newOrdId = data?.order?.orderNumber || data?.order?.id || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(newOrdId);
      notifyNewOrderPlaced(newOrdId, grandTotalToman);

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'خطای شبکه در برقراری ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-xl h-full bg-white border-r-2 border-slate-200 shadow-2xl flex flex-col justify-between text-right font-['Vazirmatn']">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider">سبد خرید ستاره موبایل</h3>
              <p className="text-xs text-slate-400 font-mono">{cartItems.length.toLocaleString('fa-IR')} قلم کالا</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="بستن سبد خرید"
            className="p-2 bg-slate-900 text-slate-400 hover:text-white transition rounded-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {orderId ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 border-2 border-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-950">سفارش شما با موفقیت ثبت شد!</h4>
              <p className="text-xs text-slate-500 font-medium">شماره پیگیری سفارش شما در دیتابیس:</p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-950 text-slate-950 font-mono text-2xl font-black px-6 py-3">
              {orderId}
            </div>

            <p className="text-xs text-slate-700 max-w-sm mx-auto leading-relaxed font-medium">
              موجودی کالا کسر شده و تیم پشتیبانی موبایل ستاره با شماره <span className="text-slate-950 font-black" dir="ltr">{phone}</span> تماس می‌گیرد.
            </p>

            <button
              onClick={() => {
                onClearCart();
                setOrderId(null);
                onClose();
              }}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-8 py-3 transition uppercase tracking-wider"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
            <p className="text-slate-900 font-bold text-sm">سبد خرید شما خالی است.</p>
            <p className="text-xs text-slate-500 max-w-xs font-medium">محصولات مورد نظر خود را از ویترین فروشگاه انتخاب کنید.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.persianName}
                    className="w-14 h-14 object-contain bg-white p-1 border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-black text-slate-950 line-clamp-1">{item.product.persianName}</h4>
                    <span className="text-[10px] text-slate-500 block font-medium">رنگ: {item.selectedColor}</span>
                    <div className="text-xs font-black text-slate-950">
                      {item.product.priceToman.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-300 p-1 text-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="افزایش تعداد"
                        className="p-1 hover:text-slate-950 text-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-slate-950">{item.quantity.toLocaleString('fa-IR')}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            setItemToDelete(item);
                          } else {
                            onUpdateQuantity(item.product.id, item.quantity - 1);
                          }
                        }}
                        aria-label="کاهش تعداد"
                        className="p-1 hover:text-slate-950 text-slate-600 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      aria-label="حذف از سبد خرید"
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded transition"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Method Selection */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-900 font-bold block">روش تحویل و ارسال:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('peyk')}
                  className={`p-2.5 border text-right transition ${
                    deliveryMethod === 'peyk'
                      ? 'bg-slate-950 text-white border-slate-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">پیک مبارکه</span>
                  <span className="text-[10px] text-emerald-400">رایگان (فوری)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('post')}
                  className={`p-2.5 border text-right transition ${
                    deliveryMethod === 'post'
                      ? 'bg-slate-950 text-white border-slate-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">پست پیشتاز</span>
                  <span className="text-[10px] text-slate-400">۴۵,۰۰۰ تومان</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('hazoori')}
                  className={`p-2.5 border text-right transition ${
                    deliveryMethod === 'hazoori'
                      ? 'bg-slate-950 text-white border-slate-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="block font-bold">تحویل حضوری</span>
                  <span className="text-[10px] text-slate-400">خیابان حافظ</span>
                </button>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-600 font-medium block">کد تخفیف (کدهای تست: SETAREH10, EID1403):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="کد تخفیف..."
                  className="flex-1 bg-slate-50 text-slate-950 p-2.5 border border-slate-300 focus:outline-none uppercase font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2.5 transition uppercase"
                >
                  اعمال
                </button>
              </div>
              {couponApplied && (
                <span className="text-[11px] text-emerald-700 block font-bold">کد تخفیف با موفقیت اعمال شد.</span>
              )}
            </div>

            {/* Customer Info Form */}
            <form id="orderForm" onSubmit={handlePlaceOrder} className="space-y-3 text-xs pt-2 border-t border-slate-200">
              <h4 className="font-extrabold text-slate-900">مشخصات تحویل‌گیرنده:</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="نام و نام خانوادگی..."
                  className="bg-slate-50 text-slate-950 p-2.5 border border-slate-300 focus:outline-none font-medium"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="شماره همراه (09...)"
                  dir="ltr"
                  className="bg-slate-50 text-slate-950 p-2.5 border border-slate-300 focus:outline-none text-right font-medium"
                />
              </div>

              {deliveryMethod !== 'hazoori' && (
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="آدرس دقیق تحویل در مبارکه یا اصفهان..."
                  className="w-full bg-slate-50 text-slate-950 p-2.5 border border-slate-300 focus:outline-none resize-none font-medium"
                />
              )}
            </form>

          </div>
        )}

        {/* Footer Actions */}
        {!orderId && cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>جمع کل اقلام:</span>
                <span className="font-bold text-slate-950">{subtotalToman.toLocaleString('fa-IR')} تومان</span>
              </div>
              {shippingFeeToman > 0 && (
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>هزینه ارسال:</span>
                  <span className="font-bold text-slate-950">{shippingFeeToman.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>تخفیف:</span>
                  <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-300">
                <span>مبلغ قابل پرداخت (محاسبه نهایی در سرور):</span>
                <span className="text-slate-950 font-black">{grandTotalToman.toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            <button
              form="orderForm"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white font-black text-xs py-3.5 transition uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال بررسی قیمت و موجودی دیتابیس...</span>
                </>
              ) : (
                <span>ثبت و نهایی‌سازی سفارش</span>
              )}
            </button>
          </div>
        )}

        {/* DELETE CONFIRMATION DIALOG MODAL */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-right p-5 space-y-4 font-['Vazirmatn']">
              
              {/* Header Icon */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">تأیید حذف محصول</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">آیا مطمئن هستید؟</p>
                </div>
              </div>

              {/* Product Preview Card */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
                <img
                  src={itemToDelete.product.image}
                  alt={itemToDelete.product.persianName}
                  className="w-12 h-12 object-contain bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                    {itemToDelete.product.persianName}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    رنگ: {itemToDelete.selectedColor} | قیمت: {itemToDelete.product.priceToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                این محصول از لیست خرید شما حذف خواهد شد. می‌توانید بعداً مجدداً آن را اضافه کنید.
              </p>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl transition"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRemoveItem(itemToDelete.product.id);
                    setItemToDelete(null);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>بله، حذف شود</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
