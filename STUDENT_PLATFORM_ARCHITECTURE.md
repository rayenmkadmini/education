# BAC AI TUNISIA — STUDENT PLATFORM ARCHITECTURE SPECIFICATION

## 1. Architectural Independence Principle
The public student platform is designed to operate completely independently from the local authoring computer.
Students anywhere in Tunisia must be able to access verified courses, exam series, Python code solutions, and revision sheets even when the local authoring computer is shut down.

```
+-------------------------------------------------------------+
| LOCAL AUTHORING COMPUTER (Private Workstation)              |
| - Drive D:\ Knowledge Sources (Read-Only)                   |
| - Local Knowledge Extractor & PDF Parser                    |
| - Antigravity Pedagogical Task Generation                   |
| - Educator Review, 10 QA Checks & Approval                  |
| - Atomic Export to content/published/                       |
+------------------------------+------------------------------+
                               |
                               | (Manual / Authorized Sync)
                               v
+-------------------------------------------------------------+
| CLOUD STUDENT PLATFORM (Vercel Edge / Supabase / CDN)       |
| - Decoupled Next.js edge-rendered / static website          |
| - Zero dependency on local workstation online status         |
| - Public read-only access with sub-50ms latency in Tunisia  |
| - Full Arabic RTL and French technical terminology          |
| - Step-by-step interactive solution reveals                 |
+-------------------------------------------------------------+
```

## 2. Cloud Strategy & Safety Gating
- Current Status: **BLOCKED_PENDING_APPROVAL**
- The local Next.js Studio includes a fully functional, mobile-responsive **Student Platform View** tab (`StudentPlatformView.tsx`) that operates locally on verified publications.
- When production cloud deployment is authorized:
  1. Provision Supabase project.
  2. Apply `supabase/migrations/20261105_bac_ai_tunisia_schema.sql`.
  3. Deploy Next.js student client to Vercel production edge.
