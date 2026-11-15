# BAC AI Tunisia — Design System Specification
**Concept:** Editorial Education + Premium Minimal SaaS  
**Version:** 2.0 (Redesign)  
**Status:** Approved & Implemented  

---

## 1. Color Palette Tokens

The design system replaces heavy neon dark themes with a crisp, calm editorial palette:

| Token Name | Hex Code | Purpose & Application |
| :--- | :---: | :--- |
| `primary-navy` | `#14243A` | Primary brand color, headers, primary action buttons, dark mode surfaces. |
| `secondary-navy`| `#203751` | Subtle secondary brand elements, active sidebar items, emphasized titles. |
| `accent-blue` | `#3478B8` | Focused links, primary button hover states, interactive tab indicators. |
| `accent-blue-soft`| `#EBF2F9`| Selected row highlights, light badges, active state background. |
| `background` | `#F6F7F9` | Page body background (clean, calm, reducing visual glare). |
| `surface` | `#FFFFFF` | Primary content cards, tables, editor canvas, modal dialogs. |
| `surface-subdued`| `#FAFCFF` | Subtle inset panels, code header bars, secondary table headers. |
| `border` | `#E5E9EF` | Standard card dividers, table borders, input borders. |
| `border-subdued`| `#EDF2F7` | Delicate inner dividers, subtle row separators. |
| `text-primary` | `#202B38` | Primary reading text, headings, table contents (high contrast). |
| `text-secondary`| `#718096` | Subheadings, metadata labels, breadcrumbs, descriptions. |
| `text-tertiary` | `#A0AEC0` | Disabled text, subtle icon strokes, placeholder text. |
| `success` | `#27835C` | Approved status, verified badges, correct solutions (light: `#EBF5F0`). |
| `warning` | `#C58A32` | Draft status, needs OCR, unverified sources (light: `#FEF8EC`). |
| `danger` | `#C34E4E` | Rejected status, validation errors, deletion actions (light: `#FDF2F2`). |

---

## 2. Typography System

### 2.1 Typefaces
* **Latin Typography:** `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif`
* **Arabic Typography:** `"IBM Plex Sans Arabic", "Noto Sans Arabic", Tahoma, sans-serif`
* **Code & Monospace:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace`

### 2.2 Scale & Hierarchy
* **Page Display Title (`h1`):** `20px` to `24px` | Font weight: `700` | Line height: `1.25`
* **Section Heading (`h2`):** `16px` to `18px` | Font weight: `600` | Line height: `1.3`
* **Card/Subheading (`h3`):** `14px` to `15px` | Font weight: `600` | Line height: `1.4`
* **Body Text (`p`, `span`):** `13px` to `14px` | Font weight: `400` | Line height: `1.5`
* **Captions & Metadata:** `11px` to `12px` | Font weight: `500` | Line height: `1.4`

---

## 3. Spacing, Elevation & Shapes

* **Corner Radii:**
  * Small: `rounded-md` (`6px`) for buttons, badges, input fields.
  * Medium: `rounded-lg` (`8px`) for compact cards, list items, search inputs.
  * Large: `rounded-xl` (`12px`) for main content cards, editor frames, dialogs.
* **Shadows:**
  * Subtle elevation: `box-shadow: 0 1px 2px rgba(20, 36, 58, 0.05)`
  * Floating card / modal: `box-shadow: 0 4px 12px rgba(20, 36, 58, 0.08)`
  * Zero neon blur or glowing box-shadows.

---

## 4. Layout Architecture: Compact Sidebar + Contextual Topbar

```
+----------------------------------------------------------------------------------------------------+
|  [LOGO] BAC AI TUNISIA             Top Bar: [Breadcrumb]                   [FR | عربي | EN] [Status]|
+-------------------+--------------------------------------------------------------------------------+
| STUDIO DE CRÉATION|                                                                                |
| - Dashboard       |                                                                                |
| - Générateur      |                         MAIN CONTENT CANVAS                                    |
| - Éditeur         |                      (Background: #F6F7F9)                                     |
|                   |                      (Surface: #FFFFFF, Border: #E5E9EF)                       |
| KNOWLEDGE & REF   |                                                                                |
| - Bibliothèque    |                                                                                |
| - Programme SI    |                                                                                |
|                   |                                                                                |
| VALIDATION & EXP  |                                                                                |
| - Révision        |                                                                                |
| - Export          |                                                                                |
|                   |                                                                                |
| ESPACE ÉLÈVE      |                                                                                |
| - Plateforme      |                                                                                |
+-------------------+--------------------------------------------------------------------------------+
```

---

## 5. Bidirectional (RTL / LTR) Architecture

* **HTML Direction:** `dir="rtl"` applied when Arabic is selected.
* **Logical Properties:** All margins, paddings, and borders use CSS logical directions (`margin-inline-start`, `padding-inline-end`, `text-align: start`).
* **Protected LTR Blocks:**
  * Code blocks (`pre`, `code`, `.code-container`) are **strictly LTR** with monospace font and left text alignment.
  * Mathematical equations (KaTeX formulas) are **strictly LTR** to prevent equation reversal.
  * Form inputs containing file paths or Python variables remain LTR.
