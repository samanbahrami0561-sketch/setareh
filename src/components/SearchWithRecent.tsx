import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Clock, X, Trash2, ArrowUpLeft, Sparkles, Smartphone, SearchX, ChevronLeft, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface SearchWithRecentProps {
  value: string;
  onChange: (val: string) => void;
  onSearchSubmit?: (term: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  popularSearches?: string[];
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

const STORAGE_KEY = 'setareh_recent_searches';
const DEFAULT_POPULAR = ['آیفون ۱۳', 'S24 Ultra', 'شیائومی ۱۳T', 'آیفون ۱۱', 'گوشی کارکرده', 'پوکو X6'];

// Helper to normalize Persian characters and numbers for accurate matching
const normalizeSearchText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/۰/g, '0').replace(/۱/g, '1').replace(/۲/g, '2').replace(/۳/g, '3').replace(/۴/g, '4')
    .replace(/۵/g, '5').replace(/۶/g, '6').replace(/۷/g, '7').replace(/۸/g, '8').replace(/۹/g, '9')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
};

export const SearchWithRecent: React.FC<SearchWithRecentProps> = ({
  value,
  onChange,
  onSearchSubmit,
  placeholder = 'جستجوی نام، برند یا مشخصات...',
  className = '',
  inputClassName = '',
  popularSearches = DEFAULT_POPULAR,
  products = [],
  onSelectProduct
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 8));
        }
      }
    } catch (e) {
      console.error('Failed to load recent searches from localStorage:', e);
    }
  }, []);

  // Save term to recent searches
  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;

    try {
      const filtered = recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recent search to localStorage:', e);
    }
  };

  // Live matching product suggestions (Active when 3 or more characters are typed)
  const suggestedProducts = useMemo(() => {
    const query = normalizeSearchText(value);
    if (!query || query.length < 3 || !products || products.length === 0) return [];
    
    const terms = query.split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    return products.filter((product) => {
      if (onlyInStock && (product.stock === undefined || product.stock <= 0)) {
        return false;
      }

      const normPersianName = normalizeSearchText(product.persianName);
      const normEnglishName = normalizeSearchText(product.name);
      const normBrand = normalizeSearchText(product.brand);
      const normCat = normalizeSearchText(product.category);

      return terms.every(term => 
        normPersianName.includes(term) ||
        normEnglishName.includes(term) ||
        normBrand.includes(term) ||
        normCat.includes(term)
      );
    }).slice(0, 7); // Max 7 live suggestions
  }, [value, products, onlyInStock]);

  // Remove single term
  const removeTerm = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== termToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update recent searches:', e);
    }
  };

  // Clear all recent searches
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches:', e);
    }
  };

  // Select a search term or product
  const handleSelectTerm = (term: string) => {
    onChange(term);
    saveSearchTerm(term);
    if (onSearchSubmit) {
      onSearchSubmit(term);
    }
    setIsOpen(false);
  };

  const handleSelectProductItem = (product: Product) => {
    saveSearchTerm(product.persianName);
    onChange(product.persianName);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onSearchSubmit) {
      onSearchSubmit(product.persianName);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (value.trim()) {
        saveSearchTerm(value);
        if (onSearchSubmit) {
          onSearchSubmit(value);
        }
      }
      setIsOpen(false);
    }
  };

  const typedLength = value.trim().length;
  const isSearchActive = typedLength >= 3;
  const isTypingShort = typedLength > 0 && typedLength < 3;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl pr-10 pl-8 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-950 dark:focus:border-yellow-400 font-medium transition ${inputClassName}`}
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />

        {value && (
          <button
            onClick={() => {
              onChange('');
              setIsOpen(true);
            }}
            className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="پاک کردن متن"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Menu with Smooth SlideDown Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 left-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans text-right max-h-[440px] overflow-y-auto"
          >
          
          {/* HINT IF TYPING LESS THAN 3 CHARACTERS */}
          {isTypingShort && (
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>برای دریافت پیشنهادات هوشمند محصول، حداقل ۳ حرف وارد کنید (هنوز {3 - typedLength} حرف)</span>
              </span>
            </div>
          )}

          {/* LIVE PRODUCT SUGGESTIONS WHEN TYPING 3+ CHARACTERS */}
          {isSearchActive ? (
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>محصولات پیشنهادی برای «{value.trim()}»:</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOnlyInStock(!onlyInStock);
                    }}
                    className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border transition cursor-pointer font-bold ${
                      onlyInStock
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
                    <span>فقط موجود</span>
                  </button>

                  {suggestedProducts.length > 0 && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {suggestedProducts.length} نتیجه
                    </span>
                  )}
                </div>
              </div>

              {suggestedProducts.length > 0 ? (
                <div className="space-y-1 pt-1">
                  {suggestedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.16, delay: idx * 0.03 }}
                      onClick={() => handleSelectProductItem(product)}
                      className="group flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <img
                          src={product.image}
                          alt={product.persianName}
                          className="w-11 h-11 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-950 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition">
                            {product.persianName}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            <span className="font-semibold text-slate-600 dark:text-slate-300">{product.brand}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-400 dark:text-slate-500 truncate">{product.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left shrink-0 space-y-0.5">
                        <div className={`text-xs font-black font-mono ${
                          product.stock === 0 ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-amber-400'
                        }`}>
                          {product.priceToman > 0 ? `${product.priceToman.toLocaleString('fa-IR')} تومان` : 'استعلام قیمت'}
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          {product.stock === 0 ? (
                            <span className="inline-block text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold px-1.5 py-0.2 rounded">
                              ناموجود
                            </span>
                          ) : product.isOffer ? (
                            <span className="inline-block text-[9px] bg-rose-500/10 text-rose-500 font-bold px-1.5 py-0.2 rounded">
                              تخفیف ویژه
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={() => handleSelectTerm(value)}
                    className="w-full mt-1 p-2.5 text-center text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>مشاهده تمام نتایج در کاتالوگ فروشگاه</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <SearchX className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    محصولی پیدا نشد!
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    هیچ کالایی با عبارت «{value}» یافت نشد. لطفاً نام برند یا مشخصات کالا را چک کنید.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* RECENT SEARCHES SECTION */}
              {recentSearches.length > 0 ? (
                <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>جستجوهای اخیر شما:</span>
                    </span>
                    <button
                      onClick={clearAll}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف تاریخچه</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectTerm(term)}
                        className="group flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg cursor-pointer transition"
                      >
                        <Clock className="w-3 h-3 text-slate-400 group-hover:text-slate-950 transition" />
                        <span>{term}</span>
                        <button
                          onClick={(e) => removeTerm(term, e)}
                          className="p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition"
                          title="حذف این گزینه"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>هیچ تاریخچه جستجویی ثبت نشده است</span>
                </div>
              )}

              {/* POPULAR SEARCHES / QUICK SUGGESTIONS */}
              {popularSearches.length > 0 && (
                <div className="p-3 bg-slate-50/70 dark:bg-slate-950/40">
                  <span className="font-bold text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>جستجوهای محبوب کاربران:</span>
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectTerm(term)}
                        className="flex items-center gap-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg transition"
                      >
                        <span>{term}</span>
                        <ArrowUpLeft className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

