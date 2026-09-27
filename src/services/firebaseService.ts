import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { StorageService } from './storageService';
import { Project, AppScreen } from '../types';
import { generateSlug, getUniqueSlug } from '../utils/slugUtils';

const PROJECTS_COLLECTION = 'projects';

// Convert Firestore document snapshot to clean Project model
function mapDocToProject(docSnap: any): Project {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    slug: data.slug || docSnap.id,
    name: data.name || data.title || 'Untitled Project',
    tagline: data.tagline || '',
    description: data.description || data.fullDescription || '',
    category: data.category || 'Productivity',
    type: data.type || 'public',
    primaryColor: data.primaryColor || '#6366F1',
    secondaryColor: data.secondaryColor || '#3B82F6',
    techStack: data.techStack || [],
    links: data.links || {},
    screens: data.screens || [],
    deviceConfig: data.deviceConfig || {
      deviceType: 'iphone',
      color: 'titanium',
      showGlare: true,
      showShadow: true,
      notchType: 'dynamic',
      theme: 'dark',
    },
    showcase: data.showcase || {
      heroTitle: data.name || 'Showcase',
      heroTagline: data.tagline || '',
      overviewSummary: data.description || '',
      features: [],
      userFlow: [],
      milestones: [],
    },
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt || new Date().toISOString(),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt || new Date().toISOString(),
    isFavorite: Boolean(data.isFavorite),
  };
}

export class FirebaseService {
  /**
   * Fetch all projects from Cloud Firestore with local storage fallback.
   */
  static async getProjects(): Promise<Project[]> {
    if (!isFirebaseConfigured) {
      return StorageService.getProjects();
    }

    try {
      const colRef = collection(db, PROJECTS_COLLECTION);
      const querySnapshot = await getDocs(colRef);
      const projects: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        projects.push(mapDocToProject(docSnap));
      });
      projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return projects;
    } catch (err) {
      console.warn('Error fetching projects from Firestore, falling back to local storage:', err);
      return StorageService.getProjects();
    }
  }

  /**
   * Fetch a project by slug or ID for any visitor (public access).
   */
  static async getPublicProjectBySlug(idOrSlug: string): Promise<Project | undefined> {
    if (!idOrSlug) return undefined;
    const cleanIdOrSlug = idOrSlug.trim().toLowerCase();

    if (!isFirebaseConfigured) {
      return StorageService.getProjectByIdOrSlug(idOrSlug);
    }

    try {
      const colRef = collection(db, PROJECTS_COLLECTION);

      // 1. Query by exact slug
      const slugQuery = query(colRef, where('slug', '==', cleanIdOrSlug), limit(1));
      const slugSnap = await getDocs(slugQuery);
      if (!slugSnap.empty) {
        console.log('[ScreenCraft AI] Public project found via slug query:', cleanIdOrSlug);
        return mapDocToProject(slugSnap.docs[0]);
      }

      // 2. Direct doc ID lookup
      const docRef = doc(db, PROJECTS_COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapDocToProject(docSnap);
      }

      // 3. Fallback: fetch all projects and match normalized ID or slug
      const allProjects = await this.getProjects();
      const norm = cleanIdOrSlug.replace(/[^a-z0-9]/g, '');
      const match = allProjects.find((p) => {
        if (p.id.toLowerCase() === cleanIdOrSlug) return true;
        if (p.slug && p.slug.toLowerCase() === cleanIdOrSlug) return true;
        const pSlugNorm = p.slug?.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pSlugNorm === norm) return true;
        const pIdNorm = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pIdNorm === norm) return true;
        const pNameNorm = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pNameNorm === norm) return true;
        return false;
      });

      if (match) return match;
      return StorageService.getProjectByIdOrSlug(idOrSlug);
    } catch (err: any) {
      const errorCode = err?.code || 'unknown-error';
      console.warn(`[ScreenCraft AI] Public project lookup error (${errorCode}):`, err.message || err);
      return StorageService.getProjectByIdOrSlug(idOrSlug);
    }
  }

  /**
   * Fetch a project by document ID or public slug from Cloud Firestore.
   * If caller is unauthenticated or isAdmin is false, uses getPublicProjectBySlug.
   */
  static async getProjectBySlug(idOrSlug: string, isAdmin: boolean = false): Promise<Project | undefined> {
    if (!idOrSlug) return undefined;

    if (!isAdmin) {
      return this.getPublicProjectBySlug(idOrSlug);
    }

    const cleanIdOrSlug = idOrSlug.trim().toLowerCase();

    if (!isFirebaseConfigured) {
      return StorageService.getProjectByIdOrSlug(idOrSlug);
    }

    try {
      const colRef = collection(db, PROJECTS_COLLECTION);

      // Admin query without type restriction
      const slugQuery = query(colRef, where('slug', '==', cleanIdOrSlug), limit(1));
      const slugSnap = await getDocs(slugQuery);
      if (!slugSnap.empty) {
        return mapDocToProject(slugSnap.docs[0]);
      }

      const docRef = doc(db, PROJECTS_COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapDocToProject(docSnap);
      }

      const allProjects = await this.getProjects();
      const norm = cleanIdOrSlug.replace(/[^a-z0-9]/g, '');
      const match = allProjects.find((p) => {
        if (p.id.toLowerCase() === cleanIdOrSlug) return true;
        if (p.slug && p.slug.toLowerCase() === cleanIdOrSlug) return true;
        const pSlugNorm = p.slug?.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pSlugNorm === norm) return true;
        const pIdNorm = p.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pIdNorm === norm) return true;
        const pNameNorm = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (pNameNorm === norm) return true;
        return false;
      });

      if (match) return match;
      return StorageService.getProjectByIdOrSlug(idOrSlug);
    } catch (err: any) {
      const errorCode = err?.code || 'unknown-error';
      console.warn(`[ScreenCraft AI] Admin project lookup error (${errorCode}):`, err.message || err);
      return StorageService.getProjectByIdOrSlug(idOrSlug);
    }
  }

  /**
   * Fetch project by exact ID.
   */
  static async getProjectById(id: string): Promise<Project | undefined> {
    return this.getProjectBySlug(id);
  }

  /**
   * Check if a slug is already taken by another project.
   */
  static async isSlugTaken(slug: string, currentProjectId?: string): Promise<boolean> {
    const colRef = collection(db, PROJECTS_COLLECTION);
    const q = query(colRef, where('slug', '==', slug.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return false;
    if (currentProjectId) {
      return snap.docs.some((d) => d.id !== currentProjectId);
    }
    return true;
  }

  /**
   * Save (create or update) a project in Cloud Firestore.
   */
  static async saveProject(project: Project): Promise<Project> {
    const existingProjects = await this.getProjects();

    const finalSlug = project.slug && project.slug.trim() !== ''
      ? generateSlug(project.slug)
      : getUniqueSlug(project.name, existingProjects, project.id);

    // Double check duplicate slug
    const slugConflict = await this.isSlugTaken(finalSlug, project.id);
    const validatedSlug = slugConflict
      ? getUniqueSlug(finalSlug, existingProjects, project.id)
      : finalSlug;

    const projectData = {
      ...project,
      slug: validatedSlug,
      updatedAt: new Date().toISOString(),
      updatedAtTimestamp: serverTimestamp(),
    };

    const docRef = doc(db, PROJECTS_COLLECTION, project.id);
    await setDoc(docRef, projectData, { merge: true });

    return { ...project, slug: validatedSlug };
  }

  /**
   * Delete project document from Cloud Firestore.
   */
  static async deleteProject(id: string): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
  }
}
