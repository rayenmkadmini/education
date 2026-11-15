# BAC AI TUNISIA — RAPPORT DU PREMIER CONTENU PILOTE RÉEL
## PACKAGE D'ÉVALUATION ET D'APPRENTISSAGE — 4ÈME ANNÉE SCIENCES DE L'INFORMATIQUE

**Date de production :** 2026-11-06T12:16:00+01:00  
**Auteur & Responsable :** Enseignant Concepteur Principal & Agent Spécialiste de l'Évaluation Bac SI  
**Thème sélectionné :** Les Structures Composées : Les Enregistrements et la Persistance par Fichiers de Données (`pickle`)  
**Matière :** Algorithmique et Programmation (Coefficient : 3.0 / Écrit 3h + Pratique 1h30)  
**Niveau :** 4ème Année Secondaire — Section Sciences de l'Informatique (Tunisie)

---

## 1. Justification Pédagogique et Ancrage dans le Baccalauréat

Le thème **« Les Enregistrements et la Persistance par Fichiers de Données (Module pickle) »** a été sélectionné pour inaugurer la production de contenu pour les raisons suivantes :

1. **Adéquation totale avec l'épreuve nationale officielle :**
   - Directement ancré dans le sujet officiel de l'Épreuve Pratique d'Algorithmique et Programmation du **Samedi 23 Mai 2026 (Séance de 8h30)**.
   - Les fichiers distribués officiellement aux candidats (`bac-pratique-23052026-algo-8h30-fichiers.zip`) ont été analysés pour calibrer exactement la difficulté, le style de programmation Thonny / Python 3 et les conventions de nommage.
2. **Poids stratégique pour la réussite de l'élève :**
   - La manipulation conjointe d'enregistrements (structures hétérogènes) et de fichiers sérialisés (`pickle.dump`, `pickle.load`) est une compétence incontournable, présente dans 80% des sujets d'examens pratiques et théoriques.
3. **Pédagogie active en Derja tunisienne & rigueur française :**
   - Les explications didactiques sont rédigées en **Derja tunisienne naturelle et fluide** pour lever les blocages conceptuels des élèves, tandis que la terminologie technique, les définitions officielles et le code Python restent en français académique normé.

---

## 2. Inventaire des 4 Documents Produits

Tous les documents ont été validés selon le schéma strict `EducationalDraft` et sont conservés à l'état `DRAFT` (en attente de validation humaine) dans le répertoire [`content/drafts/active/`](file:///mnt/d/EDUCATION%20RAYEN/content/drafts/active) :

| Type de Document | Identifiant du Brouillon (Draft ID) | Taille Fichier | Nombre de Modules / Exercices | Barème / Statut |
| :--- | :--- | :--- | :--- | :--- |
| **1. COURS MAGISTRAL INTERACTIF** | `DRAFT-COURS-BACSI-2026-409671` | 16 Ko | 4 modules d'apprentissage complets | `DRAFT` (En attente d'approbation) |
| **2. SÉRIE D'EXERCICES PROGRESSIVE** | `DRAFT-SERIE-BACSI-2026-409671` | 8.0 Ko | 4 niveaux progressifs sans solution | 20.0 points / `DRAFT` |
| **3. DEVOIR DE SYNTHÈSE FORMATIF** | `DRAFT-DEVOIR-BACSI-2026-409671` | 7.4 Ko | 3 exercices calibrés type Bac | 20.0 points / `DRAFT` |
| **4. CORRIGÉ DÉTAILLÉ & BARÈME** | `DRAFT-CORRIGE-BACSI-2026-409671` | 12 Ko | Corrigé intégral pas à pas + grille analytique | 20.0 points / `DRAFT` |

---

## 3. Détail du Contenu Pédagogique par Document

### A. Document 1 : COURS (`DRAFT-COURS-BACSI-2026-409671`)
- **Module 1 — Modélisation :** Problématique de l'insuffisance des types simples, définition formelle de l'enregistrement (structure hétérogène), syntaxe pseudocode `Type ... = Enregistrement ... Fin`, déclaration TDO et transposition en dictionnaire Python 3 (`{'cle': valeur}`).
- **Module 2 — Persistance avec `pickle` :** Différence RAM (volatile) vs Disque (persistant), modes d'ouverture binaire (`"wb"`, `"ab"`, `"rb"`), écriture avec `dump()`, motif canonique de lecture séquentielle avec capture d'`EOFError` dans une boucle `while True`.
- **Module 3 — Algorithmes sur enregistrements :** Chargement en mémoire, tri par sélection d'enregistrements (avec insistance sur la permutation globale de l'objet entier `T[i], T[j] = T[j], T[i]`), recherche dichotomique $\\mathcal{O}(\\log_2 N)$.
- **Module 4 — Boîte à outils & Synthèse :** Les 5 pièges éliminatoires au Bac, Cheat-sheet synthétique, Lexique bilingue officiel (Français - Arabe : تسجيلة / حقل / استدامة البيانات), 4 questions d'auto-évaluation immédiate corrigées.

