# BAC AI TUNISIA — PILOT 01 ALGORITHM TEST MATRIX
## Complete Empirical & Unit Test Matrix for Pedagogical Verification
**Subject:** Algorithmique et Programmation — 4ème Année Sciences de l'Informatique  
**Academic Year:** 2026-2027  
**Test Suite Path:** `bac-ai-studio/tests/pilot_01_algorithm_tests.py`  
**Status:** **100% Tests Passing (5/5 suites, 0 failures, 0 errors)**  

---

## 1. Roman Numeral Syntax & Conversion Test Matrix

### 1.1 Canonical Valid Test Cases
All test cases must satisfy:
1. `valider_romain_canonique(s) == True`
2. `valider_romain_didactique(s) == True`
3. `romain_to_decimal(s) == ExpectedDecimal`

| Input String | Expected Decimal | Roman Breakdown & Operations | Result |
| :--- | :---: | :--- | :---: |
| `I` | 1 | 1 | **PASS** |
| `III` | 3 | $1 + 1 + 1 = 3$ | **PASS** |
| `IV` | 4 | Subtractive pair: $5 - 1 = 4$ | **PASS** |
| `IX` | 9 | Subtractive pair: $10 - 1 = 9$ | **PASS** |
| `XL` | 40 | Subtractive pair: $50 - 10 = 40$ | **PASS** |
| `XC` | 90 | Subtractive pair: $100 - 10 = 90$ | **PASS** |
| `CD` | 400 | Subtractive pair: $500 - 100 = 400$ | **PASS** |
| `CM` | 900 | Subtractive pair: $1000 - 100 = 900$ | **PASS** |
| `CXCII` | 192 | $100 + (100 - 10) + 1 + 1 = 192$ | **PASS** |
| `XLVI` | 46 | $(50 - 10) + 5 + 1 = 46$ | **PASS** |
| `MDCCL` | 1750 | $1000 + 500 + 100 + 100 + 50 = 1750$ | **PASS** |
| `MMXXVI` | 2026 | $1000 + 1000 + 10 + 10 + 5 + 1 = 2026$ (Bac 2026 Session Year) | **PASS** |

---

### 1.2 Invalid Test Cases & Exception Enforcement
All test cases must satisfy:
1. `valider_romain_canonique(s) == False`
2. `valider_romain_didactique(s) == False`
3. Calling `romain_to_decimal(s)` raises `ValueError` before any calculation is performed.

| Input String | Canonical Violation / Rejection Rationale | Exception Verified | Result |
| :--- | :--- | :---: | :---: |
| `IIII` | More than 3 consecutive repetitions of `I` (Rule: max 3) | `ValueError` raised | **PASS** |
| `IIV` | Subtractive numeral preceded by identical numeral (Rule: subtractive prefix cannot repeat) | `ValueError` raised | **PASS** |
| `IC` | Invalid subtractive jump (`I` can only precede `V` or `X`, cannot subtract from `C`) | `ValueError` raised | **PASS** |
| `IL` | Invalid subtractive jump (`I` can only precede `V` or `X`, cannot subtract from `L`) | `ValueError` raised | **PASS** |
| `VX` | Subtraction with `V` (Rule: `V`, `L`, `D` can NEVER be subtracted) | `ValueError` raised | **PASS** |
| `XM` | Invalid subtractive jump (`X` can only precede `L` or `C`, cannot subtract from `M`) | `ValueError` raised | **PASS** |
| `MCMC` | Out-of-order terms (after `CM` [900], a thousands/hundreds repetition `C` is forbidden) | `ValueError` raised | **PASS** |
| `VV` | Consecutive repetition of `V` (Rule: `V`, `L`, `D` can NEVER be repeated) | `ValueError` raised | **PASS** |
| `LL` | Consecutive repetition of `L` (Rule: `V`, `L`, `D` can NEVER be repeated) | `ValueError` raised | **PASS** |
| `DD` | Consecutive repetition of `D` (Rule: `V`, `L`, `D` can NEVER be repeated) | `ValueError` raised | **PASS** |
| `""` (Empty) | Empty string contains zero numerals | `ValueError` raised | **PASS** |
| `iv` | Lowercase letters not normalized | `ValueError` raised | **PASS** |
| `cxc` | Lowercase letters not normalized | `ValueError` raised | **PASS** |
| `ABC` | Non-Roman alphabet characters | `ValueError` raised | **PASS** |
| `IX5` | Mixed alphanumeric input | `ValueError` raised | **PASS** |
| `XXXX` | More than 3 consecutive repetitions of `X` | `ValueError` raised | **PASS** |
| `CCCC` | More than 3 consecutive repetitions of `C` | `ValueError` raised | **PASS** |

---

## 2. Multi-Criteria Selection Sorting Test Matrix

### Algorithm Specification:
- **Primary Order:** `qte_decimal` DESCENDING.
- **Secondary Order:** In case of equal `qte_decimal`, `designation` ASCENDING (lexicographical).
- **Integrity Requirement:** Full record permutation (`T[i], T[pos_max] = T[pos_max], T[i]`).

