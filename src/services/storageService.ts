import { Project, AppScreen } from '../types';
import { SEED_PROJECTS } from '../data/seedProjects';
import { generateSlug, getUniqueSlug } from '../utils/slugUtils';

const STORAGE_KEY = 'screencraft_ai_portfolio_user_projects_v2';
const OLD_STORAGE_KEY = 'screencraft_ai_projects_v1';

export class StorageService {
  static getProjects(): Project[] {
    try {
      let projects: Project[] = [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          projects = parsed;
        }
      }

      // Migration: Ensure every project has a valid slug
      let needsSave = false;
      projects = projects.map((p) => {
        if (!p.slug || p.slug.trim() === '') {
          needsSave = true;
          return {
            ...p,
            slug: getUniqueSlug(p.name, projects, p.id),
          };
        }
        return p;
      });

      if (needsSave) {
        this.saveAllProjects(projects);
      }

      return projects;
    } catch (e) {
      console.error('Failed to load projects from storage:', e);
      return [];
    }
  }

  static getUserOnlyProjects(): Project[] {
    return this.getProjects();
  }

  static saveAllProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to storage:', e);
    }
  }

  static getProjectByIdOrSlug(idOrSlug: string): Project | undefined {
    if (!idOrSlug) return undefined;
    const norm = idOrSlug.trim().toLowerCase();
    const cleanNorm = norm.replace(/[^a-z0-9]/g, '');

    const projects = this.getProjects();
    
    // 1. Exact ID match
    let found = projects.find((p) => p.id === idOrSlug);
    if (found) return found;

    // 2. Exact slug match
    found = projects.find((p) => p.slug === idOrSlug);
    if (found) return found;

    // 3. Case-insensitive ID or slug match
    found = projects.find(
      (p) =>
        p.id.toLowerCase() === norm ||
        (p.slug && p.slug.toLowerCase() === norm)
    );
    if (found) return found;

    // 4. Normalized alphanumeric match
    return projects.find((p) => {
      const pIdClean = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pIdClean === cleanNorm) return true;

      const pSlugClean = p.slug?.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pSlugClean === cleanNorm) return true;

      const pNameClean = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pNameClean === cleanNorm) return true;

      return false;
    });
  }

  static getProjectById(id: string): Project | undefined {
    return this.getProjectByIdOrSlug(id);
  }

  static saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    
    const validatedSlug = project.slug && project.slug.trim() !== ''
      ? generateSlug(project.slug)
      : getUniqueSlug(project.name, projects, project.id);

    const updatedProject: Project = {
      ...project,
      slug: validatedSlug,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      projects[index] = updatedProject;
    } else {
      projects.unshift(updatedProject);
    }
    this.saveAllProjects(projects);
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveAllProjects(projects);
  }

  static createDraftProject(initialData?: Partial<Project>): Project {
    const existingProjects = this.getProjects();
    const newId = 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const initialName = initialData?.name || 'My Flutter App';
    const initialSlug = initialData?.slug
      ? generateSlug(initialData.slug)
      : getUniqueSlug(initialName, existingProjects, newId);

    return {
      id: newId,
      slug: initialSlug,
      name: initialName,
      tagline: initialData?.tagline || 'Interactive Mobile Showcase & Portfolio Case Study',
      description: initialData?.description || 'A high-performance mobile application built with Flutter & Material 3.',
      category: initialData?.category || 'Productivity',
      primaryColor: initialData?.primaryColor || '#6366F1',
      secondaryColor: '#3B82F6',
      techStack: initialData?.techStack || ['Flutter', 'Dart', 'GetX', 'Material 3'],
      links: {
        githubUrl: '',
        apkUrl: '',
        playStoreUrl: '',
        appStoreUrl: '',
        websiteUrl: '',
      },
      screens: [],
      deviceConfig: {
        deviceType: 'iphone',
        color: 'titanium',
        showGlare: true,
        showShadow: true,
        notchType: 'dynamic',
        theme: 'dark',
      },
      showcase: {
        heroTitle: initialData?.name ? `Experience ${initialData.name}` : 'My Flutter Application',
        heroTagline: initialData?.tagline || 'Seamless user experience built with Flutter & modern UI components.',
        overviewSummary: initialData?.description || 'Designed for high performance and clean architecture across mobile devices.',
        features: [
          {
            id: 'feat-init-1',
            title: 'Intuitive Navigation',
            description: 'Smooth screen transitions and responsive mobile controls.',
            iconName: 'Smartphone',
          },
          {
            id: 'feat-init-2',
            title: 'Reactive Flutter Engine',
            description: 'Sub-second response time and reactive state binding.',
            iconName: 'Zap',
          },
          {
            id: 'feat-init-3',
            title: 'Offline Local Storage',
            description: 'Encrypted local database ensuring data privacy and offline support.',
            iconName: 'Shield',
          },
        ],
        userFlow: [
          { stepNumber: 1, title: 'Instant Onboarding', description: 'Get started in under 30 seconds.' },
          { stepNumber: 2, title: 'Explore Core Features', description: 'Access smart tools and customized workflows.' },
          { stepNumber: 3, title: 'Track Insights', description: 'Monitor metrics with high-resolution visual charts.' },
        ],
        milestones: [
          { id: 'm-init-1', title: 'Phase 1 Build', description: 'Core functionality and Flutter Material 3 design.', date: 'Current', status: 'completed' },
        ],
        architectureNotes: 'Clean Architecture with BLoC/GetX state management and modular UI components.',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static createNewProject(initialData?: Partial<Project>): Project {
    const newProject = this.createDraftProject(initialData);
    this.saveProject(newProject);
    return newProject;
  }

  static resetToDefaults(): Project[] {
    this.saveAllProjects([]);
    return [];
  }

  static exportProjectsToJson(projects?: Project[]): string {
    const list = projects || this.getProjects();
    return JSON.stringify(list, null, 2);
  }

  static importProjectsFromJson(jsonString: string): Project[] {
    try {
      const parsed = JSON.parse(jsonString);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const validItems: Project[] = items.filter((item) => item.id && item.name);
      if (validItems.length === 0) throw new Error('No valid projects found in JSON');

      const existing = this.getProjects();
      const merged = [...validItems, ...existing.filter((e) => !validItems.some((v) => v.id === e.id))];
      this.saveAllProjects(merged);
      return merged;
    } catch (e: any) {
      throw new Error('Invalid project JSON file: ' + e.message);
    }
  }
}
