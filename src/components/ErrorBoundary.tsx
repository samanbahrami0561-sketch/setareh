import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in UI:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-['Vazirmatn'] dir-rtl">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-8 max-w-md text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              متأسفانه خطایی در اجرای برنامه رخ داد
            </h2>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              مشکلی پیش‌بینی‌نشده رخ داده است. می‌توانید با بارگذاری مجدد صفحه، برنامه را بازنشانی کنید.
            </p>

            {this.state.error && (
              <div className="bg-slate-900/80 p-3 rounded-lg text-xs font-mono text-slate-300 mb-6 text-left overflow-x-auto dir-ltr">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full bg-yellow-400 text-slate-950 font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition duration-200 flex items-center justify-center gap-2"
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
