import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { Project } from './types';
import { StorageService } from './services/storageService';
import { FirebaseService } from './services/firebaseService';
import { subscribeToAuth, logoutAdmin } from './services/authService';
import { DashboardView } from './components/DashboardView';
import { EditorView } from './components/EditorView';
import { ShowcaseView } from './components/ShowcaseView';
import { CaseStudyView } from './components/CaseStudyView';
import { PrivateProjectView } from './components/PrivateProjectView';
import { NotFoundView } from './components/NotFoundView';
import { LoginView } from './components/LoginView';
import { MigrationModal } from './components/MigrationModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [isTargetLoading, setIsTargetLoading] = useState<boolean>(false);

  const [draftProject, setDraftProject] = useState<Project | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);
  const [showMigrationModal, setShowMigrationModal] = useState<boolean>(false);

  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [searchQueryString, setSearchQueryString] = useState<string>(window.location.search);

  // 1. Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((user, adminState) => {
      setCurrentUser(user);
      setIsAdmin(adminState);
      setIsAuthInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Check for legacy localStorage projects
  const refreshLocalProjects = useCallback(() => {
    const legacy = StorageService.getUserOnlyProjects();
    setLocalProjects(legacy);
  }, []);

  useEffect(() => {
    refreshLocalProjects();
  }, [refreshLocalProjects]);

  // 3. Sync state with URL location
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

  // 4. Fetch all projects from Firestore for Dashboard
  const fetchAllFirestoreProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const list = await FirebaseService.getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Error loading Firestore projects:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFirestoreProjects();
  }, [fetchAllFirestoreProjects]);

  const isFromPortfolio = new URLSearchParams(searchQueryString).get('source') === 'portfolio';

  // Parse path segments
  const cleanPath = currentPath.replace(/\/+$/, '') || '/';
  const pathParts = cleanPath.split('/').filter(Boolean);

  let viewType: 'dashboard' | 'project' | 'case-study' | 'private' | 'editor' | 'login' | 'not-found' = 'dashboard';
  let targetIdOrSlug: string | null = null;

  if (pathParts.length === 0) {
    viewType = 'dashboard';
  } else if (pathParts[0] === 'login') {
    viewType = 'login';
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
  } else if (pathParts.length === 1) {
    // Direct root path like /suraj-approval
    viewType = 'project';
    targetIdOrSlug = pathParts[0];
  } else {
    viewType = 'not-found';
  }

  // 5. Asynchronously fetch target project from Firestore by slug or ID when on detail route
  useEffect(() => {
    if (targetIdOrSlug) {
      let isMounted = true;
      setIsTargetLoading(true);
      FirebaseService.getProjectBySlug(targetIdOrSlug)
        .then((proj) => {
          if (isMounted) {
            setTargetProject(proj || null);
            setIsTargetLoading(false);
          }
        })
        .catch((err) => {
          console.error('Error fetching target project:', err);
          if (isMounted) {
            setTargetProject(null);
            setIsTargetLoading(false);
          }
        });
      return () => {
        isMounted = false;
      };
    } else {
      setTargetProject(null);
      setIsTargetLoading(false);
    }
  }, [targetIdOrSlug]);

  // CRUD Handlers
  const handleSelectProject = (projectId: string) => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    const p = projects.find((item) => item.id === projectId || item.slug === projectId);
    if (p) {
      setDraftProject(p);
      setIsNewProject(false);
      setActiveProjectId(p.id);
      navigate(`/editor/${p.slug || p.id}`);
    }
  };

  const handleCreateNewProject = () => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    const newDraft = StorageService.createDraftProject();
    setDraftProject(newDraft);
    setIsNewProject(true);
    setActiveProjectId(newDraft.id);
    navigate(`/editor/${newDraft.id}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!isAdmin) {
      alert('Only authorized admin users can delete projects.');
      return;
    }
    try {
      await FirebaseService.deleteProject(projectId);
      await fetchAllFirestoreProjects();
      if (activeProjectId === projectId) {
        setDraftProject(null);
        setIsNewProject(false);
        setActiveProjectId(null);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project: ' + (err.message || 'Firestore error'));
    }
  };

  const handleSaveProject = async (savedProject: Project) => {
    if (!isAdmin) {
      alert('Only authorized admin users can save changes.');
      return;
    }
    const saved = await FirebaseService.saveProject(savedProject);
    await fetchAllFirestoreProjects();
    setDraftProject(saved);
    setIsNewProject(false);
  };

  const handleBackToDashboard = () => {
    setDraftProject(null);
    setIsNewProject(false);
    setActiveProjectId(null);
    navigate('/');
  };

  const handleQuickPreview = (projectId: string) => {
    const p = projects.find((item) => item.id === projectId || item.slug === projectId);
    if (p) {
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

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
  };

  // Auth initializing screen
  if (isAuthInitializing) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Initializing ScreenCraft AI...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Migration Modal for Admin */}
      {isAdmin && (
        <MigrationModal
          localProjects={localProjects}
          isOpen={showMigrationModal}
          onClose={() => setShowMigrationModal(false)}
          onMigrationComplete={() => {
            refreshLocalProjects();
            fetchAllFirestoreProjects();
          }}
        />
      )}

      {/* 1. Login Route (/login) */}
      {viewType === 'login' && (
        <LoginView
          onSuccessLogin={() => {
            navigate('/');
            fetchAllFirestoreProjects();
          }}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* 2. Dashboard View (/) */}
      {viewType === 'dashboard' && (
        <DashboardView
          projects={projects}
          isAdmin={isAdmin}
          currentUserEmail={currentUser?.email}
          isLoadingProjects={isLoadingProjects}
          hasLocalProjects={localProjects.length > 0}
          onSelectProject={handleSelectProject}
          onCreateNewProject={handleCreateNewProject}
          onDeleteProject={handleDeleteProject}
          onQuickPreview={handleQuickPreview}
          onLoginClick={() => navigate('/login')}
          onLogoutClick={handleLogout}
          onOpenMigrationModal={() => setShowMigrationModal(true)}
        />
      )}

      {/* 3. Detail Route Loading Spinner */}
      {isTargetLoading && (viewType === 'project' || viewType === 'case-study' || viewType === 'private') && (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Loading project showcase from Firestore...</p>
        </div>
      )}

      {/* 4. Public Project Detail Route (/project/:slug) */}
      {!isTargetLoading && viewType === 'project' && targetProject && (
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

      {/* 5. Professional Case Study Route (/case-study/:slug) */}
      {!isTargetLoading && viewType === 'case-study' && targetProject && (
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

      {/* 6. Private Project Route (/private/:slug) */}
      {!isTargetLoading && viewType === 'private' && targetProject && (
        <PrivateProjectView
          project={targetProject}
          projectId={targetIdOrSlug || undefined}
          isFromPortfolio={isFromPortfolio}
          onBackToDashboard={handleBackToDashboard}
        />
      )}

      {/* 7. Protected Editor Workspace Route (/editor or /editor/:id) */}
      {viewType === 'editor' && (
        !isAdmin ? (
          <LoginView
            onSuccessLogin={() => fetchAllFirestoreProjects()}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : (
          <EditorView
            project={draftProject || targetProject || StorageService.createDraftProject()}
            isNewProject={isNewProject}
            onSaveProject={handleSaveProject}
            onBackToDashboard={handleBackToDashboard}
          />
        )
      )}

      {/* 8. Not Found View */}
      {!isTargetLoading && (
        (viewType === 'not-found') ||
        ((viewType === 'project' || viewType === 'case-study' || viewType === 'private') && !targetProject)
      ) && (
        <NotFoundView
          isFromPortfolio={isFromPortfolio}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}
