# BAC AI TUNISIA — PILOT 01 V3.1 SOURCE-TO-CODE VERIFICATION REPORT
## Strict Read-Only Source Code Extraction and Empirical Execution Audit
**Audit Date:** 2026-11-06  
**Auditor Roles:** Senior Tunisian Bac Informatique Examiner, Algorithm Design Specialist, Python Specialist & QA Auditor  
**Scope:** Verification of raw executable Python algorithms embedded directly within Pilot 01 V3 JSON drafts.  
**Constraint Compliance:** Strictly read-only audit. Zero drafts modified. Zero backups altered. Zero Git commits/pushes.  

---

## 1. Executive Summary & Verification Classification

This audit extracted and executed the verbatim Python code strings from all four active Version 3 educational drafts of Pilot Package 01 (`BACSI-2026-409671`):
1. `content/drafts/active/DRAFT-COURS-BACSI-2026-409671.json` (v3)
2. `content/drafts/active/DRAFT-SERIE-BACSI-2026-409671.json` (v3)
3. `content/drafts/active/DRAFT-DEVOIR-BACSI-2026-409671.json` (v3)
4. `content/drafts/active/DRAFT-CORRIGE-BACSI-2026-409671.json` (v3)

### Methodology & Testing Categorization:
- **Direct Draft Code Execution:** Code extracted verbatim from draft JSON files without rewriting or manual repair, compiled into dynamic namespaces via Python `exec()`, and executed against test assertions.
- **Harness Augmented Execution:** Companion test harness routines (specifically `DecimalToRomain()`) used to test bijective round-tripping against the extracted `Valider()` and `RomainToDecimal()` functions.
- **Manual Static Inspection:** Checking pseudocode algorithms and markdown specifications against Tunisian inspection standards.

### Overall Code Execution Verdict: **PASS (100% of executable draft blocks passed syntax and runtime verification)**

---

## 2. Exhaustive Audit of Verbatim Draft Code Blocks

### 2.1 `DRAFT-COURS-BACSI-2026-409671` (Interactive Masterclass)

#### Algorithm C-1: Record Initialization & Field Mutation
- **Location:** Module 1 (`cours-sec-1`), Statement Markdown, Code Block 1
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  # Création d'un enregistrement sous forme de dictionnaire Python
  obj = {
      'code': "OBJ101",
      'designation': "Amphore punique",
      'qte_romain': "XLVI",
      'qte_decimal': 46
  }

  # Accès et modification d'un champ :
  print("Désignation :", obj['designation'])
  obj['qte_decimal'] = 50
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:** Executed in dynamic namespace.
  - Field access `obj['designation']` evaluated to `"Amphore punique"`.
  - Field mutation `obj['qte_decimal'] = 50` successfully modified the dictionary in-place.
- **Verdict:** **PASS**

---

#### Algorithm C-2: Binary Persistence — Append Mode (`enregistrer_objet`)
- **Location:** Module 2 (`cours-sec-2`), Statement Markdown, Code Block 1
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  from pickle import dump

  def enregistrer_objet(nom_fichier: str, obj: dict) -> None:
      # 1. Ouvrir le fichier en mode ajout binaire ("ab")
      f = open(nom_fichier, "ab")
      
      # 2. Sérialiser et écrire l'objet avec dump(objet, fichier)
      dump(obj, f)
      
      # 3. Fermer impérativement le fichier !
      f.close()
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:** Tested with temporary binary files.
  - Successfully created binary file when absent.
  - Successfully appended multiple dictionary objects sequentially.
  - File handle closed cleanly.
- **Verdict:** **PASS**

---

#### Algorithm C-3: Binary Persistence — Reading with `EOFError` (`charger_tous_les_objets`)
- **Location:** Module 2 (`cours-sec-2`), Statement Markdown, Code Block 2
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  from pickle import load

  def charger_tous_les_objets(nom_fichier: str) -> list:
      objets = []
      
      # 1. Ouvrir en mode lecture binaire ("rb")
      f = open(nom_fichier, "rb")
      
      # 2. Boucle de lecture jusqu'à la fin de fichier
      while True:
        try:
          e = load(f)  # Lit un enregistrement
          objets.append(e)  # L'ajoute à la liste en mémoire
        except EOFError:
          break  # Sortie propre de la boucle dès qu'on atteint la fin
              
      # 3. Fermer le fichier
      f.close()
      
      return objets
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:**
  - Tested on populated file: loaded all 3 records faithfully.
  - Tested on empty 0-byte file: `load(f)` immediately raised `EOFError`, caught by `except`, returned `[]` cleanly.
  - *Note on Missing Files:* If file does not exist, `open(nom_fichier, "rb")` raises `FileNotFoundError`, as explicitly stated in Section 2.2 text.
- **Verdict:** **PASS**

---

