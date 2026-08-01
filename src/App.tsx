import React, { useState, useEffect } from 'react';
import { Project, ViewMode } from './types';
import { StorageService } from './services/storageService';
import { DashboardView } from './components/DashboardView';
import { EditorView } from './components/EditorView';
import { ShowcaseView } from './components/ShowcaseView';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [draftProject, setDraftProject] = useState<Project | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  // Load stored projects on mount
  useEffect(() => {
    const loaded = StorageService.getProjects();
    setProjects(loaded);
  }, []);

  // CRUD Handlers
  const handleSelectProject = (projectId: string) => {
    const p = projects.find((item) => item.id === projectId);
    if (p) {
      setDraftProject(p);
      setIsNewProject(false);
      setActiveProjectId(projectId);
      setViewMode('editor');
    }
  };

  const handleCreateNewProject = () => {
    const newDraft = StorageService.createDraftProject();
    setDraftProject(newDraft);
    setIsNewProject(true);
    setActiveProjectId(newDraft.id);
    setViewMode('editor');
  };

  const handleDeleteProject = (projectId: string) => {
    StorageService.deleteProject(projectId);
    const updated = StorageService.getProjects();
    setProjects(updated);
    if (activeProjectId === projectId) {
      setDraftProject(null);
      setIsNewProject(false);
      setActiveProjectId(null);
      setViewMode('dashboard');
    }
  };

  const handleSaveProject = (savedProject: Project) => {
    StorageService.saveProject(savedProject);
    const updatedList = StorageService.getProjects();
    setProjects(updatedList);
    setDraftProject(savedProject);
    setIsNewProject(false);
  };

  const handleBackToDashboard = () => {
    setDraftProject(null);
    setIsNewProject(false);
    setActiveProjectId(null);
    setViewMode('dashboard');
  };

  const handleQuickPreview = (projectId: string) => {
    const p = projects.find((item) => item.id === projectId);
    if (p) {
      setDraftProject(p);
      setActiveProjectId(projectId);
      setViewMode('standalone-preview');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Dashboard View */}
      {viewMode === 'dashboard' && (
        <DashboardView
          projects={projects}
          onSelectProject={handleSelectProject}
          onCreateNewProject={handleCreateNewProject}
          onDeleteProject={handleDeleteProject}
          onQuickPreview={handleQuickPreview}
        />
      )}

      {/* 2. Editor Workspace View */}
      {viewMode === 'editor' && draftProject && (
        <EditorView
          project={draftProject}
          isNewProject={isNewProject}
          onSaveProject={handleSaveProject}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* 3. Standalone Preview View */}
      {viewMode === 'standalone-preview' && draftProject && (
        <ShowcaseView
          project={draftProject}
          viewport="desktop"
          isStandalone
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}
