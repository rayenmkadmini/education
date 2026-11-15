import { z } from 'zod';

/**
 * Autonomy policy levels as specified in BAC AI Tunisia Security Architecture:
 * - LEVEL_1: Read-only operations, safe to execute automatically.
 * - LEVEL_2: Controlled local write operations (new tasks, drafts with backup).
 * - LEVEL_3: Strictly human-supervised actions (publish, git, deploy, external networks).
 */
export enum AutonomyLevel {
  LEVEL_1 = 'LEVEL_1_AUTOMATIC',
  LEVEL_2 = 'LEVEL_2_LOCAL_PROTECTED_WRITE',
  LEVEL_3 = 'LEVEL_3_HUMAN_APPROVAL_MANDATORY',
}

/**
 * Custom MCP error classes for fine-grained security and validation handling.
 */
export class McpSecurityError extends Error {
  constructor(message: string) {
    super(`[MCP-SECURITY-VIOLATION] ${message}`);
    this.name = 'McpSecurityError';
  }
}

export class McpValidationError extends Error {
  constructor(message: string) {
    super(`[MCP-VALIDATION-ERROR] ${message}`);
    this.name = 'McpValidationError';
  }
}

export class McpNotFoundError extends Error {
  constructor(message: string) {
    super(`[MCP-NOT-FOUND] ${message}`);
    this.name = 'McpNotFoundError';
  }
}

// ==========================================
// Zod Schemas for Tool Arguments
// ==========================================

export const GetProjectStatusSchema = z.object({}).strict();

export const SearchKnowledgeSchema = z.object({
  query: z.string().max(200).optional().describe('Text query to match filename, subject, or extracted text snippets'),
  subject: z.string().max(100).optional().describe('Subject filter, e.g. "Algorithmique et Programmation"'),
  classification: z.string().max(100).optional().describe('Classification, e.g. "OFFICIAL_EXAM", "OFFICIAL_TEXTBOOK", "SUPPLEMENTARY_EXAM"'),
  isOfficialOnly: z.boolean().optional().describe('Filter only official ministry documents'),
  limit: z.number().int().min(1).max(100).default(20).describe('Max results to return (1-100)'),
}).strict();

export const ReadKnowledgeFileSchema = z.object({
  documentId: z.string().regex(/^DOC-[A-F0-9]{16}$/, 'Invalid document ID format. Must match DOC-[A-F0-9]{16}').describe('Approved knowledge catalog document ID'),
}).strict();

export const ListTasksSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'ALL']).default('ALL').describe('Task status filter'),
  subject: z.string().max(100).optional().describe('Filter by subject'),
  contentType: z.string().max(50).optional().describe('Filter by content type (e.g. COURS, SERIE, DEVOIR)'),
  limit: z.number().int().min(1).max(50).default(20).describe('Max results to return'),
}).strict();

export const GetTaskSchema = z.object({
  taskId: z.string().regex(/^[A-Za-z0-9_-]{3,64}$/, 'Invalid task ID format').describe('Unique task identifier'),
}).strict();

export const ListDraftsSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'ALL']).default('ALL').describe('Draft status filter'),
  subject: z.string().max(100).optional().describe('Subject filter'),
  contentType: z.string().max(50).optional().describe('Content type filter'),
  limit: z.number().int().min(1).max(50).default(20).describe('Max results to return'),
}).strict();

export const ReadDraftSchema = z.object({
  draftId: z.string().regex(/^[A-Za-z0-9_-]{3,64}$/, 'Invalid draft ID format').describe('Unique draft identifier, e.g. DRAFT-COURS-BACSI-2026-409671'),
}).strict();

export const GetQualityReportSchema = z.object({
  reportName: z.string().regex(/^[A-Za-z0-9_.-]{3,100}$/, 'Invalid report name format').optional().describe('Specific report name (e.g. PILOT_01_V4_CURRICULUM_COMPLIANCE_AUDIT.md). Omit to list all available reports.'),
}).strict();

export const GetAuditLogSchema = z.object({
  limit: z.number().int().min(1).max(200).default(50).describe('Number of recent audit entries to retrieve'),
  action: z.string().max(50).optional().describe('Optional filter by action name'),
}).strict();

export const CreateTaskSchema = z.object({
  taskId: z.string().regex(/^(BACSI-\d{4}-\d{6}|MCP-INTEGRATION-TEST-[A-Za-z0-9_-]+)$/, 'Task ID must follow BACSI-YYYY-XXXXXX or MCP-INTEGRATION-TEST-XXXXXX format').describe('Unique task ID'),
  subject: z.string().min(2).max(100).describe('Subject, e.g. "Algorithmique et Programmation"'),
  chapter: z.string().min(2).max(150).describe('Curriculum chapter'),
  contentType: z.enum(['COURS', 'SERIE', 'DEVOIR', 'CORRIGE', 'FICHE_SYNTHESE']).describe('Educational material type'),
  instructions: z.string().min(10).max(50000).describe('Pedagogical task prompt and instructions'),
  durationMinutes: z.number().int().min(15).max(300).default(120),
  totalPoints: z.number().min(5).max(20).default(20),
  difficulty: z.enum(['INITIATION', 'STANDARD', 'BAC_OFFICIEL', 'EXCELLENCE']).default('BAC_OFFICIEL'),
  sourceReferences: z.array(z.object({
    fileName: z.string().max(255),
    pageRange: z.string().max(50).optional(),
    conceptNote: z.string().max(1000).optional(),
  })).min(1).describe('At least one verified knowledge source reference'),
}).strict();

export const WriteDraftSchema = z.object({
  draftId: z.string().regex(/^[A-Za-z0-9_-]{3,64}$/, 'Invalid draft ID format').describe('Draft identifier, e.g. DRAFT-COURS-BACSI-2026-409671'),
  taskId: z.string().regex(/^[A-Za-z0-9_-]{3,64}$/, 'Invalid task ID format').describe('Associated task ID'),
  subject: z.string().min(2).max(100).describe('Subject'),
  chapter: z.string().min(2).max(150).describe('Chapter'),
  contentType: z.enum(['COURS', 'SERIE', 'DEVOIR', 'CORRIGE', 'FICHE_SYNTHESE']).describe('Type'),
  totalPoints: z.number().min(0).max(100).default(20),
  status: z.enum(['DRAFT', 'PENDING_REVIEW']).default('DRAFT').describe('Strictly DRAFT or PENDING_REVIEW. Publishing is not permitted via MCP.'),
  content: z.record(z.any()).describe('The structured educational JSON content of the draft'),
}).strict();

export const RunQualityChecksSchema = z.object({
  target: z.enum(['test', 'lint', 'build', 'typecheck', 'compliance']).describe('Predefined, whitelisted check target'),
}).strict();
