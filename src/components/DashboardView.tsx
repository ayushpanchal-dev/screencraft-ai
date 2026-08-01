import React, { useState } from 'react';
import { Project } from '../types';
import {
  Plus,
  Search,
  Sparkles,
  Smartphone,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  FolderPlus,
  RefreshCw,
  Layout,
  Check,
  Star,
  FileCode,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
  onQuickPreview: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onSelectProject,
  onCreateNewProject,
  onDeleteProject,
  onQuickPreview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = ['All', 'Health & Fitness', 'Finance', 'Productivity', 'Food & Drink', 'Social'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header / App Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img
                src="/screencraft-logo.png"
                alt="ScreenCraft AI Logo"
                className="w-10 h-10 object-contain rounded-xl bg-slate-900 border border-slate-800 p-1 shadow-lg shadow-indigo-500/10"
              />
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                ScreenCraft <span className="text-indigo-400">AI</span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl">
              Convert mobile app screenshots into interactive app showcase websites & case studies.
            </p>
          </div>

          {/* New Project CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCreateNewProject}
              className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Flutter App</span>
            </button>
          </div>
        </header>

        {/* Search and Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, stack, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition placeholder:text-slate-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-dashed border-slate-800/80 p-8 space-y-5">
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto border border-indigo-500/20">
              <Smartphone className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-extrabold text-white">Build Your Personal Mobile Portfolio</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Add your completed Flutter & mobile apps here to generate interactive showcases, upload screenshots, add APK build links, and feature matrices.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-mono">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>All projects save automatically to your local browser storage</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={onCreateNewProject}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add My Flutter App Project</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((project) => {
                const primaryColor = project.primaryColor || '#6366F1';
                const screenCount = project.screens ? project.screens.length : 0;
                const heroScreen = project.screens && project.screens[0];

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    {/* Top Thumbnail Preview Box */}
                    <div className="relative h-48 bg-slate-950 overflow-hidden flex items-center justify-center p-4 group-hover:brightness-105 transition">
                      {/* Ambient gradient glow */}
                      <div
                        className="absolute inset-0 opacity-20 blur-xl pointer-events-none"
                        style={{ backgroundColor: primaryColor }}
                      />

                      {heroScreen ? (
                        <div className="relative w-28 h-44 rounded-xl overflow-hidden border border-slate-700 shadow-2xl transition group-hover:scale-105 duration-300">
                          <img
                            src={heroScreen.imageUrl}
                            alt={project.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-36 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-600">
                          <Smartphone className="w-8 h-8 mb-1 opacity-50" />
                          <span className="text-[10px]">No screens</span>
                        </div>
                      )}

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 shadow">
                          {project.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {screenCount} {screenCount === 1 ? 'Screen' : 'Screens'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            onClick={() => onSelectProject(project.id)}
                            className="text-lg font-bold text-white hover:text-indigo-400 cursor-pointer transition tracking-tight"
                          >
                            {project.name}
                          </h3>
                          <div
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                            style={{ backgroundColor: primaryColor }}
                            title={`Primary Theme Color: ${primaryColor}`}
                          />
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {project.tagline || project.description}
                        </p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.slice(0, 5).map((tech, idx) => (
                          <span
                            key={`${tech}-${idx}`}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
                            +{project.techStack.length - 5}
                          </span>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onQuickPreview(project.id)}
                          className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview Showcase</span>
                        </button>

                        <button
                          onClick={() => onSelectProject(project.id)}
                          className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition text-xs font-semibold"
                          title="Edit Project Details"
                        >
                          Edit
                        </button>

                        {deleteConfirmId === project.id ? (
                          <button
                            onClick={() => onDeleteProject(project.id)}
                            className="p-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold transition"
                            title="Confirm Delete"
                          >
                            Confirm
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(project.id)}
                            onMouseLeave={() => setDeleteConfirmId(null)}
                            className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
