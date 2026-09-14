import { Project } from '../types';

/**
 * Converts a string into a clean, URL-safe slug.
 * Rules:
 * - lowercase
 * - spaces become hyphens
 * - remove non-alphanumeric chars (except hyphens)
 * - collapse multiple hyphens
 * - trim leading/trailing hyphens
 */
export function generateSlug(text: string): string {
  if (!text) return 'project';
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return clean || 'project';
}

/**
 * Ensures the generated slug is unique among existing projects.
 * If slug already exists for another project, appends -2, -3, etc.
 */
export function getUniqueSlug(
  titleOrSlug: string,
  existingProjects: Project[],
  currentProjectId?: string
): string {
  const baseSlug = generateSlug(titleOrSlug);
  let uniqueSlug = baseSlug;
  let counter = 2;

  while (
    existingProjects.some(
      (p) =>
        (p.slug === uniqueSlug || p.id === uniqueSlug) &&
        p.id !== currentProjectId
    )
  ) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
