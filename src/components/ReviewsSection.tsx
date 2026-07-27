import React, { useState, useEffect } from 'react';
import { Review } from '../types';
import { 
  Star, 
  Plus, 
  X, 
  MapPin, 
  UserCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New review form states
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!author || author.trim().length < 2) {
      setErrorMessage('نام باید حداقل ۲ حرف باشد.');
      return;
    }
    if (!comment || comment.trim().length < 5) {
      setErrorMessage('متن نظر باید حداقل ۵ کاراکتر باشد.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'store-general',
          userName: author,
          rating,
          comment
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ثبت نظر');
      }

      setIsModalOpen(false);
      setAuthor('');
      setComment('');
      fetchReviews();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews" className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-right font-['Vazirmatn']">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-950 text-white flex items-center justify-center">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">نظرات و تجربیات مشتریان واقعی موبایل ستاره</h3>
            <p className="text-xs text-slate-500 font-medium">ذخیره‌شده در دیتابیس Firestore فروشگاه</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-yellow-400" />
          <span>ثبت نظر شما</span>
        </button>
      </div>

      {/* Score Overview Bar */}
      <div className="bg-slate-50 p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 text-center md:text-right border-b md:border-b-0 md:border-l border-slate-200 pb-4 md:pb-0 md:pl-6 space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-4xl font-black text-slate-950">۴.۸</span>
            <span className="text-xs text-slate-500 font-bold">از ۵</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xs text-slate-500 pt-1 font-medium">بررسی‌های ثبت شده مشتریان مبارکه</p>
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 bg-white p-3 border border-slate-200 flex-1 min-w-[200px]">
            <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>خرید حضوری و اینترنتی تاییدشده</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 border border-slate-200 flex-1 min-w-[200px]">
            <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
            <span>فروشگاه مبارکه، خیابان حافظ شرقی</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-8 text-center text-slate-400">در حال دریافت نظرات...</div>
        ) : reviews.length === 0 ? (
          <div className="col-span-3 py-8 text-center text-slate-400">هنوز نظری ثبت نشده است. اولین نفر باشید!</div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-900">{rev.userName || rev.author}</span>
                <div className="flex gap-0.5 text-yellow-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
              <span className="text-[10px] text-slate-400 block pt-2 border-t border-slate-200">
                {rev.createdAt || 'اخیر'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-slate-200 max-w-md w-full p-6 space-y-4 text-right shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-extrabold text-base text-slate-950">ثبت نظر جدید در دیتابیس</h4>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 font-medium text-slate-900 focus:outline-none"
                  placeholder="مثال: علی محمدی"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">امتیاز (از ۱ تا ۵):</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 font-bold text-slate-900 focus:outline-none"
                >
                  <option value={5}>۵ از ۵ - عالی</option>
                  <option value={4}>۴ از ۵ - خیلی خوب</option>
                  <option value={3}>۳ از ۵ - معمولی</option>
                  <option value={2}>۲ از ۵ - ضعیف</option>
                  <option value={1}>۱ از ۵ - خیلی ضعیف</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">متن نظر شما:</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 font-medium text-slate-900 focus:outline-none resize-none"
                  placeholder="تجربه خود از خرید یا مراجعه به فروشگاه را بنویسید..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-950 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-3 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ذخیره در دیتابیس...</span>
                  </>
                ) : (
                  <span>ثبت و ذخیره نظر</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
