import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyHttpTransport() {
  console.log('================================================================');
  console.log('STREAMABLE HTTP SSE TRANSPORT — END-TO-END VERIFICATION');
  console.log('================================================================\n');

  const httpPort = 3459;
  const mcpRoot = path.resolve(__dirname, '..');

  console.log(`[Step 1] Spawning HTTP SSE server on http://127.0.0.1:${httpPort}...`);
  const httpProcess = spawn('node', ['dist/http.js'], {
    cwd: mcpRoot,
    env: { ...process.env, MCP_PORT: httpPort.toString() },
    stdio: 'inherit',
  });

  // Poll /health to ensure server is ready
  let ready = false;
  const startTime = Date.now();
  while (Date.now() - startTime < 15000) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${httpPort}/health`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
      });
      ready = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!ready) {
    httpProcess.kill('SIGKILL');
    throw new Error('HTTP server failed to start within 15 seconds');
  }
  console.log('  -> HTTP SSE server is ready and responding on loopback.');

  try {
    // Connect using official SSEClientTransport from @modelcontextprotocol/sdk
    console.log('\n[Step 2] Connecting official SSEClientTransport to /sse endpoint...');
    const sseTransport = new SSEClientTransport(new URL(`http://127.0.0.1:${httpPort}/sse`));
    const client = new Client(
      { name: 'streamable-http-verifier', version: '1.0.0' },
      { capabilities: {} }
    );

    await client.connect(sseTransport);
    console.log('  ✓ MCP Initialization over SSE successful.');
    console.log(`  ✓ Server info:`, client.getServerVersion());

    // Tools list
    console.log('\n[Step 3] Calling tools/list over HTTP SSE...');
    const toolsRes = await client.listTools();
    console.log(`  ✓ Discovered ${toolsRes.tools.length} registered tools over HTTP SSE:`);
    for (const t of toolsRes.tools) {
      console.log(`    - ${t.name}`);
    }
    if (toolsRes.tools.length !== 12) {
      throw new Error(`Expected 12 tools, but received ${toolsRes.tools.length}`);
    }

    // Real tool call
    console.log('\n[Step 4] Executing real tool call (get_project_status) over HTTP SSE...');
    const statusRes: any = await client.callTool({
      name: 'get_project_status',
      arguments: {},
    });
    if (statusRes.isError) {
      throw new Error(`Tool call failed: ${statusRes.content[0].text}`);
    }
    const statusData = JSON.parse(statusRes.content[0].text);
    console.log('  ✓ Tool executed successfully. Workflow metrics:');
    console.log(JSON.stringify(statusData.workflowMetrics, null, 2));

    await client.close();
    console.log('\n  ✓ SSE Client closed cleanly.');
  } finally {
    httpProcess.kill('SIGTERM');
  }

  console.log('\n================================================================');
  console.log('HTTP SSE PROTOCOL VERIFICATION RESULT: 100% SUCCESS');
  console.log('================================================================');
}

verifyHttpTransport().catch((err) => {
  console.error('HTTP VERIFICATION FAILED:', err);
  process.exit(1);
});
