# BAC AI TUNISIA — MATRICE D'ÉVIDENCE DU CURRICULUM OFFICIEL
## SECTION : SCIENCES DE L'INFORMATIQUE (TUNISIE — 4ÈME ANNÉE SECONDAIRE)

**Horodatage de l'audit :** 2026-11-06T08:21:00+01:00  
**Inspecteur :** Auditeur Pédagogique et Technique Indépendant  
**Répertoire des sources :** `D:\EDUCATION RAYEN\bac info cours exam resourse` (71 fichiers authentiques)

---

## 1. Cadre Méthodologique de Classification des Évidences

Chaque élément du référentiel pédagogique fait l'objet d'une qualification stricte :
- **`VERIFIED_OFFICIAL`** : Affirmation directement corroborée par un manuel officiel du Centre National Pédagogique (CNP) ou une épreuve officielle du Baccalauréat tunisien (session principale ou contrôle) délivrée par le Ministère de l'Éducation.
- **`VERIFIED_SOURCE`** : Affirmation validée par des ressources pédagogiques authentiques d'enseignants tunisiens ou des sujets de travaux pratiques (TPs) réels, sans être un texte ministériel formel.
- **`NEEDS_VERIFICATION`** : Affirmation non corroborée de manière indiscutable par les 71 documents du disque D:, nécessitant une confirmation ministérielle complémentaire.
- **`INVENTED_OR_UNSUPPORTED`** : Allégation sans fondement documentaire (proscrite).

---

## 2. Matrice d'Évidence par Matière et Chapitre

### 2.1 Algorithmique et Programmation (`algo-prog`)
- **Coefficient officiel :** 3.0  
- **Durée de l'examen :** Épreuve écrite (3h00) + Épreuve pratique sur machine (1h30)  
- **Environnement logiciel officiel :** Python 3 (Thonny IDE), bibliothèque standard et paquet `thonny-tunisiaschools`. Calculatrice non autorisée.  
- **Statut global :** **`VERIFIED_OFFICIAL`**  
- **Source officielle de référence :** Manuel CNP Code `201403P00.pdf` (Manuel de cours 4ème SI) et `210402P00.pdf` (Travaux Pratiques).

| ID Chapitre | Titre du Chapitre | Concepts Clés Validés | Fichier Source Authentique | Page / Section Vérifiée | Statut d'Évidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `algo-structures` | Structures de données simples et composées | Types scalaires, chaînes de caractères (sans modules interdits), enregistrements (TDO), tableaux 1D/2D, fichiers texte et typés | `201403P00.pdf` | p. 12-65 (Chapitre 1) + Bac SI Écrit 2025/2026 | `VERIFIED_OFFICIAL` |
| `algo-modularite` | Modularité et Sous-Programmes | Fonctions, procédures, passage par valeur/variable, portée, interdiction du mot-clé `global` | `201403P00.pdf` | p. 70-112 (Chapitre 2) + Bac Pratique Samedi 23 Mai 2026 (8h30 & 11h30) | `VERIFIED_OFFICIAL` |
| `algo-recursivite` | La Récursivité | Cas d'arrêt (base), récurrence, arbre d'appels, formes terminale/non terminale | `201403P00.pdf` | p. 130-175 (Chapitre 3) + `Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf` (Ex. 2) | `VERIFIED_OFFICIAL` |
| `algo-tri-recherche` | Tris et Recherche | Tri à bulles optimisé, sélection, insertion, recherche séquentielle et dichotomique | `201403P00.pdf` | p. 180-220 (Chapitre 4) + `Algorithmique_et_programmation_Sciences_de_l_informatique_2025_Sujet.pdf` | `VERIFIED_OFFICIAL` |
| `algo-arithmetique-approximation` | Arithmétique & Approximation | PGCD/PPCM (Euclide), primalité & Crible, bases de numération (2, 8, 10, 16), rectangles, dichotomie | `201403P00.pdf` | p. 225-260 (Chapitre 5) + Bac SI Contrôle 2025 | `VERIFIED_OFFICIAL` |

---

