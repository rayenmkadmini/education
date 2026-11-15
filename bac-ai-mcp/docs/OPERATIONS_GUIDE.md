# BAC AI Tunisia — MCP Gateway Operations Guide

This operations guide is intended for educational platform administrators, computer science teachers, and full-stack developers maintaining the BAC AI Tunisia system.

---

## 1. Starting & Managing Transports

### A. Local STDIO Server (for Antigravity)
The STDIO transport is launched on-demand by Google Antigravity as specified in `~/.gemini/config/mcp_config.json`.

To run or debug STDIO manually from terminal:
```bash
cd /mnt/d/EDUCATION\ RAYEN/bac-ai-mcp
npm run start:stdio
```
*Note: The STDIO server communicates via standard input/output. Diagnostic messages appear in `stderr`.*

### B. HTTP SSE Server (for ChatGPT & Network Testing)
To launch the streamable HTTP server on `127.0.0.1:3456`:
```bash
cd /mnt/d/EDUCATION\ RAYEN/bac-ai-mcp
npm run start:http
```

To run in background using a custom port (e.g., 3458):
```bash
MCP_PORT=3458 node dist/http.js &
```

To stop the background HTTP server:
```bash
pkill -f "dist/http.js"
```

To check live status:
```bash
curl http://127.0.0.1:3456/health
```

---

## 2. Inspecting the Audit Trail

The MCP Gateway records every single operation in an append-only JSONL log:
`D:\EDUCATION RAYEN\bac-ai-mcp\logs\mcp_audit.log`

### Live Audit Tail
```bash
tail -f "/mnt/d/EDUCATION RAYEN/bac-ai-mcp/logs/mcp_audit.log"
```

### Inspect Security Denials
```bash
grep '"status":"DENIED"' "/mnt/d/EDUCATION RAYEN/bac-ai-mcp/logs/mcp_audit.log"
```

### Inspect Tool Usage via MCP
Using Antigravity or ChatGPT, invoke `get_audit_log`:
```json
{
  "limit": 20
}
```

---

## 3. Educational Workflow Procedures

### Procedure A: Requesting a New Content Draft
1. An agent or teacher creates a pending task via `create_task` with verified curriculum sources.
2. The AI agent reads the task via `get_task`.
3. The AI agent calls `search_knowledge` or `read_knowledge_file` to ground its explanations directly on official exams.
4. The AI agent writes the draft using `write_draft` (`status: "DRAFT"`).

### Procedure B: Teacher Human Review Gate (Autonomy Level 3)
1. **Never Approve via AI**: The MCP Gateway strictly rejects `status: "PUBLISHED"`.
2. A human teacher opens the local BAC AI Studio UI (`http://localhost:3000`).
3. The teacher reviews the Python code, marks, and explanation.
4. Only human action in the local studio approves and publishes the draft to `content/published/`.

---

## 4. Emergency Backup Recovery & Rollback

If an AI draft update introduced an unwanted change:

1. Locate the timestamped backup in `content/drafts/backups/`:
   ```bash
   ls -la "/mnt/d/EDUCATION RAYEN/content/drafts/backups"
   ```
2. Identify the backup file corresponding to the previous version:
   e.g. `BACKUP-DRAFT-COURS-BACSI-2026-409671-v3-1762432800000.json`
3. Restore the backup to `content/drafts/active/`:
   ```bash
   cp "content/drafts/backups/BACKUP-DRAFT-COURS-BACSI-2026-409671-v3-1762432800000.json" \
      "content/drafts/active/DRAFT-COURS-BACSI-2026-409671.json"
   ```
4. Verify restored state via MCP:
   Call `read_draft` with `draftId: "DRAFT-COURS-BACSI-2026-409671"`.
