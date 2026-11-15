import fs from 'fs';
import path from 'path';
import { getWorkspacePaths, assertSafePath, assertPayloadSize } from '../security.js';
import { McpNotFoundError, McpValidationError } from '../types.js';

export function listTasksHandler(args: {
  status?: 'PENDING' | 'COMPLETED' | 'ALL';
  subject?: string;
  contentType?: string;
  limit?: number;
}) {
  const paths = getWorkspacePaths();
  const filterStatus = args.status || 'ALL';
  const filterSubject = args.subject ? args.subject.toLowerCase() : null;
  const filterContentType = args.contentType ? args.contentType.toLowerCase() : null;
  const limit = args.limit || 20;

  const tasks: any[] = [];

  const readDir = (dir: string, st: 'PENDING' | 'COMPLETED') => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    for (const f of files) {
      const full = path.join(dir, f);
      try {
        const data = JSON.parse(fs.readFileSync(full, 'utf8'));
        const taskStatus = data.status || st;
        if (filterStatus !== 'ALL' && taskStatus !== filterStatus) continue;
        if (filterSubject && (!data.subject || !data.subject.toLowerCase().includes(filterSubject))) continue;
        if (filterContentType && (!data.contentType || !data.contentType.toLowerCase().includes(filterContentType))) continue;

        tasks.push({
          taskId: data.taskId || f.replace('.json', ''),
          status: taskStatus,
          subject: data.subject,
          chapter: data.chapter,
          contentType: data.contentType,
          durationMinutes: data.durationMinutes,
          totalPoints: data.totalPoints,
          createdAt: data.createdAt,
          sourceReferencesCount: Array.isArray(data.sourceReferences) ? data.sourceReferences.length : 0,
        });
      } catch {
        // ignore unreadable files
      }
    }
  };

  if (filterStatus === 'ALL' || filterStatus === 'PENDING') {
    readDir(paths.tasksPendingDir, 'PENDING');
  }
  if (filterStatus === 'ALL' || filterStatus === 'COMPLETED') {
    readDir(paths.tasksCompletedDir, 'COMPLETED');
  }

  return {
    total: tasks.length,
    returned: Math.min(tasks.length, limit),
    tasks: tasks.slice(0, limit),
  };
}

export function getTaskHandler(args: { taskId: string }) {
  const paths = getWorkspacePaths();
  const pendingFile = path.join(paths.tasksPendingDir, `${args.taskId}.json`);
  const completedFile = path.join(paths.tasksCompletedDir, `${args.taskId}.json`);

  assertSafePath(pendingFile, [paths.tasksPendingDir]);
  assertSafePath(completedFile, [paths.tasksCompletedDir]);

  let targetFile: string | null = null;
  let status = 'PENDING';

  if (fs.existsSync(pendingFile)) {
    targetFile = pendingFile;
    status = 'PENDING';
  } else if (fs.existsSync(completedFile)) {
    targetFile = completedFile;
    status = 'COMPLETED';
  }

  if (!targetFile) {
    throw new McpNotFoundError(`Task with ID "${args.taskId}" was not found in pending or completed task directories.`);
  }

  const raw = fs.readFileSync(targetFile, 'utf8');
  const taskData = JSON.parse(raw);
  taskData.status = taskData.status || status;

  return taskData;
}

export function createTaskHandler(args: {
  taskId: string;
  subject: string;
  chapter: string;
  contentType: 'COURS' | 'SERIE' | 'DEVOIR' | 'CORRIGE' | 'FICHE_SYNTHESE';
  instructions: string;
  durationMinutes?: number;
  totalPoints?: number;
  difficulty?: string;
  sourceReferences: Array<{ fileName: string; pageRange?: string; conceptNote?: string }>;
}) {
  assertPayloadSize(args, 1024 * 1024); // max 1MB for task

  const paths = getWorkspacePaths();
  const targetFile = path.join(paths.tasksPendingDir, `${args.taskId}.json`);
  const completedFile = path.join(paths.tasksCompletedDir, `${args.taskId}.json`);

  assertSafePath(targetFile, [paths.tasksPendingDir]);

  // Reject duplicate task IDs
  if (fs.existsSync(targetFile) || fs.existsSync(completedFile)) {
    throw new McpValidationError(`Task with ID "${args.taskId}" already exists. Duplicate task creation is rejected.`);
  }

  const taskPayload = {
    schemaVersion: '1.0.0',
    taskId: args.taskId,
    createdAt: new Date().toISOString(),
    contentType: args.contentType,
    subject: args.subject,
    chapter: args.chapter,
    academicYear: '2026-2027',
    level: "4ème Année Secondaire — Sciences de l'Informatique",
    durationMinutes: args.durationMinutes || 120,
    totalPoints: args.totalPoints || 20,
    difficulty: args.difficulty || 'BAC_OFFICIEL',
    language: 'fr_tn_derja',
    generationMode: 'STRICT_SOURCE_GROUNDED',
    sourceReferences: args.sourceReferences,
    instructions: args.instructions,
    expectedOutputStructure: {
      format: 'JSON',
      targetPath: `content/drafts/active/DRAFT-${args.contentType}-${args.taskId}.json`,
      requireMarkingScheme: true,
      requirePythonValidation: true,
    },
    status: 'PENDING',
    version: 1,
  };

  // Atomic write: write to temporary file in same directory, then rename
  if (!fs.existsSync(paths.tasksPendingDir)) {
    fs.mkdirSync(paths.tasksPendingDir, { recursive: true });
  }

  const tmpFile = path.join(paths.tasksPendingDir, `${args.taskId}.tmp.${Date.now()}`);
  fs.writeFileSync(tmpFile, JSON.stringify(taskPayload, null, 2), { encoding: 'utf8' });
  fs.renameSync(tmpFile, targetFile);

  return {
    success: true,
    taskId: args.taskId,
    status: 'PENDING',
    createdAt: taskPayload.createdAt,
    path: `content/tasks/pending/${args.taskId}.json`,
  };
}
