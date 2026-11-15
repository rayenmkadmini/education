import fs from 'fs';
import path from 'path';

/**
 * Robustly discovers the workspace root (e.g. D:\EDUCATION RAYEN or /mnt/d/EDUCATION RAYEN)
 * whether executed from inside bac-ai-studio or from the repository root.
 */
export function getWorkspaceRoot(): string {
  let cur = process.cwd();
  while (cur !== path.dirname(cur)) {
    if (fs.existsSync(path.join(cur, 'bac info cours exam resourse')) && fs.existsSync(path.join(cur, 'bac-ai-studio'))) {
      return cur;
    }
    cur = path.dirname(cur);
  }
  return process.cwd();
}

// Root directory for all persistent content: <WORKSPACE_ROOT>/content
// Tests may redirect this to an isolated sandbox via the BAC_AI_CONTENT_ROOT environment variable.
export const CONTENT_ROOT = process.env.BAC_AI_CONTENT_ROOT
  ? path.resolve(process.env.BAC_AI_CONTENT_ROOT)
  : path.resolve(getWorkspaceRoot(), 'content');

export const ALLOWED_SUBDIRECTORIES = [
  'tasks/pending',
  'tasks/completed',
  'drafts/active',
  'drafts/backups',
  'reviews',
  'published',
  'knowledge-catalog'
] as const;

export type AllowedSubdir = typeof ALLOWED_SUBDIRECTORIES[number];

/**
 * Validates and sanitizes an ID (e.g. BACSI-2026-000001, draft-algo-01).
 * Strictly forbids path traversal characters like '/', '\', '..', ':', etc.
 */
export function sanitizeId(id: string): string {
  if (!id || typeof id !== 'string') {
    throw new Error('Identifiant invalide: l\'ID doit être une chaîne non vide.');
  }

  // Only allow alphanumeric characters, hyphens, underscores, and single dots (no leading/trailing dot, no consecutive dots)
  const clean = id.trim();
  if (!/^[A-Za-z0-9_.-]+$/.test(clean) || clean.includes('..') || clean.startsWith('.') || clean.endsWith('.')) {
    throw new Error(`Identifiant invalide "${id}": seuls les caractères alphanumériques, tirets et underscores sont autorisés.`);
  }

  if (clean.length > 64) {
    throw new Error('Identifiant trop long: maximum 64 caractères.');
  }

  return clean;
}

/**
 * Resolves a safe file path within an authorized subdirectory under CONTENT_ROOT.
 * Enforces strict jail checks to prevent directory traversal.
 */
export function resolveSafePath(subdir: AllowedSubdir, id: string, extension: string = '.json'): string {
  const sanitizedId = sanitizeId(id);
  
  if (!extension.startsWith('.') || !/^\.[a-zA-Z0-9]+$/.test(extension)) {
    throw new Error(`Extension invalide "${extension}". Seules les extensions standard comme .json sont autorisées.`);
  }

  const filename = `${sanitizedId}${extension}`;
  const targetDir = path.resolve(CONTENT_ROOT, subdir);
  const resolvedPath = path.resolve(targetDir, filename);

  // Jail Boundary Check: resolvedPath MUST start with targetDir
  const relative = path.relative(targetDir, resolvedPath);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative !== filename) {
    throw new Error(`Violations de sécurité de chemin détectée (Path Traversal): "${id}"`);
  }

  // Ensure resolvedPath is strictly within CONTENT_ROOT
  const rootRelative = path.relative(CONTENT_ROOT, resolvedPath);
  if (rootRelative.startsWith('..') || path.isAbsolute(rootRelative)) {
    throw new Error('Accès refusé: tentative d\'accès en dehors de la racine de contenu.');
  }

  return resolvedPath;
}

/**
 * Generates a unique task identifier in official format:
 * BACSI-YYYY-XXXXXX (e.g. BACSI-2026-000001)
 */
export function generateUniqueTaskId(prefix: string = 'BACSI-2026'): string {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}-${randomSuffix}`;
}

/**
 * Generates a unique draft identifier:
 * DRAFT-YYYY-XXXXXX
 */
export function generateUniqueDraftId(prefix: string = 'DRAFT-2026'): string {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  return `${prefix}-${randomSuffix}`;
}

/**
 * Generates a unique review identifier:
 * REV-YYYY-XXXXXX
 */
export function generateUniqueReviewId(): string {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  return `REV-2026-${randomSuffix}`;
}

/**
 * Generates a unique publication identifier:
 * PUB-YYYY-XXXXXX
 */
export function generateUniquePublicationId(): string {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
  return `PUB-2026-${randomSuffix}`;
}
