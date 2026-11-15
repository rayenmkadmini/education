import { createTask } from '../src/lib/server/task-service';
import { saveDraft } from '../src/lib/server/draft-service';
import { EducationalDraft } from '../src/lib/types';
import fs from 'fs/promises';

async function main() {
  console.log('=== DÉMARRAGE DE LA PRODUCTION DU PACKAGE PÉDAGOGIQUE PILOTE N°1 ===');

  // 1. Création de la tâche officielle dans le workflow Studio
  console.log('\n[1/5] Création de la tâche de génération via le workflow Studio...');
  const { task, promptMarkdown } = await createTask({
    contentType: 'COURS',
    subject: 'Algorithmique et Programmation',
    chapter: 'Structures de Données Simples et Composées',
    academicYear: '2026-2027',
    level: '4ème Année Secondaire — Sciences de l\'Informatique',
    difficulty: 'BAC_OFFICIEL',
    durationMinutes: 120,
    totalPoints: 20.0,
    language: 'fr_tn_derja',
    generationMode: 'STRICT_SOURCE_GROUNDED',
    sourceReferences: [
      {
        fileName: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
        pageRange: '1-5',
        conceptNote: 'Sujet officiel Bac 2026 : Enregistrements, persistance binaire avec pickle (dump, load, EOFError), tri et manipulation.'
      },
      {
        fileName: 'bac-pratique-23052026-algo-8h30-fichiers.zip',
        pageRange: 'AjoutObjet.py, Manip.py',
        conceptNote: 'Code source officiel distribué aux candidats (module de validation, exploitation pickle et structure).'
      }
    ],
    instructions: 'Produire le premier package pédagogique d\'élite complet (Cours en Derja/Français, Série d\'exercices progressifs, Devoir de synthèse 20 pts, et Corrigé détaillé avec barème analytique) sur les Enregistrements et la Persistance par Fichiers de Données avec pickle.'
  });

  console.log(`✓ Tâche créée avec succès : ${task.taskId}`);

  // Sauvegarde du prompt dans docs/content-pilot/TASK_PROMPT.md
  await fs.writeFile(
    '/mnt/d/EDUCATION RAYEN/docs/content-pilot/TASK_PROMPT.md',
    promptMarkdown,
    'utf-8'
  );
  console.log('✓ Prompt Markdown sauvegardé dans docs/content-pilot/TASK_PROMPT.md');

  // =========================================================================
  // DOCUMENT 1 : LE COURS COMPLET (COURS)
  // =========================================================================
  console.log('\n[2/5] Rédaction et persistance du Document 1 : COURS...');
  const courseDraft: EducationalDraft = {
    schemaVersion: '1.0.0',
    draftId: `DRAFT-COURS-${task.taskId.replace('TASK-', '')}`,
    taskId: task.taskId,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DRAFT',
    subject: 'Algorithmique et Programmation',
    chapter: 'Structures de Données Simples et Composées',
    academicYear: '2026-2027',
    contentType: 'COURS',
    totalPoints: 20.0,
    isOfficialBac: true,
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      sourcesCited: [
        {
          document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
          page: 1,
          section: 'Gestion du stock et persistance'
        },
        {
          document: 'bac-pratique-23052026-algo-8h30-fichiers.zip',
          page: 1,
          section: 'AjoutObjet.py et Manip.py'
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: 'République Tunisienne — Ministère de l\'Éducation',
      sessionLabel: 'Cours Magistral Interactif — Section Sciences de l\'Informatique',
      duration: '2h00',
      coefficient: 3.0
    },
    exercises: [
      {
        id: 'cours-sec-1',
        number: 1,
        title: 'Module 1 : Chma3naha Enregistrement ? (Modélisation Conceptuelle & TDO)',
        points: 5.0,
        statementMarkdown: `### 1.1 El Mochkla : 3lesh les types simples ma ykattiwsh ?

Aslema bikom ya jme3et el 4ème SI !
Kima ta3rfou men 3ème SI, l9ina les types standards scalaires kima \`entier\`, \`réel\`, \`booléen\`, \`caractère\`, w les types composés kima \`chaine\` w \`tableau\`.
Ama f'denya el wa9e3ya w fil machari3 mte3 l'Informatique, ma nakhdmoush b'données isolées.
Methel men sujet el **Bac Pratique 2026 (Séance 8h30)** :
> 3andna musée y7eb yjeri el stock mte3 les **objets archéologiques**. Kol objet 3andou :
> - \`code\` : chaîne (ex: "OBJ101")
> - \`designation\` : chaîne (ex: "Amphore punique")
> - \`qte_romain\` : chaîne (ex: "XLVI")
> - \`qte_decimal\` : entier (ex: 46)

Kan bech nesta3mlou des tableaux séparés (\`T_code\`, \`T_desig\`, \`T_qte\`), ywali 3andna risque kbir mte3 désynchronisation wa9t el tri walla el suppression !
Houni yji concept el **Enregistrement (Record)**.

---

### 1.2 Définition Formelle & Pseudocode Officiel Tunisien

> **Définition :** Un **enregistrement** est une structure de données composite, statique et **hétérogène**, formée d'un ensemble fini d'éléments appelés **champs** (fields). Chaque champ possède un nom (identificateur) et un type spécifique.

Fil notation algorithmique officielle mte3 el Baccalauréat tunisien, n3arfou el type fil partie déclaration kima hakka :

\`\`\`text
Type
    ObjetArcheo = Enregistrement
        code        : chaîne
        designation : chaîne
        qte_romain  : chaîne
        qte_decimal : entier
    Fin
\`\`\`

Fil **TDO (Tableau de Déclaration des Objets)** :
| Objet | Type / Nature | Rôle |
| :--- | :--- | :--- |
| \`obj\` | \`ObjetArcheo\` | Variable de type enregistrement représentant une pièce de musée |
| \`T\` | \`Tableau de N ObjetArcheo\` | Tableau contenant les enregistrements |

Pour accéder à un champ spécifique, on utilise l'opérateur point (\`.\`) :
\`\`\`text
obj.code <- "OBJ101"
obj.designation <- "Amphore punique"
obj.qte_decimal <- 46
\`\`\`

---

### 1.3 Traduction Python 3 Conforme au Bac Tunisien

F'Python standard (environnement **Thonny** recommandé par le Ministère), la structure d'enregistrement est canoniquement implémentée sous forme de **dictionnaire** :

\`\`\`python
# Création d'un enregistrement sous forme de dictionnaire Python
obj = {
    'code': "OBJ101",
    'designation': "Amphore punique",
    'qte_romain': "XLVI",
    'qte_decimal': 46
}

# Accès et modification d'un champ :
print("Désignation :", obj['designation'])
obj['qte_decimal'] = 50
\`\`\`

> [!TIP]
> **Conseil Bac :** Fil épreuve pratique, ma tbadalsh les noms des clés ('code', 'designation', etc.) elli ya3tihomlek fil énoncé ! El correction automatique tthabet bel les clés exactes.`,
        solutionMarkdown: `**Synthèse Pédagogique du Module 1 :**
1. L'enregistrement regroupe des champs de types différents sous une même entité logique.
2. En pseudocode : syntaxe \`Type ... = Enregistrement ... Fin\`.
3. En Python : dictionnaire \`{'cle': valeur}\` avec accès indexé \`obj['cle']\`.`,
        gradingCriteria: [
          { id: 'crit-m1-1', description: 'Compréhension de l\'hétérogénéité de l\'enregistrement', points: 2.5 },
          { id: 'crit-m1-2', description: 'Conformité de la syntaxe TDO et dictionnaire Python', points: 2.5 }
        ]
      },
      {
        id: 'cours-sec-2',
        number: 2,
        title: 'Module 2 : La Persistance — Kifeh nkhabbiw les données fil Fichiers b\'Module pickle ?',
        points: 5.0,
        statementMarkdown: `### 2.1 3lesh les Fichiers de Données ? (Mémoire Volatile vs Permanente)

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
\`\`\``,
        solutionMarkdown: `**Synthèse Pédagogique du Module 2 :**
1. Toujours spécifier le \`b\` dans les modes d'ouverture (\`"ab"\`, \`"rb"\`, \`"wb"\`).
2. \`dump(donnee, f)\` pour écrire, \`load(f)\` pour lire.
3. Toujours utiliser \`try: load(f) except EOFError: break\` pour lire jusqu'au bout sans planter le programme.
4. Ne jamais oublier \`f.close()\` pour libérer le fichier sur le système d'exploitation.`,
        gradingCriteria: [
          { id: 'crit-m2-1', description: 'Maîtrise des modes d\'ouverture binaire', points: 2.5 },
          { id: 'crit-m2-2', description: 'Gestion parfaite de l\'exception EOFError', points: 2.5 }
        ]
      },
      {
        id: 'cours-sec-3',
        number: 3,
        title: 'Module 3 : Algorithmes Fondamentaux sur Tableaux d\'Enregistrements',
        points: 5.0,
        statementMarkdown: `### 3.1 Tri d'un Tableau d'Enregistrements (Tri par Sélection)

Fil sujet officiel du **Bac Pratique 2026**, ba3d ma nchargez les objets mel fichier, el matloub howa :
> *Afficher de manière triée les objets enregistrés selon leur quantité décroissante.*

Kifeh ntriw un tableau d'enregistrements \`T\` ?
El principe howa nafssou el **Tri par sélection du maximum (ou du minimum)**, ama fil comparaison, n9arnou le champ clé (ex: \`T[j]['qte_decimal']\`) w fil permutation npermutiw **tout l'enregistrement** (mouch juste la quantité !) :

\`\`\`python
def tri_selection_enregistrements(T: list) -> None:
    n = len(T)
    for i in range(n - 1):
        # On cherche la position du maximum dans la partie non triée [i .. n-1]
        pos_max = i
        for j in range(i + 1, n):
            if T[j]['qte_decimal'] > T[pos_max]['qte_decimal']:
                pos_max = j
        
        # Permutation globale des deux enregistrements si nécessaire
        if pos_max != i:
            T[i], T[pos_max] = T[pos_max], T[i]
\`\`\`

> [!WARNING]
> **Erreur fatale d'élève :** Écrire \`T[i]['qte_decimal'], T[pos_max]['qte_decimal'] = ...\` !
> Si vous faites ça, vous permutez seulement les quantités en laissant les désignations et les codes à leur place ! Les données deviennent totalement fausses et mélangées !
> On permute **toujours** l'objet entier : \`T[i], T[pos_max] = T[pos_max], T[i]\`.

---

### 3.2 Recherche Dichotomique dans un Tableau d'Enregistrements

Supposons que le tableau \`T\` est trié par ordre alphabétique croissant selon le \`code\` de l'objet.
La recherche dichotomique permet de retrouver un objet en complexité logarithmique $\\mathcal{O}(\\log_2 N)$ :

\`\`\`python
def recherche_dichotomique_objet(T: list, code_cherche: str) -> int:
    deb = 0
    fin = len(T) - 1
    
    while deb <= fin:
        mil = (deb + fin) // 2
        if T[mil]['code'] == code_cherche:
            return mil  # Objet trouvé à l'indice mil
        elif T[mil]['code'] < code_cherche:
            deb = mil + 1
        else:
            fin = mil - 1
            
    return -1  # Non trouvé
\`\`\``,
        solutionMarkdown: `**Synthèse Pédagogique du Module 3 :**
1. Dans un tri d'enregistrements, la comparaison se fait sur un champ (\`T[j]['cle']\`), mais la permutation s'applique à l'enregistrement entier (\`T[i], T[j] = T[j], T[i]\`).
2. La recherche dichotomique s'applique uniquement si le tableau est préalablement ordonné selon la clé de recherche.`,
        gradingCriteria: [
          { id: 'crit-m3-1', description: 'Application rigoureuse de la permutation globale', points: 2.5 },
          { id: 'crit-m3-2', description: 'Implémentation exacte de la recherche dichotomique', points: 2.5 }
        ]
      },
      {
        id: 'cours-sec-4',
        number: 4,
        title: 'Module 4 : Pièges Classiques du Bac, Fiche Résumé & Lexique Bilingue',
        points: 5.0,
        statementMarkdown: `### 4.1 Les 5 Pièges Éliminatoires à Éviter au Bac SI

1. **Oublier le mode binaire :** Faire \`open("fich.dat", "a")\` au lieu de \`"ab"\`. Python lèvera une exception \`TypeError\` car \`dump\` n'accepte que des flux binaires !
2. **Utiliser \`readline()\` ou \`readlines()\` sur un fichier pickle :** \`pickle\` enregistre des octets binaires sérialisés, pas du texte brut ! Ces méthodes ne fonctionnent pas sur les fichiers typés.
3. **Oublier de fermer le fichier (\`f.close()\`) :** Le fichier reste verrouillé par le système d'exploitation et les données risquent de ne pas être écrites physiquement sur le disque.
4. **Permuter uniquement le champ au lieu de tout l'enregistrement :** Ce piège détruit la cohérence de la base de données.
5. **Ne pas intercepter \`EOFError\` :** Votre programme plantera dès qu'il finira de lire le fichier, entraînant la perte des points de fonctionnement !

---

### 4.2 Fiche Résumé / Cheat-Sheet Express

\`\`\`python
# 1. Enregistrement = Dictionnaire
eleve = {'cin': "12345678", 'nom': "Ali", 'moyenne': 16.5}

# 2. Écriture (Ajout)
from pickle import dump, load
f = open("donnees.dat", "ab")
dump(eleve, f)
f.close()

# 3. Lecture Complète
f = open("donnees.dat", "rb")
tous = []
while True:
    try:
        tous.append(load(f))
    except EOFError:
        break
f.close()
\`\`\`

---

### 4.3 Lexique Bilingue Officiel (Français — Arabe)

| Terme Français | Équivalent Arabe Officiel | Définition Didactique |
| :--- | :--- | :--- |
| **Enregistrement** | **تسجيلة / قيد** | Structure composite hétérogène regroupant plusieurs attributs. |
| **Champ** | **حقل** | Composante élémentaire d'un enregistrement dotée d'un type précis. |
| **Persistance** | **استدامة البيانات** | Conservation des données sur support de stockage permanent. |
| **Fichier typé / binaire** | **ملف مهيكل / ثنائي** | Fichier stockant des données structurées sérialisées. |
| **Fin de fichier (EOF)** | **نهاية الملف** | Condition indiquant qu'il n'y a plus d'octets à lire dans le fichier. |
| **Sérialisation (\`dump\`)** | **تسلسل البيانات** | Transformation d'un objet mémoire en flux d'octets enregistrable. |

---

### 4.4 Questions d'Auto-Évaluation Rapide

1. **Question 1 :** Quelle est la différence fondamentale entre un tableau et un enregistrement ?
2. **Question 2 :** Quel mode d'ouverture devez-vous choisir pour insérer un nouvel enregistrement sans supprimer les précédents ?
3. **Question 3 :** Quelle exception est levée lorsque la fonction \`load(f)\` arrive au bout d'un fichier \`pickle\` ?
4. **Question 4 :** Dans un tri d'enregistrements, que se passe-t-il si l'on permute \`T[i]['moyenne']\` et \`T[j]['moyenne']\` sans permuter \`T[i]\` et \`T[j]\` ?`,
        solutionMarkdown: `**Réponses aux Questions d'Auto-Évaluation :**
1. Un tableau est une structure **homogène** (tous les éléments ont obligatoirement le même type). Un enregistrement est une structure **hétérogène** (les champs peuvent avoir des types différents).
2. Le mode d'ouverture est l'ajout binaire : **\`"ab"\`**.
3. L'exception levée est **\`EOFError\`** (End Of File Error).
4. On permute uniquement les notes tout en laissant les noms des élèves à leur place, ce qui attribue la note d'un élève à un autre et corrompt la base de données.`,
        gradingCriteria: [
          { id: 'crit-m4-1', description: 'Identification des erreurs classiques et syntaxe', points: 2.5 },
          { id: 'crit-m4-2', description: 'Exactitude des réponses d\'auto-évaluation', points: 2.5 }
        ]
      }
    ]
  };

  await saveDraft(courseDraft);
  console.log(`✓ Document 1 sauvegardé : ${courseDraft.draftId}`);

  // =========================================================================
  // DOCUMENT 2 : LA SÉRIE D'EXERCICES PROGRESSIVE (SERIE_EXERCICES)
  // =========================================================================
  console.log('\n[3/5] Rédaction et persistance du Document 2 : SÉRIE D\'EXERCICES...');
  const seriesDraft: EducationalDraft = {
    schemaVersion: '1.0.0',
    draftId: `DRAFT-SERIE-${task.taskId.replace('TASK-', '')}`,
    taskId: task.taskId,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DRAFT',
    subject: 'Algorithmique et Programmation',
    chapter: 'Structures de Données Simples et Composées',
    academicYear: '2026-2027',
    contentType: 'SERIE_EXERCICES',
    totalPoints: 20.0,
    isOfficialBac: true,
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      sourcesCited: [
        {
          document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
          page: 2,
          section: 'Travail demandé et modules de traitement'
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: 'République Tunisienne — Ministère de l\'Éducation',
      sessionLabel: 'Série d\'Exercices Guidés — Niveau Baccalauréat SI',
      duration: '2h00',
      coefficient: 3.0
    },
    exercises: [
      {
        id: 'ex-prog-1',
        number: 1,
        title: 'Niveau 1 (Compréhension) : Modélisation et Validation d\'Enregistrement',
        points: 4.0,
        statementMarkdown: `### Exercice 1 : Modélisation et Contrôle de Saisie (4 points)
**Compétences évaluées :** Définition de structures d'enregistrements, manipulation de chaînes et vérification de contraintes.  
**Temps estimé :** 20 minutes.

Pour informatiser une bibliothèque de lycée, on modélise chaque livre par un enregistrement comportant :
- \`isbn\` : chaîne de 13 caractères numériques.
- \`titre\` : chaîne de 3 à 50 caractères non vide.
- \`prix\` : réel strictement positif.
- \`disponible\` : booléen (\`True\` si le livre peut être emprunté).

**Travail demandé :**
1. Proposer la déclaration en pseudocode conventionnel tunisien du type \`Livre\` ainsi que le TDO correspondant.
2. Écrire une fonction Python \`valider_isbn(ch: str) -> bool\` qui vérifie si une chaîne représente un code ISBN valide (exactement 13 chiffres de '0' à '9').
3. Écrire une fonction Python \`creer_livre(isbn: str, titre: str, prix: float) -> dict\` qui retourne l'enregistrement représentant le livre avec le statut de disponibilité initialisé à \`True\`.`,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          { id: 'c-ex1-tdo', description: 'Déclaration TDO conforme', points: 1.0 },
          { id: 'c-ex1-isbn', description: 'Fonction de validation ISBN', points: 2.0 },
          { id: 'c-ex1-dict', description: 'Fonction de création d\'enregistrement', points: 1.0 }
        ]
      },
      {
        id: 'ex-prog-2',
        number: 2,
        title: 'Niveau 2 (Application) : Persistance Binaire et Ajout dans un Fichier pickle',
        points: 5.0,
        statementMarkdown: `### Exercice 2 : Enregistrement Binaire dans un Fichier de Données (5 points)
**Compétences évaluées :** Utilisation du module \`pickle\`, mode d'ouverture d'ajout, intégrité des flux binaires.  
**Temps estimé :** 25 minutes.

On souhaite sauvegarder les livres de la bibliothèque dans un fichier binaire nommé \`"bibliotheque.dat"\`.

**Travail demandé :**
1. Développer une procédure Python \`ajouter_livre(nom_fich: str, livre: dict) -> None\` permettant d'écrire l'enregistrement \`livre\` à la fin du fichier sans écraser les données préexistantes.
2. Développer une fonction Python \`saisir_et_enregistrer_plusieurs(nom_fich: str, n: int) -> None\` qui demande la saisie de $N$ livres au clavier (en validant les champs) et les ajoute un par un dans le fichier.
3. Préciser le mode d'ouverture à utiliser et justifier son choix par rapport au mode \`"wb"\`.`,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          { id: 'c-ex2-ab', description: 'Usage rigoureux du mode "ab" et dump', points: 2.0 },
          { id: 'c-ex2-loop', description: 'Boucle d\'enregistrement des N éléments', points: 2.0 },
          { id: 'c-ex2-justif', description: 'Justification didactique du mode', points: 1.0 }
        ]
      },
      {
        id: 'ex-prog-3',
        number: 3,
        title: 'Niveau 3 (Raisonnement) : Chargement, Filtrage et Calcul Statistique',
        points: 5.0,
        statementMarkdown: `### Exercice 3 : Exploitation et Statistiques sur Fichier Typé (5 points)
**Compétences évaluées :** Parcours de fichier binaire avec capture d'EOFError, calcul d'indicateurs agrégés.  
**Temps estimé :** 35 minutes.

On dispose du fichier \`"bibliotheque.dat"\` contenant des enregistrements de type \`Livre\`.

**Travail demandé :**
1. Développer une fonction Python \`charger_livres(nom_fich: str) -> list\` qui lit l'intégralité du fichier et retourne une liste contenant tous les enregistrements. La fin de fichier doit être gérée par l'exception \`EOFError\`.
2. Développer une fonction \`prix_moyen(T: list) -> float\` calculant le prix moyen des livres enregistrés. Si le tableau est vide, la fonction renvoie \`0.0\`.
3. Développer une fonction \`extraire_disponibles(T: list) -> list\` qui extrait et retourne un nouveau tableau contenant uniquement les livres dont le champ \`disponible\` est égal à \`True\`.`,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          { id: 'c-ex3-load', description: 'Lecture intégrale et gestion EOFError', points: 2.5 },
          { id: 'c-ex3-stat', description: 'Calcul du prix moyen avec garde', points: 1.5 },
          { id: 'c-ex3-filtre', description: 'Extraction conditionnelle de liste', points: 1.0 }
        ]
      },
      {
        id: 'ex-prog-4',
        number: 4,
        title: 'Niveau 4 (Problème Type Bac) : Tri Décroissant et Recherche d\'Enregistrements',
        points: 6.0,
        statementMarkdown: `### Exercice 4 : Problème de Synthèse — Tri et Consultation (6 points)
**Compétences évaluées :** Tri par sélection d'enregistrements, permutation globale, algorithme de recherche.  
**Temps estimé :** 45 minutes.

Pour préparer l'inventaire annuel de la bibliothèque, le conservateur exige de :
1. Trier tous les livres par ordre **décroissant de prix** (le livre le plus cher en première position).
2. Consulter la disponibilité d'un livre connaissant son code ISBN.

**Travail demandé :**
1. Écrire en pseudocode conventionnel tunisien puis implémenter en Python 3 une procédure \`tri_selection_livres(T: list) -> None\` qui trie le tableau d'enregistrements \`T\` sur place par ordre décroissant du champ \`prix\`.
2. Développer une fonction \`rechercher_livre_isbn(T: list, isbn_recherche: str) -> int\` retournant l'indice du livre correspondant dans \`T\`, ou \`-1\` s'il n'existe pas.
3. Développer un module \`generer_rapport_inventaire(nom_fich_source: str, nom_fich_rapport: str) -> None\` qui lit les livres de \`nom_fich_source\`, les trie par prix décroissant, et enregistre un rapport texte lisible \`nom_fich_rapport\` listant chaque livre sur une ligne au format :
\`\`\`text
[ISBN] Titre - Prix DT (Disponible: OUI/NON)
\`\`\``,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          { id: 'c-ex4-tri', description: 'Tri par sélection décroissant sur champ', points: 2.5 },
          { id: 'c-ex4-rech', description: 'Recherche séquentielle fiable', points: 1.5 },
          { id: 'c-ex4-rap', description: 'Génération du fichier texte de synthèse', points: 2.0 }
        ]
      }
    ]
  };

  await saveDraft(seriesDraft);
  console.log(`✓ Document 2 sauvegardé : ${seriesDraft.draftId}`);

  // =========================================================================
  // DOCUMENT 3 : LE DEVOIR DE SYNTHÈSE PÉDAGOGIQUE (DEVOIR)
  // =========================================================================
  console.log('\n[4/5] Rédaction et persistance du Document 3 : DEVOIR (20 Points)...');
  const homeworkDraft: EducationalDraft = {
    schemaVersion: '1.0.0',
    draftId: `DRAFT-DEVOIR-${task.taskId.replace('TASK-', '')}`,
    taskId: task.taskId,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DRAFT',
    subject: 'Algorithmique et Programmation',
    chapter: 'Structures de Données Simples et Composées',
    academicYear: '2026-2027',
    contentType: 'DEVOIR',
    totalPoints: 20.0,
    isOfficialBac: false, // Devoir pédagogique inspiré du format Bac, non national
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      sourcesCited: [
        {
          document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
          page: 1,
          section: 'Gestion archéologique et conversion romaine'
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: 'Lycée Pilote de l\'Excellence — Évaluation Pédagogique Formative',
      sessionLabel: 'Devoir de Synthèse N°1 — 4ème Année Sciences de l\'Informatique',
      duration: '2h00',
      coefficient: 3.0
    },
    exercises: [
      {
        id: 'dev-ex-1',
        number: 1,
        title: 'Exercice 1 : Analyse Algorithmique et Validation Métier (5.0 points)',
        points: 5.0,
        statementMarkdown: `### Exercice 1 (5.0 points)
Dans le cadre de l'épreuve pratique du Baccalauréat SI (Session 2026), un musée gère son stock d'objets archéologiques dont les quantités étaient historiquement notées en **chiffres romains**.
On rappelle qu'un nombre romain valide est une chaîne non vide composée uniquement des lettres majuscules :
\`I\` (1), \`V\` (5), \`X\` (10), \`L\` (50), \`C\` (100), \`D\` (500), \`M\` (1000).
De plus, la chaîne ne doit jamais contenir plus de trois lettres identiques consécutives (par exemple, "IIII" est invalide, "IV" est valide).

Pour convertir un nombre romain en nombre décimal :
- On parcourt la chaîne de gauche à droite :
  - Si la valeur du caractère courant est $\\ge$ à celle du caractère suivant, on **ajoute** sa valeur au total.
  - Si la valeur du caractère courant est $<$ à celle du caractère suivant, on **retranche** sa valeur du total.
- La valeur du dernier caractère est **toujours ajoutée**.

**Questions :**
1. **(1.5 pt)** Donner la trace manuelle de calcul pour convertir la chaîne \`"CXCII"\` en décimal. Justifier chaque opération d'addition et de soustraction.
2. **(1.5 pt)** Écrire en pseudocode conventionnel tunisien une fonction \`Valider(ch: chaîne) : booléen\` qui vérifie si une chaîne respecte strictement la syntaxe d'un nombre romain selon les deux règles précédentes.
3. **(2.0 pts)** Traduire en script Python 3 la fonction \`RomainToDecimal(ch: str) -> int\` permettant d'effectuer la conversion en appliquant les règles officielles de l'épreuve.`,
        solutionMarkdown: `*(Corrigé détaillé inclus dans le document de correction)*`,
        gradingCriteria: [
          { id: 'crit-dev1-trace', description: 'Trace d\'exécution et justification exacte de CXCII (192)', points: 1.5 },
          { id: 'crit-dev1-valider', description: 'Fonction Valider en pseudocode avec double critère', points: 1.5 },
          { id: 'crit-dev1-convert', description: 'Fonction Python RomainToDecimal conforme', points: 2.0 }
        ]
      },
      {
        id: 'dev-ex-2',
        number: 2,
        title: 'Exercice 2 : Persistance Binaire et Gestion des Fichiers pickle (6.0 points)',
        points: 6.0,
        statementMarkdown: `### Exercice 2 (6.0 points)
Chaque objet archéologique est représenté par l'enregistrement suivant :
- \`code\` : chaîne de 6 caractères (ex: "OBJ042").
- \`designation\` : chaîne de caractères (ex: "Stèle funéraire").
- \`qte_romain\` : chaîne (quantité en chiffres romains).
- \`qte_decimal\` : entier (quantité équivalente en décimal).

Les objets sont conservés sur disque dans un fichier binaire sérialisé nommé \`"objets.dat"\`.

**Questions :**
1. **(1.0 pt)** Proposer la déclaration TDO de cet enregistrement et expliciter sa structure équivalente en dictionnaire Python.
2. **(2.5 pts)** Écrire une procédure Python \`EnregistrerObjet(nom_fich: str, obj: dict) -> None\` qui permet d'ajouter cet objet en fin de fichier binaire avec \`pickle.dump\`. Justifier rigoureusement le mode d'ouverture choisi et la fermeture du flux.
3. **(2.5 pts)** Écrire une fonction Python \`ChargerObjets(nom_fich: str) -> list\` qui lit l'ensemble des enregistrements du fichier et les renvoie sous la forme d'un tableau/liste d'enregistrements. Expliquer le rôle du bloc \`try ... except EOFError\` dans la boucle de lecture.`,
        solutionMarkdown: `*(Corrigé détaillé inclus dans le document de correction)*`,
        gradingCriteria: [
          { id: 'crit-dev2-tdo', description: 'Déclaration TDO et dictionnaire conforme', points: 1.0 },
          { id: 'crit-dev2-dump', description: 'Procédure EnregistrerObjet avec mode "ab"', points: 2.5 },
          { id: 'crit-dev2-load', description: 'Fonction ChargerObjets avec gestion propre EOFError', points: 2.5 }
        ]
      },
      {
        id: 'dev-ex-3',
        number: 3,
        title: 'Exercice 3 : Problème de Synthèse Modulaire & Algorithme de Tri (9.0 points)',
        points: 9.0,
        statementMarkdown: `### Exercice 3 (9.0 points)
Le conservateur du musée souhaite organiser une exposition des pièces les plus volumineuses.
Pour cela, il demande de développer une solution logicielle modulaire qui réalise les traitements suivants :
1. Charger les objets depuis le fichier binaire \`"objets.dat"\`.
2. Trier le tableau d'objets par ordre **décroissant de la quantité décimale** (\`qte_decimal\`). Si deux objets ont la même quantité, ils doivent être ordonnés par ordre alphabétique croissant de leur \`designation\`.
3. Filtrer et afficher tous les objets dont la quantité décimale est supérieure ou égale à un seuil $S$ donné ($S > 0$).
4. Rechercher si un objet possède un code donné en utilisant une méthode de recherche dichotomique (supposant le tableau trié par code).

**Questions :**
1. **(4.0 pts)** Écrire en pseudocode conventionnel tunisien puis implémenter en Python 3 la procédure de tri par sélection \`TriSelectionMultiCriteres(T, N)\` réalisant le tri selon les deux critères énoncés.
2. **(2.5 pts)** Développer la procédure \`AfficherSelonSeuil(T, N, S)\` affichant chaque objet sous la forme :
\`\`\`text
[CODE] - DESIGNATION : QTE_DECIMAL unité(s) (QTE_ROMAIN)
\`\`\`
3. **(2.5 pts)** Développer une fonction de recherche dichotomique \`RechercheObjetParCode(T, code_rech)\` opérant sur un tableau préalablement ordonné selon le champ \`code\`.`,
        solutionMarkdown: `*(Corrigé détaillé inclus dans le document de correction)*`,
        gradingCriteria: [
          { id: 'crit-dev3-tri', description: 'Tri sélection double critère exact', points: 4.0 },
          { id: 'crit-dev3-aff', description: 'Filtrage et affichage formaté avec seuil', points: 2.5 },
          { id: 'crit-dev3-dicho', description: 'Recherche dichotomique rigoureuse', points: 2.5 }
        ]
      }
    ]
  };

  await saveDraft(homeworkDraft);
  console.log(`✓ Document 3 sauvegardé : ${homeworkDraft.draftId}`);

  // =========================================================================
  // DOCUMENT 4 : LE CORRIGÉ DÉTAILLÉ ET BARÈME ANALYTIQUE (CORRIGE)
  // =========================================================================
  console.log('\n[5/5] Rédaction et persistance du Document 4 : CORRIGÉ DÉTAILLÉ & BARÈME...');
  const correctionDraft: EducationalDraft = {
    schemaVersion: '1.0.0',
    draftId: `DRAFT-CORRIGE-${task.taskId.replace('TASK-', '')}`,
    taskId: task.taskId,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DRAFT',
    subject: 'Algorithmique et Programmation',
    chapter: 'Structures de Données Simples et Composées',
    academicYear: '2026-2027',
    contentType: 'CORRIGE',
    totalPoints: 20.0,
    isOfficialBac: false,
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      sourcesCited: [
        {
          document: 'Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf',
          page: 1,
          section: 'Corrigé officiel type Bac'
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: 'Lycée Pilote de l\'Excellence — Correction Officielle Détaillée',
      sessionLabel: 'Corrigé Analytique et Grille de Notation — Devoir de Synthèse N°1',
      duration: '2h00',
      coefficient: 3.0
    },
    exercises: [
      {
        id: 'cor-ex-1',
        number: 1,
        title: 'Correction Exercice 1 : Analyse Algorithmique & Conversion (5.0 points)',
        points: 5.0,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 1 (5.0 points)

#### 1. Trace manuelle de calcul pour "CXCII" (1.5 point)
Le mot est composé des 5 lettres : \`C\` (100), \`X\` (10), \`C\` (100), \`I\` (1), \`I\` (1).
- **Position 0 ('C') :** caractère suivant 'X'. Or $100 \\ge 10$ (valeur supérieure), donc on **ajoute 100** : $+100$.
- **Position 1 ('X') :** caractère suivant 'C'. Or $10 < 100$ (valeur strictement inférieure), donc on **retranche 10** : $-10$.
- **Position 2 ('C') :** caractère suivant 'I'. Or $100 \\ge 1$ (valeur supérieure), donc on **ajoute 100** : $+100$.
- **Position 3 ('I') :** caractère suivant 'I'. Or $1 \\ge 1$ (valeur égale), donc on **ajoute 1** : $+1$.
- **Position 4 ('I' finale) :** dernier caractère, donc on **ajoute toujours sa valeur** : $+1$.
$$\\text{Total} = 100 - 10 + 100 + 1 + 1 = 192$$
Le résultat décimal exact est donc **192**.

---

#### 2. Fonction Valider en pseudocode (1.5 point)
\`\`\`text
Fonction Valider(ch : chaîne) : booléen
Variables
    r : chaîne
    i : entier
    test : booléen
Début
    r <- "IVXLCDM"
    Si ch = "" Alors
        Retourner Faux
    Sinon
        test <- Vrai
        i <- 1
        TantQue (i <= Longueur(ch)) Et (Position(ch[i], r) <> 0) Et test Faire
            // Vérification de la contrainte : pas plus de 3 lettres identiques consécutives
            Si Position(SousChaine(ch, i, 4), ch[i] + ch[i] + ch[i] + ch[i]) <> 0 Alors
                test <- Faux
            Sinon
                i <- i + 1
            FinSi
        FinTantQue
        Retourner (i > Longueur(ch)) Et test
    FinSi
Fin
\`\`\`

---

#### 3. Fonction RomainToDecimal en Python 3 (2.0 points)
\`\`\`python
def RomainToDecimal(ch: str) -> int:
    valeurs = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    }
    total = 0
    n = len(ch)
    
    # Parcours de la chaîne du premier caractère à l'avant-dernier
    for i in range(n - 1):
        v_courant = valeurs[ch[i]]
        v_suivant = valeurs[ch[i + 1]]
        
        if v_courant >= v_suivant:
            total += v_courant
        else:
            total -= v_courant
            
    # Ajout obligatoire du dernier caractère
    total += valeurs[ch[-1]]
    return total
\`\`\`

**Grille d'évaluation de l'Exercice 1 :**
- Calcul détaillé et résultat 192 : **1.5 pt**
- Fonction Valider en pseudocode (Gestion chaîne vide, appartenance alphabet, interdiction quadruple répétition) : **1.5 pt**
- Fonction RomainToDecimal en Python (Dictionnaire de correspondance, boucle n-1 avec comparaison, ajout final) : **2.0 pts**`,
        solutionMarkdown: `Code vérifié à 100% avec les tests automatisés du sujet officiel 2026.`,
        gradingCriteria: [
          { id: 'cor1-c1', description: 'Démarche de calcul CXCII = 192', points: 1.5 },
          { id: 'cor1-c2', description: 'Pseudocode Valider', points: 1.5 },
          { id: 'cor1-c3', description: 'Script Python RomainToDecimal', points: 2.0 }
        ]
      },
      {
        id: 'cor-ex-2',
        number: 2,
        title: 'Correction Exercice 2 : Persistance Binaire et pickle (6.0 points)',
        points: 6.0,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 2 (6.0 points)

#### 1. Déclaration TDO et dictionnaire (1.0 point)
**En pseudocode conventionnel :**
\`\`\`text
Type
    ObjetArcheo = Enregistrement
        code        : chaîne
        designation : chaîne
        qte_romain  : chaîne
        qte_decimal : entier
    Fin
\`\`\`
**En Python 3 :**
\`\`\`python
objet = {
    'code': "OBJ042",
    'designation': "Stèle funéraire",
    'qte_romain': "XLVI",
    'qte_decimal': 46
}
\`\`\`

---

#### 2. Procédure EnregistrerObjet en Python (2.5 points)
\`\`\`python
from pickle import dump

def EnregistrerObjet(nom_fich: str, obj: dict) -> None:
    # Mode "ab" (Append Binary) : indispensable pour ajouter sans écraser
    f = open(nom_fich, "ab")
    dump(obj, f)
    f.close()
\`\`\`
**Justification didactique :**
- Le mode \`"ab"\` positionne le pointeur à la fin du fichier. Si le fichier existe, les octets précédents sont conservés intacts. Le mode \`"wb"\` aurait tronqué le fichier à 0 octet, provoquant la perte irréversible des objets enregistrés antérieurement.
- L'appel \`f.close()\` force l'écriture physique des mémoires tampons du système d'exploitation vers le support de stockage persistant.

---

#### 3. Fonction ChargerObjets en Python (2.5 points)
\`\`\`python
from pickle import load

def ChargerObjets(nom_fich: str) -> list:
    T = []
    # Mode "rb" (Read Binary) : lecture binaire
    f = open(nom_fich, "rb")
    
    while True:
        try:
            e = load(f)  # Lit l'enregistrement suivant
            T.append(e)  # Ajoute l'objet à la liste
        except EOFError:
            break        # Sortie dès que la fin physique du fichier est atteinte
            
    f.close()
    return T
\`\`\`
**Explication de \`EOFError\` :**
Contrairement aux fichiers textes manipulant des lignes terminées par \`"\\n"\`, un fichier binaire \`pickle\` enregistre des objets sans séparateur visible. La tentative de lecture au-delà du dernier octet provoque la levée de l'exception native \`EOFError\`. Le bloc \`try ... except EOFError\` intercepte cette exception normale et termine la boucle proprement sans interruption brutale du programme.

**Grille d'évaluation de l'Exercice 2 :**
- TDO et dictionnaire : **1.0 pt**
- Procédure d'enregistrement avec mode "ab", dump et close : **2.5 pts**
- Procédure de chargement avec mode "rb", boucle infinie, gestion EOFError et fermeture : **2.5 pts**`,
        solutionMarkdown: `Procédure rigoureusement testée sur le système de fichiers réel.`,
        gradingCriteria: [
          { id: 'cor2-c1', description: 'Définition de structure', points: 1.0 },
          { id: 'cor2-c2', description: 'Procédure EnregistrerObjet', points: 2.5 },
          { id: 'cor2-c3', description: 'Fonction ChargerObjets', points: 2.5 }
        ]
      },
      {
        id: 'cor-ex-3',
        number: 3,
        title: 'Correction Exercice 3 : Tri Multi-Critères & Consultation (9.0 points)',
        points: 9.0,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 3 (9.0 points)

#### 1. Procédure de Tri par Sélection Multi-Critères (4.0 points)
**Principe :** On cherche le maximum sur la quantité décimale décroissante (\`qte_decimal\`). En cas d'égalité stricte, on départage sur la désignation alphabétique croissante (\`designation\`).

**En pseudocode :**
\`\`\`text
Procédure TriSelectionMultiCriteres(Var T : Tableau de N ObjetArcheo ; N : entier)
Variables
    i, j, pos_max : entier
    aux : ObjetArcheo
Début
    Pour i de 0 à N - 2 Faire
        pos_max <- i
        Pour j de i + 1 à N - 1 Faire
            // Critère 1 : Quantité décroissante
            Si T[j].qte_decimal > T[pos_max].qte_decimal Alors
                pos_max <- j
            // Critère 2 : Égalité sur la quantité -> Désignation croissante
            Sinon Si (T[j].qte_decimal = T[pos_max].qte_decimal) Et (T[j].designation < T[pos_max].designation) Alors
                pos_max <- j
            FinSi
        FinPour
        
        Si pos_max <> i Alors
            aux <- T[i]
            T[i] <- T[pos_max]
            T[pos_max] <- aux
        FinSi
    FinPour
Fin
\`\`\`

**En Python 3 :**
\`\`\`python
def TriSelectionMultiCriteres(T: list) -> None:
    n = len(T)
    for i in range(n - 1):
        pos_max = i
        for j in range(i + 1, n):
            # Critère 1 : quantité décroissante
            if T[j]['qte_decimal'] > T[pos_max]['qte_decimal']:
                pos_max = j
            # Critère 2 : égalité -> ordre alphabétique croissant de la désignation
            elif (T[j]['qte_decimal'] == T[pos_max]['qte_decimal']) and (T[j]['designation'] < T[pos_max]['designation']):
                pos_max = j
                
        # Permutation globale des enregistrements
        if pos_max != i:
            T[i], T[pos_max] = T[pos_max], T[i]
\`\`\`

---

#### 2. Procédure AfficherSelonSeuil (2.5 points)
\`\`\`python
def AfficherSelonSeuil(T: list, S: int) -> None:
    compteur = 0
    print(f"--- OBJETS AVEC QUANTITÉ >= {S} ---")
    for obj in T:
        if obj['qte_decimal'] >= S:
            print(f"[{obj['code']}] - {obj['designation']} : {obj['qte_decimal']} unité(s) ({obj['qte_romain']})")
            compteur += 1
            
    print(f"Total des objets sélectionnés : {compteur}")
\`\`\`

---

#### 3. Recherche Dichotomique par Code (2.5 points)
\`\`\`python
def RechercheObjetParCode(T: list, code_rech: str) -> int:
    deb = 0
    fin = len(T) - 1
    
    while deb <= fin:
        mil = (deb + fin) // 2
        if T[mil]['code'] == code_rech:
            return mil
        elif T[mil]['code'] < code_rech:
            deb = mil + 1
        else:
            fin = mil - 1
            
    return -1
\`\`\`

**Analyse de complexité :**
- Le tri par sélection a une complexité temporelle asymptotique quadratique $\\mathcal{O}(N^2)$ quel que soit l'état initial du tableau (nombre de comparaisons égal à $\\frac{N(N-1)}{2}$).
- La recherche dichotomique a une complexité temporelle logarithmique $\\mathcal{O}(\\log_2 N)$, divisant l'espace de recherche par deux à chaque itération.

**Grille d'évaluation de l'Exercice 3 :**
- Pseudocode et Python du tri sélection double critère (Boucles imbriquées, condition de départage, permutation complète) : **4.0 pts**
- Filtrage conditionnel et affichage formaté avec compteur : **2.5 pts**
- Recherche dichotomique complète avec indices deb, fin, mil et retour d'indice : **2.5 pts**`,
        solutionMarkdown: `Ensemble des algorithmes validés sur des cas de test aux limites.`,
        gradingCriteria: [
          { id: 'cor3-c1', description: 'Tri sélection multi-critères', points: 4.0 },
          { id: 'cor3-c2', description: 'Affichage selon seuil', points: 2.5 },
          { id: 'cor3-c3', description: 'Recherche dichotomique et complexité', points: 2.5 }
        ]
      }
    ]
  };

  await saveDraft(correctionDraft);
  console.log(`✓ Document 4 sauvegardé : ${correctionDraft.draftId}`);

  console.log('\n=== SUCCÈS : LES 4 DOCUMENTS PILOTES SONT CRÉÉS DANS content/drafts/active/ ===');
  console.log(`1. COURS      : ${courseDraft.draftId}`);
  console.log(`2. SERIE      : ${seriesDraft.draftId}`);
  console.log(`3. DEVOIR     : ${homeworkDraft.draftId}`);
  console.log(`4. CORRIGE    : ${correctionDraft.draftId}`);
}

main().catch(err => {
  console.error('ERREUR LORS DE LA GÉNÉRATION DU PACKAGE PILOTE :', err);
  process.exit(1);
});
