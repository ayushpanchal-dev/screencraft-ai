import React from 'react';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

interface NotFoundViewProps {
  isFromPortfolio?: boolean;
  onBackToDashboard?: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  isFromPortfolio = false,
  onBackToDashboard,
}) => {
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || '#';

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between p-6 md:p-12">
      <div className="max-w-xl mx-auto w-full space-y-8 my-auto text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-2xl">
          <FileQuestion className="w-10 h-10" />
        </div>

        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 uppercase tracking-wider">
            404 — Project Not Found
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Project Not Found
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            The requested project URL does not exist or may have been moved. Please verify the link or return to the main showcase.
          </p>
        </div>

        {/* CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {isFromPortfolio && (
            <a
              href={portfolioUrl}
              className="px-6 py-3 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </a>
          )}

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-6 py-3 rounded-xl text-xs md:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-indigo-400" />
              <span>Return to ScreenCraft</span>
            </button>
          )}
        </div>
      </div>

      <footer className="text-center text-xs text-slate-600 pt-6">
        ScreenCraft AI • Showcase & Portfolio Generator
      </footer>
    </div>
  );
};
