import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Sparkles, Eye, EyeOff, Activity } from 'lucide-react';

export interface RibbonsProps {
  /** Explicitly disable canvas animation & rendering */
  disabled?: boolean;
  /** Automatically pause when user prefers reduced motion (defaults to true) */
  respectReducedMotion?: boolean;
  /** Number of flowing ribbon strands */
  ribbonCount?: number;
  /** Base colors for the ribbons */
  colors?: string[];
  /** Speed multiplier for ambient movement */
  speed?: number;
  /** Custom container class names */
  className?: string;
  /** Show a visible floating toggle button for the user */
  showToggleControl?: boolean;
  /** Callback when visibility state changes */
  onVisibilityChange?: (visible: boolean) => void;
}

export const Ribbons: React.FC<RibbonsProps> = ({
  disabled = false,
  respectReducedMotion = true,
  ribbonCount = 3,
  colors = ['rgba(245, 158, 11, 0.35)', 'rgba(59, 130, 246, 0.25)', 'rgba(16, 185, 129, 0.2)'],
  speed = 0.8,
  className = '',
  showToggleControl = false,
  onVisibilityChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const systemReducedMotion = useReducedMotion();

  // Internal state for manual user toggle
  const [userEnabled, setUserEnabled] = useState<boolean>(true);

  // Effective status calculation
  const isReducedMotionActive = respectReducedMotion && systemReducedMotion;
  const isCanvasActive = !disabled && userEnabled && !isReducedMotionActive;

  const handleToggle = useCallback(() => {
    setUserEnabled(prev => {
      const next = !prev;
      if (onVisibilityChange) onVisibilityChange(next);
      return next;
    });
  }, [onVisibilityChange]);

  useEffect(() => {
    if (!isCanvasActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = containerRef.current?.offsetWidth || window.innerWidth);
    let height = (canvas.height = containerRef.current?.offsetHeight || 400);

    // Mouse/Touch physics points
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.targetX = e.touches[0].clientX - rect.left;
      mouse.targetY = e.touches[0].clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Resize
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Ribbon Ribbon Point Structure
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    interface Strand {
      nodes: Node[];
      color: string;
      width: number;
      freqX: number;
      freqY: number;
      amplitude: number;
    }

    const nodeCount = 10;
    const strands: Strand[] = Array.from({ length: ribbonCount }).map((_, i) => {
      const nodes: Node[] = Array.from({ length: nodeCount }).map(() => ({
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0
      }));

      return {
        nodes,
        color: colors[i % colors.length],
        width: 14 - i * 2,
        freqX: 0.002 + i * 0.001,
        freqY: 0.003 + i * 0.0015,
        amplitude: 25 + i * 10
      };
    });

    let time = 0;

    const render = () => {
      if (document.hidden) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015 * speed;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      strands.forEach((strand, strandIndex) => {
        const head = strand.nodes[0];

        // Wave offset calculations
        const waveX = Math.sin(time * strand.freqX * 10 + strandIndex) * strand.amplitude;
        const waveY = Math.cos(time * strand.freqY * 10 + strandIndex) * strand.amplitude;

        head.x = mouse.x + waveX;
        head.y = mouse.y + waveY;

        // Propagate down nodes with spring physics
        for (let j = 1; j < strand.nodes.length; j++) {
          const prev = strand.nodes[j - 1];
          const curr = strand.nodes[j];

          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;

          curr.vx += dx * 0.15;
          curr.vy += dy * 0.15;

          curr.vx *= 0.65;
          curr.vy *= 0.65;

          curr.x += curr.vx;
          curr.y += curr.vy;
        }

        // Draw Ribbon Curve
        ctx.beginPath();
        ctx.moveTo(strand.nodes[0].x, strand.nodes[0].y);

        for (let j = 1; j < strand.nodes.length - 1; j++) {
          const xc = (strand.nodes[j].x + strand.nodes[j + 1].x) / 2;
          const yc = (strand.nodes[j].y + strand.nodes[j + 1].y) / 2;
          ctx.quadraticCurveTo(strand.nodes[j].x, strand.nodes[j].y, xc, yc);
        }

        ctx.strokeStyle = strand.color;
        ctx.lineWidth = Math.max(1, strand.width);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
    };
  }, [isCanvasActive, ribbonCount, colors, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[180px] overflow-hidden pointer-events-none ${className}`}
    >
      {/* Canvas Element */}
      {isCanvasActive ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0 opacity-80 transition-opacity duration-500"
        />
      ) : (
        /* Reduced motion / disabled static ambient fallback */
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-blue-500/5 to-emerald-500/5 backdrop-blur-[1px] transition-all duration-300" />
      )}

      {/* Optional User Visibility Toggle Control */}
      {showToggleControl && (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleToggle}
            type="button"
            title={
              isCanvasActive
                ? 'غیرفعال‌سازی انیمیشن انحنادار (کاهش مصرف باتری)'
                : 'فعال‌سازی انیمیشن زنده (Ribbons)'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition shadow-sm ${
              isCanvasActive
                ? 'bg-slate-900/80 border-amber-500/40 text-amber-300 hover:bg-slate-800'
                : 'bg-slate-100/90 border-slate-300 text-slate-600 hover:bg-white'
            }`}
          >
            {isCanvasActive ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>افکت زنده فعال است</span>
                <EyeOff className="w-3.5 h-3.5 mr-1 opacity-70" />
              </>
            ) : (
              <>
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>حالت کم‌مصرف (کاهش حرکت)</span>
                <Eye className="w-3.5 h-3.5 mr-1 text-amber-500" />
              </>
            )}
          </button>

          {isReducedMotionActive && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-medium">
              تنظیمات سیستم: Reduced Motion
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Ribbons;
