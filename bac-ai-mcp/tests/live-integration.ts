import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { getWorkspacePaths, assertSafePath, assertNotKnowledgeRepo } from '../src/security.js';
import { McpSecurityError } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const paths = getWorkspacePaths();

interface TestExecutionRecord {
  testId: string;
  testName: string;
  toolInvoked: string;
  argumentsPassed: any;
  status: 'PASS' | 'FAIL';
  evidence: any;
  notes?: string;
}

const auditTrail: TestExecutionRecord[] = [];

async function runLiveVerification() {
  console.log('================================================================');
  console.log('BAC AI TUNISIA — LIVE MCP INTEGRATION VERIFICATION HARNESS');
  console.log('================================================================\n');

  // Launch Stdio Client connected to compiled dist/stdio.js
  const stdioTransport = new StdioClientTransport({
    command: 'node',
    args: [path.resolve(__dirname, '../dist/stdio.js')],
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      BAC_AI_WORKSPACE_ROOT: paths.workspaceRoot,
      NODE_ENV: 'production',
    },
  });

  const mcpClient = new Client(
    { name: 'antigravity-live-integration-verifier', version: '1.0.0' },
    { capabilities: {} }
  );

  console.log('[1/7] Connecting to compiled bac-ai-mcp via StdioClientTransport...');
  await mcpClient.connect(stdioTransport);
  console.log('  -> Live Stdio Transport connected.\n');

  // Verify tool discovery
  const toolsRes = await mcpClient.listTools();
  console.log(`  -> Discovered ${toolsRes.tools.length} registered tools over STDIO.`);

  // -------------------------------------------------------------------------
  // TEST 1 — Actual MCP Connection
  // -------------------------------------------------------------------------
  console.log('\n--- EXECUTING TEST 1: Actual MCP Connection ---');

  // Call 1: get_project_status
  console.log('Invoking: get_project_status');
  const statusRes: any = await mcpClient.callTool({
    name: 'get_project_status',
    arguments: {},
  });
  const statusData = JSON.parse(statusRes.content[0].text);
  auditTrail.push({
    testId: 'TEST-1.1',
    testName: 'Actual MCP Connection — get_project_status',
    toolInvoked: 'get_project_status',
    argumentsPassed: {},
    status: statusRes.isError ? 'FAIL' : 'PASS',
    evidence: statusData,
  });
  console.log('  ✓ get_project_status output received:', JSON.stringify(statusData.workflowMetrics));

  // Call 2: list_tasks
  console.log('Invoking: list_tasks');
  const tasksRes: any = await mcpClient.callTool({
    name: 'list_tasks',
    arguments: { status: 'PENDING', limit: 5 },
  });
  const tasksData = JSON.parse(tasksRes.content[0].text);
  auditTrail.push({
    testId: 'TEST-1.2',
    testName: 'Actual MCP Connection — list_tasks',
    toolInvoked: 'list_tasks',
    argumentsPassed: { status: 'PENDING', limit: 5 },
    status: tasksRes.isError ? 'FAIL' : 'PASS',
    evidence: { total: tasksData.total, sample: tasksData.tasks[0]?.taskId },
  });
  console.log(`  ✓ list_tasks output received: ${tasksData.total} pending tasks found.`);

  // Call 3: list_drafts
  console.log('Invoking: list_drafts');
  const draftsRes: any = await mcpClient.callTool({
    name: 'list_drafts',
    arguments: { status: 'DRAFT', limit: 5 },
  });
  const draftsData = JSON.parse(draftsRes.content[0].text);
  auditTrail.push({
    testId: 'TEST-1.3',
    testName: 'Actual MCP Connection — list_drafts',
    toolInvoked: 'list_drafts',
    argumentsPassed: { status: 'DRAFT', limit: 5 },
    status: draftsRes.isError ? 'FAIL' : 'PASS',
    evidence: { total: draftsData.total, sample: draftsData.drafts[0]?.draftId },
  });
  console.log(`  ✓ list_drafts output received: ${draftsData.total} drafts found.`);

  // -------------------------------------------------------------------------
  // TEST 2 — Knowledge Access
  // -------------------------------------------------------------------------
  console.log('\n--- EXECUTING TEST 2: Knowledge Access ---');

  // Search 1: Algorithmique
  console.log('Invoking search_knowledge with "Algorithmique"...');
  const algoRes: any = await mcpClient.callTool({
    name: 'search_knowledge',
    arguments: { query: 'Algorithmique', limit: 3 },
  });
  const algoData = JSON.parse(algoRes.content[0].text);
  auditTrail.push({
    testId: 'TEST-2.1',
    testName: 'Knowledge Search — Algorithmique',
    toolInvoked: 'search_knowledge',
    argumentsPassed: { query: 'Algorithmique' },
    status: algoData.totalMatches > 0 ? 'PASS' : 'FAIL',
    evidence: algoData.documents.map((d: any) => ({ id: d.id, filename: d.filename, isOfficial: d.isOfficial })),
  });
  console.log(`  ✓ Matches found: ${algoData.totalMatches} (Sample ID: ${algoData.documents[0]?.id})`);

  // Search 2: Python
  console.log('Invoking search_knowledge with "Python"...');
  const pythonRes: any = await mcpClient.callTool({
    name: 'search_knowledge',
    arguments: { query: 'Python', limit: 3 },
  });
  const pythonData = JSON.parse(pythonRes.content[0].text);
  auditTrail.push({
    testId: 'TEST-2.2',
    testName: 'Knowledge Search — Python',
    toolInvoked: 'search_knowledge',
    argumentsPassed: { query: 'Python' },
    status: pythonData.totalMatches > 0 ? 'PASS' : 'FAIL',
    evidence: pythonData.documents.map((d: any) => ({ id: d.id, filename: d.filename })),
  });
  console.log(`  ✓ Matches found: ${pythonData.totalMatches} (Sample ID: ${pythonData.documents[0]?.id})`);

  // Search 3: Bac pratique 2026
  console.log('Invoking search_knowledge with "Bac pratique 2026"...');
  const bacRes: any = await mcpClient.callTool({
    name: 'search_knowledge',
    arguments: { query: 'bac-pratique', limit: 3 },
  });
  const bacData = JSON.parse(bacRes.content[0].text);
  auditTrail.push({
    testId: 'TEST-2.3',
    testName: 'Knowledge Search — Bac pratique 2026',
    toolInvoked: 'search_knowledge',
    argumentsPassed: { query: 'bac-pratique' },
    status: bacData.totalMatches > 0 ? 'PASS' : 'FAIL',
    evidence: bacData.documents.map((d: any) => ({ id: d.id, filename: d.filename })),
  });
  console.log(`  ✓ Matches found: ${bacData.totalMatches} (Sample ID: ${bacData.documents[0]?.id})`);

  // -------------------------------------------------------------------------
  // TEST 3 — Safe Write
  // -------------------------------------------------------------------------
  console.log('\n--- EXECUTING TEST 3: Safe Write ---');
  const testTaskId = `MCP-INTEGRATION-TEST-${Date.now()}`;
  console.log(`Creating test task with ID: ${testTaskId}...`);

  const createRes: any = await mcpClient.callTool({
    name: 'create_task',
    arguments: {
      taskId: testTaskId,
      subject: 'Algorithmique et Programmation',
      chapter: 'Structures de Données Simples et Composées',
      contentType: 'COURS',
      instructions: 'Live integration test task to verify atomic persistence without publication.',
      durationMinutes: 90,
      totalPoints: 20,
      difficulty: 'STANDARD',
      sourceReferences: [
        {
          fileName: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
          conceptNote: 'Live verification reference',
        },
      ],
    },
  });

  const createData = JSON.parse(createRes.content[0].text);
  console.log('  -> create_task response:', createData);

  // Read back via get_task
  console.log(`Reading back task via get_task (${testTaskId})...`);
  const getTaskRes: any = await mcpClient.callTool({
    name: 'get_task',
    arguments: { taskId: testTaskId },
  });
  const getTaskData = JSON.parse(getTaskRes.content[0].text);

  // Verify file on filesystem
  const expectedTaskFile = path.join(paths.tasksPendingDir, `${testTaskId}.json`);
  const fileExistsOnDisk = fs.existsSync(expectedTaskFile);
  console.log(`  -> File exists on disk at ${expectedTaskFile}: ${fileExistsOnDisk}`);

  auditTrail.push({
    testId: 'TEST-3.1',
    testName: 'Safe Write — create_task and get_task verification',
    toolInvoked: 'create_task / get_task',
    argumentsPassed: { taskId: testTaskId },
    status: fileExistsOnDisk && getTaskData.taskId === testTaskId ? 'PASS' : 'FAIL',
    evidence: {
      createdTaskId: testTaskId,
      fileExistsOnDisk,
      diskPath: expectedTaskFile,
      taskStatus: getTaskData.status,
    },
    notes: 'Preserved on disk as required. Exact ID reported for tracking.',
  });

  // -------------------------------------------------------------------------
  // TEST 4 — Draft Protection
  // -------------------------------------------------------------------------
  console.log('\n--- EXECUTING TEST 4: Draft Protection ---');

  // Read real draft
  const targetDraftId = 'DRAFT-COURS-BACSI-2026-409671';
  console.log(`Reading existing active draft: ${targetDraftId}...`);
  const readDraftRes: any = await mcpClient.callTool({
    name: 'read_draft',
    arguments: { draftId: targetDraftId },
  });
  const readDraftData = JSON.parse(readDraftRes.content[0].text);
  console.log(`  ✓ Successfully read draft: version ${readDraftData.version}, status: ${readDraftData.status}`);

  // Test that PUBLISHED status is strictly rejected
  console.log('Attempting write_draft with prohibited status "PUBLISHED"...');
  const pubTestRes: any = await mcpClient.callTool({
    name: 'write_draft',
    arguments: {
      draftId: 'DRAFT-TEST-PUBLISH-ATTEMPT-999',
      taskId: 'BACSI-2026-409671',
      subject: 'Algorithmique et Programmation',
      chapter: 'Security Verification',
      contentType: 'COURS',
      status: 'PUBLISHED', // Prohibited!
      content: { sample: 123 },
    },
  });

  const publishBlocked = pubTestRes.isError && (
    pubTestRes.content[0].text.includes('Level 3') ||
    pubTestRes.content[0].text.includes('PUBLISHED') ||
    pubTestRes.content[0].text.includes('VALIDATION ERROR')
  );
  console.log(`  ✓ Publication attempt blocked: ${publishBlocked} (${pubTestRes.content[0].text.trim()})`);

  auditTrail.push({
    testId: 'TEST-4.1',
    testName: 'Draft Protection — Read draft and reject PUBLISHED status',
    toolInvoked: 'read_draft / write_draft',
    argumentsPassed: { draftId: targetDraftId, attemptedStatus: 'PUBLISHED' },
    status: readDraftData.version === 4 && publishBlocked ? 'PASS' : 'FAIL',
    evidence: {
      readDraftId: targetDraftId,
      version: readDraftData.version,
      status: readDraftData.status,
      publishRejectionMessage: pubTestRes.content[0].text,
    },
  });

  // -------------------------------------------------------------------------
  // TEST 5 — HTTP Transport
  // -------------------------------------------------------------------------
  console.log('\n--- EXECUTING TEST 5: HTTP Transport ---');

  const httpPort = 3458;
  const mcpRoot = path.resolve(__dirname, '..');
  console.log(`Spawning HTTP server process on port ${httpPort}...`);

  const httpProcess = spawn('node', ['dist/http.js'], {
    cwd: mcpRoot,
    env: { ...process.env, MCP_PORT: httpPort.toString() },
    stdio: 'inherit',
  });

  // Poll /health until server responds (allow up to 25s for slow filesystem mounts)
  let healthRes: any = null;
  const startTime = Date.now();
  while (Date.now() - startTime < 25000) {
    try {
      healthRes = await new Promise<any>((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${httpPort}/health`, (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
        });
        req.on('error', reject);
      });
      if (healthRes.statusCode === 200) break;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!healthRes || healthRes.statusCode !== 200) {
    httpProcess.kill('SIGKILL');
    throw new Error('HTTP server failed to respond within 25 seconds');
  }

  console.log('  -> HTTP SSE server is listening.');
  console.log('  ✓ /health returned HTTP', healthRes.statusCode, healthRes.body);

  // Test B: DNS Rebinding Protection (Invalid Host Header)
  const dnsBlockRes = await new Promise<any>((resolve, reject) => {
    const req = http.request(
      `http://127.0.0.1:${httpPort}/health`,
      {
        headers: { Host: 'attacker-controlled-domain.com' },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.end();
  });
  console.log(`  ✓ DNS Rebinding check: Host "attacker-controlled-domain.com" rejected with HTTP ${dnsBlockRes.statusCode}`);

  // Test C: Invalid Session ID rejection
  const invalidSessionRes = await new Promise<any>((resolve, reject) => {
    const req = http.request(
      `http://127.0.0.1:${httpPort}/messages?sessionId=non-existent-session-id`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ statusCode: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.write(JSON.stringify({ jsonrpc: '2.0', id: 1 }));
    req.end();
  });
  console.log(`  ✓ Invalid sessionId rejected with HTTP ${invalidSessionRes.statusCode}`);

  httpProcess.kill('SIGTERM');

  auditTrail.push({
    testId: 'TEST-5.1',
    testName: 'HTTP Transport — Loopback Binding, DNS Rebinding & SSE validation',
    toolInvoked: 'HTTP SSE server /health & /messages',
    argumentsPassed: { port: httpPort },
    status: healthRes.statusCode === 200 && dnsBlockRes.statusCode === 403 && invalidSessionRes.statusCode === 400 ? 'PASS' : 'FAIL',
    evidence: {
      boundHost: healthRes.body.boundHost,
      dnsRebindingStatus: dnsBlockRes.statusCode,
      invalidSessionStatus: invalidSessionRes.statusCode,
    },
  });

  // -------------------------------------------------------------------------
  // TEST 6 — Security
  // -------------------------------------------------------------------------
  console.log('\n--- EXECUTING TEST 6: Security Boundaries ---');

  // Check 1: Reading .env.local
  let envBlocked = false;
  try {
    assertSafePath(path.join(paths.workspaceRoot, '.env.local'), [paths.workspaceRoot]);
  } catch (err: any) {
    if (err instanceof McpSecurityError) envBlocked = true;
  }
  console.log(`  ✓ Access to .env.local blocked: ${envBlocked}`);

  // Check 2: Reading .git/config
  let gitBlocked = false;
  try {
    assertSafePath(path.join(paths.workspaceRoot, '.git/config'), [paths.workspaceRoot]);
  } catch (err: any) {
    if (err instanceof McpSecurityError) gitBlocked = true;
  }
  console.log(`  ✓ Access to .git blocked: ${gitBlocked}`);

  // Check 3: Path traversal outside workspace
  let traversalBlocked = false;
  try {
    assertSafePath('../../etc/shadow', [paths.draftsActiveDir]);
  } catch (err: any) {
    if (err instanceof McpSecurityError) traversalBlocked = true;
  }
  console.log(`  ✓ Path traversal (../../etc/shadow) blocked: ${traversalBlocked}`);

  // Check 4: Writing into read-only knowledge repository
  let knowledgeWriteBlocked = false;
  try {
    assertNotKnowledgeRepo(path.join(paths.knowledgeDir, 'malicious_overwrite.pdf'), paths);
  } catch (err: any) {
    if (err instanceof McpSecurityError) knowledgeWriteBlocked = true;
  }
  console.log(`  ✓ Write to knowledge repository blocked: ${knowledgeWriteBlocked}`);

  // Check 5: MCP Tool Level Traversal
  const maliciousTaskRes: any = await mcpClient.callTool({
    name: 'get_task',
    arguments: { taskId: '../../../.env.local' },
  });
  const mcpToolBlocked = maliciousTaskRes.isError;
  console.log(`  ✓ Tool invocation with traversal taskId rejected: ${mcpToolBlocked}`);

  auditTrail.push({
    testId: 'TEST-6.1',
    testName: 'Security Boundaries — .env.local, .git, traversal, and read-only repo',
    toolInvoked: 'assertSafePath / assertNotKnowledgeRepo / get_task',
    argumentsPassed: { targets: ['.env.local', '.git', '../../etc/shadow', 'knowledge repo write'] },
    status: envBlocked && gitBlocked && traversalBlocked && knowledgeWriteBlocked && mcpToolBlocked ? 'PASS' : 'FAIL',
    evidence: {
      envBlocked,
      gitBlocked,
      traversalBlocked,
      knowledgeWriteBlocked,
      mcpToolBlocked,
    },
  });

  // Close Stdio Client
  await mcpClient.close();
  console.log('\nLive Stdio MCP Client disconnected.');

  // Output summary table in JSON for report consumption
  console.log('\n================================================================');
  console.log('LIVE INTEGRATION AUDIT RESULTS');
  console.log('================================================================');
  console.log(JSON.stringify(auditTrail, null, 2));
}

runLiveVerification().catch((err) => {
  console.error('FATAL VERIFICATION ERROR:', err);
  process.exit(1);
});