#### Algorithm C-4: Multi-Criteria Selection Sort (`tri_selection_multi_criteres`)
- **Location:** Module 3 (`cours-sec-3`), Statement Markdown, Code Block 1
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  def tri_selection_multi_criteres(T: list) -> None:
      n = len(T)
      for i in range(n - 1):
          pos_max = i
          for j in range(i + 1, n):
              # Critère 1 : quantité décroissante
              if T[j]['qte_decimal'] > T[pos_max]['qte_decimal']:
                  pos_max = j
              # Critère 2 : égalité -> ordre alphabétique croissant de la désignation
              elif (T[j]['qte_decimal'] == T[pos_max]['qte_decimal']) and (T[j]['designation'] < T[pos_max]['designation']):
                  pos_max = j
          
          # Permutation globale des deux enregistrements si nécessaire
          if pos_max != i:
              T[i], T[pos_max] = T[pos_max], T[i]
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:**
  - Primary sort on `qte_decimal` descending: verified.
  - Secondary tie-breaking sort on `designation` ascending: verified.
  - Full record swap `T[i], T[pos_max] = T[pos_max], T[i]`: verified (no field corruption).
- **Verdict:** **PASS**

---

#### Algorithm C-5: Prerequisite Sort & Dichotomic Search (`trier_par_code` & `recherche_dichotomique_objet_code`)
- **Location:** Module 3 (`cours-sec-3`), Statement Markdown, Code Block 2
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  def trier_par_code(T: list) -> None:
      """Trie le tableau par ordre croissant du champ 'code'."""
      n = len(T)
      for i in range(n - 1):
          pos_min = i
          for j in range(i + 1, n):
              if T[j]['code'] < T[pos_min]['code']:
                  pos_min = j
          if pos_min != i:
              T[i], T[pos_min] = T[pos_min], T[i]

  def recherche_dichotomique_objet_code(T: list, code_cherche: str) -> int:
      """Recherche dichotomique sur tableau IMPÉRATIVEMENT trié par 'code'."""
      deb = 0
      fin = len(T) - 1
      
      while deb <= fin:
          mil = (deb + fin) // 2
          if T[mil]['code'] == code_cherche:
              return mil  # Objet trouvé à l'indice mil
          elif T[mil]['code'] < code_cherche:
              deb = mil + 1
          else:
              fin = mil - 1
              
      return -1  # Non trouvé
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:**
  - `trier_par_code`: perfectly orders records by `code` ascending in $\mathcal{O}(N^2)$.
  - `recherche_dichotomique_objet_code`: successfully finds target at index 0, intermediate indices, and last index in $\mathcal{O}(\log_2 N)$. Returns `-1` for missing codes.
- **Verdict:** **PASS**

---

#### Algorithm C-6: Cheat-Sheet Synthesis Script
- **Location:** Module 4 (`cours-sec-4`), Statement Markdown, Code Block 1
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:** Complete end-to-end demonstration script.
- **Execution Test:** Executed inside temporary sandbox directory. Wrote and loaded records cleanly.
- **Verdict:** **PASS**

---

### 2.2 `DRAFT-CORRIGE-BACSI-2026-409671` (Correction & Analytic Rubric)

#### Algorithm K-1: Canonical Roman Numeral Validation & Conversion (`Valider` & `RomainToDecimal`)
- **Location:** Exercise 1 (`cor-ex-1`), Statement Markdown, Code Block 1
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  import re

  CANONICAL_ROMAN = re.compile(r'^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$')

  def Valider(ch: str) -> bool:
      """Valide strictement la syntaxe canonique d'un nombre romain."""
      if not isinstance(ch, str) or len(ch) == 0:
          return False
      return bool(CANONICAL_ROMAN.match(ch))

  def RomainToDecimal(ch: str) -> int:
      """
      Convertit un nombre romain canonique en décimal.
      RÈGLE ABSOLUE : La validation syntaxique précède impérativement tout calcul.
      """
      if not Valider(ch):
          raise ValueError(f"Nombre romain canonique invalide: {ch!r}")
          
      valeurs = {
          'I': 1, 'V': 5, 'X': 10, 'L': 50,
          'C': 100, 'D': 500, 'M': 1000
      }
      total = 0
      n = len(ch)
      
      # Parcours de la chaîne du premier caractère à l'avant-dernier
      for i in range(n - 1):
          v_courant = valeurs[ch[i]]
          v_suivant = valeurs[ch[i + 1]]
          
          if v_courant >= v_suivant:
              total += v_courant
          else:
              total -= v_courant
              
      # Ajout obligatoire du dernier caractère
      total += valeurs[ch[-1]]
      return total
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:**
  - Upfront check: If `Valider(ch)` is `False`, `ValueError` is raised immediately.
  - Valid strings (`I`, `III`, `IV`, `IX`, `XL`, `XC`, `CD`, `CM`, `CXCII`, `XLVI`, `MDCCL`, `MMXXVI`): accurately return `1, 3, 4, 9, 40, 90, 400, 900, 192, 46, 1750, 2026`.
  - Non-canonical strings (`IIV`, `IC`, `IL`, `VX`, `XM`, `MCMC`, `VV`, `LL`, `DD`, `IIII`, `""`, `'iv'`, `'ABC'`, `'IX5'`): all rejected with `ValueError`.
