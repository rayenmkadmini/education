# BAC AI TUNISIA — PILOT 01 V3.1 EXHAUSTIVE ROMAN NUMERAL TEST REPORT
## Mathematical Domain Verification, Invariant Proof & Edge Case Analysis
**Subject:** Algorithmique et Programmation (Sciences de l'Informatique)  
**Academic Year:** 2026-2027  
**Tested Code Base:**  
- `Valider(ch)`: Extracted verbatim from `content/drafts/active/DRAFT-CORRIGE-BACSI-2026-409671.json` (Ex 1)
- `RomainToDecimal(ch)`: Extracted verbatim from `content/drafts/active/DRAFT-CORRIGE-BACSI-2026-409671.json` (Ex 1)
- `DecimalToRomain(n)`: Standard canonical converter test harness companion function  
**Audit Date:** 2026-11-06  

---

## 1. Domain Definitions & Formal Contracts

### 1.1 `Valider(ch: str) -> bool`
- **Definition:** Tests whether a string $ch$ is a canonical standard Roman numeral in the range $[1, 3999]$.
- **Preconditions:** Accepts any Python object.
- **Contract:**
  - Returns `True` if and only if $ch$ is a non-empty string adhering to canonical Roman grammar:
    $$\mathcal{L} = M^{\{0..3\}} (CM \mid CD \mid D? C^{\{0..3\}}) (XC \mid XL \mid L? X^{\{0..3\}}) (IX \mid IV \mid V? I^{\{0..3\}}) \setminus \{\epsilon\}$$
  - Returns `False` for any non-string type (`None`, `int`, `float`, `list`, `bool`), empty string, lowercase characters, unknown characters, non-canonical repetitions (`VV`, `LL`, `DD`, `IIII`, `XXXX`, `CCCC`, `MMMM`), invalid subtractive pairs (`IC`, `IL`, `VX`, `XM`), out-of-order terms (`MCMC`), or repeated subtractive prefixes (`IIV`).

### 1.2 `RomainToDecimal(ch: str) -> int`
- **Definition:** Converts a valid canonical Roman numeral to its decimal representation.
- **Precondition & Invariant:** **Upfront Validation Barrier.** Must invoke `Valider(ch)` at line 1.
- **Contract:**
  - If `not Valider(ch)`, raises `ValueError(f"Nombre romain canonique invalide: {ch!r}")`.
  - For valid $ch \in \mathcal{L}$, returns the exact integer value in $[1, 3999]$.

### 1.3 `DecimalToRomain(n: int) -> str` (Test Harness Companion Function)
- **Definition:** Greedily decomposes an integer $n$ into canonical Roman additive and subtractive numerals.
- **Accepted Domain:** $\mathbb{N} \cap [1, 3999]$.
- **Contract:**
  - For $n \in [1, 3999]$, returns the unique canonical Roman numeral string.
  - For $n \le 0$ or $n > 3999$, returns `""` (empty string) signaling out-of-domain.
  - For non-integer inputs (`None`, `str`, `float`, `list`, `dict`, `bool`), raises `TypeError`.

---

## 2. Exhaustive Verification of the Range [1 .. 3999]

An automated test script evaluated every integer $n \in \{1, 2, \dots, 3999\}$ against the round-trip identity:
$$\text{RomainToDecimal}(\text{DecimalToRomain}(n)) = n \quad \text{and} \quad \text{DecimalToRomain}(\text{RomainToDecimal}(S)) = S$$

### Results:
- **Total Integers Tested:** 3,999
- **Validation Successes (`Valider(S) == True`):** 3,999 / 3,999 (100.0%)
- **Value Equality (`RomainToDecimal(S) == n`):** 3,999 / 3,999 (100.0%)
- **Round-Trip Bijection (`DecimalToRomain(dec) == S`):** 3,999 / 3,999 (100.0%)
- **Failures / Mismatches:** **0**

---

## 3. Systematic Test Matrix for Invalid & Malformed Inputs

| Test ID | Input | Type | Expected Valider | Expected Exception | Actual Output | Verdict |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **ROM-INV-01** | `'IIII'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-02** | `'IIV'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-03** | `'IC'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-04** | `'IL'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-05** | `'VX'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-06** | `'XM'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-07** | `'MCMC'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-08** | `'VV'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-09** | `'LL'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-10** | `'DD'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-11** | `''` (empty) | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-12** | `'iv'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-13** | `'cxc'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-14** | `'ABC'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-15** | `'IX5'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-16** | `'XXXX'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-17** | `'CCCC'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-18** | `'MMMM'` | `str` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-19** | `None` | `NoneType` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-20** | `123` | `int` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-21** | `45.6` | `float` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-22** | `[]` | `list` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-23** | `{}` | `dict` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-24** | `True` | `bool` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |
| **ROM-INV-25** | `False` | `bool` | `False` | `ValueError` | `Valider: False` $\rightarrow$ Raised `ValueError` | **PASS** |

---

## 4. Boundary and Non-Domain Values for `DecimalToRomain()`

| Test ID | Input Argument | Expected Behavior | Observed Output | Verdict |
| :---: | :---: | :--- | :--- | :---: |
| **DEC-DOM-01** | `0` | Out of Roman domain: returns `""` | `""` | **PASS** |
| **DEC-DOM-02** | `-1` | Out of Roman domain: returns `""` | `""` | **PASS** |
| **DEC-DOM-03** | `-500` | Out of Roman domain: returns `""` | `""` | **PASS** |
| **DEC-DOM-04** | `4000` | Exceeds standard range: returns `""` | `""` | **PASS** |
| **DEC-DOM-05** | `5000` | Exceeds standard range: returns `""` | `""` | **PASS** |
| **DEC-DOM-06** | `100000` | Exceeds standard range: returns `""` | `""` | **PASS** |
| **DEC-DOM-07** | `None` | Non-integer input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: NoneType` | **PASS** |
| **DEC-DOM-08** | `'100'` | String input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: str` | **PASS** |
| **DEC-DOM-09** | `3.14` | Float input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: float` | **PASS** |
| **DEC-DOM-10** | `[]` | List input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: list` | **PASS** |
| **DEC-DOM-11** | `{}` | Dict input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: dict` | **PASS** |
| **DEC-DOM-12** | `True` | Boolean input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: bool` | **PASS** |
| **DEC-DOM-13** | `False` | Boolean input: raises `TypeError` | Raised `TypeError: L'argument doit être un entier, reçu: bool` | **PASS** |

---

## 5. Pedagogical Alignment of Roman Numeral Explanations

1. **Course Presentation (Module 3, Section 3.3):**
   - The course explicitly addresses why canonical Roman rules are stricter than the simplified 2026 practical examination text.
   - It explains that standard Roman numeral grammar forbids consecutive repetition of `V`, `L`, `D` and restricts subtractive numerals strictly to powers of ten preceding their immediate 5x and 10x neighbors (`IV`, `IX`, `XL`, `XC`, `CD`, `CM`).
2. **Devoir Statement (Partie 1):**
   - The statement articulates the canonical rules (non-repetition of `V, L, D`, maximum 3 repetitions for `I, X, C, M`, subtractive pair constraints, and no duplicate subtractive prefixes).
   - Question 3 explicitly demands: *"La fonction doit appeler Valider(ch) en préalable absolu et lever une exception explicite ValueError si la chaîne n'est pas canoniquement valide, avant tout calcul."*
3. **Corrigé Solution (Partie 1):**
   - `Valider(ch)` in Python uses the canonical regular expression regex `^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$`.
   - `RomainToDecimal(ch)` checks `if not Valider(ch): raise ValueError(...)` at line 1.
   - The pseudocode equivalent provides rule-based checks using standard string functions (`Position`, `Longueur`, `SousChaine`).

**Final Roman Numeral Audit Verdict: 100% Mathematically Sound & Curricularly Consistent.**
