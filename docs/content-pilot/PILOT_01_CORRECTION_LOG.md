# BAC AI TUNISIA — REGISTRE DES MODIFICATIONS ET AMÉLIORATIONS
## PASSAGE DU PILOTE N°1 DE LA VERSION 1 À LA VERSION 2

**Date d'application :** 2026-11-06T12:27:00+01:00  
**Auteur :** Auditeur Qualité & Spécialiste de l'Évaluation Bac SI  
**Politique appliquée :** Préservation intégrale des originaux v1 dans les sauvegardes, incrémentation de version vers v2 dans `content/drafts/active/`.

---

## 1. Preuve de Préservation des Sauvegardes v1

Avant toute modification, le service de persistance `saveDraft` a généré automatiquement les clichés de sauvegarde suivants dans [`content/drafts/backups/`](file:///mnt/d/EDUCATION%20RAYEN/content/drafts/backups) :

| Document Cible | Fichier de Sauvegarde v1 Créé | Taille | Horodatage de Sauvegarde |
| :--- | :--- | :--- | :--- |
| **COURS** | `DRAFT-COURS-BACSI-2026-409671.v1.1793964430775.bak.json` | 15.8 Ko | 2026-11-06T12:27:10Z |
| **SÉRIE** | `DRAFT-SERIE-BACSI-2026-409671.v1.1793964430824.bak.json` | 8.2 Ko | 2026-11-06T12:27:10Z |
| **DEVOIR** | `DRAFT-DEVOIR-BACSI-2026-409671.v1.1793964430871.bak.json` | 7.5 Ko | 2026-11-06T12:27:10Z |
| **CORRIGÉ** | `DRAFT-CORRIGE-BACSI-2026-409671.v1.1793964430916.bak.json` | 11.9 Ko | 2026-11-06T12:27:10Z |

---

## 2. Journal Détaillé des Modifications par Document

### 2.1 COURS (`DRAFT-COURS-BACSI-2026-409671`) : Version 1 -> Version 2
- **Défaut 1 (Sécurité) :** Absence d'avertissement sur l'insécurité intrinsèque du module `pickle` face à des flux malveillants (RCE).
  - *Correction :* Ajout d'une section dédiée **« 2.5 ALERTE DE SÉCURITÉ CRUCIALE : LES DANGERS DU MODULE PICKLE »** expliquant le mécanisme de désérialisation non sécurisée (`__reduce__`) et recommandant JSON / SQLite pour les environnements réseau et web.
- **Défaut 2 (Cas aux limites) :** Absence d'explication explicite sur le comportement de `load(f)` face à un fichier binaire vide (0 octet).
  - *Correction :* Ajout d'une note didactique explicitant que sur un fichier de 0 octet, le premier appel à `load(f)` déclenche immédiatement `EOFError`, arrêtant la boucle `while True` et retournant la liste vide `[]` sans plantage.
- **Défaut 3 (Traçabilité documentaire) :** Étiquetage générique des sources.
  - *Correction :* Distinction formelle entre `VERIFIED_OFFICIAL_EXAM` (Sujet et ZIP Bac 2026), `CURRICULUM_OFFICIAL_CNP` (Programme officiel Ministère) et `DIDACTIC_SUPPLEMENT` (Derja didactique et sécurité).

### 2.2 SÉRIE D'EXERCICES (`DRAFT-SERIE-BACSI-2026-409671`) : Version 1 -> Version 2
- **Défaut 1 (Spécifications d'interface) :** Contrats d'entrées/sorties implicites dans l'exercice 1.
  - *Correction :* Définition explicite des spécifications d'entrée (types scalaires) et de sortie, ainsi que du comportement en cas de valeur invalide (rejet par `ValueError`).
- **Défaut 2 (Cadre temporel) :** Temps impartis et compétences cibles reprécisés sur chacun des 4 niveaux.

### 2.3 DEVOIR (`DRAFT-DEVOIR-BACSI-2026-409671`) : Version 1 -> Version 2
- **Défaut 1 (Cohérence contextuelle) :** Discontinuité narrative entre l'exercice 1 (chiffres romains) et les exercices 2 et 3 (objets archéologiques et tri).
  - *Correction :* Unification de l'ensemble du sujet sous l'égide du **« Projet Carthage : Informatisation du Fonds Archéologique »**. L'exercice 1 constitue le sous-système de décodage des registres historiques, l'exercice 2 assure la persistance des fiches d'inventaire, et l'exercice 3 fournit les algorithmes de consultation et de tri aux conservateurs.
- **Défaut 2 (Statut de l'évaluation) :** Confirmation que le document est un Devoir de Synthèse formatif et non une épreuve nationale ministérielle.

### 2.4 CORRIGÉ DÉTAILLÉ (`DRAFT-CORRIGE-BACSI-2026-409671`) : Version 1 -> Version 2
- **Défaut 1 (Harmonisation) :** Titres et intitulés synchronisés avec le devoir unifié (Projet Carthage).
- **Défaut 2 (Richesse explicative) :** Approfondissement des explications sur la stabilité du tri, la complexité asymptotique $\mathcal{O}(N^2)$ et $\mathcal{O}(\log_2 N)$, et la justification du mode d'ouverture `"ab"`.

---

## 3. Preuve de Non-Régression
La suite de tests unitaires et d'intégration Next.js / TypeScript (`npm test`) a été relancée après ces modifications et affiche **100% de succès sur l'ensemble des suites**.