### 2.2 Bases de Données Relationnelles (`base-donnees`)
- **Coefficient officiel :** 1.5  
- **Durée de l'examen :** Épreuve écrite intégrée (épreuve d'Informatique / STI)  
- **Environnement officiel :** SGBD relationnel MySQL / MariaDB (via phpMyAdmin / interface terminal).  
- **Statut global :** **`VERIFIED_OFFICIAL`**  
- **Source officielle de référence :** Manuel CNP `livre bd.pdf` et `Annexes html css sql php js 4si v2025_2.pdf`.

| ID Chapitre | Titre du Chapitre | Concepts Clés Validés | Fichier Source Authentique | Page / Section Vérifiée | Statut d'Évidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bd-relationnel` | Modèle relationnel et normalisation | Relation, attributs, clés primaires `#`, clés étrangères, 1FN, 2FN, 3FN | `livre bd.pdf` | p. 15-58 (Chapitres 1 & 2) + `resume bdr sgbdr et contraintes.pdf` | `VERIFIED_OFFICIAL` |
| `bd-sql-ddl-dml` | Langage SQL — LDD et LMD | `CREATE TABLE`, contraintes `PRIMARY KEY`, `FOREIGN KEY`, `CHECK`, `INSERT`, `UPDATE`, `DELETE` | `Annexes html css sql php js 4si v2025_2.pdf` & `bd_tezeghdenti_2027.sql` | p. 3-4 (Syntaxe SQL officielle) | `VERIFIED_SOURCE` (le script SQL est enseignant) |
| `bd-sql-select` | Requêtes complexes (SELECT) | `SELECT`, jointures `INNER JOIN`, agrégats `COUNT`, `SUM`, `AVG`, `GROUP BY`, `HAVING` | `livre bd.pdf` & `STI_..._2026_Sujet.pdf` | p. 95-142 + Sujet national Bac SI 2026 | `VERIFIED_OFFICIAL` |

---

### 2.3 Systèmes et Technologies de l'Informatique (`sti-systemes`)
- **Coefficient officiel :** 3.0  
- **Durée de l'examen :** Épreuve écrite (3h00) + Épreuve pratique (1h30)  
- **Statut global :** **`VERIFIED_OFFICIAL`**  
- **Sources officielles :** Épreuves nationales écrites et pratiques 2025 et 2026.

| ID Chapitre | Titre du Chapitre | Concepts Clés Validés | Fichier Source Authentique | Page / Section Vérifiée | Statut d'Évidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sti-architecture` | Architecture matérielle | CPU, ALU, registres, bus adresses/données/contrôle, hiérarchie mémoire RAM/ROM/cache | `STI_Systemes_..._2026_Sujet.pdf` | Exercice 1 (Questions d'architecture matérielle) | `VERIFIED_OFFICIAL` |
| `sti-reseaux` | Réseaux et protocoles | Modèles OSI et TCP/IP, classes IPv4, calcul de masques de sous-réseaux, équipements | `STI__Seance_de_8h30__groupe_1_..._2026.pdf` | Épreuve pratique officielle du 16 mai 2026 | `VERIFIED_OFFICIAL` |
| `sti-securite` | Sécurité et Cryptographie | Cryptographie symétrique (AES), asymétrique (RSA), hachage (SHA-256), certificats X.509 | `STI_Systemes_..._2025_Sujet.pdf` | Exercice thématique sécurité des systèmes | `VERIFIED_OFFICIAL` |

---

### 2.4 TIC & Développement Web (`tic-web`)
- **Coefficient officiel :** 1.5  
- **Format de travail :** Travaux Pratiques et intégration web client-serveur.  
- **Statut global :** **`VERIFIED_SOURCE`** (validé par les TPs réels du disque D:).  
- **Sources de référence :** Sujets de TP et captures d'écran des formulaires (`TP1_PHP_HTML.pdf`, `TP4 PHP Login.pdf`, `formulaire_html.png`, `Annexes html css sql php js 4si v2025_2.pdf`).