### Initial Test Dataset:
```python
[
    {'code': 'OBJ003', 'designation': 'Stèle B', 'qte_decimal': 46, 'qte_romain': 'XLVI'},
    {'code': 'OBJ001', 'designation': 'Amphore', 'qte_decimal': 192, 'qte_romain': 'CXCII'},
    {'code': 'OBJ002', 'designation': 'Stèle A', 'qte_decimal': 46, 'qte_romain': 'XLVI'},
    {'code': 'OBJ004', 'designation': 'Bijou Or', 'qte_decimal': 2026, 'qte_romain': 'MMXXVI'},
    {'code': 'OBJ005', 'designation': 'Lampe', 'qte_decimal': 46, 'qte_romain': 'XLVI'}
]
```

### Result After Multi-Criteria Sort:
| Rank | Code | Designation | Qte Décimale | Sorting Rationale | Status |
| :---: | :---: | :--- | :---: | :--- | :---: |
| 0 | `OBJ004` | Bijou Or | 2026 | Highest quantity (Primary sort) | **PASS** |
| 1 | `OBJ001` | Amphore | 192 | Second highest quantity | **PASS** |
| 2 | `OBJ005` | Lampe | 46 | Equal quantity (46) — 'Lampe' < 'Stèle A' (Secondary sort) | **PASS** |
| 3 | `OBJ002` | Stèle A | 46 | Equal quantity (46) — 'Stèle A' < 'Stèle B' | **PASS** |
| 4 | `OBJ003` | Stèle B | 46 | Equal quantity (46) — 'Stèle B' comes last | **PASS** |

---

## 3. Dichotomic Search Precondition & Failure Proof Matrix

### Theoretical Context:
Dichotomic (binary) search divides the search interval $[\text{deb} \dots \text{fin}]$ in half based on comparison with $T[\text{mil}]$. This operation assumes monotonicity of the search attribute.

### Empirical Proof of Failure on Quantity-Sorted Array:
Consider 4 items sorted by quantity descending:
- Index 0: `OBJ200` (`qte_decimal`: 1000)
- Index 1: `OBJ100` (`qte_decimal`: 500)
- Index 2: `OBJ900` (`qte_decimal`: 50)
- Index 3: `OBJ500` (`qte_decimal`: 10)

Target: Search for code `'OBJ500'` (which exists at Index 3).

| Step | Interval [deb .. fin] | mil | T[mil]['code'] | Comparison vs 'OBJ500' | Action Taken | Failure Observation |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | [0 .. 3] | 1 | `'OBJ100'` | `'OBJ100' < 'OBJ500'` (True) | `deb = mil + 1 = 2` | Discards left half [0..1] |
| 2 | [2 .. 3] | 2 | `'OBJ900'` | `'OBJ900' < 'OBJ500'` (False) | `fin = mil - 1 = 1` | **FATAL ERROR:** Discards right half [2..3] containing target! |
| 3 | [2 .. 1] | — | — | `deb > fin` | Loop terminates | **Returns -1 (False Negative)!** |

### Empirical Proof of Success After Code Sort (`tri_selection_par_code`):
Sorted by code:
- Index 0: `OBJ100` (Bague)
- Index 1: `OBJ200` (Denier)
- Index 2: `OBJ500` (Aigle)
- Index 3: `OBJ900` (Collier)

Target: Search for code `'OBJ500'`.

| Step | Interval [deb .. fin] | mil | T[mil]['code'] | Comparison vs 'OBJ500' | Action Taken | Success Observation |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | [0 .. 3] | 1 | `'OBJ200'` | `'OBJ200' < 'OBJ500'` (True) | `deb = mil + 1 = 2` | Explores right half [2..3] |
| 2 | [2 .. 3] | 2 | `'OBJ500'` | `'OBJ500' == 'OBJ500'` (Match!) | **Return 2** | **Target successfully found!** |

---

## 4. Pickle File Handling & Persistence Edge Case Matrix

| Test Scenario | Input State | Operation | Expected Outcome | Observed Outcome | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Nonexistent File** | File path does not exist on disk | `charger_objets("absent.dat")` | Return `[]` cleanly without exception | Returned `[]` | **PASS** |
| **Empty File (0 Octets)** | File exists with size 0 bytes | `charger_objets("empty.dat")` | First `load(f)` raises `EOFError`; caught and returns `[]` | Returned `[]` | **PASS** |
| **Sequential Appends** | Multiple calls in mode `"ab"` | `dump(obj1)` then `dump(obj2)` | Both objects appended sequentially without truncation | Both records retrieved in order | **PASS** |
| **File Overwrite** | Single call in mode `"wb"` | `dump(new_obj)` | Previous records truncated, file contains only 1 record | Exactly 1 record present | **PASS** |

---

## 5. Verification Conclusion

Every algorithmic routine, edge case, and theoretical precondition present in Pilot Package 01 has been thoroughly tested, empirically verified, and formally documented. The implementation conforms 100% to Tunisian Baccalaureate standards.
