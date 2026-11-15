# BAC AI Tunisia — Strict Closed Knowledge Base Implementation Report

**Date:** 2026-11-06  
**Status:** IMPLEMENTED, ENFORCED, AND VERIFIED  
**Security Level:** CRITICAL ARCHITECTURAL POLICY  
**Workspace:** `/mnt/d/EDUCATION RAYEN` (`D:\EDUCATION RAYEN`)  
**Authorized Source Directory:** `/mnt/d/EDUCATION RAYEN/bac info cours exam resourse` (`D:\EDUCATION RAYEN\bac info cours exam resourse`)

---

## 1. Executive Summary

This report documents the implementation and verification of the **Strict Closed Knowledge Base** architectural policy for BAC AI Tunisia.

Under this policy:
1. **The sole authorized educational knowledge source** is the local knowledge directory (`D:\EDUCATION RAYEN\bac info cours exam resourse`).
2. **Absolute prohibition of external sources**: The AI and all educational workflows are strictly forbidden from consulting or referencing Google search, external websites, Wikipedia, YouTube, external APIs, external PDFs, or ungrounded model pretraining memory.
3. **Mandatory pre-generation retrieval**: Every educational workflow (courses, exercises, series, exams, corrections, revisions, QCM) must retrieve verified chunks and cite exact internal file paths and page numbers.
4. **Zero fabrication rule**: When information or curriculum concepts are not found within the 1,640 indexed files, the system returns the exact mandatory constant:
   ```text
   INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE
   ```
   accompanied by an explanation of missing concepts and the evidence status `NOT_FOUND`.

---

## 2. Core Architecture & Enforcement Services

