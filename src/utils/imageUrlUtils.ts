import { AppScreen } from '../types';

/**
 * Extracts Google Drive file ID from various Google Drive sharing URL formats.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const cleanUrl = url.trim();

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID or thumbnail?id=FILE_ID
  const idParamMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Pattern 3: https://lh3.googleusercontent.com/d/FILE_ID
  const lh3Match = cleanUrl.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) {
    return lh3Match[1];
  }

  // Pattern 4: /d/FILE_ID path
  const dMatch = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }

  return null;
}

/**
 * Converts a raw image URL or Google Drive sharing link into a browser-renderable image URL.
 * Never throws exceptions. Returns original URL or empty string if input is invalid.
 */
export function getRenderableImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  try {
    // If it's a data URL or base64 data, return as-is
    if (trimmed.startsWith('data:image/')) {
      return trimmed;
    }

    // Check if it's a Google Drive link
    const driveFileId = extractGoogleDriveFileId(trimmed);
    if (driveFileId) {
      // Return high-resolution direct Google Drive renderable image link
      return `https://lh3.googleusercontent.com/d/${driveFileId}`;
    }

    return trimmed;
  } catch (err) {
    console.warn('Error parsing renderable image URL:', err);
    return trimmed;
  }
}

/**
 * Resolves a screen image URL supporting new imageUrl field as well as legacy fallbacks.
 */
export function getScreenImageUrl(screen?: Partial<AppScreen> | null): string {
  if (!screen) return '';

  // 1. Preferred field: imageUrl
  if (screen.imageUrl && screen.imageUrl.trim() !== '') {
    return getRenderableImageUrl(screen.imageUrl);
  }

  // 2. Legacy Firebase Storage URL fallback
  if (screen.firebaseStorageUrl && screen.firebaseStorageUrl.trim() !== '') {
    return screen.firebaseStorageUrl.trim();
  }

  // 3. Legacy base64 / dataUrl fallback
  const anyScreen = screen as any;
  if (anyScreen.dataUrl && typeof anyScreen.dataUrl === 'string') {
    return anyScreen.dataUrl.trim();
  }
  if (anyScreen.base64 && typeof anyScreen.base64 === 'string') {
    return anyScreen.base64.trim();
  }

  return '';
}

/**
 * Validates user input for new screenshot image URLs.
 */
export function validateImageUrl(url: string): { isValid: boolean; message?: string } {
  if (!url || !url.trim()) {
    return { isValid: false, message: 'Image URL cannot be empty.' };
  }

  const trimmed = url.trim();

  if (trimmed.startsWith('data:image/')) {
    return {
      isValid: false,
      message: 'Base64 data URLs are not supported for new screens. Please provide a Google Drive sharing link or external HTTPS image URL.',
    };
  }

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return {
      isValid: false,
      message: 'Image URL must start with http:// or https://',
    };
  }

  return { isValid: true };
}
