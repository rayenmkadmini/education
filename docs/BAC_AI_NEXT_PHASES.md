# BAC AI TUNISIA — ROADMAP & NEXT DEVELOPMENT PHASES

**Document Version:** 1.0.0  
**Target Milestone:** Full Production & National Student Rollout  
**Architecture Model:** Direct Local Studio $\rightarrow$ Human Editorial Gate $\rightarrow$ Cloud Student Distribution

---

## 1. High-Level Architecture Overview

BAC AI Tunisia operates as a secure, human-in-the-loop educational content generation and delivery ecosystem:

```
[Knowledge Repository] (Read-Only)
   │ 253 Official Documents, Exams, Textbooks
   ▼
[Content Studio (bac-ai-studio)]
   ├── Task Generator (Curriculum-aligned prompts)
   ├── Antigravity AI Engine (High-fidelity pedagogical drafting)
   ├── Human-in-the-Loop Educational Editor (Math, Pseudocode, Python)
   └── 10-Criterion Homologation Review Gate (Strict compliance check)
   │
   ▼ (Approved Publications Only)
[Published Educational Archive] (content/published/)
   │
   ▼
[Student Learning Platform]
   ├── Mobile-first, responsive study portal
   ├── Dual Derja / French educational scaffolding
   ├── Progressive hints & interactive solution reveal
   └── Offline-capable, fast edge delivery
```

---

## 2. Upcoming Development Phases

### Phase 2: Curriculum Scaling across Bac SI
- **Objective:** Expand beyond Pilot 01 (`Enregistrements et fichiers pickle`) to all remaining core chapters:
  - **Algorithmique & Programmation:**
    - Récursivité & Algorithmes arithmétiques avancés
    - Tri et recherche (Tri fusion, tri rapide, dichotomie)
    - Algorithmes de manipulation textuelle et cryptographie
  - **Bases de Données (MariaDB / SQL):**
    - Modèle relationnel, formes normales
    - Requêtes DML (SELECT avec jointures, GROUP BY, HAVING)
    - Procédures et fonctions stockées
  - **TIC & Développement Web:**
    - Formulaires HTML5 / CSS3 responsives
    - Traitement côté serveur (PHP) et interactions sécurisées
    - Requêtes asynchrones et validation côté client

### Phase 3: Teacher Portal & Batch Workflows
- **Batch Task Generation:** Ability to generate a full semester's worth of series and exams in a single structured session.
- **Rubric Customizer:** Pedagogical rubric presets for Devoir de Contrôle (1h, 20 pts) vs. Devoir de Synthèse (2h, 20 pts) vs. Épreuve Pratique (1h30, 20 pts).
- **Curriculum Change Audit:** Automated diffing against future Tunisian Ministry updates.

### Phase 4: Production Cloud Deployment & CDN Edge Distribution
- **Target Infrastructure:** Vercel Edge Runtime for the public student portal, Supabase for authenticated student progress tracking, and read-only published content CDN.
- **Safety Gate:** Production database migrations and public DNS switches remain locked until formal educational committee sign-off.
- **Analytics & Diagnostic:** Anonymous learning analytics to detect common conceptual stumbling blocks among students.