- **Verdict:** **PASS**

---

#### Algorithm K-2: Archaeological Record Model & Persistence (`EnregistrerObjet` & `ChargerObjets`)
- **Location:** Exercise 2 (`cor-ex-2`), Statement Markdown, Code Blocks 2 & 3
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  ```python
  from pickle import dump

  def EnregistrerObjet(nom_fich: str, obj: dict) -> None:
      # Mode "ab" (Append Binary) : indispensable pour ajouter sans écraser
      f = open(nom_fich, "ab")
      dump(obj, f)
      f.close()
  ```
  ```python
  from pickle import load
  import os

  def ChargerObjets(nom_fich: str) -> list:
      T = []
      if not os.path.exists(nom_fich):
          return T  # Retourne une liste vide si le fichier n'a pas encore été créé
          
      # Mode "rb" (Read Binary) : lecture binaire
      f = open(nom_fich, "rb")
      
      while True:
          try:
              e = load(f)  # Lit l'enregistrement suivant
              T.append(e)  # Ajoute l'objet à la liste
          except EOFError:
              break        # Sortie dès que la fin physique du fichier est atteinte
              
      f.close()
      return T
  ```
- **Syntax & Indentation:** Valid standard Python 3.
- **Execution Test:**
  - Defensive check `if not os.path.exists(nom_fich): return T`: handles missing file gracefully.
  - Empty file (0 bytes): returns `[]` via `EOFError`.
  - Sequential multiple writes in `"ab"` mode: preserves existing records and appends correctly.
- **Verdict:** **PASS**

---

#### Algorithm K-3: Multi-Criteria Sorting, Threshold Display, Prerequisite Sort & Binary Search
- **Location:** Exercise 3 (`cor-ex-3`), Statement Markdown, Code Blocks 1 to 4
- **Inspection Type:** Direct Draft Code Execution
- **Verbatim Code Extracted:**
  1. `TriSelectionMultiCriteres(T: list) -> None`
  2. `AfficherSelonSeuil(T: list, S: int) -> None`
  3. `TrierParCode(T: list) -> None`
  4. `RechercheObjetParCode(T: list, code_rech: str) -> int`
- **Execution Test:**
  - Multi-criteria sort correctly places higher quantity first and alphabetizes ties.
  - `AfficherSelonSeuil` filters items $\ge S$ and counts selected objects.
  - `TrierParCode` orders by `code`.
  - `RechercheObjetParCode` returns exact index when found, `-1` when absent.
- **Verdict:** **PASS**

---

## 3. Summary of Extracted Code Audit

| Code Unit | Draft Origin | Section | Syntax | Independent Execution | Contract & Boundary Compliance |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `obj` model | `DRAFT-COURS` | Module 1 | OK | OK | OK |
| `enregistrer_objet` | `DRAFT-COURS` | Module 2 | OK | OK | OK |
| `charger_tous_les_objets` | `DRAFT-COURS` | Module 2 | OK | OK | OK |
| `tri_selection_multi_criteres` | `DRAFT-COURS` | Module 3 | OK | OK | OK |
| `trier_par_code` | `DRAFT-COURS` | Module 3 | OK | OK | OK |
| `recherche_dichotomique_objet_code` | `DRAFT-COURS` | Module 3 | OK | OK | OK |
| `Valider` | `DRAFT-CORRIGE` | Corrigé Ex 1 | OK | OK | OK |
| `RomainToDecimal` | `DRAFT-CORRIGE` | Corrigé Ex 1 | OK | OK | OK |
| `EnregistrerObjet` | `DRAFT-CORRIGE` | Corrigé Ex 2 | OK | OK | OK |
| `ChargerObjets` | `DRAFT-CORRIGE` | Corrigé Ex 2 | OK | OK | OK |
| `TriSelectionMultiCriteres` | `DRAFT-CORRIGE` | Corrigé Ex 3 | OK | OK | OK |
| `AfficherSelonSeuil` | `DRAFT-CORRIGE` | Corrigé Ex 3 | OK | OK | OK |
| `TrierParCode` | `DRAFT-CORRIGE` | Corrigé Ex 3 | OK | OK | OK |
| `RechercheObjetParCode` | `DRAFT-CORRIGE` | Corrigé Ex 3 | OK | OK | OK |

**Zero syntax errors, zero indentation defects, and zero runtime failures detected.**
