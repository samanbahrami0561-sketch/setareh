import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

interface ImageLoaderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  quality?: number;
  width?: number | string;
  height?: number | string;
  fallbackSrc?: string;
}

/**
 * Optimized ImageLoader component with WebP conversion, Unsplash query optimization,
 * native lazy loading, Skeleton loader, and graceful error fallback.
 */
export const ImageLoader: React.FC<ImageLoaderProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  quality = 80,
  width,
  height,
  fallbackSrc = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80&fm=webp',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Convert image URL to WebP format where applicable (e.g. Unsplash images)
  const getOptimizedUrl = (originalUrl: string): string => {
    if (!originalUrl) return fallbackSrc;

    try {
      if (originalUrl.includes('images.unsplash.com')) {
        const url = new URL(originalUrl);
        url.searchParams.set('fm', 'webp');
        url.searchParams.set('q', quality.toString());
        if (width && typeof width === 'number') {
          url.searchParams.set('w', (width * 2).toString()); // 2x DPR support
        }
        return url.toString();
      }
    } catch {
      // Fallback if URL parsing fails
    }

    return originalUrl;
  };

  const optimizedSrc = getOptimizedUrl(hasError ? fallbackSrc : src);

  useEffect(() => {
    // Reset load state when source changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Loading Skeleton Indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
        </div>
      )}

      {/* Error Fallback State */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl text-center z-10 w-full h-full">
          <ImageOff className="w-6 h-6 mb-1 opacity-70" />
          <span className="text-[10px] font-bold">تصویر در دسترس نیست</span>
        </div>
      ) : (
        <img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`transition-opacity duration-300 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
