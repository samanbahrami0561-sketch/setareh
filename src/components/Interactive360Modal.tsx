import React, { useState } from 'react';
import { X, RotateCw, Palette, Eye, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';

interface Interactive360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const Interactive360Modal: React.FC<Interactive360ModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedColorHex, setSelectedColorHex] = useState<string>('');

  if (!isOpen || !product) return null;

  const images = product.images360 && product.images360.length > 0 
    ? product.images360 
    : [product.image];

  const activeImageIndex = Math.floor((rotationAngle / 360) * images.length) % images.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-200 shadow-2xl overflow-hidden my-8 text-right flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                نمایش ۳۶۰ درجه و رنگ‌بندی واقع‌گرایانه
                <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5">
                  INTERACTIVE 360°
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {product.persianName}
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

        {/* Interactive Viewer */}
        <div className="p-8 bg-slate-50 flex flex-col items-center justify-center space-y-6">
          
          <div className="relative w-64 h-64 bg-white border border-slate-200 p-6 flex items-center justify-center shadow-lg group">
            <img 
              src={images[activeImageIndex] || product.image} 
              alt={product.name} 
              className="w-full h-full object-contain transition duration-200"
            />

            <div className="absolute bottom-2 left-2 bg-slate-950/80 text-yellow-400 px-2 py-0.5 text-[10px] font-mono font-bold flex items-center gap-1">
              <RotateCw className="w-3 h-3 animate-spin" />
              <span>زاویه: {rotationAngle}°</span>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="w-full max-w-md space-y-2 text-center">
            <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
              <span>چرخش ۳۶۰ درجه گوشی:</span>
              <span className="font-mono">{rotationAngle} درجه</span>
            </div>
            <input
              type="range"
              min={0}
              max={359}
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full accent-slate-950 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 font-medium">اسلایدر را درگ کنید تا زاویه‌های مختلف گوشی بررسی شود</p>
          </div>

          {/* Color Variants Selector */}
          <div className="w-full max-w-md pt-4 border-t border-slate-200 space-y-3">
            <h4 className="font-black text-slate-950 text-xs flex items-center gap-1.5 justify-center">
              <Palette className="w-4 h-4 text-slate-700" />
              <span>رنگ‌بندی‌های رسمی موجود در انبار موبایل ستاره:</span>
            </h4>

            <div className="flex justify-center items-center gap-3">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorHex(c.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-bold transition ${
                    selectedColorHex === c.hex
                      ? 'border-slate-950 bg-slate-950 text-white shadow'
                      : 'border-slate-300 bg-white text-slate-950 hover:border-slate-400'
                  }`}
                >
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-slate-400" 
                    style={{ backgroundColor: c.hex }} 
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
