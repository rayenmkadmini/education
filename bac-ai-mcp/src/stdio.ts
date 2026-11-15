import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './server.js';

async function main() {
  process.stderr.write('[BAC-AI-MCP] Initializing STDIO transport for Google Antigravity...\n');

  const server = createMcpServer({ actor: 'stdio' });
  const transport = new StdioServerTransport();

  process.on('SIGINT', async () => {
    process.stderr.write('[BAC-AI-MCP] Received SIGINT, shutting down STDIO transport.\n');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    process.stderr.write('[BAC-AI-MCP] Received SIGTERM, shutting down STDIO transport.\n');
    await server.close();
    process.exit(0);
  });

  await server.connect(transport);
  process.stderr.write('[BAC-AI-MCP] STDIO transport connected successfully and ready for MCP commands.\n');
}

main().catch((err) => {
  process.stderr.write(`[BAC-AI-MCP] Fatal error initializing STDIO transport: ${err?.stack || err}\n`);
  process.exit(1);
});
