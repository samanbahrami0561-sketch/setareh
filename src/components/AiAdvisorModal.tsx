import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  ShoppingBag, 
  PhoneCall, 
  CheckCircle2, 
  Zap,
  Star
} from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [budget, setBudget] = useState('۱۵ تا ۳۰ میلیون تومان');
  const [usage, setUsage] = useState('عکاسی و کاربری عمومی');
  const [brand, setBrand] = useState('همه برندها');
  const [query, setQuery] = useState('');
  
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'سلام! من **دستیار هوشمند موبایل ستاره مبارکه** هستم. 🌟\nچگونه می‌توانم در انتخاب بهترین گوشی متناسب با بودجه و نیازتان به شما کمک کنم؟'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || query || `گوشی پیشنهادی برای بودجه ${budget} با اولویت ${usage}`;
    if (!promptToSend.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text: promptToSend }];
    setChatHistory(newHistory);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          budget,
          usage,
          preferredBrand: brand
        })
      });

      const data = await res.json();
      setChatHistory([
        ...newHistory,
        { sender: 'ai', text: data.reply || 'پاسخی دریافت نشد.' }
      ]);
    } catch (err) {
      console.error('AI Advisor error:', err);
      setChatHistory([
        ...newHistory,
        {
          sender: 'ai',
          text: 'خطا در ارتباط با هوش مصنوعی. لطفاً مستقیم با شماره ۰۳۱۵۲۴۱۵۷۷۹ تماس بگیرید یا به خیابان حافظ شرقی مبارکه مراجعه فرمایید.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-yellow-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                دستیار و مشاور هوشمند خرید موبایل ستاره
                <span className="bg-yellow-400 text-slate-950 text-[10px] px-2 py-0.5 font-bold uppercase">
                  Gemini AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">پاسخگویی آنلاین بر اساس قیمت‌های روز بازار ایران و مبارکه</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Quick Selectors */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="text-slate-700 text-[10px] block mb-1 font-bold">محدوده بودجه:</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white text-slate-950 border border-slate-300 p-1.5 focus:outline-none font-medium"
              >
                <option value="زیر ۱۵ میلیون تومان">زیر ۱۵ میلیون تومان</option>
                <option value="۱۵ تا ۳۰ میلیون تومان">۱۵ تا ۳۰ میلیون تومان</option>
                <option value="۳۰ تا ۶۰ میلیون تومان">۳۰ تا ۶۰ میلیون تومان</option>
                <option value="۶۰ تا ۱۰۰ میلیون تومان+">۶۰ تا ۱۰۰ میلیون تومان+</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 text-[10px] block mb-1 font-bold">اولویت اصلی شما:</label>
              <select
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="w-full bg-white text-slate-950 border border-slate-300 p-1.5 focus:outline-none font-medium"
              >
                <option value="عکاسی و کیفیت دوربین">عکاسی و کیفیت دوربین</option>
                <option value="گیمینگ و سخت‌افزار قدرتمند">گیمینگ و پردازش قدرتمند</option>
                <option value="شارژدهی بالای باتری">شارژدهی بالای باتری</option>
                <option value="ارزش خرید بالا و اقتصادی">ارزش خرید بالا و اقتصادی</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 text-[10px] block mb-1 font-bold">برند مورد علاقه:</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-white text-slate-950 border border-slate-300 p-1.5 focus:outline-none font-medium"
              >
                <option value="همه برندها">همه برندها (آیفون، سامسونگ، شیائومی)</option>
                <option value="Apple (آیفون)">Apple (آیفون)</option>
                <option value="Samsung (سامسونگ)">Samsung (سامسونگ)</option>
                <option value="Xiaomi (شیائومی)">Xiaomi (شیائومی)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-bold">پرسش‌های سریع:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['بهترین گوشی تا ۲۵ میلیون', 'آیفون ۱۳ بخرم یا S24 FE؟', 'گیمینگ شیائومی تا ۳۰ تومن'].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-950 font-bold text-[10px] px-2.5 py-1 shrink-0 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                item.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center shrink-0 font-bold ${
                  item.sender === 'user'
                    ? 'bg-slate-950 text-yellow-400'
                    : 'bg-slate-100 text-slate-950 border border-slate-300'
                }`}
              >
                {item.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  item.sender === 'user'
                    ? 'bg-slate-950 text-white font-bold'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 font-medium'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-900 font-bold bg-slate-50 border border-slate-200 p-3 w-max">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>دستیار هوشمند ستاره در حال بررسی بازار و پیشنهاد بهترین گزینه...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="سوال خود را بنویسید (مثلاً: برای عکاسی تا ۴۰ میلیون چی پیشنهادی داری؟)..."
              className="flex-1 bg-white text-slate-950 placeholder-slate-400 text-xs px-4 py-3 border border-slate-300 focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs p-3 transition"
            >
              <Send className="w-4 h-4 text-yellow-400" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
