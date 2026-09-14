import React from 'react';
import { Project } from '../types';
import { ShieldAlert, ArrowLeft, Lock, Building2, ExternalLink } from 'lucide-react';

interface PrivateProjectViewProps {
  project?: Project;
  projectId?: string;
  isFromPortfolio?: boolean;
  onBackToDashboard?: () => void;
}

export const PrivateProjectView: React.FC<PrivateProjectViewProps> = ({
  project,
  projectId = 'restricted',
  isFromPortfolio = false,
  onBackToDashboard,
}) => {
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || '#';
  const projectName = project?.name || 'Private Project';
  const shortDescription =
    project?.description ||
    'This project is private and restricted under enterprise non-disclosure agreements.';

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between p-6 md:p-12">
      <div className="max-w-3xl mx-auto w-full space-y-8 my-auto text-center">
        {/* Top Restricted Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Restricted / Confidential Access</span>
        </div>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {projectName}
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {shortDescription}
          </p>
        </div>

        {/* Safe Metadata Cards if available */}
        {project && (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 max-w-md mx-auto space-y-3 text-left">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-semibold text-slate-500">Category:</span>
              <span className="text-slate-300 font-medium">{project.category || 'Enterprise'}</span>
            </div>
            {project.techStack && project.techStack.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Technology Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={`${tech}-${idx}`}
                      className="text-[11px] px-2.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confidentiality Box */}
        <div className="bg-slate-900/50 rounded-2xl border border-amber-500/20 p-5 text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          <p className="font-bold text-amber-300 mb-1 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Confidentiality Notice</span>
          </p>
          Internal architecture, application screenshots, live demos, and source code for this project are confidential and cannot be displayed publicly.
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          {isFromPortfolio ? (
            <a
              href={portfolioUrl}
              className="px-6 py-3 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Portfolio</span>
            </a>
          ) : (
            onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-6 py-3 rounded-xl text-xs md:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-400" />
                <span>Return to ScreenCraft Homepage</span>
              </button>
            )
          )}
        </div>
      </div>

      <footer className="text-center text-xs text-slate-600 pt-6">
        ScreenCraft AI • Restricted Project Notice
      </footer>
    </div>
  );
};
