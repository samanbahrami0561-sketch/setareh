import React from 'react';
import { X, Printer, Download, Share2, CheckCircle2, ShieldCheck, Phone, MapPin, Building2, User, Hash, Calendar } from 'lucide-react';
import { numberToPersianWords } from '../utils/numberToPersianWords';

interface OrderItem {
  productId?: string;
  titleFa?: string;
  name?: string;
  image?: string;
  color?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

interface OrderData {
  id: string;
  orderNumber?: string;
  customerName: string;
  phone: string;
  userEmail?: string;
  deliveryAddress?: string;
  payableAmount?: number;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  createdAtFa?: string;
  items?: OrderItem[];
  discountAmount?: number;
  shippingFee?: number;
}

interface OfficialInvoiceModalProps {
  order: OrderData | null;
  onClose: () => void;
}

export const OfficialInvoiceModal: React.FC<OfficialInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const orderNo = order.orderNumber || order.id || 'INV-1001';
  const orderDate = order.createdAtFa || order.createdAt?.slice(0, 10) || new Date().toLocaleDateString('fa-IR');
  const items = order.items || [];
  
  const totalPayable = order.payableAmount || order.totalAmount || 0;
  const rawSubtotal = items.reduce((sum, item) => sum + (item.totalPrice || (item.unitPrice || 0) * item.quantity), 0);
  const discount = order.discountAmount || (rawSubtotal > totalPayable ? rawSubtotal - totalPayable : 0);
  const shippingFee = order.shippingFee || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-['Vazirmatn'] dir-rtl">
      
      {/* Print styles injected for clean PDF / Paper output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #official-printable-invoice, #official-printable-invoice * {
            visibility: visible !important;
          }
          #official-printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Header (Hidden during print) */}
        <div className="no-print bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-xl flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <span>صدور و چاپ فاکتور رسمی خرید</span>
                <span className="bg-yellow-400/20 text-yellow-300 text-[11px] px-2 py-0.5 rounded-md font-mono border border-yellow-400/30">
                  {orderNo}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                فاکتور رسمی فروشگاه ستاره مبارکه - آماده جهت چاپ کاغذ A4 یا ذخیره فایل PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-yellow-400/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره فایل PDF</span>
            </button>

            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs transition"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/60 flex-1 flex justify-center">
          
