# BAC AI TUNISIA — DOSSIER DE PREUVES ET ANCRAGE DOCUMENTAIRE DU PILOTE
## THEME PILOTE 1 : LES ENREGISTREMENTS ET LA PERSISTANCE PAR FICHIERS DE DONNÉES (`pickle`)

**Date :** 2026-11-06T12:12:00+01:00  
**Section :** 4ème Année Secondaire — Sciences de l'Informatique (Tunisie)  
**Matière :** Algorithmique et Programmation (Coeff. 3.0)  
**Rôle :** Enseignant Concepteur Principal et Spécialiste de l'Évaluation Bac SI

---

## 1. Justification du Choix du Sujet Pilote

Pour ce premier contenu pilote de haute précision, le thème **« Les Structures Composées : Les Enregistrements et la Persistance par Fichiers Typés (Module pickle) »** a été retenu pour les raisons pédagogiques et documentaires indiscutables suivantes :

1. **Ancrage direct dans une épreuve nationale officielle réelle (Bac 2026) :**
   - L'épreuve pratique nationale officielle du **Samedi 23 Mai 2026 à 8h30** (Section Sciences de l'Informatique) porte intégralement sur la manipulation d'objets structurés (enregistrements d'objets archéologiques), leur validation algorithmique, leur sérialisation dans un fichier de données avec le module standard `pickle`, leur rechargement séquentiel jusqu'à `EOFError`, et leur tri avant affichage.
2. **Poids déterminant dans l'évaluation du Baccalauréat SI :**
   - Les enregistrements et les fichiers typés figurent systématiquement à la fois dans les épreuves pratiques de mai (sur 20 points, coeff. 1) et dans les épreuves écrites de juin (Exercice de synthèse modulaire, coeff. 3).
3. **Double niveau d'abstraction essentiel pour l'élève tunisien :**
   - Modélisation conceptuelle en pseudocode conventionnel tunisien (TDO : Tableau de Déclaration des Objets, `Type Nom = Enregistrement ... Fin`).
   - Implémentation concrète en Python 3 sous Thonny (dictionnaires structurés ou classes, fichiers binaires avec `pickle.dump` et `pickle.load`).
4. **Volume textuel authentique disponible :**
   - Le sujet officiel `Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf` fournit 10 237 caractères de directives officielles, de barème officiel et de structures de données.
   - L'archive `bac-pratique-23052026-algo-8h30-fichiers.zip` fournit le squelette exact du code Python distribué aux candidats.

---

## 2. Inventaire Exhaustif des Documents Sources Utilisés

| Référence du Fichier | Nature du Document | Statut Documentaire | Pages / Sections Exploitées | Éléments Pédagogiques Extraits |
| :--- | :--- | :--- | :--- | :--- |
| `Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf` | Épreuve Pratique Nationale Officielle Bac 2026 (Ministère de l'Éducation) | **VERIFIED_OFFICIAL** | Pages 1/5 à 5/5 | Structure de l'enregistrement (Désignation, Quantité convertie), règles de validation des chaînes, enregistrement dans fichier avec `pickle`, lecture séquentielle jusqu'à fin de fichier, tri d'enregistrements, barème officiel (8.25 pts et 9.75 pts). |
| `bac-pratique-23052026-algo-8h30-fichiers.zip` | Fichiers informatiques distribués aux candidats (dossier Ressources) | **VERIFIED_OFFICIAL** | `AjoutObjet.py` et `Manip.py` | Importations officielles (`from pickle import load, dump`), boucle `while` de validation de chaîne, squelette de l'interface graphique. |
| `Algorithmique_et_programmation__Seance_de_11h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf` | Épreuve Pratique Nationale Officielle Bac 2026 (Séance 11h30) | **VERIFIED_OFFICIAL** | Pages 1/5 à 5/5 | Conventions de gestion des fichiers textes et matrices, modularité (`RechAffZones`, `Remplissage`). |
| `Annexes html css sql php js 4si v2025_2.pdf` | Document officiel d'annexes pour les candidats du Bac SI | **VERIFIED_OFFICIAL** | Section Python & conventions | Rappels des types standards, manipulations de listes et dictionnaires. |

---

## 3. Analyse Didactique et Traçabilité des Concepts

### 3.1 Définition et Modélisation de l'Enregistrement
- **Pseudocode officiel tunisien :**
  ```text
  Type
      ObjetArcheo = Enregistrement
          designation : chaîne
          qte_romain  : chaîne
          qte_decimal : entier
      Fin
  ```
- **Équivalent Python 3 normalisé au Bac SI :**
  ```python
  # Représentation par dictionnaire standard (conforme Thonny et sujet officiel 2026)
  objet = {
      'designation': designation,
      'qte_romain': qte_romain,
      'qte_decimal': qte_decimal
  }
  ```

### 3.2 Persistance et Sérialisation (`pickle`)
- **Écriture (Ajout en fin de fichier) :**
  ```python
  from pickle import dump
  f = open("objets.dat", "ab")  # Mode binaire d'ajout
  dump(objet, f)
  f.close()
  ```
- **Lecture complète avec détection de fin de fichier (`EOFError`) :**
  ```python
  from pickle import load
  f = open("objets.dat", "rb")  # Mode binaire de lecture
  objets = []
  while True:
      try:
          e = load(f)
          objets.append(e)
      except EOFError:
          break
  f.close()
  ```

### 3.3 Traitements algorithmiques sur tableau d'enregistrements
- Tri par sélection (ou tri à bulles) d'un tableau d'enregistrements selon la clé `qte_decimal` décroissante ou `designation` alphabétique.
- Recherche séquentielle et recherche dichotomique dans un tableau d'enregistrements.
- Filtrage conditionnel et mise à jour de données persistées.

---

## 4. Vérification d'Incertitudes et Limites Documentaires

1. **Format des fichiers typés au Bac :** Le programme tunisien utilise le module standard `pickle` sous Python 3 pour simuler les fichiers d'enregistrements (`fichiers typés`) de l'ancien Pascal. Les modes d'ouverture formels sont `"ab"` (ajout binaire), `"rb"` (lecture binaire) et `"wb"` (création/réécriture binaire).
2. **Pas d'extrapolations :** Aucune bibliothèque tierce non autorisée au Bac (comme `pandas` ou `dataclasses`) n'est introduite. Seuls `pickle`, `numpy` (pour tableaux/matrices), et les types standards Python (`str`, `int`, `float`, `list`, `dict`) sont employés.
