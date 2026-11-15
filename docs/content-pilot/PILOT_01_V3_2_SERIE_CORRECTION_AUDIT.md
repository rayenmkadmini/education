# BAC AI TUNISIA — PILOT 01 V3.2 SÉRIE CORRECTION AUDIT REPORT
## Audit of Companion Draft: `DRAFT-CORRIGE-SERIE-BACSI-2026-409671`
**Audit Date:** 2026-11-06  
**Auditor Roles:** Senior Tunisian Bac Informatique Examiner, Assessment Specialist & Educational QA Auditor  
**Subject:** Algorithmique et Programmation (4ème Année Secondaire — Sciences de l'Informatique)  
**Target Document Created:** `content/drafts/active/DRAFT-CORRIGE-SERIE-BACSI-2026-409671.json` (Version 1, Status: `DRAFT`)  

---

## 1. Executive Summary & Verification Classification

To close the non-blocking finding identified in the V3.1 audit (where `DRAFT-SERIE-BACSI-2026-409671` referenced an external correction document), an independent, fully fleshed-out companion correction draft was created:  
**`DRAFT-CORRIGE-SERIE-BACSI-2026-409671`**.

This document:
- Matches every exercise and sub-question in `DRAFT-SERIE-BACSI-2026-409671` 1-to-1.
- Provides complete, runnable Python 3 code and official pseudocode without placeholders.
- Totals exactly **20.0 / 20.0 points**, matching the Série's point distribution.
- Is articulated in natural Tunisian Arabic (Derja) with French technical terminology.
- Explicitly highlights common student pitfalls and algorithmic complexity.
- Stored safely as an independent **`DRAFT`** via `saveDraft()`. The four original V3 drafts remain unchanged.

### Audit Verdict: **PASS (100% of questions solved and tested)**

---

## 2. Granular Exercise-by-Exercise Solution Audit

### Exercice 1 : Modélisation et Contrôle de Saisie (4.0 points)
- **Question 1 : Déclaration TDO et type `Livre` (1.0 pt)**
  - *Pseudocode :* Syntaxe officielle `Type Livre = Enregistrement isbn : chaîne, titre : chaîne, prix : réel, disponible : booléen Fin`.
  - *TDO :* `livre` de type `Livre`, `T` de type `Tableau de N Livre`.
  - *Python :* Dictionnaire conforme avec les 4 clés exactes.
- **Question 2 : Fonction `valider_isbn(ch: str) -> bool` (2.0 pts)**
  - Tests exacts : `len(ch) == 13` et tous les caractères compris entre `'0'` et `'9'`.
  - Common student mistake documented : Using `int(ch)` which erroneously truncates leading zeros or raises unexpected exceptions on non-numeric characters.
- **Question 3 : Fonction `creer_livre(isbn, titre, prix) -> dict` (1.0 pt)**
  - Validates ISBN, non-empty title (3..50 chars), and positive price (`prix > 0`).
  - Raises `ValueError` explicitly on violations. Initialises `disponible` to `True`.

---

### Exercice 2 : Enregistrement Binaire dans un Fichier de Données (5.0 points)
- **Question 1 : Procédure `ajouter_livre(nom_fich, livre)` (2.0 pts)**
  - Uses `open(nom_fich, "ab")`, `pickle.dump(livre, f)`, and `f.close()`.
- **Question 2 : Fonction `saisir_et_enregistrer_plusieurs(nom_fich, n)` (2.0 pts)**
  - Implements controlled `while True` loops for keyboard inputs, validating each field before calling `ajouter_livre`.
- **Question 3 : Justification didactique du mode `"ab"` vs `"wb"` (1.0 pt)**
  - Explains that `"ab"` positions the pointer at the end of the file, preserving existing records, whereas `"wb"` truncates the file to 0 bytes, irreversibly destroying previous data.

---

### Exercice 3 : Exploitation et Statistiques sur Fichier Typé (5.0 points)
- **Question 1 : Fonction `charger_livres(nom_fich) -> list` (2.5 pts)**
  - Opens in `"rb"`, implements `while True: try: load(f) except EOFError: break`.
  - Handles missing file gracefully (`if not os.path.exists(nom_fich): return livres`).
  - Handles empty 0-byte file: immediate `EOFError` caught safely, returns `[]`.
- **Question 2 : Fonction `prix_moyen(T: list) -> float` (1.5 pts)**
  - Includes empty-list guard: `if not T or len(T) == 0: return 0.0` preventing `ZeroDivisionError`.
  - Calculates average rounded to 3 decimal places (standard Tunisian millimes format).
- **Question 3 : Fonction `extraire_disponibles(T: list) -> list` (1.0 pt)**
  - Filters records where `disponible is True`.

---

### Exercice 4 : Problème de Synthèse — Tri et Consultation (6.0 points)
- **Question 1 : Tri par sélection décroissant sur le prix (2.5 pts)**
  - Pseudocode & Python `tri_selection_livres(T)`.
  - Compares `T[j]['prix'] > T[pos_max]['prix']`.
  - Full record permutation `T[i], T[pos_max] = T[pos_max], T[i]`.
- **Question 2 : Fonction `rechercher_livre_isbn_sequentiel` & Justification (1.5 pts)**
  - Linear sequential search $\mathcal{O}(N)$ returning index or `-1`.
  - **Pedagogical Justification:** The array was sorted by *price*, NOT by *ISBN*. Monotonicity is not satisfied for the ISBN key; binary search would fail. Linear search is the only mathematically sound approach on an array ordered by another key.
- **Question 3 : Module `generer_rapport_inventaire` (2.0 pts)**
  - Reads from binary file, sorts by price descending, and writes formatted text report:
    `[ISBN] Titre - Prix DT (Disponible: OUI/NON)`.

---

## 3. Direct Code Execution Test Summary

All Python routines from `DRAFT-CORRIGE-SERIE-BACSI-2026-409671` were extracted and executed against an automated test suite:

```text
Ex 1 python blocks: 3 -> Passed all tests.
Ex 2 python blocks: 2 -> Passed all tests.
Ex 3 python blocks: 3 -> Passed all tests.
Ex 4 python blocks: 3 -> Passed all tests.
VERBATIM CODE FROM DRAFT-CORRIGE-SERIE-BACSI-2026-409671 TESTED 100% CLEAN!
```

---

## 4. Marking Scale & Alignment Matrix

| Exercise | Série Points | Corrigé Points | Question-by-Question Coverage |
| :--- | :---: | :---: | :---: |
| **Exercice 1 : Modélisation et Contrôle** | 4.0 | 4.0 | Q1 (1.0) + Q2 (2.0) + Q3 (1.0) = 4.0 pts |
| **Exercice 2 : Persistance Binaire** | 5.0 | 5.0 | Q1 (2.0) + Q2 (2.0) + Q3 (1.0) = 5.0 pts |
| **Exercice 3 : Exploitation & Statistiques** | 5.0 | 5.0 | Q1 (2.5) + Q2 (1.5) + Q3 (1.0) = 5.0 pts |
| **Exercice 4 : Tri & Synthèse** | 6.0 | 6.0 | Q1 (2.5) + Q2 (1.5) + Q3 (2.0) = 6.0 pts |
| **TOTAL** | **20.0** | **20.0** | **100% EXACT MATCH** |
