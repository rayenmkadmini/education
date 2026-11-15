import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import {
  AutonomyLevel,
  McpSecurityError,
  McpValidationError,
  McpNotFoundError,
  GetProjectStatusSchema,
  SearchKnowledgeSchema,
  ReadKnowledgeFileSchema,
  ListTasksSchema,
  GetTaskSchema,
  ListDraftsSchema,
  ReadDraftSchema,
  GetQualityReportSchema,
  GetAuditLogSchema,
  CreateTaskSchema,
  WriteDraftSchema,
  RunQualityChecksSchema,
} from './types.js';
import { AuditLogger, defaultAuditLogger } from './audit.js';
import { getProjectStatusHandler } from './tools/project-status.js';
import { searchKnowledgeHandler, readKnowledgeFileHandler } from './tools/knowledge.js';
import { listTasksHandler, getTaskHandler, createTaskHandler } from './tools/tasks.js';
import { listDraftsHandler, readDraftHandler, writeDraftHandler } from './tools/drafts.js';
import { getQualityReportHandler } from './tools/reports.js';
import { getAuditLogHandler } from './tools/audit-tool.js';
import { runQualityChecksHandler } from './tools/quality.js';

export interface ServerOptions {
  actor?: 'stdio' | 'http';
  auditLogger?: AuditLogger;
}

