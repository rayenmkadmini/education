import http from 'http';
import url from 'url';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpServer } from './server.js';
const HOST = '127.0.0.1'; // STRICT: Loopback only. Never 0.0.0.0
const PORT = parseInt(process.env.MCP_PORT || process.env.PORT || '3456', 10);
const sessions = new Map();
function isHostAllowed(hostHeader) {
    if (!hostHeader)
        return false;
    const host = hostHeader.split(':')[0].toLowerCase();
    return host === '127.0.0.1' || host === 'localhost';
}
const server = http.createServer(async (req, res) => {
    // DNS Rebinding and Host check
    if (!isHostAllowed(req.headers.host)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Forbidden: Invalid Host header' }));
        return;
    }
    // Set restrictive CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname;
    // Health check endpoint (safe, no secrets)
    if (req.method === 'GET' && pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'bac-ai-mcp',
            transport: 'http-sse',
            boundHost: HOST,
            activeSessions: sessions.size,
            timestamp: new Date().toISOString(),
        }));
        return;
    }
    // SSE stream endpoint
    if (req.method === 'GET' && pathname === '/sse') {
        const mcpServer = createMcpServer({ actor: 'http' });
        const transport = new SSEServerTransport('/messages', res);
        const sessionId = transport.sessionId;
        sessions.set(sessionId, { transport, server: mcpServer });
        req.on('close', async () => {
            sessions.delete(sessionId);
            await mcpServer.close();
        });
        await mcpServer.connect(transport);
        return;
    }
    // Message receiver endpoint
    if (req.method === 'POST' && pathname === '/messages') {
        const sessionId = parsedUrl.query.sessionId;
        if (!sessionId || !sessions.has(sessionId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid or missing sessionId query parameter' }));
            return;
        }
        const session = sessions.get(sessionId);
        await session.transport.handlePostMessage(req, res);
        return;
    }
    // 404 for any other route
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});
server.listen(PORT, HOST, () => {
    console.log(`[BAC-AI-MCP] Streamable HTTP SSE server listening strictly on http://${HOST}:${PORT}`);
    console.log('[BAC-AI-MCP] Bound exclusively to loopback (127.0.0.1). Zero public network exposure.');
});
process.on('SIGINT', () => {
    console.log('[BAC-AI-MCP] Received SIGINT, closing HTTP server...');
    server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
    console.log('[BAC-AI-MCP] Received SIGTERM, closing HTTP server...');
    server.close(() => process.exit(0));
});
//# sourceMappingURL=http.js.map