import React from 'react';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Scale, 
  Check, 
  Star, 
  ShieldCheck, 
  Sparkles,
  CreditCard,
  Bell
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onSelectProduct?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onOpenInstallment?: (product: Product) => void;
  onOpen360?: (product: Product) => void;
  onOpenStockNotify?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onSelectProduct,
  onOpenDetail,
  onOpenStockNotify,
}) => {
  const handleSelect = onOpenDetail || onSelectProduct || (() => {});
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock !== undefined && product.stock > 0 && product.stock < 3;
  const discountPercent = product.originalPriceToman
    ? Math.round(((product.originalPriceToman - product.priceToman) / product.originalPriceToman) * 100)
    : 0;

  return (
    <div className={`group relative bg-white hover:bg-white border ${isOutOfStock ? 'border-rose-200' : isLowStock ? 'border-rose-300' : 'border-slate-200 hover:border-slate-950'} rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}>
      
      {/* Top Badges */}
      <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
              ناموجود
            </span>
          ) : (
            <>
              {isLowStock && (
                <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter animate-pulse flex items-center gap-1">
                  فقط تعداد محدود باقیمانده
                </span>
              )}
              {product.isTopSeller && (
                <span className="bg-yellow-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                  پرفروش
                </span>
              )}
              {product.isInstallment && (
                <span className="bg-slate-950 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-tighter">
                  اقساطی
                </span>
              )}
            </>
          )}
        </div>

        {!isOutOfStock && discountPercent > 0 && (
          <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded shadow-sm">
            ٪{discountPercent.toLocaleString('fa-IR')} تخفیف
          </span>
        )}
      </div>

      {/* Product Image Clickable */}
      <div 
        onClick={() => handleSelect(product)}
        className="relative pt-10 pb-5 px-4 bg-slate-50 border-b border-slate-100 cursor-pointer overflow-hidden group-hover:bg-slate-100/60 transition"
      >
        <div className={`w-full h-44 flex items-center justify-center ${isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''}`}>
          <img
            src={product.image}
            alt={product.persianName}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300 drop-shadow-md"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Color preview dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {product.colors.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-sm"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-right">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 text-slate-900 font-bold">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{product.rating.toLocaleString('fa-IR')}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount.toLocaleString('fa-IR')})</span>
            </div>
          </div>

          <h3 
            onClick={() => handleSelect(product)}
            className="text-sm font-black text-slate-900 hover:text-blue-600 cursor-pointer transition line-clamp-1"
          >
            {product.persianName}
          </h3>

          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-[10px] text-rose-800 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded-md font-bold mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>کالا ناموجود است - امکان ثبت درخواست پیامکی</span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-1.5 text-[10px] text-rose-700 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 px-2.5 py-1 rounded-md font-bold mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
              <span>فقط تعداد محدود باقیمانده ({product.stock?.toLocaleString('fa-IR')} عدد)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-700 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-bold mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>موجود در مغازه مبارکه (تحویل فوری / خرید آنلاین)</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-slate-400 font-medium">قیمت روز ستاره:</span>
            <div className="text-left">
              {!isOutOfStock && product.originalPriceToman && (
                <div className="text-[11px] text-slate-400 line-through">
                  {product.originalPriceToman.toLocaleString('fa-IR')}
                </div>
              )}
              <div className="text-sm font-black text-slate-950">
                {product.priceToman.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-500">تومان</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {isOutOfStock ? (
              <button
                onClick={() => onOpenStockNotify ? onOpenStockNotify(product) : handleSelect(product)}
                className="col-span-4 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 px-3 rounded-none transition transform active:scale-95 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                <span>خبرم کن (موجودی)</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="col-span-4 flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-none transition transform active:scale-95 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
                <span>افزودن به سبد</span>
              </button>
            )}

            <button
              onClick={() => onToggleCompare(product)}
              className={`col-span-1 flex items-center justify-center p-2 rounded-none border transition ${
                isCompared 
                  ? 'bg-yellow-400 border-yellow-400 text-slate-950' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950 hover:border-slate-950'
              }`}
              title={isCompared ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
