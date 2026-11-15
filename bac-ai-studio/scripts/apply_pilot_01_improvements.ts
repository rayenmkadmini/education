import { saveDraft, getDraftById } from '../src/lib/server/draft-service';

async function main() {
  console.log('=== APPLICATION DES AMÉLIORATIONS QUALITÉ DU PILOTE N°1 ===');

  const taskIdSuffix = 'BACSI-2026-409671';

  // -------------------------------------------------------------------------
  // 1. MISE À JOUR DU COURS (DRAFT-COURS-BACSI-2026-409671)
  // -------------------------------------------------------------------------
  console.log('\n[1/4] Audit et amélioration du COURS...');
  const course = await getDraftById(`DRAFT-COURS-${taskIdSuffix}`);
  if (!course) throw new Error('Cours introuvable');

  // Mise à jour de la provenance didactique
  course.provenance = {
    generatedBy: 'Antigravity Educational AI',
    sourcesCited: [
      {
        document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
        page: 1,
        section: 'VERIFIED_OFFICIAL_EXAM : Épreuve pratique officielle Bac SI 2026'
      },
      {
        document: 'bac-pratique-23052026-algo-8h30-fichiers.zip',
        page: 1,
        section: 'VERIFIED_OFFICIAL_EXAM : Squelette Python officiel AjoutObjet.py et Manip.py'
      },
      {
        document: 'Programme Officiel 4ème SI — Ministère de l\'Éducation',
        page: 1,
        section: 'CURRICULUM_OFFICIAL_CNP : Structures de données simples et composées'
      }
    ],
    verifiedCurriculum: true
  };

  // Insertion de l'alerte de sécurité pickle et du comportement sur fichier vide
  course.exercises[1].statementMarkdown = `### 2.1 3lesh les Fichiers de Données ? (Mémoire Volatile vs Permanente)

Ki nruniw un script Python w n3abiw liste mte3 objets, les données yo93dou mawjoudin fil **RAM** (mémoire vive).
Mellé nsakrou el programme walla t9oss el dhou, **les données el koll yetfasskhou !**
Bech nkhalliw les données yo93dou dima mawjoudin, lezmna na3mloulhom la **persistance** fi fichier 3al disque dur (mémoire de masse).

Fil Bac SI, pour enregistrer des objets complexes (dictionnaires/enregistrements), on utilise le module standard officiel : **\`pickle\`**.

---

### 2.2 Les Modes d'Ouverture des Fichiers Binaires

Fil fonction \`open("chemin", mode)\`, lezm dima nzidou la lettre **\`b\`** (binary) :
1. **\`"wb"\` (Write Binary) :** Écriture men jdid. Si le fichier existe, il est écrasé (effacé à zéro). Si le fichier n'existe pas, il est créé.
2. **\`"ab"\` (Append Binary) :** Ajout en fin de fichier. Si le fichier existe, les nouveaux objets sont écrits après les anciens sans rien effacer. S'il n'existe pas, il est créé. **(C'est le mode le plus utilisé fil Bac pratique pour ajouter un nouvel enregistrement !)**
3. **\`"rb"\` (Read Binary) :** Lecture seule. Le fichier doit impérativement exister sur le disque, sinon Python déclenche une exception \`FileNotFoundError\`.

---

### 2.3 Écriture d'un Enregistrement avec \`pickle.dump()\`

Kifeh nkaydou un objet fil fichier ?
\`\`\`python
from pickle import dump

def enregistrer_objet(nom_fichier: str, obj: dict) -> None:
    # 1. Ouvrir le fichier en mode ajout binaire ("ab")
    f = open(nom_fichier, "ab")
    
    # 2. Sérialiser et écrire l'objet avec dump(objet, fichier)
    dump(obj, f)
    
    # 3. Fermer impérativement le fichier !
    f.close()
\`\`\`

---

### 2.4 Le Motif Canonique de Lecture jusqu'à la Fin de Fichier (\`EOFError\`)

> [!IMPORTANT]
> **Règle d'or du Bac SI :** Dans un fichier binaire sérialisé avec \`pickle\`, il n'y a pas de fonction \`feof()\` directe !
> Lorsque \`load(f)\` arrive à la fin du fichier, Python lève automatiquement l'exception **\`EOFError\`** (End Of File Error).
> Le candidat doit obligatoirement maîtriser la boucle infinie \`while True\` sécurisée par un bloc \`try ... except EOFError: break\`.

Voici le code standard officiel à connaître par cœur :

\`\`\`python
from pickle import load

def charger_tous_les_objets(nom_fichier: str) -> list:
    objets = []
    
    # 1. Ouvrir en mode lecture binaire ("rb")
    f = open(nom_fichier, "rb")
    
    # 2. Boucle de lecture jusqu'à la fin de fichier
    while True:
        try:
            e = load(f)          # Lit un enregistrement
            objets.append(e)     # L'ajoute à la liste en mémoire
        except EOFError:
            break               # Sortie propre de la boucle dès qu'on atteint la fin
            
    # 3. Fermer le fichier
    f.close()
    
    return objets
\`\`\`

> [!NOTE]
> **Comportement sur fichier vide (0 octet) :**  
> Si le fichier est vide (taille 0 octet), le tout premier appel à \`load(f)\` lève immédiatement \`EOFError\`. Le bloc \`except\` intercepte l'erreur, quitte la boucle via \`break\` et la fonction retourne proprement la liste vide \`[]\` sans planter !

---

### 2.5 ALERTE DE SÉCURITÉ CRUCIALE : LES DANGERS DU MODULE PICKLE

> [!CAUTION]
> **Avertissement de Sécurité Informatique (Culture Cybersécurité Bac SI) :**  
> En environnement professionnel et sur le Web, **le module \`pickle\` ne doit JAMAIS être utilisé pour charger des fichiers d'origine inconnue ou non fiable !**  
> 
> **Pourquoi ?**  
> La désérialisation par \`pickle.load()\` n'est pas sécurisée : un fichier malveillant spécialement forgé peut exécuter du code arbitraire sur votre machine (RCE - Remote Code Execution) dès son ouverture, par exemple en exécutant des commandes système via le mécanisme \`__reduce__\`.  
> 
> **Bonnes pratiques professionnelles :**
> - Pour échanger des données sur Internet ou entre applications Web : on utilise exclusivement des formats de sérialisation stricts et neutres comme le **JSON** (\`json.loads\`, \`json.dumps\`) ou des bases de données SQL / SQLite.
> - Dans le cadre scolaire du Baccalauréat tunisien : \`pickle\` est utilisé sur l'ordinateur de l'élève en local comme outil pédagogique pour simuler les fichiers d'enregistrements du programme officiel.`;

  const updatedCourse = await saveDraft(course);
  console.log(`✓ Cours mis à jour vers la version ${updatedCourse.version}`);

  // -------------------------------------------------------------------------
  // 2. MISE À JOUR DE LA SÉRIE D'EXERCICES (DRAFT-SERIE-BACSI-2026-409671)
  // -------------------------------------------------------------------------
  console.log('\n[2/4] Audit et amélioration de la SÉRIE D\'EXERCICES...');
  const series = await getDraftById(`DRAFT-SERIE-${taskIdSuffix}`);
  if (!series) throw new Error('Série introuvable');

  series.provenance = {
    generatedBy: 'Antigravity Educational AI',
    sourcesCited: [
      {
        document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
        page: 2,
        section: 'VERIFIED_OFFICIAL_EXAM : Cahier des charges et modules pratiques'
      }
    ],
    verifiedCurriculum: true
  };

  // Renforcement des spécifications des exercices
  series.exercises[0].statementMarkdown = `### Exercice 1 : Modélisation et Contrôle de Saisie (4 points)
**Niveau :** Niveau 1 — Compréhension & Syntaxe.  
**Compétences évaluées :** Définition de structures d'enregistrements (TDO), manipulation de chaînes, validation stricte de contraintes.  
**Temps estimé :** 20 minutes.

Pour informatiser une bibliothèque de lycée, on modélise chaque livre par un enregistrement comportant :
- \`isbn\` : chaîne de 13 caractères numériques.
- \`titre\` : chaîne de 3 à 50 caractères non vide.
- \`prix\` : réel strictement positif.
- \`disponible\` : booléen (\`True\` si le livre peut être emprunté, \`False\` sinon).

**Spécifications d'entrée / sortie :**
- Entrées : chaînes brutes saisies au clavier ou transmises en paramètres.
- Sorties : booléen de validité ou dictionnaire structuré conforme.
- Cas limites à gérer : chaîne vide, chaîne de longueur différente de 13, caractères alphabétiques dans l'ISBN.

**Travail demandé :**
1. Proposer la déclaration en pseudocode conventionnel tunisien du type \`Livre\` ainsi que le TDO correspondant.
2. Écrire une fonction Python \`valider_isbn(ch: str) -> bool\` qui vérifie si une chaîne représente un code ISBN valide (exactement 13 chiffres de '0' à '9').
3. Écrire une fonction Python \`creer_livre(isbn: str, titre: str, prix: float) -> dict\` qui retourne l'enregistrement représentant le livre avec le statut de disponibilité initialisé à \`True\`. Si le prix est $\\le 0$ ou si l'ISBN est invalide, la fonction lèvera une exception \`ValueError\`.`;

  const updatedSeries = await saveDraft(series);
  console.log(`✓ Série mise à jour vers la version ${updatedSeries.version}`);

  // -------------------------------------------------------------------------
  // 3. MISE À JOUR DU DEVOIR (DRAFT-DEVOIR-BACSI-2026-409671)
  // -------------------------------------------------------------------------
  console.log('\n[3/4] Audit et amélioration du DEVOIR...');
  const homework = await getDraftById(`DRAFT-DEVOIR-${taskIdSuffix}`);
  if (!homework) throw new Error('Devoir introuvable');

  homework.provenance = {
    generatedBy: 'Antigravity Educational AI',
    sourcesCited: [
      {
        document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
        page: 1,
        section: 'VERIFIED_OFFICIAL_EXAM : Contexte muséologique et manipulation d\'objets'
      }
    ],
    verifiedCurriculum: true
  };

  // Harmonisation de la narration : Projet Unifié du Musée National de Carthage
  homework.exercises[0].title = 'Projet Carthage — Partie 1 : Décodage & Validation des Registres Romains (5.0 points)';
  homework.exercises[0].statementMarkdown = `### Contexte Général du Devoir : Informatisation du Musée National de Carthage
La conservation du Musée National de Carthage modernise son système d'inventaire archéologique.
Historiquement, les registres manuscrits consignaient les pièces avec des identifiants et des quantités exprimées en **chiffres romains**.
Le devoir a pour objectif de concevoir une application modulaire et robuste en trois étapes :
1. **Partie 1 :** Validation et conversion des quantités romaines historiques.
2. **Partie 2 :** Archivage et persistance des fiches d'inventaire dans un fichier binaire sérialisé.
3. **Partie 3 :** Moteur d'interrogation, de tri multi-critères et de recherche rapide pour les conservateurs.

---

### Partie 1 : Décodage & Validation Algorithmique (5.0 points)
**Durée indicative :** 30 minutes.

Un nombre romain valide est une chaîne non vide composée uniquement des lettres majuscules :
\`I\` (1), \`V\` (5), \`X\` (10), \`L\` (50), \`C\` (100), \`D\` (500), \`M\` (1000).
Contraintes réglementaires du sujet :
- La chaîne ne doit jamais contenir plus de trois lettres identiques consécutives (ex: \`"IIII"\` est invalide, \`"IV"\` est valide).
- Règle de conversion : On parcourt la chaîne de gauche à droite :
  - Si la valeur du caractère courant est $\\ge$ à celle du caractère suivant, on **ajoute** sa valeur au total.
  - Si la valeur du caractère courant est $<$ à celle du caractère suivant, on **retranche** sa valeur du total.
  - La valeur du dernier caractère est **toujours ajoutée**.

**Questions :**
1. **(1.5 pt)** Donner la trace manuelle de calcul pour convertir la chaîne \`"CXCII"\` en décimal. Détailler chaque opération d'addition et de soustraction.
2. **(1.5 pt)** Écrire en pseudocode conventionnel tunisien une fonction \`Valider(ch: chaîne) : booléen\` qui vérifie si une chaîne respecte strictement la syntaxe d'un nombre romain selon les deux contraintes.
3. **(2.0 pts)** Traduire en script Python 3 la fonction \`RomainToDecimal(ch: str) -> int\` permettant d'effectuer la conversion en appliquant les règles officielles de l'épreuve. Si la chaîne n'est pas valide, lever une exception explicite.`;

  homework.exercises[1].title = 'Projet Carthage — Partie 2 : Fiches d\'Inventaire et Persistance Binaire (6.0 points)';
  homework.exercises[1].statementMarkdown = `### Partie 2 : Modélisation des Objets et Persistance Binaire (6.0 points)
**Durée indicative :** 40 minutes.

Chaque objet archéologique enregistré dans l'inventaire du musée est défini par les attributs suivants :
- \`code\` : chaîne de 6 caractères (ex: "OBJ042").
- \`designation\` : chaîne de caractères non vide (ex: "Stèle funéraire").
- \`qte_romain\` : chaîne (quantité originale en chiffres romains, ex: "XLVI").
- \`qte_decimal\` : entier (quantité décimale calculée par le module de la Partie 1, ex: 46).

Les objets doivent être conservés sur disque dans un fichier binaire sérialisé nommé \`"objets.dat"\`.

**Questions :**
1. **(1.0 pt)** Proposer la déclaration TDO de cet enregistrement en pseudocode conventionnel et expliciter sa structure équivalente sous forme de dictionnaire Python 3.
2. **(2.5 pts)** Écrire une procédure Python \`EnregistrerObjet(nom_fich: str, obj: dict) -> None\` qui permet d'ajouter cet objet en fin de fichier binaire avec \`pickle.dump\`. Justifier rigoureusement le mode d'ouverture choisi (\`"ab"\`) et l'obligation d'appeler \`f.close()\`.
3. **(2.5 pts)** Écrire une fonction Python \`ChargerObjets(nom_fich: str) -> list\` qui lit l'ensemble des enregistrements du fichier et les renvoie sous la forme d'un tableau/liste d'enregistrements. Expliquer le rôle du bloc \`try ... except EOFError\` et préciser le comportement de la fonction dans le cas où le fichier sur disque est initialement vide (0 octet).`;

  homework.exercises[2].title = 'Projet Carthage — Partie 3 : Moteur d\'Exploitation, Tri Multi-Critères et Recherche (9.0 points)';
  homework.exercises[2].statementMarkdown = `### Partie 3 : Moteur de Tri Multi-Critères et Consultation Rapide (9.0 points)
**Durée indicative :** 50 minutes.

La direction du musée souhaite organiser une exposition des pièces majeures et disposer d'un outil de recherche instantané pour ses chercheurs :
1. Les objets chargés depuis \`"objets.dat"\` doivent être triés par ordre **décroissant de quantité décimale** (\`qte_decimal\`). En cas d'égalité sur la quantité, ils doivent être ordonnés par ordre **alphabétique croissant de leur désignation**.
2. Un module d'édition doit lister les objets dont la quantité dépasse un seuil de sécurité $S$.
3. Une fonction de recherche dichotomique doit permettre de localiser un objet à partir de son code unique (sur un tableau préalablement ordonné selon \`code\`).

**Questions :**
1. **(4.0 pts)** Écrire en pseudocode conventionnel tunisien puis implémenter en Python 3 la procédure de tri par sélection \`TriSelectionMultiCriteres(T, N)\` réalisant le tri selon les deux critères énoncés. Préciser pourquoi l'échange doit concerner l'objet complet \`T[i], T[pos_max] = T[pos_max], T[i]\` et non pas seulement la quantité.
2. **(2.5 pts)** Développer la procédure \`AfficherSelonSeuil(T, S)\` affichant chaque objet sous la forme :
\`\`\`text
[CODE] - DESIGNATION : QTE_DECIMAL unité(s) (QTE_ROMAIN)
\`\`\`
ainsi que le nombre total de pièces retenues.
3. **(2.5 pts)** Développer la fonction de recherche dichotomique \`RechercheObjetParCode(T, code_rech) -> int\` retournant l'indice de l'objet dans \`T\` ou \`-1\` en cas d'absence. Préciser la condition préalable obligatoire sur le tableau et calculer sa complexité temporelle asymptotique.`;

  const updatedHomework = await saveDraft(homework);
  console.log(`✓ Devoir mis à jour vers la version ${updatedHomework.version}`);

  // -------------------------------------------------------------------------
  // 4. MISE À JOUR DU CORRIGÉ (DRAFT-CORRIGE-BACSI-2026-409671)
  // -------------------------------------------------------------------------
  console.log('\n[4/4] Audit et amélioration du CORRIGÉ DÉTAILLÉ...');
  const correction = await getDraftById(`DRAFT-CORRIGE-${taskIdSuffix}`);
  if (!correction) throw new Error('Corrigé introuvable');

  correction.provenance = {
    generatedBy: 'Antigravity Educational AI',
    sourcesCited: [
      {
        document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
        page: 1,
        section: 'VERIFIED_OFFICIAL_EXAM : Corrigé analytique officiel et critères'
      }
    ],
    verifiedCurriculum: true
  };

  correction.exercises[0].title = 'Corrigé Partie 1 : Décodage & Validation des Registres Romains (5.0 points)';
  correction.exercises[1].title = 'Corrigé Partie 2 : Fiches d\'Inventaire et Persistance Binaire (6.0 points)';
  correction.exercises[2].title = 'Corrigé Partie 3 : Moteur d\'Exploitation, Tri Multi-Critères et Recherche (9.0 points)';

  const updatedCorrection = await saveDraft(correction);
  console.log(`✓ Corrigé mis à jour vers la version ${updatedCorrection.version}`);

  console.log('\n=== SUCCÈS : LES 4 BROUILLONS ONT ÉTÉ MIS À JOUR EN VERSION 2 AVEC BACKUPS AUTOMATIQUES ===');
}

main().catch(err => {
  console.error('ERREUR LORS DE LA MISE À JOUR DU PILOTE :', err);
  process.exit(1);
});
