import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, X, Trash2, ArrowUpLeft, Sparkles } from 'lucide-react';

interface SearchWithRecentProps {
  value: string;
  onChange: (val: string) => void;
  onSearchSubmit?: (term: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  popularSearches?: string[];
}

const STORAGE_KEY = 'setareh_recent_searches';
const DEFAULT_POPULAR = ['آیفون ۱۳', 'S24 Ultra', 'شیائومی ۱۳T', 'آیفون ۱۱', 'گوشی کارکرده', 'پوکو X6'];

export const SearchWithRecent: React.FC<SearchWithRecentProps> = ({
  value,
  onChange,
  onSearchSubmit,
  placeholder = 'جستجوی نام، برند یا مشخصات...',
  className = '',
  inputClassName = '',
  popularSearches = DEFAULT_POPULAR,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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

  // Select a search term
  const handleSelectTerm = (term: string) => {
    onChange(term);
    saveSearchTerm(term);
    if (onSearchSubmit) {
      onSearchSubmit(term);
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden font-sans text-right animate-fadeIn">
          
          {/* RECENT SEARCHES SECTION */}
          {recentSearches.length > 0 ? (
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-yellow-500" />
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
                    className="group flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 dark:hover:bg-yellow-400 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-lg cursor-pointer transition"
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
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span>جستجوهای محبوب کاربران:</span>
              </span>

              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTerm(term)}
                    className="flex items-center gap-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-yellow-400 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg transition"
                  >
                    <span>{term}</span>
                    <ArrowUpLeft className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
