import React from 'react';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Scale, 
  Star, 
  Bell,
  PhoneCall
} from 'lucide-react';
import { OfferCountdown } from './OfferCountdown';
import { ImageLoader } from './ImageLoader';

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
  onOpenPriceInquiry?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onSelectProduct,
  onOpenDetail,
  onOpenStockNotify,
  onOpenPriceInquiry,
}) => {
  const handleSelect = onOpenDetail || onSelectProduct || (() => {});
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock !== undefined && product.stock > 0 && product.stock < 3;
  const discountPercent = product.originalPriceToman
    ? Math.round(((product.originalPriceToman - product.priceToman) / product.originalPriceToman) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-[#1e1f23] border border-[#e1e3e1] dark:border-[#33353b] hover:border-[#b4c5e4] dark:hover:border-[#7f97ca] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between p-4">
      
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1 items-center">
          {isOutOfStock ? (
            <span className="bg-[#fce8e6] dark:bg-[#601410] text-[#c5221f] dark:text-[#f2b8b5] font-medium text-[10px] px-2.5 py-0.5 rounded-full">
              ناموجود
            </span>
          ) : (
            <>
              {isLowStock && (
                <span className="bg-[#fce8e6] dark:bg-[#601410] text-[#c5221f] dark:text-[#f2b8b5] font-medium text-[10px] px-2.5 py-0.5 rounded-full">
                  تعداد محدود
                </span>
              )}
              {product.isTopSeller && (
                <span className="bg-[#feefc3] dark:bg-[#5c3e00] text-[#762700] dark:text-[#fde293] font-medium text-[10px] px-2.5 py-0.5 rounded-full">
                  پرفروش
                </span>
              )}
              {product.isInstallment && (
                <span className="bg-[#d3e3fd] dark:bg-[#0842a0] text-[#041e49] dark:text-[#d3e3fd] font-medium text-[10px] px-2.5 py-0.5 rounded-full">
                  اقساطی
                </span>
              )}
            </>
          )}
        </div>

        {!isOutOfStock && discountPercent > 0 && (
          <span className="bg-[#c5221f] text-white font-medium text-[10px] px-2 py-0.5 rounded-full shrink-0">
            ٪{discountPercent.toLocaleString('fa-IR')} تخفیف
          </span>
        )}
      </div>

      {/* Offer Countdown Timer */}
      {!isOutOfStock && (product.isOffer || discountPercent > 0) && (
        <div className="mb-2 flex justify-center">
          <OfferCountdown productId={product.id} variant="compact" />
        </div>
      )}

      {/* Product Image Clickable */}
      <div 
        onClick={() => handleSelect(product)}
        className="relative py-4 px-2 bg-[#f0f4f9] dark:bg-[#28292e] rounded-xl cursor-pointer overflow-hidden transition"
      >
        <div className={`w-full h-40 flex items-center justify-center ${isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''}`}>
          <ImageLoader
            src={product.image}
            alt={product.persianName}
            width={300}
            height={300}
            containerClassName="w-full h-full flex items-center justify-center"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Color preview dots */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {product.colors.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="pt-3 space-y-2 flex-1 flex flex-col justify-between text-right">
        <div>
          <div className="flex items-center justify-between text-xs text-[#444746] dark:text-[#c4c7c5] mb-1">
            <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 font-semibold text-[#1f1f1f] dark:text-[#e3e2e6]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toLocaleString('fa-IR')}</span>
              <span className="text-[#747775] font-normal">({product.reviewsCount.toLocaleString('fa-IR')})</span>
            </div>
          </div>

          <h3 
            onClick={() => handleSelect(product)}
            className="text-sm font-bold text-[#1f1f1f] dark:text-white hover:text-[#0b57d0] dark:hover:text-[#a8c7fa] cursor-pointer transition line-clamp-1"
          >
            {product.persianName}
          </h3>

          <p className="text-xs text-[#444746] dark:text-[#c4c7c5] mt-1 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>

          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-[11px] text-[#c5221f] dark:text-[#f2b8b5] bg-[#fce8e6] dark:bg-[#601410]/40 px-2.5 py-1 rounded-full font-medium mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5221f]"></span>
              <span>کالا ناموجود است - ثبت خبرنامه موجودی</span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-1.5 text-[11px] text-[#c5221f] dark:text-[#f2b8b5] bg-[#fce8e6] dark:bg-[#601410]/40 px-2.5 py-1 rounded-full font-medium mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5221f]"></span>
              <span>تعداد محدود باقیمانده ({product.stock?.toLocaleString('fa-IR')} عدد)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-[#004d7a] dark:text-[#c2e7ff] bg-[#c2e7ff]/40 dark:bg-[#004d7a]/40 px-2.5 py-1 rounded-full font-medium mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0b57d0]"></span>
              <span>موجود در مغازه مبارکه (تحویل فوری)</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-[#e1e3e1] dark:border-[#33353b] space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-[#747775]">قیمت ستاره:</span>
            <div className="text-left">
              {!isOutOfStock && product.originalPriceToman && (
                <div className="text-xs text-[#747775] line-through">
                  {product.originalPriceToman.toLocaleString('fa-IR')}
                </div>
              )}
              <div className="text-base font-bold text-[#1f1f1f] dark:text-white">
                {product.priceToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-[#747775]">تومان</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {isOutOfStock ? (
              <button
                onClick={() => onOpenStockNotify ? onOpenStockNotify(product) : handleSelect(product)}
                className="w-full flex items-center justify-center gap-1.5 bg-[#feefc3] dark:bg-[#5c3e00] text-[#762700] dark:text-[#fde293] font-semibold text-xs py-2.5 px-3 rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>خبرم کن (موجودی جدید)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Main Price Inquiry Button */}
                <button
                  onClick={() => onOpenPriceInquiry ? onOpenPriceInquiry(product) : handleSelect(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-2.5 rounded-xl shadow-sm transition cursor-pointer"
                  title="استعلام قیمت روز و تخفیف فوری"
                >
                  <PhoneCall className="w-3.5 h-3.5 animate-pulse shrink-0" />
                  <span className="truncate">استعلام قیمت لحظه‌ای</span>
                </button>

                {/* Direct Store Call Button */}
                <a
                  href="tel:03152415759"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow-sm transition cursor-pointer shrink-0 flex items-center justify-center"
                  title="تماس تلفنی مستقیم با فروشگاه مبارکه (۰۳۱-۵۲۴۱۵۷۵۹)"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>

                {/* Add to Cart icon */}
                <button
                  onClick={() => onAddToCart(product)}
                  className="p-2 bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#d3e3fd] text-white dark:text-[#062e6f] rounded-xl shadow-sm transition cursor-pointer shrink-0"
                  title="افزودن مستقیم به سبد خرید آنلاین"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>

                {/* Compare Button */}
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`p-2 rounded-xl border transition cursor-pointer shrink-0 ${
                    isCompared 
                      ? 'bg-[#d3e3fd] dark:bg-[#0842a0] border-[#0b57d0] text-[#0b57d0] dark:text-[#d3e3fd]' 
                      : 'bg-white dark:bg-[#28292e] border-[#c4c7c5] dark:border-[#444746] text-[#444746] dark:text-[#c4c7c5] hover:border-[#0b57d0]'
                  }`}
                  title={isCompared ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
