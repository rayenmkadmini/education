import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { McpSecurityError } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface WorkspacePaths {
  workspaceRoot: string;
  knowledgeDir: string;
  tasksPendingDir: string;
  tasksCompletedDir: string;
  draftsActiveDir: string;
  draftsBackupsDir: string;
  docsDir: string;
  reportsDir: string;
  logsDir: string;
  catalogJsonPath: string;
  studioDir: string;
}

/**
 * Resolves and verifies canonical paths within BAC AI Tunisia workspace.
 */
export function getWorkspacePaths(overrideRoot?: string): WorkspacePaths {
  const root = overrideRoot || process.env.BAC_AI_WORKSPACE_ROOT || path.resolve(__dirname, '../..');
  const canonicalRoot = path.resolve(root);

  return {
    workspaceRoot: canonicalRoot,
    knowledgeDir: path.resolve(canonicalRoot, 'bac info cours exam resourse'),
    tasksPendingDir: path.resolve(canonicalRoot, 'content/tasks/pending'),
    tasksCompletedDir: path.resolve(canonicalRoot, 'content/tasks/completed'),
    draftsActiveDir: path.resolve(canonicalRoot, 'content/drafts/active'),
    draftsBackupsDir: path.resolve(canonicalRoot, 'content/drafts/backups'),
    docsDir: path.resolve(canonicalRoot, 'docs'),
    reportsDir: path.resolve(canonicalRoot, 'content/reports'),
    logsDir: path.resolve(canonicalRoot, 'bac-ai-mcp/logs'),
    catalogJsonPath: path.resolve(canonicalRoot, 'content/knowledge-catalog.json'),
    studioDir: path.resolve(canonicalRoot, 'bac-ai-studio'),
  };
}

/**
 * Blacklisted file substrings and patterns that must NEVER be accessed through MCP.
 */
const FORBIDDEN_PATH_PATTERNS = [
  /\.env(\.|$)/i,
  /\.git(\/|\\|$)/i,
  /\.vercel(\/|\\|$)/i,
  /node_modules(\/|\\|$)/i,
  /id_rsa/i,
  /id_ed25519/i,
  /\.pem$/i,
  /\.key$/i,
  /\.pfx$/i,
  /credentials/i,
  /shadow$/i,
  /passwd$/i,
];

/**
 * Ensures a relative or absolute path does not escape allowed workspace directories
 * and does not point to forbidden sensitive files.
 */
export function assertSafePath(targetPath: string, allowedRoots: string[]): string {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new McpSecurityError('Path must be a non-empty string.');
  }

  // Check for null bytes or carriage returns
  if (targetPath.includes('\0') || targetPath.includes('\r')) {
    throw new McpSecurityError('Path contains invalid control characters.');
  }

  // Resolve normalized absolute path
  const normalized = path.normalize(targetPath);
  const resolved = path.resolve(normalized);

  // Check against forbidden patterns
  for (const pattern of FORBIDDEN_PATH_PATTERNS) {
    if (pattern.test(resolved) || pattern.test(targetPath)) {
      throw new McpSecurityError(`Access to sensitive path pattern is strictly denied: ${pattern}`);
    }
  }

  // Check if target is inside at least one allowed root
  const isAllowed = allowedRoots.some((allowedRoot) => {
    const canonicalAllowed = path.resolve(allowedRoot);
    return resolved === canonicalAllowed || resolved.startsWith(canonicalAllowed + path.sep);
  });

  if (!isAllowed) {
    throw new McpSecurityError(`Path traversal detected: target path "${resolved}" escapes allowed directories.`);
  }

  // Symlink resolution check (prevent symlink breakout)
  if (fs.existsSync(resolved)) {
    try {
      const real = fs.realpathSync.native ? fs.realpathSync.native(resolved) : fs.realpathSync(resolved);
      const isRealAllowed = allowedRoots.some((allowedRoot) => {
        const canonicalAllowed = path.resolve(allowedRoot);
        return real === canonicalAllowed || real.startsWith(canonicalAllowed + path.sep);
      });
      if (!isRealAllowed) {
        throw new McpSecurityError(`Symlink target "${real}" escapes allowed directories.`);
      }
    } catch {
      // If realpath fails, allow normal processing if file exists
    }
  }

  return resolved;
}

/**
 * Strictly prevents any write operation to the read-only knowledge repository.
 */
export function assertNotKnowledgeRepo(targetPath: string, paths: WorkspacePaths): void {
  const resolved = path.resolve(targetPath);
  const canonicalKnowledge = path.resolve(paths.knowledgeDir);
  if (resolved === canonicalKnowledge || resolved.startsWith(canonicalKnowledge + path.sep)) {
    throw new McpSecurityError('The knowledge repository is strictly READ-ONLY. No write or delete operations are permitted.');
  }
}

/**
 * Redacts common sensitive tokens, keys, and credentials from output.
 */
export function redactSensitiveData(input: string): string {
  if (!input || typeof input !== 'string') return input;

  return input
    .replace(/(SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY|API_KEY|SECRET_KEY|TOKEN|PASSWORD|BEARER)\s*[:=]\s*['"]?([a-zA-Z0-9_\-\.]{10,})['"]?/gi, '$1=[REDACTED_SECRET]')
    .replace(/ey[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, '[REDACTED_JWT_TOKEN]')
    .replace(/-----BEGIN (RSA|EC|OPENSSH|DSA|PGP)? PRIVATE KEY-----[\s\S]*?-----END \1 PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]')
    .replace(/(postgres|mysql|mongodb|redis):\/\/[^:\s]+:[^@\s]+@[^\s]+/gi, '$1://[REDACTED_CREDENTIALS]@host');
}

/**
 * Deep redaction for JSON objects.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return redactSensitiveData(obj) as unknown as T;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObject(item)) as unknown as T;
  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('secret') ||
        lowerKey.includes('password') ||
        lowerKey.includes('token') ||
        lowerKey.includes('apikey') ||
        lowerKey.includes('auth') ||
        lowerKey.includes('credential')
      ) {
        sanitized[key] = '[REDACTED_SECRET]';
      } else {
        sanitized[key] = sanitizeObject(val);
      }
    }
    return sanitized as T;
  }
  return obj;
}

/**
 * Payload size check.
 */
export function assertPayloadSize(payload: unknown, maxBytes: number = 5 * 1024 * 1024): void {
  const json = JSON.stringify(payload);
  const size = Buffer.byteLength(json, 'utf8');
  if (size > maxBytes) {
    throw new McpSecurityError(`Payload size (${size} bytes) exceeds maximum permitted limit (${maxBytes} bytes).`);
  }
}