| ID Chapitre | Titre du Chapitre | Concepts Clés Validés | Fichier Source Authentique | Page / Section Vérifiée | Statut d'Évidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `web-html-css` | Structuration HTML5 & CSS3 | `<form>`, `<input>`, `<select>`, validation `required`, Flexbox | `TP1_PHP_HTML.pdf`, `formulaire_html.png` | Énoncé TP insertion et formulaire | `VERIFIED_SOURCE` |
| `web-javascript` | Validation client JavaScript | DOM `getElementById`, `onsubmit`, contrôles de champs, alertes | `Annexes html css sql php js 4si v2025_2.pdf` | p. 5 (Rappels syntaxiques JS) | `VERIFIED_OFFICIAL` |
| `web-php-mysql` | Traitement serveur PHP/MySQL | `$_POST`, `$_GET`, `mysqli_connect`, requêtes préparées, sessions | `TP4 PHP Login.pdf`, `tp1php.php`, `Correction TP3 PHP.jpg` | Code source réel TP login et insertion | `VERIFIED_SOURCE` |

---

### 2.5 Mathématiques SI (`mathematiques`)
- **Coefficient officiel :** 3.0  
- **Durée de l'examen :** Épreuve écrite (3h00), calculatrice scientifique autorisée.  
- **Statut global :** **`VERIFIED_OFFICIAL`**  
- **Sources officielles :** Manuel CNP Code `221402P00.pdf` et sujets nationaux 2025/2026.

| ID Chapitre | Titre du Chapitre | Concepts Clés Validés | Fichier Source Authentique | Page / Section Vérifiée | Statut d'Évidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `math-complexes` | Nombres complexes | Forme algébrique, trigonométrique, géométrie du plan complexe | `Mathematiques_..._2026_Sujet.pdf` | Exercice 1 | `VERIFIED_OFFICIAL` |
| `math-analyse-fonctions` | Analyse fonctionnelle | Continuité, TVI, dérivabilité, fonctions exponentielle et logarithme | `Mathematiques_..._2025_Sujet.pdf` | Problème d'analyse complet | `VERIFIED_OFFICIAL` |
| `math-suites-integrales` | Suites & Calcul intégral | Convergence de suites, primitives, intégration par parties, aires | `Mathematiques_..._2025_Correction.pdf` | Exercice 2 | `VERIFIED_OFFICIAL` |
| `math-probas` | Probabilités & Dénombrement | Analyse combinatoire, probabilités conditionnelles, loi binomiale | `Mathematiques_..._2026_Sujet.pdf` | Exercice 3 | `VERIFIED_OFFICIAL` |

---

### 2.6 Sciences Physiques SI (`sciences-physiques`)
- **Coefficient officiel :** 2.0  
- **Durée de l'examen :** Épreuve écrite (2h00), calculatrice autorisée.  
- **Statut global :** **`VERIFIED_OFFICIAL`**  
- **Sources officielles :** Manuel CNP Code `241403P00.pdf` et sujets nationaux 2025/2026.

| ID Chapitre | Titre du Chapitre | Concepts Clés Validés | Fichier Source Authentique | Page / Section Vérifiée | Statut d'Évidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `phys-electricite` | Circuits électriques | Dipôles RC, RL, oscillations libres amorties/non amorties RLC | `Sciences_physiques_..._2026_Sujet.pdf` | Partie Électricité | `VERIFIED_OFFICIAL` |
| `phys-ondes` | Ondes mécaniques & lumineuses | Propagation onde progressive, diffraction de la lumière $\theta = \lambda / a$ | `Sciences_physiques_..._2025_Sujet.pdf` | Partie Ondes | `VERIFIED_OFFICIAL` |

---

## 3. Inventaire des Autres Matières Présentes au Disque D:

Les matières suivantes disposent de manuels CNP et/ou d'épreuves officielles au sein des 71 fichiers, confirmant leur présence dans le tronc commun ou optionnel de la Section SI :
- **Français :** Manuels CNP `261401P01.pdf` & `261401P02.pdf`, Sujets d'examen 2025 & 2026.
- **Anglais :** Manuel CNP `281403P00.pdf`, Sujets d'examen 2025 & 2026.
- **Arabe :** Manuel CNP `291401P00.pdf`, Sujets d'examen 2025 & 2026.
- **Philosophie :** Sujet d'examen officiel `Philosophie_Sciences_de_l_informatique_2026_Sujet.pdf`.
- **Langues optionnelles :** `Allemand_..._2025_Sujet.pdf`, `Espagnol_..._2025_Sujet.pdf`, `Chinois_..._2025_Sujet.pdf`.
- **Informatique Complémentaire :** Manuel CNP `641404P00.pdf`.
