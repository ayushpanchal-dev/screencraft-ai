import React from 'react';
import { ExternalLink, Github, Linkedin, Sparkles } from 'lucide-react';

interface AttributionFooterProps {
  className?: string;
}

export const AttributionFooter: React.FC<AttributionFooterProps> = ({ className = '' }) => {
  return (
    <footer
      className={`w-full py-6 sm:py-8 px-4 sm:px-6 text-center text-xs text-slate-400 border-t border-slate-900 bg-slate-950/80 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-mono font-medium">
            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
            <span>ScreenCraft AI</span>
          </span>
          <span className="text-slate-600 hidden xs:inline">•</span>
          <span>
            Built by{' '}
            <a
              href="https://ayush-panchal.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-200 hover:text-indigo-400 underline decoration-indigo-500/40 underline-offset-4 transition inline-flex items-center gap-1"
            >
              <span>Ayush Panchal</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 text-slate-400 pt-1 sm:pt-0">
          <a
            href="https://ayush-panchal.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 transition flex items-center gap-1.5 text-xs"
          >
            <span>Portfolio</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <a
            href="https://github.com/ayushpanchal-dev/apayush"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 transition flex items-center gap-1.5 text-xs"
            title="GitHub Profile"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/ayush2505/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-400 transition flex items-center gap-1.5 text-xs"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
