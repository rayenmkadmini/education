# BAC AI TUNISIA — REGISTRE DES VERROUS DE PRODUCTION ET AUTORISATIONS
## ANALYSE DES RESTRICTIONS, RISQUES ET FEUILLE DE ROUTE DE DÉBLOCAGE

**Date d'audit :** 2026-11-06T08:23:00+01:00  
**Statut Global du Studio Local :** **OPÉRATIONNEL SANS AUCUN BLOCAGE**  
**Statut du Déploiement Public Cloud :** **VERROUILLÉ EN ATTENTE D'AUTORISATION EXPLICITE**

---

## 1. Distinction Fondamentale : Local vs Cloud

| Périmètre | Statut Réel | Explication & Justification |
| :--- | :--- | :--- |
| **Studio Local de Production de Contenu (Auteur/Enseignant)** | **100% OPÉRATIONNEL (PASS)** | L'ensemble des 8 écrans, du pipeline de génération de tâches, d'import, d'édition, de révision, d'exportation A4 et de prévisualisation étudiante fonctionne localement sur le disque D: sans aucune dépendance cloud payante ni modèle LLM lourd. |
| **Plateforme Étudiante Publique Hébergée (Cloud)** | **VERROUILLÉ (BLOCKED)** | Le déploiement sur l'infrastructure cloud publique (Supabase PostgreSQL distant, Vercel Production, DNS) est volontairement suspendu pour respecter scrupuleusement la règle de sécurité interdisant toute modification d'infrastructure distante sans ordre de l'utilisateur. |

---

## 2. Registre Détaillé des Tâches Marquées `BLOCKED_PENDING_APPROVAL`

### Blocage 1 — `CLOUD-001` : Migration de la Base de Données Supabase
- **Composant :** Schéma de production SQL préparé dans `supabase/migrations/20261105_bac_ai_tunisia_schema.sql`.
- **Classification :** **`BLOCKED_PENDING_APPROVAL`**
- **Risque prévenu :** Altération intempestive d'une base de données de production distante sans validation humaine préalable.
- **Conditions pour débloquer :**
  1. L'utilisateur fournit les variables d'environnement distantes valides (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
  2. L'utilisateur émet l'ordre formel d'appliquer la migration SQL.

### Blocage 2 — `CLOUD-002` : Déploiement en Production sur Vercel
- **Composant :** Application Next.js 15.5.29 compilée (`.vercel/` et `vercel --prod`).
- **Classification :** **`BLOCKED_PENDING_APPROVAL`**
- **Risque prévenu :** Exposition publique prématurée de l'interface ou consommation de quotas d'hébergement.
- **Conditions pour débloquer :**
  1. L'utilisateur valide les résultats des tests d'acceptation locaux.
  2. L'utilisateur ordonne expressément l'exécution de la commande `vercel --prod`.

### Blocage 3 — `CLOUD-003` : Envoi vers le Dépôt Distant GitHub (Git Push)
- **Composant :** Dépôt Git local (`https://github.com/rayenmkadmini/education.git`).
- **Classification :** **`BLOCKED_PENDING_APPROVAL`**
- **Raison de sécurité :** Respect absolu de la consigne « No Git commit, push, pull, merge, reset, or force operations ».
- **Conditions pour débloquer :**
  1. L'utilisateur inspecte le `git status` et valide la liste des fichiers créés.
  2. L'utilisateur ordonne formellement de créer le commit et d'exécuter `git push origin main`.

### Blocage 4 — `OCR-001` : Traitement OCR des 2 Documents Scannés
- **Composant :** Fichiers scannés identifiés dans le catalogue (`Mathematiques_..._2026_Correction.pdf` et `Annexes html css sql php js 4si v2025_2.pdf`).
- **Classification :** **`BLOCKED_PENDING_APPROVAL`**
- **Justification :** L'extraction de texte de ces deux documents a révélé une densité $< 80$ caractères par page (watermark uniquement pour les mathématiques). L'installation d'outils OCR système lourds (ex. `tesseract-ocr` ou bibliothèques C++) n'est pas autorisée sans accord.
- **Option retenue :** Les documents restent correctement étiquetés `OCR_REQUIRED` dans le catalogue pour garantir l'honnêteté intellectuelle et éviter toute falsification de données.

---

## 3. Matrice de Prérequis pour le Passage en Déploiement Cloud

```
[ÉTAPE ACTUELLE]
Studio Local Stable & Opérationnel (D:\EDUCATION RAYEN)
       │
       ├──> Validation par l'utilisateur du rapport d'acceptation
       │
[DÉVERROUILLAGE ÉVENTUEL PAR L'UTILISATEUR]
       ├──> 1. git add . && git commit -m "feat: complete BAC AI Studio" && git push origin main
       ├──> 2. Configuration Supabase (URL + Clé de Service) & Exécution de la migration SQL
       └──> 3. Exécution de `vercel --prod` pour mise en ligne de la plateforme étudiante
```
