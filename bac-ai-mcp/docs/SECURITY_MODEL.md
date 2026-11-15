# BAC AI Tunisia — MCP Security Model & Threat Assessment

## 1. Executive Summary

The BAC AI Tunisia platform hosts mission-critical national examination resources, curriculum documents, and active educational drafts for the Tunisian Secondary Baccalaureate (Sciences de l'Informatique).

The MCP Gateway implements a **zero-trust defense-in-depth model** designed to safely connect autonomous AI agents while preventing:
1. Unauthorized modifications to official educational knowledge sources.
2. Exposure of environment credentials, secrets, and private keys.
3. Arbitrary filesystem access or remote command execution.
4. Premature or unauthorized publishing of unvetted educational content.

---

## 2. Autonomy Policy Matrix

The gateway enforces a three-tier autonomy framework:

```mermaid
flowchart TD
    subgraph Level1["Level 1: Automatic Operations (Safe)"]
        L1A["Read project status"]
        L1B["Search knowledge catalog"]
        L1C["Read tasks & drafts"]
        L1D["Read audit logs & quality reports"]
    end

    subgraph Level2["Level 2: Protected Writes (Controlled)"]
        L2A["Create tasks (pending queue only)"]
        L2B["Write drafts (with automatic backup)"]
        L2C["Run predefined test suites"]
    end

    subgraph Level3["Level 3: Prohibited via MCP (Human Mandatory)"]
        L3A["Approve or Publish Drafts"]
        L3B["Git commit, push, or branch switch"]
        L3C["Database migrations (Supabase)"]
        L3D["Cloud Deployment (Vercel)"]
        L3E["Modify Knowledge Repository"]
    end

    Level1 -->|Permitted| AGENT["AI Coding Assistant"]
    Level2 -->|Permitted with Guards| AGENT
    Level3 -->|STRICTLY REJECTED| BLOCK["Blocked by Gateway"]
```

### Level 1 — Automatic (Permitted)
Operations that only inspect read-only metadata, search indexed catalogs, or view drafts and test reports. Agents can execute these autonomously without human friction.

### Level 2 — Protected Local Writes (Permitted with Strict Safeguards)
Operations that write data locally to pre-approved directories:
- `create_task`: Enforces schema validity, checks for duplicate task IDs across pending and completed queues, and writes atomically.
- `write_draft`: Must remain in `DRAFT` or `PENDING_REVIEW`. Automatically snapshots the existing draft version to `content/drafts/backups/BACKUP-{draftId}-v{version}-{timestamp}.json` before overwriting.
- `run_quality_checks`: Spawns strictly whitelisted commands (`test`, `lint`, `build`, `typecheck`, `compliance`) with hardcoded arguments, sandboxed execution, and a 60-second timeout.

### Level 3 — Human Approval Mandatory (Strictly Barred via MCP)
Operations with irreversible or public-facing consequences are **permanently barred** from the MCP Gateway interface:
- **No Publishing Tool**: Content publication requires a certified Tunisian teacher to approve content through the local studio UI. Any attempt to supply `status: "PUBLISHED"` via MCP is rejected with `McpSecurityError`.
- **No Version Control Tools**: `git commit`, `git push`, `git merge`, and `git checkout` tools are intentionally omitted.
- **No Infrastructure Tools**: Remote database migrations, Supabase modifications, and Vercel/cloud deployments are omitted.
- **No Arbitrary Shell**: `execute_shell`, `execute_command`, and `write_any_file` tools are strictly forbidden.

---

## 3. Filesystem Whitelist & Path Traversal Guards

### Approved Root Directories
The gateway calculates canonical paths using `path.resolve()` and native filesystem realpaths, allowing access strictly within these directories:

```
[APPROVED ROOTS]
├── /mnt/d/EDUCATION RAYEN/bac info cours exam resourse/   (STRICTLY READ-ONLY)
├── /mnt/d/EDUCATION RAYEN/content/tasks/pending/          (Controlled Task Writes)
├── /mnt/d/EDUCATION RAYEN/content/tasks/completed/        (Read-Only Tasks)
├── /mnt/d/EDUCATION RAYEN/content/drafts/active/          (Controlled Draft Writes)
├── /mnt/d/EDUCATION RAYEN/content/drafts/backups/         (Automated Backup Writes)
├── /mnt/d/EDUCATION RAYEN/docs/                           (Read-Only Reports)
├── /mnt/d/EDUCATION RAYEN/bac-ai-mcp/logs/                (MCP Audit Log Writes)
└── /mnt/d/EDUCATION RAYEN/content/knowledge-catalog.json  (Read-Only Catalog)
```

### Path Sanitization Algorithm
When a path argument is received:
1. Rejects null bytes (`\0`), carriage returns (`\r`), and control characters.
2. Resolves canonical absolute path using `path.normalize()` and `path.resolve()`.
3. Verifies that the resolved path is a child of at least one approved root.
4. Checks native symlink destination via `fs.realpathSync`. If a symlink points outside approved roots, execution is immediately aborted with `McpSecurityError`.

---

## 4. Blacklisted Files & Secret Redaction

### Blacklist Patterns
The gateway denies access to any path matching the following regular expressions:

```typescript
const FORBIDDEN_PATH_PATTERNS = [
  /\.env(\.|$)/i,        // Denies .env, .env.local, .env.production
  /\.git(\/|\\|$)/i,     // Denies git repository internal objects
  /\.vercel(\/|\\|$)/i,  // Denies Vercel project configurations
  /node_modules/i,       // Denies dependencies
  /id_rsa/i,             // Denies SSH RSA private keys
  /id_ed25519/i,         // Denies SSH Ed25519 private keys
  /\.pem$/i,             // Denies certificates and private keys
  /\.key$/i,             // Denies private keys
  /\.pfx$/i,             // Denies certificate archives
  /credentials/i,        // Denies credential stores
  /shadow$/i,            // Denies system shadow files
  /passwd$/i,            // Denies system passwd files
];
```

### Data Leak Prevention & Redaction
All tool responses and audit log entries pass through deep object sanitization (`redactSensitiveData`):
- Supabase Service Role and Anon keys are redacted to `[REDACTED_SECRET]`.
- JWT tokens (`eyJh...`) are redacted to `[REDACTED_JWT_TOKEN]`.
- Private key blocks (`-----BEGIN RSA PRIVATE KEY-----`) are redacted to `[REDACTED_PRIVATE_KEY]`.
- Database connection URLs containing passwords (`postgres://user:pass@host`) are redacted to `postgres://[REDACTED_CREDENTIALS]@host`.

---

## 5. Network & Subprocess Hardening

### HTTP Loopback Binding
- Bound exclusively to IPv4 loopback `127.0.0.1`.
- Rejects any request where the `Host` header is not `127.0.0.1` or `localhost` (protects against browser DNS rebinding attacks).
- Does not listen on `0.0.0.0` or expose any public ports.

### Subprocess Sandboxing (`run_quality_checks`)
- Command execution is restricted to hardcoded command-line tuples:
  - `test`: `npm test` inside `bac-ai-studio`
  - `lint`: `npm run lint` inside `bac-ai-studio`
  - `build`: `npm run build` inside `bac-ai-studio`
  - `typecheck`: `npx tsc --noEmit` inside `bac-ai-studio`
  - `compliance`: `python3 bac-ai-mcp/scripts/test_compliance.py` inside root
- `shell: false` is enforced in `child_process.spawn` to prevent shell injection.
- Execution timeout is hard-capped at 60 seconds; processes exceeding this limit are terminated via `SIGKILL`.
- Process stdout/stderr output buffer is capped at 50KB to prevent memory exhaustion attacks.
