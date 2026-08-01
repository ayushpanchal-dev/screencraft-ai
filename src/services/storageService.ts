import { Project, AppScreen } from '../types';
import { SEED_PROJECTS } from '../data/seedProjects';

const STORAGE_KEY = 'screencraft_ai_portfolio_user_projects_v2';
const OLD_STORAGE_KEY = 'screencraft_ai_projects_v1';

export class StorageService {
  static getProjects(): Project[] {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Migration check from old storage key if present, stripping sample seed items
        const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
        if (oldRaw) {
          try {
            const oldParsed = JSON.parse(oldRaw);
            if (Array.isArray(oldParsed)) {
              const seedIds = ['proj-pulsefit-01', 'proj-novapay-02', 'proj-health-03'];
              const filteredUserProjects = oldParsed.filter((p: Project) => !seedIds.includes(p.id));
              this.saveAllProjects(filteredUserProjects);
              return filteredUserProjects;
            }
          } catch (err) {
            console.error('Migration error:', err);
          }
        }
        // Default to clean empty list
        this.saveAllProjects([]);
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seedIds = ['proj-pulsefit-01', 'proj-novapay-02', 'proj-health-03'];
        const userOnly = parsed.filter((p: Project) => !seedIds.includes(p.id));
        return userOnly;
      }
      return [];
    } catch (e) {
      console.error('Failed to load projects from storage:', e);
      return [];
    }
  }

  static saveAllProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to storage:', e);
    }
  }

  static getProjectById(id: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find((p) => p.id === id);
  }

  static saveProject(project: Project): void {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const updatedProject: Project = {
      ...project,
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
    const newId = 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    return {
      id: newId,
      name: initialData?.name || 'My Flutter App',
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
