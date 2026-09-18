import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
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
   * Fetch all projects from Cloud Firestore.
   */
  static async getProjects(): Promise<Project[]> {
    try {
      const colRef = collection(db, PROJECTS_COLLECTION);
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const projects: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        projects.push(mapDocToProject(docSnap));
      });
      return projects;
    } catch (err) {
      console.error('Error fetching projects from Firestore:', err);
      // Fallback query without orderBy if index is building
      const colRef = collection(db, PROJECTS_COLLECTION);
      const querySnapshot = await getDocs(colRef);
      const projects: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        projects.push(mapDocToProject(docSnap));
      });
      return projects;
    }
  }

  /**
   * Fetch a project by its document ID or public slug from Cloud Firestore.
   */
  static async getProjectBySlug(idOrSlug: string): Promise<Project | undefined> {
    if (!idOrSlug) return undefined;
    const cleanIdOrSlug = idOrSlug.trim().toLowerCase();

    try {
      const colRef = collection(db, PROJECTS_COLLECTION);

      // 1. Query by exact slug
      const slugQuery = query(colRef, where('slug', '==', cleanIdOrSlug));
      const slugSnap = await getDocs(slugQuery);
      if (!slugSnap.empty) {
        return mapDocToProject(slugSnap.docs[0]);
      }

      // 2. Direct document ID lookup
      const docRef = doc(db, PROJECTS_COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return mapDocToProject(docSnap);
      }

      // 3. Fallback: fetch all projects and match normalized ID or slug
      const allProjects = await this.getProjects();
      const norm = cleanIdOrSlug.replace(/[^a-z0-9]/g, '');
      return allProjects.find((p) => {
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
    } catch (err) {
      console.error('Error looking up project by slug in Firestore:', err);
      return undefined;
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