          {/* Printable Invoice Container (A4 Printable Box) */}
          <div 
            id="official-printable-invoice"
            className="w-full bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200 text-xs leading-relaxed space-y-6 max-w-3xl"
          >
            {/* Header: Logo, Title, Dates */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-950 text-yellow-400 font-black rounded-2xl flex flex-col items-center justify-center border-2 border-yellow-400 shadow-md">
                  <span className="text-xl leading-none">★</span>
                  <span className="text-[10px] tracking-tight text-white mt-0.5">ستاره</span>
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-950 tracking-tight">
                    فروشگاه تخصصی موبایل ستاره مبارکه
                  </h1>
                  <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                    مرکز رسمی عرضه گوشی‌های هوشمند، تبلت و لوازم جانبی اورجینال
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    شناسه ملی / ثبت: ۱۰۲۶۰۵۴۹۱۸ • شماره صنف: ۵۴۲۱
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center space-y-1 min-w-[170px]">
                <div className="text-xs font-black text-slate-950 border-b border-slate-200 pb-1">
                  صورتحساب فروش کالا
                </div>
                <div className="text-[11px] text-slate-700 flex justify-between gap-2 pt-1 font-mono">
                  <span>شماره فاکتور:</span>
                  <strong className="text-slate-900">{orderNo}</strong>
                </div>
                <div className="text-[11px] text-slate-700 flex justify-between gap-2 font-mono">
                  <span>تاریخ صدور:</span>
                  <strong>{orderDate}</strong>
                </div>
              </div>
            </div>

            {/* Seller & Buyer Info Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Seller Specs */}
              <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5">
                <div className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-slate-700" />
                  <span>مشخصات فروشنده:</span>
                </div>
                <div className="text-[11px] text-slate-800 space-y-1">
                  <div><strong>فروشگاه:</strong> موبایل ستاره (مدیریت)</div>
                  <div><strong>استان/شهر:</strong> اصفهان، مبارکه</div>
                  <div><strong>نشانی:</strong> خیابان حافظ شرقی، روبروی بانک ملی، پلاک ۱۱۲</div>
                  <div><strong>تلفن تماس:</strong> <span className="font-mono" dir="ltr">031-52415779</span></div>
                  <div><strong>وبسایت:</strong> <span className="font-mono">www.setarehmobile.ir</span></div>
                </div>
              </div>

              {/* Buyer Specs */}
              <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/50 space-y-1.5">
                <div className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-slate-700" />
                  <span>مشخصات خریدار / تحویل‌گیرنده:</span>
                </div>
                <div className="text-[11px] text-slate-800 space-y-1">
                  <div><strong>نام و نام خانوادگی:</strong> {order.customerName || 'خریدار محترم'}</div>
                  <div>
                    <strong>شماره همراه:</strong>{' '}
                    <span className="font-mono" dir="ltr">{order.phone || 'ثبت نشده'}</span>
                  </div>
                  {order.userEmail && (
                    <div><strong>ایمیل:</strong> <span className="font-mono">{order.userEmail}</span></div>
                  )}
                  <div><strong>آدرس تحویل:</strong> {order.deliveryAddress || 'تحویل حضوری در فروشگاه ستاره'}</div>
                  <div>
                    <strong>وضعیت سفارش:</strong>{' '}
                    <span className="font-bold text-slate-900">{order.status || 'تکمیل شده'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Items Table */}
            <div className="overflow-x-auto border border-slate-900 rounded-xl">
              <table className="w-full text-right text-[11px] border-collapse">
                <thead className="bg-slate-900 text-white font-bold">
                  <tr>
                    <th className="p-2 border-l border-slate-700 text-center w-10">ردیف</th>
                    <th className="p-2 border-l border-slate-700">کد / نام کالا و خدمات</th>
                    <th className="p-2 border-l border-slate-700 text-center">رنگ</th>
                    <th className="p-2 border-l border-slate-700 text-center w-16">تعداد</th>
                    <th className="p-2 border-l border-slate-700 text-center">مبلغ واحد (تومان)</th>
                    <th className="p-2 text-center">مبلغ کل (تومان)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-900">
                  {items.length > 0 ? (
                    items.map((item, idx) => {
                      const uPrice = item.unitPrice || (item.totalPrice && item.quantity ? Math.round(item.totalPrice / item.quantity) : 0);
                      const tPrice = item.totalPrice || uPrice * item.quantity;
                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border-l border-slate-200 text-center font-mono font-bold">{idx + 1}</td>
                          <td className="p-2 border-l border-slate-200 font-bold">
                            {item.titleFa || item.name || item.productId || 'محصول سفارشی'}
                          </td>
                          <td className="p-2 border-l border-slate-200 text-center">{item.color || 'اصلی'}</td>
                          <td className="p-2 border-l border-slate-200 text-center font-mono font-bold">{item.quantity}</td>
                          <td className="p-2 border-l border-slate-200 text-center font-mono">{uPrice.toLocaleString('fa-IR')}</td>
                          <td className="p-2 text-center font-mono font-bold">{tPrice.toLocaleString('fa-IR')}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-500">
                        هیچ آیتمی ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Box */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                
                {/* Words amount */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block">مبلغ کل پرداختی به حروف:</span>
                  <div className="font-extrabold text-slate-950 bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                    {numberToPersianWords(totalPayable)}
                  </div>
                </div>

                {/* Numbers calculation breakdown */}
                <div className="space-y-1.5 text-[11px]">
                  {rawSubtotal > 0 && (
                    <div className="flex justify-between text-slate-700">
                      <span>جمع اقلام فاکتور:</span>
                      <span className="font-mono">{rawSubtotal.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-rose-600 font-bold">
                      <span>مبلغ تخفیف / کوپن:</span>
                      <span className="font-mono">- {discount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-700">
                    <span>هزینه بسته‌بندی و ارسال (پیک/پست):</span>
                    <span className="font-mono">{shippingFee > 0 ? `${shippingFee.toLocaleString('fa-IR')} تومان` : 'رایگان (ویژه ستاره)'}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-black text-slate-950 border-t border-slate-300 pt-2 bg-yellow-100 p-2 rounded-lg border border-yellow-300">
                    <span>مبلغ نهایی قابل پرداخت:</span>
                    <span className="font-mono text-sm">{totalPayable.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Warranty Terms & Legal Notices */}
            <div className="border border-slate-200 rounded-xl p-3 text-[10px] text-slate-600 bg-slate-50/50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>شرایط ضمانت و تعویض فروشگاه موبایل ستاره:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pr-2">
                <li>تمامی دستگاه‌های فروخته شده دارای ۱۸ ماه گارانتی شرکتی و ۷ روز مهلت تست اختصاصی ستاره موبایل می‌باشند.</li>
                <li>هرگونه آسیب فیزیکی، شکستگی، نوسانات برق و ورود مایعات شامل گارانتی نمی‌باشد.</li>
                <li>ارائه این فاکتور یا کد رهگیری جهت استفاده از خدمات پس از فروش و گارانتی الزامی است.</li>
              </ul>
            </div>

            {/* Signatures & Seal Section */}
            <div className="grid grid-cols-2 gap-8 pt-4 text-center">
              <div className="border-t-2 border-dashed border-slate-300 pt-2 space-y-12">
                <span className="font-extrabold text-slate-800 text-[11px] block">امضاء و مهر فروشگاه موبایل ستاره مبارکه</span>
                <div className="text-[10px] text-slate-400 font-serif italic">[ مهر و امضای دیجیتال تایید شد ]</div>
              </div>

              <div className="border-t-2 border-dashed border-slate-300 pt-2 space-y-12">
                <span className="font-extrabold text-slate-800 text-[11px] block">امضاء خریدار (تحویل‌گیرنده کالا)</span>
                <div className="text-[10px] text-slate-400 italic">[ صحت و تحویل سالم کالا تایید گردید ]</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