export function createMcpServer(options: ServerOptions = {}) {
  const actor = options.actor || 'stdio';
  const logger = options.auditLogger || defaultAuditLogger;

  const server = new Server(
    {
      name: 'bac-ai-tunisia-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List of all 12 tools specifications
  const TOOLS = [
    {
      name: 'get_project_status',
      description:
        'Retrieve the BAC AI Tunisia project structure, workflow metrics, catalog statistics, active drafts count, and autonomy policies. Safe read-only discovery.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'search_knowledge',
      description:
        'Search the read-only BAC AI Tunisia knowledge catalog (71 official textbooks, national exams, and exercises). Supports filtering by keyword query, subject, classification, and official status.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search keywords across filename, subject, and text snippets' },
          subject: { type: 'string', description: 'Subject filter, e.g. "Algorithmique et Programmation"' },
          classification: { type: 'string', description: 'Classification, e.g. "OFFICIAL_EXAM", "OFFICIAL_TEXTBOOK"' },
          isOfficialOnly: { type: 'boolean', description: 'Return only official ministry documents' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'read_knowledge_file',
      description:
        'Read an approved knowledge document by its catalog ID (e.g. DOC-805A06468A481293). Enforces read-only knowledge repository security boundaries and returns document metadata and extracted content.',
      inputSchema: {
        type: 'object',
        properties: {
          documentId: { type: 'string', pattern: '^DOC-[A-F0-9]{16}$', description: 'Catalog ID of the document' },
        },
        required: ['documentId'],
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'list_tasks',
      description:
        'List educational content tasks across pending and completed queues with optional filtering by status, subject, and content type.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'ALL'], default: 'ALL' },
          subject: { type: 'string' },
          contentType: { type: 'string' },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
        },
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'get_task',
      description:
        'Retrieve a specific educational task definition by its validated task ID (e.g. BACSI-2026-409671).',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'Task ID (alphanumeric with hyphens/underscores)' },
        },
        required: ['taskId'],
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'list_drafts',
      description:
        'List active educational content drafts (Courses, Series, Devoirs, Corrigés) with version, review status, points, and subject filters.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['DRAFT', 'PENDING_REVIEW', 'ALL'], default: 'ALL' },
          subject: { type: 'string' },
          contentType: { type: 'string' },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 20 },
        },
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'read_draft',
      description:
        'Read an active educational draft by its validated draft ID (e.g. DRAFT-COURS-BACSI-2026-409671). Returns its version, status, and full pedagogical JSON content.',
      inputSchema: {
        type: 'object',
        properties: {
          draftId: { type: 'string', description: 'Draft identifier' },
        },
        required: ['draftId'],
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'get_quality_report',
      description:
        'List available quality/audit reports or read a specific audit report (e.g. PILOT_01_V4_CURRICULUM_COMPLIANCE_AUDIT.md) from the docs directory.',
      inputSchema: {
        type: 'object',
        properties: {
          reportName: { type: 'string', description: 'Name of the report markdown file (omit to list all)' },
        },
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'get_audit_log',
      description:
        'Retrieve recent MCP operations from the append-only security audit log. Guaranteed to contain zero secrets, tokens, or credentials.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
          action: { type: 'string', description: 'Optional action filter' },
        },
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_1,
    },
    {
      name: 'create_task',
      description:
        'Create a new educational task in the pending queue (content/tasks/pending). Validates task schema, rejects duplicate IDs, and performs atomic write with audit logging.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string', pattern: '^(BACSI-\\d{4}-\\d{6}|MCP-INTEGRATION-TEST-[A-Za-z0-9_-]+)$', description: 'Unique task ID' },
          subject: { type: 'string', description: 'Educational subject' },
          chapter: { type: 'string', description: 'Curriculum chapter' },
          contentType: { type: 'string', enum: ['COURS', 'SERIE', 'DEVOIR', 'CORRIGE', 'FICHE_SYNTHESE'] },
          instructions: { type: 'string', description: 'Pedagogical instructions' },
          durationMinutes: { type: 'integer', default: 120 },
          totalPoints: { type: 'number', default: 20 },
          difficulty: { type: 'string', default: 'BAC_OFFICIEL' },
          sourceReferences: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                fileName: { type: 'string' },
                pageRange: { type: 'string' },
                conceptNote: { type: 'string' },
              },
              required: ['fileName'],
            },
          },
        },
        required: ['taskId', 'subject', 'chapter', 'contentType', 'instructions', 'sourceReferences'],
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_2,
    },
    {
      name: 'write_draft',
      description:
        'Create or update an educational draft in content/drafts/active. Enforces automatic backup creation prior to updates, increments version number, validates draft schema, and strictly restricts status to DRAFT or PENDING_REVIEW (publishing is prohibited via MCP).',
      inputSchema: {
        type: 'object',
        properties: {
          draftId: { type: 'string', description: 'Draft identifier' },
          taskId: { type: 'string', description: 'Associated task ID' },
          subject: { type: 'string' },
          chapter: { type: 'string' },
          contentType: { type: 'string', enum: ['COURS', 'SERIE', 'DEVOIR', 'CORRIGE', 'FICHE_SYNTHESE'] },
          totalPoints: { type: 'number', default: 20 },
          status: { type: 'string', enum: ['DRAFT', 'PENDING_REVIEW'], default: 'DRAFT' },
          content: { type: 'object', description: 'Pedagogical JSON payload' },
        },
        required: ['draftId', 'taskId', 'subject', 'chapter', 'contentType', 'content'],
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_2,
    },
    {
      name: 'run_quality_checks',
      description:
        'Execute predefined, whitelisted studio quality checks (test, lint, build, typecheck, compliance) with sandboxed arguments, 60-second timeout, and output sanitization. No arbitrary commands allowed.',
      inputSchema: {
        type: 'object',
        properties: {
          target: { type: 'string', enum: ['test', 'lint', 'build', 'typecheck', 'compliance'] },
        },
        required: ['target'],
        additionalProperties: false,
      },
      autonomyLevel: AutonomyLevel.LEVEL_2,
    },
  ];

  // Register tools list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    };
  });

  // Register tool execution handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const toolDef = TOOLS.find((t) => t.name === name);

    if (!toolDef) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    const startTime = Date.now();
    let status: 'SUCCESS' | 'DENIED' | 'ERROR' = 'SUCCESS';
    let details: Record<string, any> = { tool: name };

    try {
      let resultData: any;

      switch (name) {
        case 'get_project_status': {
          GetProjectStatusSchema.parse(rawArgs || {});
          resultData = getProjectStatusHandler();
          break;
        }

        case 'search_knowledge': {
          const validated = SearchKnowledgeSchema.parse(rawArgs || {});
          details = { ...details, query: validated.query, subject: validated.subject };
          resultData = searchKnowledgeHandler(validated);
          break;
        }

        case 'read_knowledge_file': {
          const validated = ReadKnowledgeFileSchema.parse(rawArgs || {});
          details = { ...details, documentId: validated.documentId };
          resultData = readKnowledgeFileHandler(validated);
          break;
        }

        case 'list_tasks': {
          const validated = ListTasksSchema.parse(rawArgs || {});
          details = { ...details, status: validated.status };
          resultData = listTasksHandler(validated);
          break;
        }

        case 'get_task': {
          const validated = GetTaskSchema.parse(rawArgs || {});
          details = { ...details, taskId: validated.taskId };
          resultData = getTaskHandler(validated);
          break;
        }

        case 'list_drafts': {
          const validated = ListDraftsSchema.parse(rawArgs || {});
          details = { ...details, status: validated.status };
          resultData = listDraftsHandler(validated);
          break;
        }

        case 'read_draft': {
          const validated = ReadDraftSchema.parse(rawArgs || {});
          details = { ...details, draftId: validated.draftId };
          resultData = readDraftHandler(validated);
          break;
        }

        case 'get_quality_report': {
          const validated = GetQualityReportSchema.parse(rawArgs || {});
          details = { ...details, reportName: validated.reportName };
          resultData = getQualityReportHandler(validated);
          break;
        }

        case 'get_audit_log': {
          const validated = GetAuditLogSchema.parse(rawArgs || {});
          details = { ...details, limit: validated.limit, actionFilter: validated.action };
          resultData = getAuditLogHandler(validated, logger);
          break;
        }

        case 'create_task': {
          const validated = CreateTaskSchema.parse(rawArgs || {});
          details = { ...details, taskId: validated.taskId, contentType: validated.contentType };
          resultData = createTaskHandler(validated);
          break;
        }

        case 'write_draft': {
          const validated = WriteDraftSchema.parse(rawArgs || {});
          details = { ...details, draftId: validated.draftId, taskId: validated.taskId };
          resultData = writeDraftHandler(validated);
          break;
        }

        case 'run_quality_checks': {
          const validated = RunQualityChecksSchema.parse(rawArgs || {});
          details = { ...details, target: validated.target };
          resultData = await runQualityChecksHandler(validated);
          break;
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Tool implementation not registered: ${name}`);
      }

      logger.log({
        action: name,
        actor,
        autonomyLevel: toolDef.autonomyLevel,
        status: 'SUCCESS',
        details,
        durationMs: Date.now() - startTime,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resultData, null, 2),
          },
        ],
      };
    } catch (err: any) {
      const durationMs = Date.now() - startTime;

      if (err instanceof McpSecurityError) {
        status = 'DENIED';
        logger.log({
          action: name,
          actor,
          autonomyLevel: toolDef.autonomyLevel,
          status,
          details: { ...details, error: err.message },
          durationMs,
        });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `SECURITY VIOLATION: ${err.message}`,
            },
          ],
        };
      }

      status = 'ERROR';
      logger.log({
        action: name,
        actor,
        autonomyLevel: toolDef.autonomyLevel,
        status,
        details: { ...details, error: err.message },
        durationMs,
      });

      if (err instanceof McpValidationError || err.name === 'ZodError') {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `VALIDATION ERROR: ${err.message}`,
            },
          ],
        };
      }

      if (err instanceof McpNotFoundError) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `NOT FOUND: ${err.message}`,
            },
          ],
        };
      }

      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `INTERNAL ERROR: ${err.message}`,
          },
        ],
      };
    }
  });

  return server;
}
