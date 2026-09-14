import React, { useState, useEffect, useCallback } from 'react';
import { Project, ViewMode } from './types';
import { StorageService } from './services/storageService';
import { DashboardView } from './components/DashboardView';
import { EditorView } from './components/EditorView';
import { ShowcaseView } from './components/ShowcaseView';
import { CaseStudyView } from './components/CaseStudyView';
import { PrivateProjectView } from './components/PrivateProjectView';
import { NotFoundView } from './components/NotFoundView';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [draftProject, setDraftProject] = useState<Project | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [searchQueryString, setSearchQueryString] = useState<string>(window.location.search);

  // Load stored projects on mount
  useEffect(() => {
    const loaded = StorageService.getProjects();
    setProjects(loaded);
  }, []);

  // Sync state with URL location
  const syncRouteWithLocation = useCallback(() => {
    setCurrentPath(window.location.pathname);
    setSearchQueryString(window.location.search);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', syncRouteWithLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteWithLocation);
    };
  }, [syncRouteWithLocation]);

  const navigate = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    syncRouteWithLocation();
  };

  const isFromPortfolio = new URLSearchParams(searchQueryString).get('source') === 'portfolio';

  // Parse path segments
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';
  const pathParts = cleanPath.split('/').filter(Boolean);

  let viewType: 'dashboard' | 'project' | 'case-study' | 'private' | 'editor' | 'not-found' = 'dashboard';
  let targetIdOrSlug: string | null = null;

  if (pathParts.length === 0) {
    viewType = 'dashboard';
  } else if (pathParts[0] === 'project' || pathParts[0] === 'projects') {
    viewType = 'project';
    targetIdOrSlug = pathParts[1] || null;
  } else if (pathParts[0] === 'case-study' || pathParts[0] === 'case-studies') {
    viewType = 'case-study';
    targetIdOrSlug = pathParts[1] || null;
  } else if (pathParts[0] === 'private') {
    viewType = 'private';
    targetIdOrSlug = pathParts[1] || null;
  } else if (pathParts[0] === 'editor') {
    viewType = 'editor';
    targetIdOrSlug = pathParts[1] || null;
  } else {
    // Check if direct root path (e.g. /suraj-approval) matches a project slug or ID
    const directMatch = StorageService.getProjectByIdOrSlug(pathParts[0]);
    if (directMatch) {
      viewType = 'project';
      targetIdOrSlug = pathParts[0];
    } else {
      viewType = 'not-found';
    }
  }

  // Lookup target project if ID/slug is in URL
  const targetProject = targetIdOrSlug ? StorageService.getProjectByIdOrSlug(targetIdOrSlug) : null;

  // CRUD Handlers
  const handleSelectProject = (projectId: string) => {
    const p = StorageService.getProjectByIdOrSlug(projectId);
    if (p) {
      setDraftProject(p);
      setIsNewProject(false);
      setActiveProjectId(p.id);
      navigate(`/editor/${p.slug || p.id}`);
    }
  };

  const handleCreateNewProject = () => {
    const newDraft = StorageService.createDraftProject();
    setDraftProject(newDraft);
    setIsNewProject(true);
    setActiveProjectId(newDraft.id);
    navigate(`/editor/${newDraft.id}`);
  };

  const handleDeleteProject = (projectId: string) => {
    StorageService.deleteProject(projectId);
    const updated = StorageService.getProjects();
    setProjects(updated);
    if (activeProjectId === projectId) {
      setDraftProject(null);
      setIsNewProject(false);
      setActiveProjectId(null);
      navigate('/');
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
    navigate('/');
  };

  const handleQuickPreview = (projectId: string) => {
    const p = StorageService.getProjectByIdOrSlug(projectId);
    if (p) {
      setDraftProject(p);
      setActiveProjectId(p.id);
      const slugOrId = p.slug || p.id;
      if (p.type === 'professional') {
        navigate(`/case-study/${slugOrId}`);
      } else if (p.type === 'private') {
        navigate(`/private/${slugOrId}`);
      } else {
        navigate(`/project/${slugOrId}`);
      }
    }
  };

  // Render view depending on URL route
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. Dashboard View */}
      {viewType === 'dashboard' && (
        <DashboardView
          projects={projects}
          onSelectProject={handleSelectProject}
          onCreateNewProject={handleCreateNewProject}
          onDeleteProject={handleDeleteProject}
          onQuickPreview={handleQuickPreview}
        />
      )}

      {/* 2. Public Project Detail Route (/project/:id) */}
      {viewType === 'project' && targetProject && (
        targetProject.type === 'professional' ? (
          <CaseStudyView
            project={targetProject}
            isFromPortfolio={isFromPortfolio}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : targetProject.type === 'private' ? (
          <PrivateProjectView
            project={targetProject}
            projectId={targetIdOrSlug || undefined}
            isFromPortfolio={isFromPortfolio}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <ShowcaseView
            project={targetProject}
            viewport="desktop"
            isStandalone
            isFromPortfolio={isFromPortfolio}
            onBackToDashboard={handleBackToDashboard}
          />
        )
      )}

      {/* 3. Professional Case Study Route (/case-study/:id) */}
      {viewType === 'case-study' && targetProject && (
        targetProject.type === 'private' ? (
          <PrivateProjectView
            project={targetProject}
            projectId={targetIdOrSlug || undefined}
            isFromPortfolio={isFromPortfolio}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <CaseStudyView
            project={targetProject}
            isFromPortfolio={isFromPortfolio}
            onBackToDashboard={handleBackToDashboard}
          />
        )
      )}

      {/* 4. Private Project Route (/private/:id) */}
      {viewType === 'private' && targetProject && (
        <PrivateProjectView
          project={targetProject}
          projectId={targetIdOrSlug || undefined}
          isFromPortfolio={isFromPortfolio}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* 5. Editor Workspace View (/editor or /editor/:id) */}
      {viewType === 'editor' && (
        <EditorView
          project={draftProject || targetProject || StorageService.createDraftProject()}
          isNewProject={isNewProject}
          onSaveProject={handleSaveProject}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* 6. Invalid / Missing Route or Project Not Found */}
      {(viewType === 'not-found' || ((viewType === 'project' || viewType === 'case-study' || viewType === 'private') && !targetProject)) && (
        <NotFoundView
          isFromPortfolio={isFromPortfolio}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}
