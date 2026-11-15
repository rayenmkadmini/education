# BAC AI Tunisia — Google Antigravity MCP Setup Guide

This guide describes how to configure, launch, and verify the **BAC AI Tunisia MCP Gateway** inside **Google Antigravity**.

---

## 1. Configuration Locations

Google Antigravity discovers MCP servers from two standard locations:

1. **Global Configuration (User-wide)**:
   `~/.gemini/config/mcp_config.json`
2. **Project / Workspace Configuration**:
   `D:\EDUCATION RAYEN\bac-ai-studio\.agents\mcp_config.json` (or WSL `/mnt/d/EDUCATION RAYEN/bac-ai-studio/.agents/mcp_config.json`)

Both files have been configured and verified.

---

## 2. Configuration Structure

```json
{
  "mcpServers": {
    "bac-ai-mcp": {
      "command": "node",
      "args": [
        "/mnt/d/EDUCATION RAYEN/bac-ai-mcp/dist/stdio.js"
      ],
      "cwd": "/mnt/d/EDUCATION RAYEN/bac-ai-mcp",
      "env": {
        "BAC_AI_WORKSPACE_ROOT": "/mnt/d/EDUCATION RAYEN",
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Key Parameters:
- `command`: `"node"` invokes the local Node.js runtime (v22.x LTS).
- `args`: Points to the compiled ES2022 entry point `dist/stdio.js`.
- `cwd`: Sets the working directory to `/mnt/d/EDUCATION RAYEN/bac-ai-mcp`.
- `env.BAC_AI_WORKSPACE_ROOT`: Explicitly anchors the workspace boundary.
- **Zero Secrets**: No tokens, API keys, or private passwords are stored in this file.

---

## 3. Refreshing / Re-discovering Tools in Antigravity

When modifying tools or starting a new session:

1. **Reload MCP Servers**:
   - In Antigravity IDE, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Run: `Antigravity: Refresh MCP Servers`.
2. **Alternative Restart**:
   - Simply start a new conversation session or restart Antigravity. The STDIO transport connects automatically during session handshake.
3. **Verification in Chat**:
   - Ask Antigravity: *"What MCP tools are available from bac-ai-mcp?"*
   - Or run: `get_project_status` tool to view live workflow counts.

---

## 4. Manual Verification via Command Line

To test the STDIO connection independently of the IDE UI, run:

```bash
cd /mnt/d/EDUCATION\ RAYEN/bac-ai-mcp
python3 -c "
import subprocess, json
proc = subprocess.Popen(['node', 'dist/stdio.js'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
proc.stdin.write(json.dumps({'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2024-11-05', 'capabilities': {}, 'clientInfo': {'name': 'test', 'version': '1.0'}}}) + '\n')
proc.stdin.flush()
print(proc.stdout.readline())
proc.kill()
"
```

Expected output:
```json
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"bac-ai-tunisia-mcp","version":"1.0.0"}},"jsonrpc":"2.0","id":1}
```

---

## 5. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| `Cannot find module dist/stdio.js` | TypeScript not built | Run `npm run build` inside `bac-ai-mcp/` |
| Tools not appearing in chat | Antigravity has not refreshed | Reload Antigravity or trigger `Antigravity: Refresh MCP Servers` |
| `EACCES` or permission denied | File permissions on WSL mount | Run `chmod +x dist/stdio.js` |
| Unexpected JSON on stdout | Logging to stdout instead of stderr | Ensure debug prints use `process.stderr.write` |
