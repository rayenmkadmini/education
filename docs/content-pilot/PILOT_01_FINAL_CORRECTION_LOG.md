# BAC AI TUNISIA — PILOT 01 FINAL CORRECTION LOG
## Version 2 to Version 3 Educational Refinement Log
**Package ID:** `BACSI-2026-409671`  
**Target Program:** Baccalauréat Sciences de l'Informatique 2026-2027  
**Module:** Algorithmique et Programmation (Structures de Données Simples et Composées)  
**Date:** 2026-11-06  

---

## 1. Archival & Historical Version Preservation

Prior to applying any modifications to Version 2 documents, the BAC AI Studio atomic persistence engine generated immutable timestamped backups:

### V2 Backups Created:
1. `content/drafts/backups/DRAFT-COURS-BACSI-2026-409671.v2.1793965108756.bak.json` (Size: 17,554 bytes)
2. `content/drafts/backups/DRAFT-SERIE-BACSI-2026-409671.v2.1793965108852.bak.json` (Size: 8,682 bytes)
3. `content/drafts/backups/DRAFT-DEVOIR-BACSI-2026-409671.v2.1793965109009.bak.json` (Size: 8,890 bytes)
4. `content/drafts/backups/DRAFT-CORRIGE-BACSI-2026-409671.v2.1793965109095.bak.json` (Size: 12,017 bytes)

*(All previous V1 backups from the initial release continue to be preserved in `content/drafts/backups/`)*.

---

## 2. Granular Record of Changes (V2 $\rightarrow$ V3)

### 2.1 `DRAFT-COURS-BACSI-2026-409671` (Cours Magistral Interactif)
- **Version Bump:** `2` $\rightarrow$ `3`.
- **Module 2 (Persistance Binaire & pickle) :**
  - Clarified exact behavior when reading a 0-byte (empty) file: `load(f)` immediately raises `EOFError`, caught safely by `except EOFError: break`, returning `[]`.
  - Reinforced cybersecurity alert on `pickle` deserialization vulnerabilities (RCE via `__reduce__`) and contrast with JSON/SQLite.
- **Module 3 (Algorithmes Fondamentaux) :**
  - Added dedicated subsection **3.2 "La Condition Préalable Obligatoire de la Recherche Dichotomique"** explaining why binary search on `code` fails on an array sorted by quantity.
  - Provided `trier_par_code(T)` implementation before binary search.
  - Added subsection **3.3 "Nombres Romains : Règles Canoniques vs Règles Simplifiées du Bac 2026"** explaining standard Roman numeral syntax beyond the exam's 3-letter repetition rule.
- **Module 4 (Pièges du Bac & Auto-évaluation) :**
  - Updated auto-evaluation question 4 to address the binary search sorting precondition.

### 2.2 `DRAFT-SERIE-BACSI-2026-409671` (Série d'Exercices Guidés)
- **Version Bump:** `2` $\rightarrow$ `3`.
- **Exercice 3 :**
  - Explicitly specified requirement to handle empty (0-byte) files gracefully in `charger_livres`.
- **Exercice 4 :**
  - Rephrased question 2 to specifically emphasize why sequential search `rechercher_livre_isbn_sequentiel` is used on an array sorted by price, rather than binary search.

### 2.3 `DRAFT-DEVOIR-BACSI-2026-409671` (Devoir de Synthèse N°1)
- **Version Bump:** `2` $\rightarrow$ `3`.
- **Partie 1 (Décodage & Validation Canonique) :**
  - Expanded specification with all canonical Roman numeral syntax rules: non-repetition of `V`, `L`, `D`, strict subtractive pairs (`IV`, `IX`, `XL`, `XC`, `CD`, `CM`), prohibition of repeating subtractive prefixes (`IIV`), and canonical order.
  - Explicitly mandated that `RomainToDecimal` must call `Valider(ch)` before any calculation and raise `ValueError` on malformed input.
- **Partie 2 (Fiches d'Inventaire et Persistance) :**
  - Maintained 6.0 points allocation and required explaining 0-byte file behavior in `ChargerObjets`.
- **Partie 3 (Moteur de Tri & Consultation) :**
  - Revised Question 3 into three granular sub-questions:
    - a) Explain why binary search cannot be applied directly on the quantity-sorted table, with concrete counter-example (0.5 pt).
    - b) Specify the procedure `TrierParCode(Var T : Tableau ; N : entier)` (0.5 pt).
    - c) Implement `RechercheObjetParCode` and state asymptotic complexity (1.5 pt).
  - Total points preserved at exactly 20.0 (Part 1: 5.0, Part 2: 6.0, Part 3: 9.0).

### 2.4 `DRAFT-CORRIGE-BACSI-2026-409671` (Corrigé Analytique et Barème)
- **Version Bump:** `2` $\rightarrow$ `3`.
- **Corrigé Partie 1 :**
  - Enriched `Valider` in pseudocode with checks for `VV/LL/DD`, `IIII`, and invalid subtractive pairs.
  - In Python 3, added canonical regex validation and bijective verification check.
  - Added pre-validation call `if not Valider(ch): raise ValueError(...)` in `RomainToDecimal`.
- **Corrigé Partie 2 :**
  - Added explanation of 0-byte empty file behavior with `EOFError` handling and `FileNotFoundError`.
- **Corrigé Partie 3 :**
  - Added full didactic proof of the binary search failure on the quantity-sorted table, tracing the exact failure when searching for `OBJ500`.
  - Provided complete implementation of `TrierParCode(T)` in Python.
  - Maintained total points at exactly 20.0, matching the Devoir marking scale 1-to-1.

---

## 3. Local Safety Audit Checklist

- [x] Knowledge resource directory `D:\EDUCATION RAYEN\bac info cours exam resourse` was never modified, renamed, moved, or deleted.
- [x] No secrets from `.env.local` were logged or inspected.
- [x] Zero Git operations (`commit`, `push`, `pull`, `merge`, `reset`) executed.
- [x] Zero cloud deployments executed (no Vercel, no remote Supabase migrations).
- [x] Zero paid external APIs consumed.
- [x] All 4 active deliverables remain in `DRAFT` status (no automatic publication).
- [x] All automated tests pass 100% locally.
