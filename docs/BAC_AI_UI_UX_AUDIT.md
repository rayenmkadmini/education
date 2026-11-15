# BAC AI Tunisia — UI/UX Audit & Redesign Specification
**Date:** 2026-11-06  
**Auditor:** Senior Product Designer & Design Systems Architect  
**Project:** BAC AI Tunisia (Section Sciences de l'Informatique 2026–2027)  
**Target Application:** `D:\EDUCATION RAYEN\bac-ai-studio`  

---

## 1. Executive Summary

BAC AI Tunisia was built with functional completeness in mind: secure server-side file persistence, an incremental knowledge indexing engine over 71 authentic Tunisian educational resources, a curriculum registry, task generation, draft review, and an offline student platform.

However, the initial visual presentation adopted a **"crypto/gaming AI dashboard" aesthetic** typical of unrefined developer prototypes:
- **Excessive Dark Neon:** Dominant pitch-black background (`#070B14`) paired with aggressive cyan glows (`#00F0FF`, `box-shadow: 0 0 20px rgba(0, 240, 255, 0.3)`), dark surface cards (`#0E1626`), and heavy borders.
- **Header Overload:** All 8 primary navigation tabs were crammed horizontally into the top navigation bar as pills, resulting in visual clutter and horizontal overflow on laptop screens.
- **Card-in-Card Nesting:** Almost every label, stat, and input was wrapped in nested rounded cards with dark borders, producing visual noise instead of clear educational hierarchy.
- **Unnatural for Teachers and Students:** Real educational technology products (e.g., Coursera, Linear, Notion, Canvas, Raycast) use calm, high-contrast, distraction-free typography and clean surfaces that facilitate reading, writing, and pedagogical evaluation.

---

## 2. Component-by-Component UX Friction Analysis

### 2.1 Global Navigation (`Navbar.tsx` & Layout Shell)
* **Problem:** Horizontal navigation bar with 8 items (`Tableau de bord`, `Bibliothèque`, `Programme`, `Générateur IA`, `Studio Auteur`, `Validation`, `Export`, `Plateforme Élèves`).
* **UX Impact:** Users on smaller screens (tablets, 13-inch laptops) see an awkward horizontally scrolling header.
* **Redesign Direction:** Transition to an elegant, compact **Sidebar** grouped by operational domain (*Studio de Création*, *Référentiels & Sources*, *Qualité & Publication*, *Espace Apprenant*), paired with a distraction-free Topbar containing breadcrumbs, document status, and language switching.

### 2.2 Dashboard (`DashboardView.tsx`)
* **Problem:** Glowing gradient banners and high-contrast dark cards create an impression of an AI telemetry monitor rather than an educational content studio.
* **UX Impact:** Cognitive fatigue; lack of calm focus on pending educational drafts and tasks.
* **Redesign Direction:** Clean editorial greeting, concise summary of verified knowledge sources, active drafts queue, and direct 1-click actions to generate or review lessons.

### 2.3 Knowledge Base Explorer (`KnowledgeView.tsx`)
* **Problem:** Document list uses heavy dark cards with repetitive badges and glowing borders.
* **UX Impact:** Scanning across 71+ files is cumbersome.
* **Redesign Direction:** Professional, compact document table/row view with clean typography, clear status tags (`INDEXED`, `NEEDS_OCR`, `DUPLICATE`), instant search, and a slide-out metadata drawer.

### 2.4 Curriculum Explorer (`CurriculumView.tsx`)
* **Problem:** Overly wide lists with repetitive badge styles and dark contrast that obscures chapter progression.
* **UX Impact:** Hard to visualize the pedagogical hierarchy (Matière $\rightarrow$ Module $\rightarrow$ Chapitre $\rightarrow$ Compétences).
* **Redesign Direction:** Expandable clean accordion tree with verified CNP textbook citations and official Tunisian Ministry coefficients.

### 2.5 Task & Prompt Generator (`GeneratorView.tsx`)
* **Problem:** Form fields are spread across dense dark panels, and the output prompt is presented inside a terminal-like neon box.
* **UX Impact:** Teachers feel like they are writing command-line scripts rather than configuring a structured educational lesson.
* **Redesign Direction:** Calm, step-by-step form layout (Matière $\rightarrow$ Chapitre $\rightarrow$ Type de document $\rightarrow$ Barème $\rightarrow$ Sources) with a clean prompt preview drawer and single-click copy action.

### 2.6 Content Editor (`EditorView.tsx`)
* **Problem:** Dark textarea with neon green code highlights and dark cards.
* **UX Impact:** Prolonged typing causes eye strain. Educational text (especially mathematical formulas and French/Derja explanations) is best edited in a clean, high-readability writing environment.
* **Redesign Direction:** Premium writing canvas with KaTeX formula preview, clean monospace code block styling, dynamic barème counter (out of 20), and exercise reordering controls.

### 2.7 Review & Approval Desk (`ReviewView.tsx`)
* **Problem:** Rejection and approval controls are nestled amidst dark containers without a clear audit checklist emphasis.
* **UX Impact:** Potential ambiguity regarding what checks have been validated.
* **Redesign Direction:** Formal pedagogical compliance checklist (10 criteria), clear status banner (`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`), mandatory rejection reason field, and approval confirmation modal.

### 2.8 Export Desk (`ExportView.tsx`)
* **Problem:** The printable exam preview was rendered with dark borders and dark background, making it hard to envision the final A4 paper output.
* **UX Impact:** Inconvenient for teachers wanting to print directly for classroom distribution.
* **Redesign Direction:** Pure white A4 paper canvas with official Tunisian Ministry header styling, clean typography, and instant print/PDF download.

### 2.9 Student Platform (`StudentPlatformView.tsx`)
* **Problem:** Was sharing styling with the admin console, including a toggle that could allow previewing unpublished drafts!
* **UX Impact:** Violates the fundamental privacy requirement that students must only access approved, published educational content.
* **Redesign Direction:** Distinct, student-focused educational platform with clean course navigation, reading comfort, interactive exercise practice with collapsible solution hints, and zero access to unpublished drafts.

---

## 3. The New Visual Concept: Editorial Education + Premium Minimal SaaS

### 3.1 Design Principles
1. **Calm Clarity:** High contrast, crisp typography, clean surfaces, and subtle borders. Zero neon glow or crypto-style gradients.
2. **Academic Authority:** Feels like an official, prestigious educational institution platform designed for Tunisian national excellence.
3. **Restrained Accent:** Primary Navy (`#14243A`) for structure, Accent Blue (`#3478B8`) for interactive focus, and semantic greens/ambers for status.
4. **First-Class Arabic & French:** Balanced typographic rhythm across Latin (Inter) and Arabic (IBM Plex Sans Arabic / Noto Sans Arabic), with strict LTR isolation for Python code and LaTeX mathematics.
5. **Human Ergonomics:** Optimized for long editing and study sessions on laptops, desktops, and mobile devices.