### 2.1 Central Source Policy Service
File: [`bac-ai-studio/src/lib/server/source-policy-service.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/lib/server/source-policy-service.ts)

- **`assertAuthorizedKnowledgePath(targetPath)`**:
  - Resolves target path to canonical absolute path using `path.resolve()`.
  - Enforces jail-check: target path must start with the canonical root `/mnt/d/EDUCATION RAYEN/bac info cours exam resourse`.
  - Immediately rejects directory traversal (`..`), path escaping, or non-knowledge paths (e.g., `/etc/passwd`, external project folders).
- **`validateSourceReference(sourceRef)`**:
  - Validates `path`, `exactMatchSnippet`, `evidenceStatus`, `sha256`, and `pageNumber`.
  - Rejects external URL schemes (`http://`, `https://`, `ftp://`).
  - Rejects path traversal and verifies that the file exists in the authorized catalog (`catalog.json`).
  - Verifies that file SHA-256 matches the catalog hash.
- **`validateSourcesTraceability(sourcesCited)`**:
  - Validates full arrays of cited sources for tasks, drafts, and publication requests.
  - Returns `valid: true/false`, list of verified sources, and granular errors.
- **`enforceRetrievalBeforeGeneration(query, options)`**:
  - Automatically queries the authorized knowledge base prior to generation.
  - If matches are found: returns `evidenceStatus: 'VERIFIED_FROM_SOURCE'`, citations with SHA-256 and snippets.
  - If no matches are found: returns `content: "INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE"`, `evidenceStatus: 'NOT_FOUND'`, and missing query details.
- **`getSourcePolicyStatus()`**:
  - Returns live telemetry: authorized root directory, total indexed files (1,640), active draft count (5), duplicate count (681), and policy enforcement flag (`isStrictlyClosed: true`).

### 2.2 Task Service Enforcement
File: [`bac-ai-studio/src/lib/server/task-service.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/lib/server/task-service.ts)

- `createTask()` verifies that every item in `sourceReferences` is checked by `validateSourceReference()`. If any reference is invalid or points outside the authorized repository, task creation fails immediately with HTTP 400.
- `generateAntigravityPrompt()` embeds strict system prompts mandating that Antigravity use only internal knowledge chunks and return `INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE` if source material is absent.

### 2.3 Draft Validation & Review Service
Files:
- [`bac-ai-studio/src/lib/server/validation.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/lib/server/validation.ts)
- [`bac-ai-studio/src/lib/server/review-service.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/lib/server/review-service.ts)

- `validateDraftPayload()` checks `provenance.sourcesCited` to ensure no URLs, traversal patterns, or external references are present.
- `submitReview()` enforces `validateSourcesTraceability()` whenever a reviewer sets `status === 'APPROVED'`. Rejects approval if citations are unverified or non-traceable.

### 2.4 Publication Gate Enforcement
File: [`bac-ai-studio/src/lib/server/publication-service.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/lib/server/publication-service.ts)

- `publishDraft()` runs `validateSourcesTraceability(draft.provenance.sourcesCited)` before allowing any draft to be written to `content/published/`.
- If an unverified source is detected, publication is rejected, and an audit log event is recorded with action `PUBLICATION_REJECTED_UNAUTHORIZED_SOURCE`.

### 2.5 Policy Status API
File: [`bac-ai-studio/src/app/api/source-policy/route.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/app/api/source-policy/route.ts)

- `GET /api/source-policy` returns current policy boundaries and indexing statistics to the Studio UI.

---

## 3. Studio UI Policy Indicators

1. **Global Navigation Bar ([`Navbar.tsx`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/components/layout/Navbar.tsx)):**
   - Live `ShieldCheck` status badge in the header: **"Base Fermée D: 1640 docs"**.
   - Tooltip indicating strict closed-source enforcement across all studio features.
2. **Task Generator ([`GeneratorView.tsx`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/components/views/GeneratorView.tsx)):**
   - High-visibility policy alert explaining that generation is restricted to the 1,640 indexed documents.
   - Explicitly notes the `INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE` protocol for unindexed concepts.
3. **Review & Audit View ([`ReviewView.tsx`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/src/components/views/ReviewView.tsx)):**
   - Checklist Criterion 2: "Traçabilité Source Fermée (100% des sources proviennent du dossier autorisé)".
   - Checklist Criterion 10: "Absence d'Hallucination Externe (Pas de web search, pas de Wikipédia, respect strict du programme tunisien)".

---

## 4. Evidence Classification Taxonomy

All educational citations and assertions use the 5-tier evidence classification:

| Evidence Status | Meaning | System Behavior |
| :--- | :--- | :--- |
| `VERIFIED_FROM_SOURCE` | Exact match found in authorized knowledge PDF/DOCX/PY file with snippet & SHA-256. | Permitted in drafts and published content. |
| `PARTIALLY_SUPPORTED` | Core concept found, but minor pedagogical enrichment or variable naming applied. | Flagged for review; permitted if teacher-approved. |
| `CONFLICTING_SOURCES` | Two or more authorized exams or inspectorate documents present contradictory rules. | Escalated to human inspector review. |
| `NOT_FOUND` | Concept is absent from authorized repository. | Emits `INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE`; generation blocked. |
| `NEEDS_HUMAN_REVIEW` | Ambiguous curriculum scope or borderline syntax construct. | Placed in pending review queue. |

---

## 5. Verification & Test Suite

The test suite [`bac-ai-studio/tests/closed-knowledge-policy.test.ts`](file:///mnt/d/EDUCATION RAYEN/bac-ai-studio/tests/closed-knowledge-policy.test.ts) was executed and passed with 100% success rate:

```
✔ Test 1: Ingested document is verified inside the authorized repository
✔ Test 2: Ingested content is retrievable through knowledge search (contacts.bin)
✔ Test 3: Incremental ingestion cached catalog is verified (1640 files)
✔ Test 4: External knowledge sources are strictly rejected (HTTP/HTTPS/Wikipedia)
✔ Test 5: Files outside the authorized directory are blocked by canonical jail
✔ Test 6: Unsupported knowledge generation returns INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE
✔ Test 7: Sources cited in drafts are strictly validated for traceability
✔ Test 8: Policy status endpoint returns correct authorized repository metadata
✔ Test 9: Source knowledge directory remains strictly unmodified (1640 files intact)
```

### Full Project Test Summary
All 4 test suites in `bac-ai-studio` passed:
1. `tests/workflow-foundation.test.ts` — PASSED
2. `tests/knowledge-indexing.test.ts` — PASSED
3. `tests/task-generation.test.ts` — PASSED
4. `tests/closed-knowledge-policy.test.ts` — PASSED

---

## 6. Repository Immutability Guarantee

- Initial indexed file count: **1,640 files** (306 directories).
- Post-implementation file count: **1,640 files** (306 directories).
- Modifications to source repository: **0 files created, 0 modified, 0 deleted, 0 renamed**.
- Source repository permissions remain strictly READ-ONLY.
