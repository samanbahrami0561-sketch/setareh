import React, { useState } from 'react';
import { 
  X, 
  Newspaper, 
  Video, 
  FileText, 
  HelpCircle, 
  Eye, 
  Clock, 
  Play, 
  ThumbsUp, 
  Share2, 
  BookOpen 
} from 'lucide-react';
import { BlogArticle } from '../types';
import { BLOG_ARTICLES } from '../data/mockData';

interface TechHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechHubModal: React.FC<TechHubModalProps> = ({ isOpen, onClose }) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredArticles = BLOG_ARTICLES.filter((art) => {
    if (activeCategory === 'all') return true;
    return art.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                مجله تخصصی و وبلاگ موبایل ستاره
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5">
                  SETAREH TECH HUB
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                بررسی تخصصی گوشی‌ها، ویدئوی آنباکسینگ، اخبار فناوری و آموزش‌های کاربردی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'all', name: 'همه مطالب' },
            { id: 'بررسی تخصصی', name: 'بررسی تخصصی گوشی' },
            { id: 'ویدئو آنباکس', name: 'ویدئوی آنباکسینگ' },
            { id: 'اخبار موبایل', name: 'اخبار دنیای موبایل' },
            { id: 'آموزش و ترفند', name: 'آموزش‌ها و ترفندها' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedArticle(null);
              }}
              className={`px-3 py-1.5 transition whitespace-nowrap ${
                activeCategory === cat.id ? 'bg-slate-950 text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
          {selectedArticle ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 mb-2"
              >
                ← بازگشت به لیست مقالات
              </button>

              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-56 object-cover border border-slate-200" />

              <div className="space-y-2">
                <span className="bg-yellow-400 text-slate-950 text-[11px] font-black px-2 py-0.5">
                  {selectedArticle.category}
                </span>
                <h2 className="text-lg font-black text-slate-950 leading-snug">{selectedArticle.title}</h2>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} بازدید</span>
                </div>
              </div>

              <div className="text-slate-800 leading-relaxed space-y-3 font-medium text-sm pt-2 border-t border-slate-200">
                <p>{selectedArticle.content}</p>
                <p>
                  جهت خرید گوشی‌های بررسی شده در این مطلب با گارانتی معتبر شرکتی و مهلت تست، می‌توانید از فروشگاه آنلاین یا مراجعه حضوری به شعب ستاره در مبارکه اقدام فرمایید.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-950 transition cursor-pointer overflow-hidden flex flex-col group"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-900">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90" 
                    />
                    {art.category === 'ویدئو آنباکس' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                        <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center rounded-full shadow-lg">
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    )}
                    <span className="absolute top-2 right-2 bg-slate-950 text-yellow-400 text-[10px] font-black px-2 py-0.5">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-950 text-sm leading-snug group-hover:text-yellow-600 transition">
                        {art.title}
                      </h4>
                      <p className="text-slate-600 line-clamp-2 text-xs font-medium">
                        {art.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-200">
                      <span>{art.date}</span>
                      <span className="flex items-center gap-1 text-slate-700 font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        {art.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
