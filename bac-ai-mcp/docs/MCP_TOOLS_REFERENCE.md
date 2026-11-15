# BAC AI Tunisia — MCP Tools Complete Reference

This document provides exhaustive reference specifications for the 12 tools exposed by the **BAC AI Tunisia MCP Gateway**.

---

## Summary of Registered Tools

| # | Tool Name | Type | Autonomy Tier | Description |
|---|:---|:---|:---|:---|
| 1 | `get_project_status` | Read-Only | LEVEL 1 | Retrieve project layout, workflow metrics, catalog stats |
| 2 | `search_knowledge` | Read-Only | LEVEL 1 | Search the 71 cataloged exam/textbook entries |
| 3 | `read_knowledge_file` | Read-Only | LEVEL 1 | Read approved knowledge document by catalog ID |
| 4 | `list_tasks` | Read-Only | LEVEL 1 | List pending and completed content tasks |
| 5 | `get_task` | Read-Only | LEVEL 1 | Retrieve task definition by task ID |
| 6 | `list_drafts` | Read-Only | LEVEL 1 | List active educational content drafts |
| 7 | `read_draft` | Read-Only | LEVEL 1 | Read active draft content and version by draft ID |
| 8 | `get_quality_report` | Read-Only | LEVEL 1 | List or read markdown audit reports |
| 9 | `get_audit_log` | Read-Only | LEVEL 1 | Retrieve recent MCP security audit records |
| 10 | `create_task` | Controlled Write | LEVEL 2 | Create a task in `content/tasks/pending` |
| 11 | `write_draft` | Controlled Write | LEVEL 2 | Write draft with automatic backup and version bump |
| 12 | `run_quality_checks` | Controlled Write | LEVEL 2 | Execute whitelisted studio quality checks |

---

## 1. `get_project_status`

Retrieve project architecture summary, current workflow queue counts, knowledge catalog index statistics, and autonomy rules.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Input Parameters**: None (`{}`)
- **Example Response**:
```json
{
  "projectName": "BAC AI Tunisia",
  "academicYear": "2026-2027",
  "targetAudience": "Baccalauréat Informatique (4ème Sciences de l'Informatique)",
  "status": "ACTIVE_DEVELOPMENT_PHASE_PILOT_VERIFIED",
  "autonomyPolicy": {
    "level1": "Automatic read-only discovery and analysis",
    "level2": "Protected atomic writes with automated backup for tasks and drafts",
    "level3": "Human approval mandatory: Publishing, Git commits/pushes, Supabase migrations, Cloud deployment"
  },
  "workflowMetrics": {
    "pendingTasks": 7,
    "completedTasks": 0,
    "activeDrafts": 5,
    "historicalBackups": 9,
    "indexedKnowledgeDocuments": 71,
    "catalogVersion": "1.0.0",
    "availableReportsCount": 16
  }
}
```

---

## 2. `search_knowledge`

Search the read-only catalog of official Tunisian Baccalaureate resources.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `query` *(string, optional)*: Text query matching filename, subject, classification, or snippet.
  - `subject` *(string, optional)*: Filter by subject name (e.g., `Algorithmique et Programmation`).
  - `classification` *(string, optional)*: Filter by classification (e.g., `OFFICIAL_EXAM`, `OFFICIAL_TEXTBOOK`).
  - `isOfficialOnly` *(boolean, optional)*: Restrict results to official Ministry of Education documents.
  - `limit` *(integer, optional, default: 20)*: Maximum number of records to return (1-100).
- **Example Call**:
```json
{
  "query": "algorithme 2026",
  "isOfficialOnly": true,
  "limit": 5
}
```

---

## 3. `read_knowledge_file`

Read an approved knowledge catalog item by its unique catalog ID. Arbitrary filesystem paths are rejected.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `documentId` *(string, required)*: Catalog identifier matching pattern `^DOC-[A-F0-9]{16}$`.
- **Example Call**:
```json
{
  "documentId": "DOC-805A06468A481293"
}
```
- **Example Response**:
```json
{
  "documentId": "DOC-805A06468A481293",
  "filename": "201403P00.pdf",
  "classification": "OFFICIAL_TEXTBOOK",
  "subject": "Algorithmique et Programmation",
  "academicYear": "2026",
  "isOfficial": true,
  "pageCount": 240,
  "extractionStatus": "TEXT_EXTRACTED",
  "snippet": "MANUEL SCOLAIRE OFFICIEL...",
  "readOnlyNotice": "Source document verified from read-only official repository."
}
```

---

## 4. `list_tasks`

List educational content generation tasks across pending and completed queues.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `status` *(string, optional, enum: `["PENDING", "COMPLETED", "ALL"]`, default: `"ALL"`)*
  - `subject` *(string, optional)*: Filter by subject.
  - `contentType` *(string, optional)*: Filter by type (`COURS`, `SERIE`, `DEVOIR`, `CORRIGE`).
  - `limit` *(integer, optional, default: 20)*: Max items (1-50).

