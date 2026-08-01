import React, { useState } from 'react';
import { Project, AppScreen, EditorTab, DevicePreviewViewport, DeviceConfig, FeatureCard, ShowcaseContent } from '../types';
import { DeviceFrame } from './DeviceFrame';
import { ShowcaseView } from './ShowcaseView';
import { ExportService } from '../services/exportService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Upload,
  Smartphone,
  Info,
  Layers,
  Eye,
  Download,
  FileCode,
  Github,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Check,
  Globe,
  Palette,
  Laptop,
  Tablet,
  Phone,
  Bot,
  ExternalLink,
  Copy,
  RefreshCw,
  X,
} from 'lucide-react';

interface EditorViewProps {
  project: Project;
  isNewProject?: boolean;
  onSaveProject: (updated: Project) => void;
  onBackToDashboard: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  project,
  isNewProject = false,
  onSaveProject,
  onBackToDashboard,
}) => {
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const [techStackInput, setTechStackInput] = useState<string>((project.techStack || []).join(', '));
  const [isDirty, setIsDirty] = useState<boolean>(isNewProject);
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('info');
  const [activeViewport, setActiveViewport] = useState<DevicePreviewViewport>('desktop');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysisScreenId, setAiAnalysisScreenId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>(isNewProject ? 'Unsaved draft' : 'Saved to local storage');

  const updateCurrentProject = (updated: Project) => {
    setCurrentProject(updated);
    setIsDirty(true);
    setSaveStatus('Unsaved changes');
  };

  const handleTechStackInputChange = (text: string) => {
    setTechStackInput(text);
    const parsed = text.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = { ...currentProject, techStack: parsed };
    updateCurrentProject(updated);
  };

  const handleSave = () => {
    onSaveProject(currentProject);
    setIsDirty(false);
    setSaveStatus('Saved to local storage');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  const handleBackClick = () => {
    if (isDirty || isNewProject) {
      setShowDiscardModal(true);
    } else {
      onBackToDashboard();
    }
  };

  // Local helper to update project fields
  const handleProjectFieldChange = (field: keyof Project, value: any) => {
    const updated = { ...currentProject, [field]: value };
    updateCurrentProject(updated);
  };

  const handleLinksChange = (linkField: string, value: string) => {
    const updated = {
      ...currentProject,
      links: { ...currentProject.links, [linkField]: value },
    };
    updateCurrentProject(updated);
  };

  const handleDeviceConfigChange = (configField: keyof DeviceConfig, value: any) => {
    const updated = {
      ...currentProject,
      deviceConfig: { ...currentProject.deviceConfig, [configField]: value },
    };
    updateCurrentProject(updated);
  };

  const handleShowcaseFieldChange = (field: keyof ShowcaseContent, value: any) => {
    const updatedShowcase = {
      ...currentProject.showcase,
      [field]: value,
    };
    updateCurrentProject({ ...currentProject, showcase: updatedShowcase });
  };

  const handleAddCapability = () => {
    const newCap: FeatureCard = {
      id: 'feat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: 'New Capability',
      description: 'Description of key technical feature or UX capability.',
      iconName: 'Zap',
    };
    const updatedFeatures = [...(currentProject.showcase.features || []), newCap];
    handleShowcaseFieldChange('features', updatedFeatures);
  };

  const handleUpdateCapability = (id: string, field: keyof FeatureCard, value: any) => {
    const updatedFeatures = (currentProject.showcase.features || []).map((f) =>
      f.id === id ? { ...f, [field]: value } : f
    );
    handleShowcaseFieldChange('features', updatedFeatures);
  };

  const handleDeleteCapability = (id: string) => {
    const updatedFeatures = (currentProject.showcase.features || []).filter((f) => f.id !== id);
    handleShowcaseFieldChange('features', updatedFeatures);
  };

  // Multiple File / Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newScreens: AppScreen[] = [];
    let processed = 0;

    Array.from(files).forEach((file: File, idx: number) => {
      // Basic image size validation (limit 10MB per screen image)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const screenId = 'scr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
          newScreens.push({
            id: screenId,
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            description: 'Uploaded mobile screen ready for showcase.',
            imageUrl: result,
            order: (currentProject.screens ? currentProject.screens.length : 0) + idx,
            category: 'UI View',
          });
        }
        processed++;
        if (processed === files.length) {
          const updatedScreens = [...(currentProject.screens || []), ...newScreens];
          updateCurrentProject({ ...currentProject, screens: updatedScreens });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Reorder screen item
  const handleMoveScreen = (index: number, direction: 'up' | 'down') => {
    const screens = [...(currentProject.screens || [])];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === screens.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = screens[index];
    screens[index] = screens[targetIdx];
    screens[targetIdx] = temp;

    // re-assign order
    screens.forEach((s, idx) => (s.order = idx));
    updateCurrentProject({ ...currentProject, screens });
  };

  const handleDeleteScreen = (screenId: string) => {
    const screens = (currentProject.screens || []).filter((s) => s.id !== screenId);
    screens.forEach((s, idx) => (s.order = idx));
    updateCurrentProject({ ...currentProject, screens });
  };

  const handleUpdateScreenDetails = (screenId: string, field: keyof AppScreen, value: any) => {
    const screens = (currentProject.screens || []).map((s) => (s.id === screenId ? { ...s, [field]: value } : s));
    updateCurrentProject({ ...currentProject, screens });
  };

  // AI Vision Analysis for single screenshot
  const handleAiAnalyzeScreen = async (screen: AppScreen) => {
    try {
      setAiAnalysisScreenId(screen.id);
      const res = await fetch('/api/ai/analyze-screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: screen.imageUrl,
          appName: currentProject.name,
          appCategory: currentProject.category,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const { screenTitle, category, description, keyFeatures } = data.analysis;
        const screens = (currentProject.screens || []).map((s) =>
          s.id === screen.id
            ? {
                ...s,
                title: screenTitle || s.title,
                category: category || s.category,
                description: description || s.description,
                aiExtractedFeatures: keyFeatures || [],
                aiAnalysisDone: true,
              }
            : s
        );
        updateCurrentProject({ ...currentProject, screens });
      }
    } catch (err) {
      console.error('Failed to analyze screen:', err);
    } finally {
      setAiAnalysisScreenId(null);
    }
  };

  // AI Full Showcase Copywriter Generator
  const handleAiGenerateShowcase = async () => {
    try {
      setIsAiLoading(true);
      const res = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentProject.name,
          tagline: currentProject.tagline,
          description: currentProject.description,
          category: currentProject.category,
          techStack: currentProject.techStack,
          screens: currentProject.screens,
        }),
      });

      const data = await res.json();
      if (data.success && data.showcase) {
        const updatedShowcase = {
          ...currentProject.showcase,
          heroTitle: data.showcase.heroTitle || currentProject.showcase.heroTitle,
          heroTagline: data.showcase.heroTagline || currentProject.showcase.heroTagline,
          overviewSummary: data.showcase.overviewSummary || currentProject.showcase.overviewSummary,
          features: data.showcase.features || currentProject.showcase.features,
          userFlow: data.showcase.userFlow || currentProject.showcase.userFlow,
          architectureNotes: data.showcase.architectureNotes || currentProject.showcase.architectureNotes,
        };
        updateCurrentProject({ ...currentProject, showcase: updatedShowcase });
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Failed to generate AI showcase copy:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Trigger export handlers
  const handleExportHTML = () => {
    const html = ExportService.generateHTML(currentProject);
    ExportService.downloadFile(`${currentProject.name.toLowerCase().replace(/\s+/g, '-')}-showcase.html`, html, 'text/html');
    confetti({ particleCount: 70, spread: 70 });
  };

  const handleExportMarkdown = () => {
    const md = ExportService.generateMarkdown(currentProject);
    ExportService.downloadFile(`${currentProject.name.toLowerCase().replace(/\s+/g, '-')}-README.md`, md, 'text/markdown');
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(currentProject, null, 2);
    ExportService.downloadFile(`${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.screencraft`, json, 'application/json');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Workspace Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackClick}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 transition flex items-center gap-2 text-xs font-bold shadow-sm"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentProject.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                {currentProject.category}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDirty || isNewProject ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <span>{saveStatus}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isDirty || isNewProject
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 animate-pulse'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
            title="Save Project to Browser Storage"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isDirty || isNewProject ? 'Save Project' : 'Project Saved'}</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview Showcase</span>
          </button>
        </div>
      </header>

      {/* Editor Body with Left Tab Sidebar & Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigation Tabs */}
        <nav className="w-full md:w-60 bg-slate-900/60 border-r border-slate-800/80 p-3 space-y-1 shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>1. Project Details</span>
          </button>

          <button
            onClick={() => setActiveTab('screenshots')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition whitespace-nowrap ${
              activeTab === 'screenshots'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Screenshots ({currentProject.screens?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('device')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition whitespace-nowrap ${
              activeTab === 'device'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>3. Device Frame</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-copilot')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition whitespace-nowrap ${
              activeTab === 'ai-copilot'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>4. Gemini AI Copilot</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>5. Live Preview</span>
          </button>
        </nav>

        {/* Main Tab View Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* TAB 1: GENERAL INFO FORM */}
          {activeTab === 'info' && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Project Metadata Collector</h3>
                <p className="text-xs text-slate-400">
                  Configure essential project information, tech stack, theme color, and release repository links.
                </p>
              </div>

              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Project Name *</label>
                    <input
                      type="text"
                      value={currentProject.name}
                      onChange={(e) => handleProjectFieldChange('name', e.target.value)}
                      className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Category</label>
                    <select
                      value={currentProject.category}
                      onChange={(e) => handleProjectFieldChange('category', e.target.value)}
                      className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Finance">Finance</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Food & Drink">Food & Drink</option>
                      <option value="Social">Social</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="AI Tools">AI Tools</option>
                      <option value="Utilities">Utilities</option>
                    </select>
                  </div>
                </div>

                {/* Tagline */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Short Tagline</label>
                  <input
                    type="text"
                    value={currentProject.tagline}
                    onChange={(e) => handleProjectFieldChange('tagline', e.target.value)}
                    placeholder="e.g., AI-Powered Personal Fitness Tracker"
                    className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Full Description</label>
                  <textarea
                    rows={4}
                    value={currentProject.description}
                    onChange={(e) => handleProjectFieldChange('description', e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Primary Theme Color & Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Primary Brand Color</span>
                      <span className="font-mono text-slate-400 text-[11px]">{currentProject.primaryColor}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={currentProject.primaryColor}
                        onChange={(e) => handleProjectFieldChange('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-800 p-1"
                      />
                      {/* Presets */}
                      <div className="flex items-center gap-1.5">
                        {['#06B6D4', '#8B5CF6', '#F97316', '#6366F1', '#10B981', '#EC4899'].map((c) => (
                          <button
                            key={c}
                            onClick={() => handleProjectFieldChange('primaryColor', c)}
                            className="w-6 h-6 rounded-full border border-white/20 transition hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack comma separated */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => handleTechStackInputChange(e.target.value)}
                      placeholder="Flutter, Dart, GetX, Material 3"
                      className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* External Store & Repo Links */}
                <div className="pt-4 border-t border-slate-800/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">External Repository & Build Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-400">GitHub Repository URL</label>
                      <input
                        type="url"
                        value={currentProject.links.githubUrl || ''}
                        onChange={(e) => handleLinksChange('githubUrl', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full bg-slate-950 text-slate-200 text-xs px-3.5 py-2 rounded-lg border border-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-400">Direct APK Download URL</label>
                      <input
                        type="url"
                        value={currentProject.links.apkUrl || ''}
                        onChange={(e) => handleLinksChange('apkUrl', e.target.value)}
                        placeholder="https://github.com/.../release.apk"
                        className="w-full bg-slate-950 text-slate-200 text-xs px-3.5 py-2 rounded-lg border border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCREENSHOTS & REORDERING */}
          {activeTab === 'screenshots' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Screenshot Organizer & Upload</h3>
                  <p className="text-xs text-slate-400">
                    Upload mobile screenshots, reorder screens, edit captions, or analyze UI with Gemini AI.
                  </p>
                </div>

                {/* Upload Zone Button */}
                <label className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition cursor-pointer flex items-center gap-2 self-start sm:self-auto">
                  <Upload className="w-4 h-4" />
                  <span>Upload Screenshots</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Screens List */}
              {currentProject.screens.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-800 space-y-4">
                  <Upload className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-300">No screenshots uploaded yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Drag and drop or select multiple PNG/JPEG files from your mobile app builds.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentProject.screens.map((screen, idx) => (
                    <div
                      key={screen.id}
                      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col md:flex-row items-start md:items-center gap-6"
                    >
                      {/* Screen Thumbnail Frame */}
                      <div className="relative w-28 h-44 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0 shadow-lg">
                        <img
                          src={screen.imageUrl}
                          alt={screen.title}
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-800">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Screen Metadata Form */}
                      <div className="flex-1 space-y-3 w-full">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={screen.title}
                            onChange={(e) => handleUpdateScreenDetails(screen.id, 'title', e.target.value)}
                            placeholder="Screen Title"
                            className="bg-slate-950 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 flex-1"
                          />

                          <button
                            onClick={() => handleAiAnalyzeScreen(screen)}
                            disabled={aiAnalysisScreenId === screen.id}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                            title="Use Gemini AI Vision to analyze screen and auto-caption features"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {aiAnalysisScreenId === screen.id ? 'Analyzing...' : 'AI Analyze UI'}
                            </span>
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={screen.description}
                          onChange={(e) =>
                            handleUpdateScreenDetails(screen.id, 'description', e.target.value)
                          }
                          placeholder="Short description of user actions and features on this screen..."
                          className="w-full bg-slate-950 text-slate-300 text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                        />

                        {/* Extracted Bullets if available */}
                        {screen.aiExtractedFeatures && screen.aiExtractedFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {screen.aiExtractedFeatures.map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                              >
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reorder and Delete Actions */}
                      <div className="flex md:flex-col items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleMoveScreen(idx, 'up')}
                          disabled={idx === 0}
                          className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 border border-slate-800 transition"
                          title="Move Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveScreen(idx, 'down')}
                          disabled={idx === currentProject.screens.length - 1}
                          className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 border border-slate-800 transition"
                          title="Move Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScreen(screen.id)}
                          className="p-2 rounded-lg bg-slate-950 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                          title="Delete Screen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEVICE FRAME CUSTOMIZER */}
          {activeTab === 'device' && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Device Frame Customizer</h3>
                  <p className="text-xs text-slate-400">
                    Customize phone frame mockups, frame color, glare intensity, and notch style.
                  </p>
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
                  {/* Device Model */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Phone Model Chassis</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'iphone', label: 'iPhone 16 Pro' },
                        { id: 'pixel', label: 'Google Pixel 9' },
                        { id: 'samsung', label: 'Samsung S25' },
                        { id: 'flat', label: 'Minimal Flat' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => handleDeviceConfigChange('deviceType', d.id)}
                          className={`p-3 rounded-xl text-xs font-semibold border text-left transition ${
                            currentProject.deviceConfig.deviceType === d.id
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Body Color */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Metallic Frame Finish</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'titanium', label: 'Titanium' },
                        { id: 'black', label: 'Space Black' },
                        { id: 'silver', label: 'Silver White' },
                        { id: 'purple', label: 'Deep Purple' },
                        { id: 'gold', label: 'Desert Gold' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleDeviceConfigChange('color', c.id)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition ${
                            currentProject.deviceConfig.color === c.id
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Front Camera Cutout Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Front Camera Cutout Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'dynamic', label: 'Wide Island' },
                        { id: 'small', label: 'Small Island' },
                        { id: 'corner', label: 'Round on Corner' },
                        { id: 'center', label: 'Round in Center' },
                      ].map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleDeviceConfigChange('notchType', n.id)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition ${
                            currentProject.deviceConfig.notchType === n.id
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Effects Toggles */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <label className="flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer">
                      <span>Screen Glass Glare</span>
                      <input
                        type="checkbox"
                        checked={currentProject.deviceConfig.showGlare}
                        onChange={(e) => handleDeviceConfigChange('showGlare', e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-800 accent-indigo-600"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer">
                      <span>Device Drop Shadow</span>
                      <input
                        type="checkbox"
                        checked={currentProject.deviceConfig.showShadow}
                        onChange={(e) => handleDeviceConfigChange('showShadow', e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-800 accent-indigo-600"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Live Device Mockup Preview */}
              <div className="md:col-span-7 flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/80 min-h-[580px]">
                {currentProject.screens && currentProject.screens.length > 0 ? (
                  <DeviceFrame
                    imageSrc={currentProject.screens[0].imageUrl}
                    title={currentProject.screens[0].title}
                    config={currentProject.deviceConfig}
                    scale={0.95}
                  />
                ) : (
                  <div className="text-center text-slate-500 space-y-2">
                    <Smartphone className="w-12 h-12 mx-auto opacity-40" />
                    <p className="text-xs">Upload a screenshot in Tab 2 to view device mockup</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GEMINI AI COPILOT & EDITABLE SHOWCASE COPY */}
          {activeTab === 'ai-copilot' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bot className="w-6 h-6 text-indigo-400" />
                  <span>Gemini 2.5 AI & Showcase Copy Editor</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Generate showcase copy automatically with Gemini AI or edit any hero headline, overview text, and key capabilities manually below.
                </p>
              </div>

              {/* AI Auto-generator Card */}
              <div className="bg-gradient-to-tr from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-500/30 p-6 space-y-4 shadow-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">One-Click AI Copy Generation</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Gemini will analyze "{currentProject.name}" ({currentProject.techStack.join(', ')}) and uploaded screenshots to compose developer showcase copy.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAiGenerateShowcase}
                  disabled={isAiLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-xs md:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiLoading ? 'Gemini AI is Writing Showcase Copy...' : 'Generate Showcase Copy with Gemini AI'}</span>
                </button>
              </div>

              {/* Editable Showcase Content Fields */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Edit Showcase Copy & Overview</h4>

                <div className="space-y-5 text-xs text-slate-300">
                  {/* Hero Title */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 block">Hero Title Headline</label>
                    <input
                      type="text"
                      value={currentProject.showcase.heroTitle || ''}
                      onChange={(e) => handleShowcaseFieldChange('heroTitle', e.target.value)}
                      placeholder="e.g. Experience PulseFit Pro"
                      className="w-full bg-slate-950 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Hero Tagline */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 block">Hero Sub-Tagline</label>
                    <input
                      type="text"
                      value={currentProject.showcase.heroTagline || ''}
                      onChange={(e) => handleShowcaseFieldChange('heroTagline', e.target.value)}
                      placeholder="e.g. Seamless user experience built with Flutter & modern UI components."
                      className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Overview Summary */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 block">Project Overview Summary</label>
                    <textarea
                      rows={4}
                      value={currentProject.showcase.overviewSummary || ''}
                      onChange={(e) => handleShowcaseFieldChange('overviewSummary', e.target.value)}
                      placeholder="Write comprehensive technical insights and overview of the project..."
                      className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* Architecture & Technical Insights */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 block">Architecture & Technical Notes</label>
                    <textarea
                      rows={3}
                      value={currentProject.showcase.architectureNotes || ''}
                      onChange={(e) => handleShowcaseFieldChange('architectureNotes', e.target.value)}
                      placeholder="Clean Architecture with BLoC/GetX state management and modular UI components."
                      className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Key Capabilities Section Editor */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Key Capabilities Manager</h4>
                    <p className="text-xs text-slate-400">Add, edit, or remove key features and technical capabilities displayed on your preview website.</p>
                  </div>
                  <button
                    onClick={handleAddCapability}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Capability</span>
                  </button>
                </div>

                {(!currentProject.showcase.features || currentProject.showcase.features.length === 0) ? (
                  <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800 space-y-2">
                    <p className="text-xs text-slate-400">No Key Capabilities added yet.</p>
                    <button
                      onClick={handleAddCapability}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      + Add your first Key Capability
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentProject.showcase.features.map((feat) => (
                      <div
                        key={feat.id}
                        className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => handleUpdateCapability(feat.id, 'title', e.target.value)}
                            placeholder="Capability Title"
                            className="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 flex-1"
                          />
                          <button
                            onClick={() => handleDeleteCapability(feat.id)}
                            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                            title="Delete Capability"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={feat.description}
                          onChange={(e) => handleUpdateCapability(feat.id, 'description', e.target.value)}
                          placeholder="Short description of this capability..."
                          className="w-full bg-slate-900 text-slate-300 text-xs p-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500"
                        />

                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                          <span className="text-[11px] font-medium text-slate-400">Icon:</span>
                          <select
                            value={feat.iconName || 'Zap'}
                            onChange={(e) => handleUpdateCapability(feat.id, 'iconName', e.target.value)}
                            className="bg-slate-900 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none"
                          >
                            <option value="Zap">Zap (Lightning)</option>
                            <option value="Shield">Shield (Security)</option>
                            <option value="BarChart3">BarChart (Analytics)</option>
                            <option value="Sparkles">Sparkles (AI/Smart)</option>
                            <option value="Cpu">Cpu (Engine)</option>
                            <option value="Smartphone">Smartphone (UI)</option>
                            <option value="Activity">Activity (Performance)</option>
                            <option value="Globe">Globe (Network)</option>
                            <option value="CheckCircle">CheckCircle (Quality)</option>
                            <option value="TrendingUp">TrendingUp (Growth)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: LIVE MULTI-DEVICE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Viewport Switcher Header */}
              <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800 max-w-xl mx-auto">
                <span className="text-xs font-bold text-slate-400 pl-2">Device Viewport:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveViewport('desktop')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                      activeViewport === 'desktop'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Desktop (1440px)</span>
                  </button>

                  <button
                    onClick={() => setActiveViewport('tablet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                      activeViewport === 'tablet'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet (768px)</span>
                  </button>

                  <button
                    onClick={() => setActiveViewport('mobile')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                      activeViewport === 'mobile'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile (375px)</span>
                  </button>
                </div>
              </div>

              {/* Rendered Live Website Showcase or Viewport Placeholder */}
              {activeViewport !== 'desktop' ? (
                <div className="py-16 px-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800/80 max-w-xl mx-auto space-y-5 my-8 shadow-2xl">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto border border-indigo-500/20">
                    {activeViewport === 'tablet' ? (
                      <Tablet className="w-10 h-10" />
                    ) : (
                      <Phone className="w-10 h-10" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">
                      {activeViewport === 'tablet' ? 'Tablet (768px)' : 'Mobile (375px)'} Preview Coming Soon
                    </h4>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                      Interactive live preview for {activeViewport === 'tablet' ? 'Tablet' : 'Mobile'} viewports is currently under development. Currently we show the full Web / Desktop showcase experience.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveViewport('desktop')}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5"
                  >
                    Switch to Web / Desktop (1440px)
                  </button>
                </div>
              ) : (
                <ShowcaseView project={currentProject} viewport="desktop" />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-white">Unsaved Changes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isNewProject
                ? "This Flutter app project is an unsaved draft. Going back without saving will discard it from your projects."
                : "You have unsaved changes in this project. Do you want to save before returning to the dashboard?"}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowDiscardModal(false);
                  onBackToDashboard();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition"
              >
                Discard & Exit
              </button>
              <button
                onClick={() => {
                  handleSave();
                  setShowDiscardModal(false);
                  onBackToDashboard();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
