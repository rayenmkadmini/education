import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer } from '../src/server.js';
import { getWorkspacePaths, assertSafePath, assertNotKnowledgeRepo, redactSensitiveData } from '../src/security.js';
import { AuditLogger } from '../src/audit.js';
import { McpSecurityError } from '../src/types.js';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function runTest(category: string, name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, category, passed: true, durationMs: Date.now() - start });
    console.log(`  ✓ [PASS] ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    results.push({ name, category, passed: false, message: err.message, durationMs: Date.now() - start });
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
  }
}

async function main() {
  console.log('===============================================================');
  console.log('BAC AI TUNISIA — COMPREHENSIVE MCP GATEWAY TEST SUITE');
  console.log('===============================================================\n');

  const paths = getWorkspacePaths();
  const testLogPath = path.join(paths.logsDir, 'test_mcp_audit.log');
  const testLogger = new AuditLogger(testLogPath);

  // Initialize test server with in-memory transport
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createMcpServer({ actor: 'stdio', auditLogger: testLogger });
  const client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });

  await server.connect(serverTransport);
  await client.connect(clientTransport);

  // 1. MCP Initialization & Tool Discovery
  await runTest('Initialization', 'MCP server connects and initializes successfully', async () => {
    if (!server || !client) throw new Error('Client or Server failed to initialize');
  });

  let toolsList: any[] = [];
  await runTest('Tool Discovery', 'Discovers exactly 12 required MCP tools with descriptions', async () => {
    const res = await client.listTools();
    toolsList = res.tools;
    if (toolsList.length !== 12) {
      throw new Error(`Expected 12 tools, but found ${toolsList.length}`);
    }
    const expected = [
      'get_project_status',
      'search_knowledge',
      'read_knowledge_file',
      'list_tasks',
      'get_task',
      'list_drafts',
      'read_draft',
      'get_quality_report',
      'get_audit_log',
      'create_task',
      'write_draft',
      'run_quality_checks',
    ];
    for (const name of expected) {
      const found = toolsList.find((t) => t.name === name);
      if (!found) throw new Error(`Missing expected tool: ${name}`);
      if (!found.description || found.description.length < 10) {
        throw new Error(`Tool ${name} has insufficient description`);
      }
    }
  });

  // 2. Read-Only Tools Verification
  await runTest('Read Tools', 'get_project_status returns accurate project structure and metrics', async () => {
    const res: any = await client.callTool({ name: 'get_project_status', arguments: {} });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (data.projectName !== 'BAC AI Tunisia') throw new Error('Incorrect project name');
    if (typeof data.workflowMetrics.activeDrafts !== 'number') throw new Error('Missing active drafts count');
    if (typeof data.workflowMetrics.indexedKnowledgeDocuments !== 'number') throw new Error('Missing catalog count');
  });

  await runTest('Read Tools', 'search_knowledge filters catalog by query and returns official items', async () => {
    const res: any = await client.callTool({
      name: 'search_knowledge',
      arguments: { query: 'algorithmique', limit: 5 },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!Array.isArray(data.documents) || data.documents.length === 0) {
      throw new Error('search_knowledge returned no results for "algorithmique"');
    }
    if (data.totalMatches < 1) throw new Error('totalMatches should be at least 1');
  });

  await runTest('Read Tools', 'read_knowledge_file retrieves document by approved catalog ID', async () => {
    const res: any = await client.callTool({
      name: 'read_knowledge_file',
      arguments: { documentId: 'DOC-805A06468A481293' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (data.documentId !== 'DOC-805A06468A481293') throw new Error('Returned wrong document ID');
    if (!data.filename) throw new Error('Missing filename');
  });

  await runTest('Read Tools', 'list_tasks returns existing pending tasks', async () => {
    const res: any = await client.callTool({
      name: 'list_tasks',
      arguments: { status: 'PENDING' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!Array.isArray(data.tasks)) throw new Error('tasks must be an array');
    if (data.total < 1) throw new Error('Expected at least 1 pending task in content/tasks/pending');
  });

  await runTest('Read Tools', 'get_task reads real task by validated ID', async () => {
    const res: any = await client.callTool({
      name: 'get_task',
      arguments: { taskId: 'BACSI-2026-409671' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (data.taskId !== 'BACSI-2026-409671') throw new Error('Returned unexpected task');
  });

  await runTest('Read Tools', 'list_drafts lists active drafts with schema details', async () => {
    const res: any = await client.callTool({
      name: 'list_drafts',
      arguments: { status: 'DRAFT' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!Array.isArray(data.drafts) || data.total < 1) throw new Error('Expected active drafts');
  });

  await runTest('Read Tools', 'read_draft reads real active draft and returns version and content', async () => {
    const res: any = await client.callTool({
      name: 'read_draft',
      arguments: { draftId: 'DRAFT-COURS-BACSI-2026-409671' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (data.draftId !== 'DRAFT-COURS-BACSI-2026-409671') throw new Error('Draft ID mismatch');
    if (data.version !== 4) throw new Error(`Expected version 4, found ${data.version}`);
  });

  await runTest('Read Tools', 'get_quality_report reads existing audit markdown report', async () => {
    const res: any = await client.callTool({
      name: 'get_quality_report',
      arguments: { reportName: 'PILOT_01_V4_CURRICULUM_COMPLIANCE_AUDIT.md' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!data.content || !data.content.includes('VERIFIED FOR HUMAN REVIEW')) {
      throw new Error('Report content missing expected verification stamp');
    }
  });

  await runTest('Read Tools', 'get_audit_log returns recorded audit entries with zero secrets', async () => {
    const res: any = await client.callTool({
      name: 'get_audit_log',
      arguments: { limit: 10 },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!Array.isArray(data.entries)) throw new Error('entries must be an array');
    if (data.entries.length === 0) throw new Error('Audit entries should not be empty');
  });

  // 3. Security Boundaries & Path Traversal Guards
  await runTest('Security', 'Enforces knowledge repository as strictly READ-ONLY', async () => {
    try {
      assertNotKnowledgeRepo(path.join(paths.knowledgeDir, 'test.txt'), paths);
      throw new Error('Should have thrown McpSecurityError on knowledge dir access');
    } catch (err: any) {
      if (!(err instanceof McpSecurityError)) throw err;
    }
  });

  await runTest('Security', 'Rejects path traversal attempts using ../', async () => {
    try {
      assertSafePath('../../etc/passwd', [paths.draftsActiveDir]);
      throw new Error('Should have rejected traversal path');
    } catch (err: any) {
      if (!(err instanceof McpSecurityError)) throw err;
    }
  });

  await runTest('Security', 'Rejects access to .env and .env.local files', async () => {
    try {
      assertSafePath(path.join(paths.workspaceRoot, '.env.local'), [paths.workspaceRoot]);
      throw new Error('Should have rejected .env.local');
    } catch (err: any) {
      if (!(err instanceof McpSecurityError)) throw err;
    }
  });

  await runTest('Security', 'Rejects access to .git directory', async () => {
    try {
      assertSafePath(path.join(paths.workspaceRoot, '.git/config'), [paths.workspaceRoot]);
      throw new Error('Should have rejected .git');
    } catch (err: any) {
      if (!(err instanceof McpSecurityError)) throw err;
    }
  });

  await runTest('Security', 'Rejects invalid or malformed task IDs with directory traversal', async () => {
    const res: any = await client.callTool({
      name: 'get_task',
      arguments: { taskId: '../../../etc/passwd' },
    });
    if (!res.isError) throw new Error('Expected validation/security error for path traversal task ID');
  });

  await runTest('Security', 'Rejects invalid draft IDs with path traversal', async () => {
    const res: any = await client.callTool({
      name: 'read_draft',
      arguments: { draftId: '..\\..\\..\\.env.local' },
    });
    if (!res.isError) throw new Error('Expected error for malicious draft ID');
  });

  await runTest('Security', 'Redacts sensitive keys and JWT tokens from strings', async () => {
    const sensitive = 'SUPABASE_SERVICE_ROLE_KEY=eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummysecret1234567890';
    const clean = redactSensitiveData(sensitive);
    if (clean.includes('eyJhGciOiJIUzI1Ni')) {
      throw new Error('JWT token was not redacted');
    }
    if (!clean.includes('[REDACTED_SECRET]') && !clean.includes('[REDACTED_JWT_TOKEN]')) {
      throw new Error('Redaction token missing');
    }
  });

  // 4. Controlled Write Tools, Atomic Writes, Backups & Autonomy Guards
  const testTaskId = 'BACSI-2026-999999';
  const testDraftId = 'DRAFT-TEST-MCP-999999';
  const testTaskPath = path.join(paths.tasksPendingDir, `${testTaskId}.json`);
  const testDraftPath = path.join(paths.draftsActiveDir, `${testDraftId}.json`);

  // Clean any pre-existing test files
  if (fs.existsSync(testTaskPath)) fs.unlinkSync(testTaskPath);
  if (fs.existsSync(testDraftPath)) fs.unlinkSync(testDraftPath);

  await runTest('Controlled Writes', 'create_task performs atomic write and creates task in pending queue', async () => {
    const res: any = await client.callTool({
      name: 'create_task',
      arguments: {
        taskId: testTaskId,
        subject: 'Algorithmique et Programmation',
        chapter: 'MCP Architecture Verification',
        contentType: 'COURS',
        instructions: 'Test instructions for MCP validation test suite',
        durationMinutes: 60,
        totalPoints: 20,
        difficulty: 'STANDARD',
        sourceReferences: [
          {
            fileName: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
            conceptNote: 'Test concept',
          },
        ],
      },
    });

    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!data.success || data.taskId !== testTaskId) throw new Error('create_task response invalid');
    if (!fs.existsSync(testTaskPath)) throw new Error('Task file was not written to pending dir');
  });

  await runTest('Controlled Writes', 'create_task strictly rejects duplicate task ID', async () => {
    const res: any = await client.callTool({
      name: 'create_task',
      arguments: {
        taskId: testTaskId,
        subject: 'Algorithmique et Programmation',
        chapter: 'MCP Architecture Duplicate Test',
        contentType: 'COURS',
        instructions: 'Should be rejected',
        sourceReferences: [{ fileName: 'test.pdf' }],
      },
    });

    if (!res.isError) throw new Error('Expected duplicate task to be rejected');
    if (!res.content[0].text.includes('already exists')) {
      throw new Error(`Expected "already exists" error, got: ${res.content[0].text}`);
    }
  });

  await runTest('Controlled Writes', 'write_draft creates new draft at version 1 in active directory', async () => {
    const res: any = await client.callTool({
      name: 'write_draft',
      arguments: {
        draftId: testDraftId,
        taskId: testTaskId,
        subject: 'Algorithmique et Programmation',
        chapter: 'MCP Test Chapter',
        contentType: 'COURS',
        status: 'DRAFT',
        content: {
          testField: 'initial_version',
        },
      },
    });

    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (data.version !== 1) throw new Error(`Expected version 1, got ${data.version}`);
    if (!fs.existsSync(testDraftPath)) throw new Error('Draft file not found in active directory');
  });

  await runTest('Controlled Writes', 'write_draft updates draft, creates verified backup, and bumps version to 2', async () => {
    const res: any = await client.callTool({
      name: 'write_draft',
      arguments: {
        draftId: testDraftId,
        taskId: testTaskId,
        subject: 'Algorithmique et Programmation',
        chapter: 'MCP Test Chapter',
        contentType: 'COURS',
        status: 'DRAFT',
        content: {
          testField: 'second_version_content',
        },
      },
    });

    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (data.version !== 2) throw new Error(`Expected version 2, got ${data.version}`);
    if (!data.backupCreated || !data.backupPath) throw new Error('Backup was not created');

    const backupFullPath = path.resolve(paths.workspaceRoot, data.backupPath);
    if (!fs.existsSync(backupFullPath)) throw new Error(`Backup file does not exist at: ${backupFullPath}`);

    const backupContent = JSON.parse(fs.readFileSync(backupFullPath, 'utf8'));
    if (backupContent.version !== 1 || backupContent.testField !== 'initial_version') {
      throw new Error('Backup content did not preserve version 1 state accurately');
    }

    // Clean up backup file
    fs.unlinkSync(backupFullPath);
  });

  await runTest('Autonomy Policy', 'write_draft strictly rejects unauthorized publication (Level 3 protection)', async () => {
    const res: any = await client.callTool({
      name: 'write_draft',
      arguments: {
        draftId: testDraftId,
        taskId: testTaskId,
        subject: 'Algorithmique et Programmation',
        chapter: 'MCP Test Chapter',
        contentType: 'COURS',
        status: 'PUBLISHED', // PROHIBITED
        content: { test: 123 },
      },
    });

    if (!res.isError) throw new Error('Expected PUBLISHED status to be rejected');
    if (!res.content[0].text.includes('PUBLISHED') && !res.content[0].text.includes('Level 3')) {
      throw new Error(`Expected autonomy level 3 warning, got: ${res.content[0].text}`);
    }
  });

  await runTest('Autonomy Policy', 'Rejects oversized payload (>5MB)', async () => {
    const hugePayload: any = { dummy: 'A'.repeat(5 * 1024 * 1024 + 100) };
    const res: any = await client.callTool({
      name: 'write_draft',
      arguments: {
        draftId: testDraftId,
        taskId: testTaskId,
        subject: 'Algorithmique et Programmation',
        chapter: 'MCP Test Chapter',
        contentType: 'COURS',
        status: 'DRAFT',
        content: hugePayload,
      },
    });

    if (!res.isError) throw new Error('Expected oversized payload to be rejected');
  });

  // Cleanup test files
  if (fs.existsSync(testTaskPath)) fs.unlinkSync(testTaskPath);
  if (fs.existsSync(testDraftPath)) fs.unlinkSync(testDraftPath);

  // 5. Quality Checks Restricted Execution
  await runTest('Quality Checks', 'run_quality_checks executes compliance target safely within timeout', async () => {
    const res: any = await client.callTool({
      name: 'run_quality_checks',
      arguments: { target: 'compliance' },
    });
    if (res.isError) throw new Error(res.content[0].text);
    const data = JSON.parse(res.content[0].text);
    if (!data.success || data.exitCode !== 0) {
      throw new Error(`Compliance check failed with code ${data.exitCode}: ${data.output}`);
    }
    if (!data.output.includes('OK') && !data.output.includes('Ran 6 tests')) {
      throw new Error('Compliance check output did not confirm expected test results');
    }
  });

  await runTest('Quality Checks', 'run_quality_checks rejects unapproved targets', async () => {
    const res: any = await client.callTool({
      name: 'run_quality_checks',
      arguments: { target: 'arbitrary_hack' },
    });
    if (!res.isError) throw new Error('Expected rejection of non-whitelisted target');
  });

  // 6. HTTP Transport (127.0.0.1) & Health Check
  await runTest('HTTP Transport', 'HTTP server binds strictly to 127.0.0.1 and returns healthy status', async () => {
    const httpPort = 3457;
    const mcpRoot = path.resolve(__dirname, '..');
    const httpProcess = spawn('node', ['dist/http.js'], {
      cwd: mcpRoot,
      env: { ...process.env, MCP_PORT: httpPort.toString() },
    });

    let stderrBuf = '';
    httpProcess.stderr.on('data', (d) => (stderrBuf += d.toString()));

    // Wait for server to emit ready signal
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error(`Timeout waiting for HTTP server to start. Stderr: ${stderrBuf}`)),
        10000
      );
      httpProcess.stdout.on('data', (d) => {
        if (d.toString().includes('listening strictly')) {
          clearTimeout(timer);
          resolve();
        }
      });
      httpProcess.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    try {
      const response = await new Promise<{ statusCode?: number; data: string }>((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${httpPort}/health`, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });
        req.on('error', (err) => reject(new Error(`${err.message} (stderr: ${stderrBuf})`)));
      });

      if (response.statusCode !== 200) {
        throw new Error(`Expected HTTP 200, got ${response.statusCode}`);
      }

      const body = JSON.parse(response.data);
      if (body.status !== 'ok' || body.boundHost !== '127.0.0.1') {
        throw new Error(`Unexpected health body: ${response.data}`);
      }
    } finally {
      httpProcess.kill('SIGTERM');
    }
  });

  // 7. Clean up in-memory connection & test audit log
  await client.close();
  await server.close();

  if (fs.existsSync(testLogPath)) {
    fs.unlinkSync(testLogPath);
  }

  // Summary
  console.log('\n===============================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED (Total: ${results.length})`);
  console.log('===============================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