---

## 5. `get_task`

Retrieve a specific task definition by its validated task ID.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `taskId` *(string, required)*: Identifier matching pattern `^[A-Za-z0-9_-]{3,64}$`.
- **Example Call**:
```json
{
  "taskId": "BACSI-2026-409671"
}
```

---

## 6. `list_drafts`

List active educational content drafts.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `status` *(string, optional, enum: `["DRAFT", "PENDING_REVIEW", "ALL"]`, default: `"ALL"`)*
  - `subject` *(string, optional)*: Filter by subject.
  - `contentType` *(string, optional)*: Filter by content type.
  - `limit` *(integer, optional, default: 20)*: Max items.

---

## 7. `read_draft`

Read full educational JSON content, version number, and review status of an active draft.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `draftId` *(string, required)*: Draft ID (e.g., `DRAFT-COURS-BACSI-2026-409671`).

---

## 8. `get_quality_report`

Inspect verification reports from `docs/` and `docs/content-pilot/`.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `reportName` *(string, optional)*: Name of the report (e.g. `PILOT_01_V4_CURRICULUM_COMPLIANCE_AUDIT.md`). If omitted, lists all available reports with metadata.

---

## 9. `get_audit_log`

Inspect recent MCP operations. All sensitive tokens, secrets, and authorization keys are automatically redacted.

- **Autonomy**: `LEVEL_1_AUTOMATIC`
- **Parameters**:
  - `limit` *(integer, optional, default: 50)*: Number of entries (1-200).
  - `action` *(string, optional)*: Filter by tool action name.

---

## 10. `create_task`

Create a new pedagogical task inside `content/tasks/pending/`.

- **Autonomy**: `LEVEL_2_LOCAL_PROTECTED_WRITE`
- **Parameters**:
  - `taskId` *(string, required)*: ID matching format `^BACSI-\d{4}-\d{6}$`.
  - `subject` *(string, required)*: e.g., `"Algorithmique et Programmation"`.
  - `chapter` *(string, required)*: Curriculum chapter.
  - `contentType` *(string, required, enum: `["COURS", "SERIE", "DEVOIR", "CORRIGE", "FICHE_SYNTHESE"]`)*.
  - `instructions` *(string, required)*: Pedagogical task prompt.
  - `durationMinutes` *(integer, optional, default: 120)*.
  - `totalPoints` *(number, optional, default: 20)*.
  - `difficulty` *(string, optional, default: `"BAC_OFFICIEL"`)*.
  - `sourceReferences` *(array of objects, required)*: References with `fileName`, `pageRange`, and `conceptNote`.
- **Validation Rules**:
  - Rejects duplicate task IDs if already present in pending or completed directories.
  - Performs atomic write via `.tmp` swap.

---

## 11. `write_draft`

Create a new draft or update an existing draft in `content/drafts/active/`.

- **Autonomy**: `LEVEL_2_LOCAL_PROTECTED_WRITE`
- **Parameters**:
  - `draftId` *(string, required)*: Draft identifier.
  - `taskId` *(string, required)*: Associated task ID.
  - `subject` *(string, required)*.
  - `chapter` *(string, required)*.
  - `contentType` *(string, required)*.
  - `totalPoints` *(number, optional, default: 20)*.
  - `status` *(string, required, enum: `["DRAFT", "PENDING_REVIEW"]`)*: Note: `PUBLISHED` is strictly rejected.
  - `content` *(object, required)*: Pedagogical JSON structure.
- **Enforced Safety Guards**:
  - If draft already exists, automatically saves a full backup copy to `content/drafts/backups/BACKUP-{draftId}-v{version}-{timestamp}.json`.
  - Increments version number (`version = existing.version + 1`).
  - Performs atomic write.

---

## 12. `run_quality_checks`

Execute predefined, sandboxed quality and compliance checks on the workspace codebase.

- **Autonomy**: `LEVEL_2_LOCAL_PROTECTED_WRITE`
- **Parameters**:
  - `target` *(string, required, enum: `["test", "lint", "build", "typecheck", "compliance"]`)*:
    - `test`: Executes `npm test` inside `bac-ai-studio`.
    - `lint`: Executes `npm run lint` inside `bac-ai-studio`.
    - `build`: Executes `npm run build` inside `bac-ai-studio`.
    - `typecheck`: Executes `npx tsc --noEmit` inside `bac-ai-studio`.
    - `compliance`: Executes `python3 bac-ai-mcp/scripts/test_compliance.py`.
- **Security Limits**:
  - 60-second timeout.
  - Output truncated at 50,000 characters.
  - No user-supplied command strings or arbitrary flags accepted.
