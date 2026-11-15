# BAC AI Tunisia — Secure Shared MCP Gateway

A secure, standalone Model Context Protocol (MCP) server connecting **Google Antigravity** (local IDE) and **ChatGPT** (via Secure MCP Tunnel) to the **BAC AI Tunisia** educational content studio and read-only national curriculum repository.

---

## Highlights

- **Dual-Transport Architecture**:
  - **Local STDIO Transport**: Zero network exposure, seamless local pair-programming with Google Antigravity.
  - **Streamable HTTP SSE Transport**: Strictly bound to loopback `127.0.0.1:3456`, protected against DNS rebinding, engineered for private ChatGPT Secure MCP Tunnel.
- **12 Controlled Pedagogical Tools**:
  - **9 Read-Only Tools (Level 1 Autonomy)**: Project status, knowledge catalog search, approved knowledge reader, tasks queue inspector, draft reader, quality & audit report viewers.
  - **3 Protected Write Tools (Level 2 Autonomy)**: Task creation with duplicate check, draft creation/versioning with mandatory automated backups, and whitelisted studio quality checks.
- **Strict Security Boundaries**:
  - The 71 official Tunisian textbooks and national exam resources in `bac info cours exam resourse` are **STRICTLY READ-ONLY**.
  - Absolute denial of `.env*`, `.git`, `.vercel`, `node_modules`, and private keys.
  - Path traversal and symlink escape defenses.
  - Zero generic shell execution tools.
  - Autonomy Level 3 actions (Publishing, Git commit/push, Supabase migrations, Cloud deployment) are strictly barred.
- **Audit & Compliance**:
  - Append-only atomic audit logger (`bac-ai-mcp/logs/mcp_audit.log`) with automated credential and token redaction.
  - 100% test coverage across 27 automated security and functional verification scenarios.

---

## Directory Layout

```
bac-ai-mcp/
├── dist/                      # Compiled ES2022 JavaScript files
├── docs/                      # Comprehensive engineering documentation
│   ├── ARCHITECTURE.md
│   ├── SECURITY_MODEL.md
│   ├── MCP_TOOLS_REFERENCE.md
│   ├── ANTIGRAVITY_SETUP.md
│   ├── CHATGPT_TUNNEL_SETUP.md
│   ├── TEST_REPORT.md
│   └── OPERATIONS_GUIDE.md
├── logs/                      # Append-only MCP security audit logs
│   └── mcp_audit.log
├── scripts/                   # Whitelisted test & compliance harnesses
│   └── test_compliance.py
├── src/                       # TypeScript source code
│   ├── audit.ts               # Atomic audit logger & redaction
│   ├── http.ts                # Streamable HTTP SSE transport (127.0.0.1)
│   ├── index.ts               # Main library exports
│   ├── security.ts            # Canonical path resolution & security checks
│   ├── server.ts              # MCP Server definition & 12 tool registrations
│   ├── stdio.ts               # Local STDIO transport entry point
│   ├── types.ts               # Zod schemas, interfaces & Autonomy levels
│   └── tools/                 # Tool handlers
│       ├── audit-tool.ts
│       ├── drafts.ts
│       ├── knowledge.ts
│       ├── project-status.ts
│       ├── quality.ts
│       ├── reports.ts
│       └── tasks.ts
├── tests/                     # Automated test suite (27 verification tests)
│   └── mcp-gateway.test.ts
├── mcp_config.json            # Reference Antigravity configuration
├── package.json
└── tsconfig.json
```

---

## Quick Start

### 1. Requirements
- Node.js 22.x LTS or higher
- Linux (Ubuntu on WSL2) or Windows 10/11 x64

### 2. Build TypeScript
```bash
npm run build
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 27 verification tests including path traversal attacks, backup integrity, atomic writes, tool discovery, and HTTP loopback binding.*

### 4. Launch Transports

**Launch STDIO Transport (for local IDEs / Antigravity):**
```bash
npm run start:stdio
# or using compiled binary:
npm run serve:stdio
```

**Launch Streamable HTTP SSE Transport (bound to 127.0.0.1):**
```bash
npm run start:http
# or using compiled binary:
npm run serve:http
```

Verify health check:
```bash
curl http://127.0.0.1:3456/health
```

---

## Google Antigravity Integration

The MCP server is registered in `~/.gemini/config/mcp_config.json` and `bac-ai-studio/.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "bac-ai-mcp": {
      "command": "node",
      "args": ["/mnt/d/EDUCATION RAYEN/bac-ai-mcp/dist/stdio.js"],
      "cwd": "/mnt/d/EDUCATION RAYEN/bac-ai-mcp",
      "env": {
        "BAC_AI_WORKSPACE_ROOT": "/mnt/d/EDUCATION RAYEN",
        "NODE_ENV": "production"
      }
    }
  }
}
```

See [docs/ANTIGRAVITY_SETUP.md](file:///mnt/d/EDUCATION%20RAYEN/bac-ai-mcp/docs/ANTIGRAVITY_SETUP.md) for full setup instructions.

---

## ChatGPT Secure MCP Tunnel Integration

ChatGPT custom MCP integration requires ChatGPT Team, Enterprise, or Edu accounts. See [docs/CHATGPT_TUNNEL_SETUP.md](file:///mnt/d/EDUCATION%20RAYEN/bac-ai-mcp/docs/CHATGPT_TUNNEL_SETUP.md) for detailed tunneling and permission instructions.
