# BAC AI TUNISIA — AUDIT DE BOUT EN BOUT DU PARCOURS ÉTUDIANT (E2E)
## Student Journey Simulation, Usability & Isolation Verification

**Projet :** BAC AI Tunisia  
**Section :** Baccalauréat Sciences de l'Informatique (Tunisie) — Session 2026–2027  
**Date :** 9 Novembre 2026  
**Auditeur :** QA Automation Engineer & User Experience Tester  
**Document :** `docs/final-release-audit/STUDENT_E2E_AUDIT.md`  

---

## 1. Objectifs & Protocole de Test

Cet audit simule de bout en bout l'expérience réelle d'un élève de 4ème SI préparant son Baccalauréat sur la plateforme BAC AI Tunisia.  
Les tests ont été conduits sur les composants réels du projet, en confrontant le comportement observé aux exigences pédagogiques, ergonomiques et de sécurité.

---

## 2. Tableau Exhaustif des 18 Scénarios Étudiants Testés

| ID | Scénario Étudiant Testé | Comportement Attendu | Résultat Constaté | Statut |
| :---: | :--- | :--- | :--- | :---: |
| **ST-01** | Accès à la page d'accueil de l'Espace Étudiant | Chargement fluide, bannière institutionnelle Session 2026–2027 | Affichage immédiat du portail avec identité Navy `#14243A` | **PASS** |
| **ST-02** | Sélection de la Section Sciences de l'Informatique | Présence des 8 matières officielles avec coefficients | Sélecteur à pilules interactif affichant coefficients (Algo: 3, Maths: 3, etc.) | **PASS** |
| **ST-03** | Exploration des chapitres du programme officiel | Liste conforme aux manuels CNP (Récursivité, Tris, Enregistrements) | Dépliage structuré avec concepts clés et objectifs didactiques | **PASS** |
| **ST-04** | Ouverture d'un cours publié (`PUB-2026-409671-COURS`) | Rendu didactique bilingue Français / Derja tunisienne | Cours magistral clair, exemples concrets de musées tunisiens et objets archéologiques | **PASS** |
| **ST-05** | Lecture des formules mathématiques | Interprétation nette KaTeX sans caractères bruts | Formules $\mathcal{O}(n)$, $\sum$, factorielles rendues en typographie bleue | **PASS** |
| **ST-06** | Consultation & Copie du code Python | Coloration syntaxique, bouton de copie en 1 clic | Bloc `#0F172A` avec copie dans le presse-papier opérationnelle | **PASS** |
| **ST-07** | Consultation d'une série d'exercices publiée | Série progressive avec énoncés conformes Bac | Affichage de `PUB-2026-409671-SERIE` avec questions d'analyse | **PASS** |
| **ST-08** | Auto-évaluation & Dépliage du corrigé | Solutions masquées par défaut, affichage sur demande | Clic sur *Afficher la solution* déplie le corrigé pédagogique | **PASS** |
| **ST-09** | Consultation d'un devoir d'examen | En-tête officiel, durée fixée par l'enseignant, consignes claires | Devoir de contrôle affiché avec consignes Thonny et barème | **PASS** |
| **ST-10** | Consultation de la correction officielle du devoir | Solution étape par étape avec critères de notation | Corrigé complet affiché avec explications méthodologiques | **PASS** |
| **ST-11** | Recherche plein texte de notions | Filtrage dynamique par mot-clé (ex: `"tri"`, `"récursif"`) | Filtrage instantané des publications correspondantes | **PASS** |
| **ST-12** | Bascule en langue Arabe (RTL) | Passage en `dir="rtl"`, typographie arabe alignée à droite | Textes traduits en Arabe, interface inversée symétriquement | **PASS** |
| **ST-13** | Bascule en langue Française (LTR) | Passage en `dir="ltr"`, typographie latine standard | Affichage LTR classique avec polices système adaptées | **PASS** |
| **ST-14** | Navigation responsive sur smartphone (375px) | Aucun débordement horizontal, menu drawer accessible | Grille fluide 1-colonne, drawer coulissant via le Topbar | **PASS** |
| **ST-15** | Verrou d'étanchéité des brouillons non publiés | **0 brouillon exposé aux élèves** | Requête stricte sur `/api/publications`, 0 brouillon visible | **PASS** |
| **ST-16** | Rafraîchissement de la page (F5) | Maintien de l'état sans écran blanc | Les publications sont rechargées immédiatement | **PASS** |
| **ST-17** | Gestion des filtres sans résultat (Empty State) | Message didactique bienveillant | Affiche un message invitant à modifier les critères de recherche | **PASS** |
| **ST-18** | Protection contre la modification par l'élève | Impossibilité pour un élève de modifier un cours publié | Interface de lecture seule stricte, aucun bouton d'édition | **PASS** |

---

## 3. Analyse Détaillée des Scénarios de Sécurité Élève

### Scénario ST-15 : Étanchéité Stricte des Sujets d'Examens
* **Protocole Exécuté :**
  Inspection de la liste des fichiers sur disque :
  * Dossier `content/drafts/active/` : **10 brouillons en cours** (dont `DRAFT-DEVOIR-TEACHER-RECURSION-2026.json`).
  * Dossier `content/published/` : **3 publications homologuées**.
* **Comportement Observé :**
  Le composant `StudentPlatformView.tsx` ne charge et ne filtre que la liste issue de `/api/publications`. Le devoir en cours d'édition par l'enseignant n'apparaît à aucun endroit de l'interface étudiante.
* **Verdict :** **PASS (100% SÉCURISÉ CÔTÉ INTERFACE)**.

### Scénario ST-05 & ST-06 : Lisibilité Scientifique en Mode Arabe
* **Protocole Exécuté :**
  Activation de la langue Arabe (`lang="ar"`).
* **Comportement Observé :**
  Le texte de présentation s'affiche de droite à gauche en calligraphie arabe. En revanche, les blocs de code Python (`def tri_selection(t):`) et les formules mathématiques KaTeX restent strictement alignés de gauche à droite (`dir="ltr"`).
* **Verdict :** **PASS (ERGONOMIE SCIENTIFIQUE PARFAITE)**.

---

## 4. Bilan Global du Test E2E

Le parcours élève simulé sur la plateforme locale démontre une **excellente maturité fonctionnelle, pédagogique et visuelle** :
* Total des scénarios : **18**
* Validés (PASS) : **18 (100%)**
* Échoués (FAIL) : **0**
* L'expérience étudiante locale est déclarée **CONFORME ET PRÊTE POUR L'USAGE APPRENANT**.
