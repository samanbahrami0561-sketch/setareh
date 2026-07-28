import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `ERR-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[${this.state.errorId || 'ERR-UI'}] Uncaught UI Error:`, error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const isProduction = process.env.NODE_ENV === 'production';

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-['Vazirmatn'] dir-rtl">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-8 max-w-md text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              بروز خطای غیرمنتظره در سامانه
            </h2>
            
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              جهت حفظ امنیت اطلاعات و حریم خصوصی، جزئیات فنی خطا نمایش داده نمی‌شود. لطفاً با ارائه کد پیگیری زیر با پشتیبانی تماس بگیرید یا صفحه را مجدداً بارگذاری کنید.
            </p>

            {/* Error Tracking Code */}
            <div className="bg-slate-900/90 border border-slate-700/60 p-3 rounded-xl text-xs text-slate-300 mb-6 flex items-center justify-between font-mono dir-ltr">
              <span className="text-slate-500 font-sans text-[11px] dir-rtl">کد پیگیری خطا:</span>
              <span className="text-amber-400 font-bold tracking-wider">{this.state.errorId || 'ERR-UNKNOWN'}</span>
            </div>

            {/* Development Mode Details Only */}
            {!isProduction && this.state.error && (
              <div className="bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-xs font-mono text-red-300 mb-6 text-left overflow-x-auto max-h-32 dir-ltr">
                <span className="text-red-400 font-bold block mb-1">Dev Debug Info:</span>
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full bg-yellow-400 text-slate-950 font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>بارگذاری مجدد صفحه</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