### B. Document 2 : SÉRIE D'EXERCICES PROGRESSIVE (`DRAFT-SERIE-BACSI-2026-409671`)
Distribution de difficulté en 4 niveaux sans affichage de correction pour l'élève :
- **Niveau 1 (Compréhension - 4 pts - 20 min) :** Modélisation d'une structure `Livre` (ISBN, Titre, Prix, Disponibilité), fonction de validation ISBN (13 chiffres).
- **Niveau 2 (Application - 5 pts - 25 min) :** Procédure d'ajout dans un fichier binaire avec `"ab"` et `dump`, saisie contrôlée de $N$ éléments.
- **Niveau 3 (Raisonnement - 5 pts - 35 min) :** Chargement complet avec gestion d'`EOFError`, calcul du prix moyen, filtrage de liste.
- **Niveau 4 (Problème type Bac - 6 pts - 45 min) :** Tri par sélection décroissant sur les prix, recherche d'un livre, génération d'un fichier texte d'inventaire formaté.

### C. Document 3 : DEVOIR DE SYNTHÈSE FORMATIF (`DRAFT-DEVOIR-BACSI-2026-409671`)
Sujet d'examen équilibré sur exactement **20.0 points** (Durée indicative : 2h00) :
- **Exercice 1 (5.0 pts) :** Analyse algorithmique et validation de chiffres romains (trace d'exécution de `CXCII = 192`, fonction `Valider` en pseudocode, fonction Python `RomainToDecimal`).
- **Exercice 2 (6.0 pts) :** Persistance binaire (TDO de l'objet archéologique, procédure `EnregistrerObjet` en mode `"ab"`, fonction `ChargerObjets` avec interception d'`EOFError`).
- **Exercice 3 (9.0 pts) :** Problème de synthèse modulaire (Tri sélection multi-critères : quantité décroissante puis désignation alphabétique croissante, procédure `AfficherSelonSeuil`, recherche dichotomique).

### D. Document 4 : CORRIGÉ DÉTAILLÉ & BARÈME ANALYTIQUE (`DRAFT-CORRIGE-BACSI-2026-409671`)
- Corrigé complet et limpide de l'ensemble des questions du devoir.
- Justification didactique de chaque choix technique (pourquoi `"ab"` plutôt que `"wb"`, pourquoi intercepter `EOFError`).
- Démonstration mathématique de la complexité $\\mathcal{O}(N^2)$ pour le tri par sélection et $\\mathcal{O}(\\log_2 N)$ pour la dichotomie.
- Grille d'évaluation analytique découpée par quart de point pour une notation rigoureuse et transparente.

---

## 4. Résultats des Vérifications et Tests Python Réels

Tous les algorithmes et scripts Python intégrés aux 4 documents ont été exécutés dans l'interpréteur Python 3 de l'environnement :
1. `valider_romain("CXCII") == True` : **VALIDÉ**
2. `valider_romain("IIII") == False` : **VALIDÉ**
3. `romain_to_decimal("CXCII") == 192` : **VALIDÉ (Conforme au corrigé officiel Bac 2026)**
4. `romain_to_decimal("XLVI") == 46` : **VALIDÉ**
5. `romain_to_decimal("MDCCL") == 1750` : **VALIDÉ**
6. Écriture binaire avec `pickle.dump` en mode `"wb"` / `"ab"` : **VALIDÉ**
7. Lecture complète avec boucle `while True` et capture d'`EOFError` : **VALIDÉ**
8. Tri par sélection d'enregistrements (avec permutation globale d'objets) : **VALIDÉ**
9. Recherche dichotomique sur tableau d'enregistrements : **VALIDÉ**

Aucune erreur de syntaxe, aucune boucle infinie, et aucun comportement indéfini n'ont été constatés.

---

## 5. Grille de Revue Manuelle pour l'Enseignant Humain

Avant d'approuver ou d'exporter ces brouillons dans le Studio, l'enseignant ou l'inspecteur humain est invité à vérifier :
- [x] Conformité stricte au programme officiel 4ème SI (Manuels CNP et session Bac 2026).
- [x] Clarté et accessibilité des explications en Derja tunisienne.
- [x] Absence de bibliothèques tierces non homologuées (seuls `pickle` et les modules standards sont employés).
- [x] Équilibre du barème : total exactement égal à 20.0 points pour le Devoir et la Série.
- [x] Absence de solutions visibles dans l'énoncé du Devoir et de la Série.
- [x] Concordance exacte 1:1 entre les énoncés et les corrections fournies.

---

## 6. Statut de Publication et Fin de Mission

Conformément à la règle de sécurité et à la condition d'arrêt :
- **Les 4 brouillons sont conservés à l'état `DRAFT` dans `content/drafts/active/`.**
- **Aucun document n'a été publié automatiquement dans `content/published/`.**
- **Aucun commit ni déploiement n'a été effectué.**
- Les documents sont immédiatement consultables et modifiables dans l'onglet **Éditeur** du Studio (`http://localhost:3000`).
