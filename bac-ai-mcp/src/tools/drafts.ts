import fs from 'fs';
import path from 'path';
import { getWorkspacePaths, assertSafePath, assertPayloadSize } from '../security.js';
import { McpNotFoundError, McpSecurityError } from '../types.js';

export function listDraftsHandler(args: {
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'ALL';
  subject?: string;
  contentType?: string;
  limit?: number;
}) {
  const paths = getWorkspacePaths();
  const filterStatus = args.status || 'ALL';
  const filterSubject = args.subject ? args.subject.toLowerCase() : null;
  const filterContentType = args.contentType ? args.contentType.toLowerCase() : null;
  const limit = args.limit || 20;

  if (!fs.existsSync(paths.draftsActiveDir)) {
    return { total: 0, returned: 0, drafts: [] };
  }

  const files = fs.readdirSync(paths.draftsActiveDir).filter((f) => f.endsWith('.json'));
  const drafts: any[] = [];

  for (const f of files) {
    const full = path.join(paths.draftsActiveDir, f);
    try {
      const data = JSON.parse(fs.readFileSync(full, 'utf8'));
      const status = data.status || 'DRAFT';
      if (filterStatus !== 'ALL' && status !== filterStatus) continue;
      if (filterSubject && (!data.subject || !data.subject.toLowerCase().includes(filterSubject))) continue;
      if (filterContentType && (!data.contentType || !data.contentType.toLowerCase().includes(filterContentType))) continue;

      drafts.push({
        draftId: data.draftId || f.replace('.json', ''),
        taskId: data.taskId || 'N/A',
        version: data.version || 1,
        status,
        subject: data.subject || 'Algorithmique et Programmation',
        chapter: data.chapter || '',
        contentType: data.contentType || 'COURS',
        totalPoints: data.totalPoints ?? 20,
        updatedAt: data.updatedAt || data.createdAt || 'N/A',
      });
    } catch {
      // ignore
    }
  }

  return {
    total: drafts.length,
    returned: Math.min(drafts.length, limit),
    drafts: drafts.slice(0, limit),
  };
}

export function readDraftHandler(args: { draftId: string }) {
  const paths = getWorkspacePaths();
  const targetFile = path.join(paths.draftsActiveDir, `${args.draftId}.json`);

  assertSafePath(targetFile, [paths.draftsActiveDir]);

  if (!fs.existsSync(targetFile)) {
    throw new McpNotFoundError(`Draft with ID "${args.draftId}" was not found in active drafts.`);
  }

  const raw = fs.readFileSync(targetFile, 'utf8');
  const draftData = JSON.parse(raw);

  return {
    draftId: draftData.draftId || args.draftId,
    taskId: draftData.taskId,
    version: draftData.version || 1,
    status: draftData.status || 'DRAFT',
    subject: draftData.subject,
    chapter: draftData.chapter,
    contentType: draftData.contentType,
    totalPoints: draftData.totalPoints,
    createdAt: draftData.createdAt,
    updatedAt: draftData.updatedAt,
    content: draftData,
  };
}

export function writeDraftHandler(args: {
  draftId: string;
  taskId: string;
  subject: string;
  chapter: string;
  contentType: 'COURS' | 'SERIE' | 'DEVOIR' | 'CORRIGE' | 'FICHE_SYNTHESE';
  totalPoints?: number;
  status: 'DRAFT' | 'PENDING_REVIEW';
  content: Record<string, any>;
}) {
  assertPayloadSize(args, 5 * 1024 * 1024); // max 5MB

  if ((args.status as string) === 'PUBLISHED' || (args.status as string) === 'APPROVED') {
    throw new McpSecurityError('Educational content cannot be approved or published via MCP. Autonomy Level 3 requires human teacher authorization.');
  }

  const paths = getWorkspacePaths();
  const targetFile = path.join(paths.draftsActiveDir, `${args.draftId}.json`);

  assertSafePath(targetFile, [paths.draftsActiveDir]);

  let version = 1;
  let backupPath: string | null = null;
  const now = new Date().toISOString();

  // If draft exists, enforce backup and version bump
  if (fs.existsSync(targetFile)) {
    try {
      const existingRaw = fs.readFileSync(targetFile, 'utf8');
      const existing = JSON.parse(existingRaw);
      const existingVersion = existing.version || 1;
      version = existingVersion + 1;

      // Create backup in backups directory
      if (!fs.existsSync(paths.draftsBackupsDir)) {
        fs.mkdirSync(paths.draftsBackupsDir, { recursive: true });
      }

      const backupFilename = `BACKUP-${args.draftId}-v${existingVersion}-${Date.now()}.json`;
      const backupFull = path.join(paths.draftsBackupsDir, backupFilename);
      fs.writeFileSync(backupFull, existingRaw, 'utf8');
      backupPath = `content/drafts/backups/${backupFilename}`;
    } catch (err: any) {
      throw new Error(`Failed to create safety backup prior to draft update: ${err.message}`);
    }
  }

  const draftPayload = {
    ...args.content,
    schemaVersion: '1.0.0',
    draftId: args.draftId,
    taskId: args.taskId,
    subject: args.subject,
    chapter: args.chapter,
    contentType: args.contentType,
    totalPoints: args.totalPoints ?? 20,
    academicYear: '2026-2027',
    createdAt: fs.existsSync(targetFile) ? undefined : now,
    updatedAt: now,
    version,
    status: args.status,
  };

  if (!fs.existsSync(paths.draftsActiveDir)) {
    fs.mkdirSync(paths.draftsActiveDir, { recursive: true });
  }

  // Atomic write
  const tmpFile = path.join(paths.draftsActiveDir, `${args.draftId}.tmp.${Date.now()}`);
  fs.writeFileSync(tmpFile, JSON.stringify(draftPayload, null, 2), 'utf8');
  fs.renameSync(tmpFile, targetFile);

  return {
    success: true,
    draftId: args.draftId,
    version,
    status: args.status,
    backupCreated: !!backupPath,
    backupPath,
    path: `content/drafts/active/${args.draftId}.json`,
    updatedAt: now,
  };
}
