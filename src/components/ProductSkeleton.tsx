import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm animate-pulse flex flex-col justify-between h-[420px] dir-rtl">
      <div>
        <div className="bg-slate-200 rounded-xl h-48 w-full mb-4"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-slate-200 rounded w-2/5"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
};
export default ProductSkeleton;
