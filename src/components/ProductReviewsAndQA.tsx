import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Filter, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  MessageCircle,
  ChevronDown,
  CornerDownLeft
} from 'lucide-react';
import { Product, Review, ProductQA, UserAccount } from '../types';
import { MOCK_PRODUCT_REVIEWS, MOCK_PRODUCT_QAS } from '../data/mockData';

interface ProductReviewsAndQAProps {
  product: Product;
  currentUser?: UserAccount | null;
}

export const ProductReviewsAndQA: React.FC<ProductReviewsAndQAProps> = ({
  product,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');
  
  // Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    return MOCK_PRODUCT_REVIEWS[product.id] || [
      {
        id: `rev-default-1`,
        author: 'رضا صامتی',
        rating: Math.round(product.rating || 5),
        date: '۱ مرداد ۱۴۰۳',
        comment: `کالای ${product.persianName} با گارانتی اصلی به دستم رسید. کیفیت ساخت و بسته‌بندی عالی بود و کاملاً راضی هستم.`,
        location: 'مبارکه',
        verified: true,
        likes: 10,
        dislikes: 0
      },
      {
        id: `rev-default-2`,
        author: 'مینا رحیمی',
        rating: 5,
        date: '۲۲ تیر ۱۴۰۳',
        comment: 'تحویل سریع حضوری در فروشگاه حافظ شرقی مبارکه. ارزش خرید بالایی داره و قیمت هم منصفانه بود.',
        location: 'مبارکه',
        verified: true,
        likes: 6,
        dislikes: 0
      }
    ];
  });

  // Q&A state
  const [qaList, setQaList] = useState<ProductQA[]>(() => {
    return MOCK_PRODUCT_QAS.filter(q => q.productId === product.id || q.productId === 'p-1');
  });

  // Filters state
  const [reviewFilter, setReviewFilter] = useState<'all' | 'verified' | '5stars'>('all');
  const [userVoted, setUserVoted] = useState<Record<string, 'like' | 'dislike'>>({});

  // Form states for new review
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newAuthor, setNewAuthor] = useState<string>(currentUser?.name || '');
  const [newLocation, setNewLocation] = useState<string>('مبارکه');
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  // Form states for new question
  const [showQAForm, setShowQAForm] = useState(false);
  const [newQAAuthor, setNewQAAuthor] = useState<string>(currentUser?.name || '');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [qaSuccess, setQaSuccess] = useState<string | null>(null);

  // Inline Answer form state
  const [replyingToQAId, setReplyingToQAId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Ratings calculation
  const totalReviewsCount = reviewsList.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : product.rating.toString();

  const ratingCounts = [5, 4, 3, 2, 1].map(star => {
    const count = reviewsList.filter(r => r.rating === star).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : (star >= 4 ? 80 : 5);
    return { star, count, percentage };
  });

  // Filtered Reviews
  const filteredReviews = reviewsList.filter(r => {
    if (reviewFilter === 'verified') return r.verified;
    if (reviewFilter === '5stars') return r.rating === 5;
    return true;
  });

  // Submit Review Handler
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim() || 'کاربر ستاره',
      rating: newRating,
      date: 'هم‌اکنون',
      comment: newComment.trim(),
      location: newLocation.trim() || 'مبارکه',
      verified: true,
      likes: 0,
      dislikes: 0
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewComment('');
    setReviewSuccess('نظر و امتیاز شما با موفقیت ثبت شد و در لیست منتشر گردید!');
    setTimeout(() => {
      setReviewSuccess(null);
      setShowReviewForm(false);
    }, 2500);
  };

  // Submit Question Handler
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQA: ProductQA = {
      id: `qa-${Date.now()}`,
      productId: product.id,
      author: newQAAuthor.trim() || 'کاربر محترم',
      date: 'هم‌اکنون',
      question: newQuestion.trim(),
      answers: []
    };

    setQaList([newQA, ...qaList]);
    setNewQuestion('');
    setQaSuccess('سوال شما ثبت شد. کارشناسان فروشگاه ستاره به زودی پاسخ خواهند داد.');
    setTimeout(() => {
      setQaSuccess(null);
      setShowQAForm(false);
    }, 2500);
  };

  // Submit Answer Handler
  const handleAddAnswer = (qaId: string) => {
    if (!replyText.trim()) return;

    setQaList(prev => prev.map(qa => {
      if (qa.id === qaId) {
        return {
          ...qa,
          answers: [
            ...qa.answers,
            {
              id: `ans-${Date.now()}`,
              author: currentUser?.name || 'کاربر ستاره',
              isStaff: currentUser?.role === 'owner' || currentUser?.role === 'sales',
              date: 'هم‌اکنون',
              text: replyText.trim()
            }
          ]
        };
      }
      return qa;
    }));

    setReplyText('');
    setReplyingToQAId(null);
  };

  // Vote helpful/unhelpful
  const handleVote = (revId: string, type: 'like' | 'dislike') => {
    if (userVoted[revId]) return;

    setReviewsList(prev => prev.map(r => {
      if (r.id === revId) {
        return {
          ...r,
          likes: type === 'like' ? (r.likes || 0) + 1 : r.likes,
          dislikes: type === 'dislike' ? (r.dislikes || 0) + 1 : r.dislikes
        };
      }
      return r;
    }));

    setUserVoted(prev => ({ ...prev, [revId]: type }));
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden font-sans text-right">
      
      {/* Tab Selector Header */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md scale-102'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400 dark:text-slate-950 fill-amber-400 dark:fill-slate-950" />
            <span>نظرات و امتیاز خریداران</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 dark:bg-slate-900 text-white dark:text-amber-300">
              {totalReviewsCount.toLocaleString('fa-IR')}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'qa'
                ? 'bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 shadow-md scale-102'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#0b57d0] dark:text-sky-400" />
            <span>پرسش و پاسخ</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {qaList.length.toLocaleString('fa-IR')}
            </span>
          </button>
        </div>

        {/* Action Button depending on active tab */}
        {activeTab === 'reviews' ? (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت نظر و امتیاز شما</span>
          </button>
        ) : (
          <button
            onClick={() => setShowQAForm(!showQAForm)}
            className="px-3.5 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>طرح پرسش جدید</span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-6">

        {/* ================= REVIEWS TAB CONTENT ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">

            {/* Rating Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Score & Stars */}
              <div className="text-center space-y-2 md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
                <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-amber-400 font-mono tracking-tight">
                  {averageRating}
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        s <= Math.round(Number(averageRating))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  بر اساس {totalReviewsCount.toLocaleString('fa-IR')} دیدگاه ثبت‌شده کاربران
                </p>
                <div className="pt-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>۹۵٪ خریداران این کالا را پیشنهاد داده‌اند</span>
                </div>
              </div>

              {/* Rating Bars Breakdown */}
              <div className="space-y-2 md:col-span-2">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-14 font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      <span>{star} ستاره</span>
                    </div>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-left font-mono text-[11px] text-slate-400 dark:text-slate-500 font-bold shrink-0">
                      {count.toLocaleString('fa-IR')} نظر
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW REVIEW FORM MODAL / COLLAPSIBLE */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-right">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <h4 className="text-sm font-black text-slate-900 dark:text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>ثبت نظر و تجربه استفاده شما</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    برای محصول {product.persianName}
                  </span>
                </div>

                {reviewSuccess ? (
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{reviewSuccess}</span>
                  </div>
                ) : (
                  <>
                    {/* Interactive Star Rating Selector */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        امتیاز شما به کیفیت این محصول:
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onMouseEnter={() => setHoverRating(s)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(s)}
                            className="p-1 hover:scale-125 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                s <= (hoverRating || newRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="mr-2 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                          {hoverRating || newRating} از ۵ ستاره
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          نام شما:
                        </label>
                        <input
                          type="text"
                          required
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                          placeholder="مثلاً: علی بهرامی"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          شهر محل سکونت:
                        </label>
                        <input
                          type="text"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          placeholder="مثلاً: مبارکه"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        متن نظر و تجربه کاربری:
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="کیفیت ساخت، شارژدهی باتری، عملکرد عکاسی یا تجربه‌تان از خدمات ستاره..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-300"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-md"
                      >
                        <Send className="w-4 h-4" />
                        <span>ارسال و انتشار نظر</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* Filter Pills Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
                <Filter className="w-4 h-4 text-slate-400" />
                <span>فیلتر دیدگاه‌ها:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs transition font-bold cursor-pointer ${
                      reviewFilter === 'all'
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    همه ({reviewsList.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('verified')}
                    className={`px-3 py-1 rounded-lg text-xs transition font-bold cursor-pointer ${
                      reviewFilter === 'verified'
                        ? 'bg-[#0b57d0] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    خریداران واقعی ({reviewsList.filter(r => r.verified).length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('5stars')}
                    className={`px-3 py-1 rounded-lg text-xs transition font-bold cursor-pointer ${
                      reviewFilter === '5stars'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ۵ ستاره عالی ({reviewsList.filter(r => r.rating === 5).length})
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  نظری با این فیلتر یافت نشد. اولین دیدگاه را شما ثبت کنید!
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-xs">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {rev.author}
                            </span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>خریدار این کالا از ستاره</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {rev.location ? `${rev.location} • ` : ''}{rev.date}
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-1">
                      {rev.comment}
                    </p>

                    {/* Like / Dislike Helpfulness */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>آیا این دیدگاه برای شما مفید بود؟</span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleVote(rev.id, 'like')}
                          disabled={Boolean(userVoted[rev.id])}
                          className={`flex items-center gap-1 text-[10px] font-bold transition px-2 py-1 rounded-lg cursor-pointer ${
                            userVoted[rev.id] === 'like'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{(rev.likes || 0).toLocaleString('fa-IR')}</span>
                        </button>

                        <button
                          onClick={() => handleVote(rev.id, 'dislike')}
                          disabled={Boolean(userVoted[rev.id])}
                          className={`flex items-center gap-1 text-[10px] font-bold transition px-2 py-1 rounded-lg cursor-pointer ${
                            userVoted[rev.id] === 'dislike'
                              ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                              : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{(rev.dislikes || 0).toLocaleString('fa-IR')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ================= QUESTIONS & ANSWERS TAB CONTENT ================= */}
        {activeTab === 'qa' && (
          <div className="space-y-6">

            {/* Header info */}
            <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0b57d0]/20 rounded-xl text-[#0b57d0] dark:text-sky-400">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-sky-300">
                    پرسش و پاسخ درباره {product.persianName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    پاسخ‌های داده‌شده توسط کارشناسان فروشگاه ستاره مبارکه و خریداران
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQAForm(!showQAForm)}
                className="px-4 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>طرح سوال جدید</span>
              </button>
            </div>

            {/* NEW QUESTION FORM */}
            {showQAForm && (
              <form onSubmit={handleAddQuestion} className="bg-sky-500/10 border-2 border-sky-500/30 rounded-2xl p-4 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                  <h4 className="text-xs font-black text-[#0b57d0] dark:text-sky-300">
                    پرسش جدید خود را مطرح کنید:
                  </h4>
                </div>

                {qaSuccess ? (
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{qaSuccess}</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        نام شما:
                      </label>
                      <input
                        type="text"
                        required
                        value={newQAAuthor}
                        onChange={(e) => setNewQAAuthor(e.target.value)}
                        placeholder="مثلاً: حسین بهرامی"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b57d0]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        سوال شما:
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="درباره رجیستری، مشخصات فنی، رنگ‌بندی یا شرایط اقساط کالا سوال بپرسید..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b57d0]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowQAForm(false)}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#0b57d0] text-white text-xs font-black rounded-xl hover:bg-[#0842a0] transition flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ارسال سوال</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {/* Q&A List */}
            <div className="space-y-4">
              {qaList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  هنوز سؤالی برای این کالا ثبت نشده است. اولین سؤال را شما بپرسید!
                </div>
              ) : (
                qaList.map((qa) => (
                  <div
                    key={qa.id}
                    className="bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    {/* Question Row */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#0b57d0]/15 text-[#0b57d0] dark:text-sky-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        ؟
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {qa.author}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {qa.date}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                          {qa.question}
                        </p>
                      </div>
                    </div>

                    {/* Answers List */}
                    {qa.answers && qa.answers.length > 0 && (
                      <div className="mr-8 pt-2 space-y-2 border-r-2 border-[#0b57d0]/30 pr-3">
                        {qa.answers.map((ans) => (
                          <div
                            key={ans.id}
                            className={`p-3 rounded-xl space-y-1 text-xs ${
                              ans.isStaff
                                ? 'bg-[#0b57d0]/10 border border-[#0b57d0]/20 text-slate-900 dark:text-slate-100'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold flex items-center gap-1.5 text-xs">
                                <span>{ans.author}</span>
                                {ans.isStaff && (
                                  <span className="bg-[#0b57d0] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                                    <span>پاسخ کارشناس ستاره</span>
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{ans.date}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                              {ans.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply button / form */}
                    <div className="mr-8 pt-1">
                      {replyingToQAId === qa.id ? (
                        <div className="space-y-2 pt-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="پاسخ خود را برای این سوال بنویسید..."
                            className="w-full text-xs p-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-950 dark:text-white"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setReplyingToQAId(null)}
                              className="text-[11px] px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
                            >
                              انصراف
                            </button>
                            <button
                              onClick={() => handleAddAnswer(qa.id)}
                              className="text-[11px] px-3 py-1 bg-[#0b57d0] text-white font-bold rounded-lg flex items-center gap-1"
                            >
                              <CornerDownLeft className="w-3.5 h-3.5" />
                              <span>ثبت پاسخ</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplyingToQAId(qa.id);
                            setReplyText('');
                          }}
                          className="text-[11px] text-[#0b57d0] dark:text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <CornerDownLeft className="w-3.5 h-3.5" />
                          <span>به این سوال پاسخ دهید</span>
                        </button>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
