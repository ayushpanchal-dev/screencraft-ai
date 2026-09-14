import React from 'react';
import { Project } from '../types';
import {
  ArrowLeft,
  Briefcase,
  Layers,
  Shield,
  CheckCircle,
  FileText,
  Building2,
  Cpu,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { renderLucideIcon } from './ShowcaseView';

interface CaseStudyViewProps {
  project: Project;
  isFromPortfolio?: boolean;
  onBackToDashboard?: () => void;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({
  project,
  isFromPortfolio = false,
  onBackToDashboard,
}) => {
  const primaryColor = project.primaryColor || '#2563EB';
  const showcase = project.showcase || {};
  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || '#';

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-6 space-y-10">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {isFromPortfolio ? (
              <a
                href={portfolioUrl}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/40 shadow-lg shadow-indigo-600/20 transition hover:-translate-x-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </a>
            ) : (
              onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-md transition hover:-translate-x-0.5"
                >
                  <ArrowLeft className="w-4 h-4 text-indigo-400" />
                  <span>Back to ScreenCraft</span>
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono font-semibold text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Professional Case Study</span>
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-bold text-blue-400 uppercase tracking-widest">
            <Briefcase className="w-4 h-4" />
            <span>Company & Enterprise Project</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {project.name}
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
            {project.tagline || project.description}
          </p>

          {/* Tech Stack Matrix */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-slate-500 font-medium mr-1">Technologies Used:</span>
            {project.techStack.map((tech, idx) => (
              <span
                key={`${tech}-${idx}`}
                className="text-xs px-3 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Confidentiality Notice Alert Box */}
        <section className="bg-slate-900/90 rounded-2xl border border-blue-500/30 p-5 md:p-6 flex items-start gap-4 shadow-xl">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Confidentiality Notice</span>
              <Lock className="w-3.5 h-3.5 text-blue-400" />
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              This is a professional enterprise software project developed for internal corporate operations. To preserve company confidentiality, internal application screenshots, proprietary source code, client information, production data, and API endpoint details are strictly omitted.
            </p>
          </div>
        </section>

        {/* Project Overview */}
        <section className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 md:p-8 space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Project Overview & Business Context</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {showcase.overviewSummary || project.description}
          </p>
        </section>

        {/* High-Level Features Grid */}
        {showcase.features && showcase.features.length > 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>High-Level Capabilities</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Core architectural capabilities implemented for enterprise scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showcase.features.map((feat, idx) => (
                <div
                  key={feat.id || `cs-feat-${idx}`}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
                    >
                      {renderLucideIcon(feat.iconName, 'w-4 h-4')}
                    </div>
                    <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed pl-10">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Clean Architecture & Technical Highlights */}
        {showcase.architectureNotes && (
          <section className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 md:p-8 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Technical & Architectural Highlights</span>
            </h2>
            <div className="bg-slate-950 p-4 md:p-5 rounded-2xl border border-slate-800 font-mono text-xs md:text-sm text-slate-300 leading-relaxed">
              {showcase.architectureNotes}
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {project.name} • Professional Case Study</p>
          {isFromPortfolio ? (
            <a
              href={portfolioUrl}
              className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Return to Main Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="text-slate-400 hover:text-white transition"
              >
                Return to ScreenCraft Dashboard
              </button>
            )
          )}
        </footer>
      </div>
    </div>
  );
};
