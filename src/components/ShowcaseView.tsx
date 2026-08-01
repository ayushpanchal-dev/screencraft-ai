import React, { useState } from 'react';
import { Project, DevicePreviewViewport } from '../types';
import { DeviceFrame } from './DeviceFrame';
import {
  Download,
  Github,
  Globe,
  Smartphone,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  Cpu,
  Activity,
  CheckCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Laptop,
  Tablet,
  Phone,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface ShowcaseViewProps {
  project: Project;
  viewport?: DevicePreviewViewport;
  isStandalone?: boolean;
  onBackToDashboard?: () => void;
}

// Icon mapper for dynamic icon string names
export const renderLucideIcon = (iconName: string, className = 'w-6 h-6') => {
  switch (iconName.toLowerCase()) {
    case 'zap':
      return <Zap className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'barchart3':
    case 'chart':
      return <BarChart3 className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'checkcircle':
      return <CheckCircle className={className} />;
    case 'trendingup':
      return <TrendingUp className={className} />;
    case 'smartphone':
    default:
      return <Smartphone className={className} />;
  }
};

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({
  project,
  viewport = 'desktop',
  isStandalone = false,
  onBackToDashboard,
}) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  const primaryColor = project.primaryColor || '#6366F1';
  const screens = project.screens || [];
  const showcase = project.showcase || {};
  const links = project.links || {};

  // Viewport container sizing logic
  let viewportWidthClass = 'w-full max-w-7xl';
  if (viewport === 'tablet') viewportWidthClass = 'w-[768px] mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60';
  if (viewport === 'mobile') viewportWidthClass = 'w-[375px] mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60';

  const currentActiveScreen = screens.length > 0 
    ? (screens[activeScreenIndex] || screens[0]) 
    : undefined;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      <div className={`mx-auto transition-all duration-300 ${viewportWidthClass}`}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-md transition hover:-translate-x-0.5 mr-2 shrink-0"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-400" />
                <span>Back to Dashboard</span>
              </button>
            )}

            <img
              src={project.logoUrl || '/screencraft-logo.png'}
              alt={project.name || 'ScreenCraft AI'}
              className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-slate-800 p-0.5 shrink-0 shadow-sm"
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-base md:text-lg text-white tracking-tight">{project.name}</span>
              <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/50 font-medium">
                {project.category || 'Mobile App'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {links.githubUrl && (
              <a
                href={links.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
                title="GitHub Repo"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 px-6 overflow-hidden">
          {/* Subtle radial ambient light */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mobile App Case Study & Interactive Showcase</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {showcase.heroTitle || project.name}
              </h1>

              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl">
                {showcase.heroTagline || project.tagline || project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {links.githubUrl && (
                  <a
                    href={links.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white shadow-xl hover:shadow-2xl transition hover:-translate-y-0.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Github className="w-4.5 h-4.5" />
                    <span>View Source Code</span>
                  </a>
                )}
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium mr-1">Built with:</span>
                {project.techStack.map((tech, idx) => (
                  <span
                    key={`${tech}-${idx}`}
                    className="text-xs px-3 py-1 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Hero Device Frame */}
            <div className="lg:col-span-5 flex justify-center items-center">
              {currentActiveScreen ? (
                <DeviceFrame
                  imageSrc={currentActiveScreen.imageUrl}
                  title={currentActiveScreen.title}
                  config={project.deviceConfig}
                  scale={0.9}
                />
              ) : (
                <div className="w-[280px] h-[540px] rounded-[40px] bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <Smartphone className="w-12 h-12 mb-3 opacity-40" />
                  <p className="text-sm">No screens uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Overview & Architecture Section */}
        <section className="py-16 px-6 border-t border-slate-900 bg-slate-950/50">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Project Overview</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Comprehensive technical insights and architecture design.
              </p>
            </div>

            <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-6 md:p-8 space-y-6">
              <p className="text-slate-300 leading-relaxed text-base">
                {showcase.overviewSummary || project.description}
              </p>

              {showcase.architectureNotes && (
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-2">
                    <Layers className="w-4 h-4" />
                    <span>Architecture & Clean Code Structure</span>
                  </div>
                  <p className="text-xs md:text-sm font-mono text-slate-400 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800/60">
                    {showcase.architectureNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Interactive Screenshot Carousel / Showcase */}
        {screens.length > 0 && (
          <section className="py-20 px-6 border-t border-slate-900 bg-slate-900/30">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Interactive Screen Showcase
                </h2>
                <p className="text-slate-400 text-base max-w-xl mx-auto">
                  Explore mobile user interfaces, screen titles, and feature callouts.
                </p>
              </div>

              {/* Screen Selector Tabs */}
              <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {screens.map((scr, idx) => (
                  <button
                    key={scr.id || `scr-${idx}`}
                    onClick={() => setActiveScreenIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 border whitespace-nowrap ${
                      activeScreenIndex === idx
                        ? 'bg-slate-800 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-700/80 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{scr.title || `Screen ${idx + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Selected Screen Spotlight View */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">
                {/* Left Mockup Display */}
                <div className="md:col-span-6 flex items-center justify-center">
                  <DeviceFrame
                    imageSrc={currentActiveScreen.imageUrl}
                    title={currentActiveScreen.title}
                    config={project.deviceConfig}
                    scale={0.92}
                  />
                </div>

                {/* Right Screen Detail Card */}
                <div className="md:col-span-6 space-y-6 text-left">
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                    {currentActiveScreen.category || 'Screen Focus'}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {currentActiveScreen.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed text-base">
                    {currentActiveScreen.description || 'Interactive mobile interface designed with Material 3 components.'}
                  </p>

                  {/* AI Extracted Feature Bullets if available */}
                  {currentActiveScreen.aiExtractedFeatures &&
                    currentActiveScreen.aiExtractedFeatures.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Key UI Capabilities:
                        </span>
                        <div className="space-y-2">
                          {currentActiveScreen.aiExtractedFeatures.map((feat, fIdx) => (
                            <div key={`${currentActiveScreen.id}-feat-${fIdx}`} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-300">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Page Navigation Controls Bar - Located on Right Side Below Description */}
                  {screens.length > 1 && (
                    <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                      <button
                        onClick={() =>
                          setActiveScreenIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1))
                        }
                        className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5 text-xs font-bold shadow-md"
                        title="Previous Screen"
                      >
                        <ChevronLeft className="w-4 h-4 text-indigo-400" />
                        <span>Prev</span>
                      </button>

                      <span className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono font-bold">
                        {activeScreenIndex + 1} / {screens.length}
                      </span>

                      <button
                        onClick={() =>
                          setActiveScreenIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0))
                        }
                        className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5 text-xs font-bold shadow-md"
                        title="Next Screen"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4 text-indigo-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Feature Highlights Grid */}
        {showcase.features && showcase.features.length > 0 && (
          <section className="py-20 px-6 border-t border-slate-900">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Key Capabilities</h2>
                <p className="text-slate-400 text-base max-w-xl mx-auto">
                  Engineered for seamless usability and high performance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {showcase.features.map((feat, idx) => (
                  <div
                    key={feat.id || `feat-${idx}`}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
                    >
                      {renderLucideIcon(feat.iconName, 'w-6 h-6')}
                    </div>
                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom Download Banner */}
        <section className="py-16 px-6 border-t border-slate-900">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-10 md:p-14 space-y-6 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Experience {project.name} Today</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Download the APK or explore the source repository on GitHub.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              {links.apkUrl && (
                <a
                  href={links.apkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl font-bold text-white text-sm shadow-xl transition hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK Direct</span>
                </a>
              )}
              {links.githubUrl && (
                <a
                  href={links.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 text-sm border border-slate-700 transition flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>View GitHub</span>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 text-center text-slate-600 text-xs border-t border-slate-900">
          <p>© {new Date().getFullYear()} {project.name}. Interactive Showcase generated with ScreenCraft AI.</p>
        </footer>
      </div>
    </div>
  );
};
