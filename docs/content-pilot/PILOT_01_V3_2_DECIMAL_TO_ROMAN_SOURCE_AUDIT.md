# BAC AI TUNISIA — PILOT 01 V3.2 DECIMAL TO ROMAN SOURCE AUDIT
## Comprehensive Source Location, Curriculum Fidelity & Reference Harness Audit
**Audit Date:** 2026-11-06  
**Auditor Roles:** Senior Tunisian Bac Informatique Examiner, Algorithm Design Specialist & QA Auditor  
**Investigation Target:** Origin, Location, and Role of `DecimalToRomain()` across Pilot Package 01  

---

## 1. Executive Forensic Determination

Following a comprehensive search across the entire workspace, JSON drafts, test files, and source materials:

### Final Classification: **B. It exists only in the test harness.**

| Search Target | Presence | Exact Location / Occurrence | Context & Purpose |
| :--- | :---: | :--- | :--- |
| `DRAFT-COURS-BACSI-2026-409671.json` | **NO** | Not present | Course covers `RomainToDecimal` and Roman syntax rules. |
| `DRAFT-SERIE-BACSI-2026-409671.json` | **NO** | Not present | Série focuses on `Livre` records, pickle, and sorting. |
| `DRAFT-DEVOIR-BACSI-2026-409671.json` | **NO** | Not present | Devoir Part 1 requires `Valider()` and `RomainToDecimal()`. |
| `DRAFT-CORRIGE-BACSI-2026-409671.json` | **NO** | Not present | Corrigé implements `Valider()` and `RomainToDecimal()`. |
| `DRAFT-CORRIGE-SERIE-BACSI-2026-409671.json` | **NO** | Not present | Corrigé Série covers library records, pickle, and sorting. |
| `bac-ai-studio/tests/pilot_01_algorithm_tests.py` | **YES** | Lines 53–68 | QA reference harness to test bijective round-tripping. |
| `docs/content-pilot/PILOT_01_ALGORITHM_TEST_MATRIX.md` | **YES** | Section 1 | Documenting mathematical verification of the 3,999 integers. |
| Official Bac Exam PDF (May 23, 2026 8h30) | **NO** | Not present | Official exam requires only `RomainToDecimal`. |

---

## 2. Curriculum & Official Examination Analysis

### 2.1 The Official 2026 Examination Context
Inspection of the raw text extracted from `bac info cours exam resourse/Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf` reveals the exact official statement:
> *"Un musée souhaite informatiser la gestion de son stock d’objets archéologiques. Dans les anciens registres les quantités des objets sont exprimées en chiffres romains.*  
> *On souhaite développer une application Python munie de deux interfaces graphiques qui permet :*  
> *- de saisir la désignation d’un objet archéologique et sa quantité en chiffres romains,*  
> *- de convertir la quantité en chiffres romains en son équivalent décimal,*  
> *- d’enregistrer l’objet dans un fichier d’enregistrements,*  
> *- de consulter et d’afficher de manière triée les objets enregistrés."*  
> *(Section 2.a : Développer le module RomainToDecimal qui s'exécute suite au clic sur le bouton intitulé 'Convertir')*

**Crucial Finding:** The official national examination asks candidates to convert **from Roman to Decimal** (`RomainToDecimal`). It never asks candidates to convert from decimal to Roman (`DecimalToRomain`).

### 2.2 Why `DecimalToRomain()` Was Created in the Test Suite
During the V2 educational audit, the QA auditor needed a formal method to empirically guarantee that `Valider()` and `RomainToDecimal()` were free of bugs across the entire canonical range $[1 \dots 3999]$ without manually hard-coding 3,999 strings.  
The auditor introduced `decimal_to_romain()` in `bac-ai-studio/tests/pilot_01_algorithm_tests.py` as an **oracle / reference generator** to evaluate the bijection:
$$\forall n \in [1, 3999], \quad \text{RomainToDecimal}(\text{DecimalToRomain}(n)) = n$$

---

## 3. Empirical Test of the Test Harness Implementation

Although `DecimalToRomain()` is not part of the student drafts, its reference implementation in the test harness was evaluated against boundary and edge cases:

```python
def DecimalToRomain(n: int) -> str:
    """Reference canonical generator used in test harness."""
    if not isinstance(n, int) or isinstance(n, bool):
        raise TypeError(f"L'argument doit être un entier, reçu: {type(n).__name__}")
    if n <= 0 or n > 3999:
        return ""
    mapping = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
    ]
    res = []
    for val, sym in mapping:
        while n >= val:
            res.append(sym)
            n -= val
    return "".join(res)
```

### Empirical Results:
1. **Valid Domain $[1 \dots 3999]$:**
   - 3,999 / 3,999 numbers produced valid canonical Roman numerals accepted by `Valider()`.
   - 100% round-trip equality: `RomainToDecimal(DecimalToRomain(n)) == n`.
2. **Boundary & Non-Domain Inputs:**
   - $n = 0, -1, -500 \implies$ returns `""` (empty string).
   - $n = 4000, 5000, 100000 \implies$ returns `""` (empty string).
   - $n \in \{\text{None}, \text{'100'}, 3.14, [], \{\}, \text{True}, \text{False}\} \implies$ raises `TypeError`.

---

## 4. Pedagogical Recommendation

1. **Keep Existing V3 Drafts Unchanged:**  
   The four active drafts accurately reflect the official Bac examination scope (`RomainToDecimal`). Introducing `DecimalToRomain` into the student Devoir or Corrigé would artificially expand the curriculum beyond what is examined by the Ministry.
2. **Transparency in Documentation:**  
   All QA reports now clearly designate `DecimalToRomain` as an **automated test harness oracle**, preventing any future confusion between student curriculum deliverables and teacher testing infrastructure.
