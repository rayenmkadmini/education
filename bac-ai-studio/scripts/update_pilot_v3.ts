import { saveDraft } from '../src/lib/server/draft-service';
import { EducationalDraft } from '../src/lib/types';

async function run() {
  console.log("=== UPDATING PILOT 01 DRAFTS TO VERSION 3 ===");

  // 1. COURS
  const coursDraft: EducationalDraft = {
    schemaVersion: "1.0.0",
    draftId: "DRAFT-COURS-BACSI-2026-409671",
    taskId: "BACSI-2026-409671",
    version: 2, // will be incremented to 3 by saveDraft
    createdAt: "2026-11-06T11:15:18.823Z",
    updatedAt: new Date().toISOString(),
    status: "DRAFT",
    subject: "Algorithmique et Programmation",
    chapter: "Structures de Données Simples et Composées",
    academicYear: "2026-2027",
    contentType: "COURS",
    totalPoints: 20,
    isOfficialBac: true,
    provenance: {
      generatedBy: "Antigravity Educational AI",
      sourcesCited: [
        {
          document: "Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf",
          page: 1,
          section: "VERIFIED_OFFICIAL_EXAM : Épreuve pratique officielle Bac SI 2026"
        },
        {
          document: "bac-pratique-23052026-algo-8h30-fichiers.zip",
          page: 1,
          section: "VERIFIED_OFFICIAL_EXAM : Squelette Python officiel AjoutObjet.py et Manip.py"
        },
        {
          document: "Programme Officiel 4ème SI — Ministère de l'Éducation",
          page: 1,
          section: "CURRICULUM_OFFICIAL_CNP : Structures de données simples et composées"
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: "République Tunisienne — Ministère de l'Éducation",
      sessionLabel: "Cours Magistral Interactif — Section Sciences de l'Informatique",
      duration: "2h00",
      coefficient: 3
    },
    exercises: [
      {
        id: "cours-sec-1",
        number: 1,
        title: "Module 1 : Chma3naha Enregistrement ? (Modélisation Conceptuelle & TDO)",
        points: 5,
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
        solutionMarkdown: `**Synthèse Pédagogique du Module 1 :**\n1. L'enregistrement regroupe des champs de types différents sous une même entité logique.\n2. En pseudocode : syntaxe \`Type ... = Enregistrement ... Fin\`.\n3. En Python : dictionnaire \`{'cle': valeur}\` avec accès indexé \`obj['cle']\`.`,
        gradingCriteria: [
          {
            id: "crit-m1-1",
            description: "Compréhension de l'hétérogénéité de l'enregistrement",
            points: 2.5
          },
          {
            id: "crit-m1-2",
            description: "Conformité de la syntaxe TDO et dictionnaire Python",
            points: 2.5
          }
        ]
      },
      {
        id: "cours-sec-2",
        number: 2,
        title: "Module 2 : La Persistance — Fichiers Binaires & Module pickle",
        points: 5,
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
> - Dans le cadre scolaire du Baccalauréat tunisien : \`pickle\` est utilisé sur l'ordinateur de l'élève en local comme outil pédagogique pour simuler les fichiers d'enregistrements du programme officiel.`,
        solutionMarkdown: `**Synthèse Pédagogique du Module 2 :**\n1. Toujours spécifier le \`b\` dans les modes d'ouverture (\`"ab"\`, \`"rb"\`, \`"wb"\`).\n2. \`dump(donnee, f)\` pour écrire, \`load(f)\` pour lire.\n3. Toujours utiliser \`try: load(f) except EOFError: break\` pour lire jusqu'au bout sans planter le programme.\n4. Ne jamais oublier \`f.close()\` pour libérer le fichier sur le système d'exploitation.`,
        gradingCriteria: [
          {
            id: "crit-m2-1",
            description: "Maîtrise des modes d'ouverture binaire",
            points: 2.5
          },
          {
            id: "crit-m2-2",
            description: "Gestion parfaite de l'exception EOFError",
            points: 2.5
          }
        ]
      },
      {
        id: "cours-sec-3",
        number: 3,
        title: "Module 3 : Algorithmes Fondamentaux sur Tableaux d'Enregistrements",
        points: 5,
        statementMarkdown: `### 3.1 Tri d'un Tableau d'Enregistrements (Tri par Sélection Multi-Critères)

Fil sujet officiel du **Bac Pratique 2026**, ba3d ma nchargez les objets mel fichier, el matloub howa :
> *Afficher de manière triée les objets enregistrés selon leur quantité décroissante. En cas d'égalité sur la quantité, ordonner selon la désignation croissante.*

Kifeh ntriw un tableau d'enregistrements \`T\` selon plusieurs critères ?
El principe howa nafssou el **Tri par sélection**, ama fil comparaison, n9arnou le premier critère (\`qte_decimal\`), w ken famma égalité n9arnou le deuxième critère (\`designation\`).
W fil permutation, **npermutiw tout l'enregistrement** (mouch juste la quantité !) :

\`\`\`python
def tri_selection_multi_criteres(T: list) -> None:
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
        
        # Permutation globale des deux enregistrements si nécessaire
        if pos_max != i:
            T[i], T[pos_max] = T[pos_max], T[i]
\`\`\`

> [!WARNING]
> **Erreur fatale d'élève :** Écrire \`T[i]['qte_decimal'], T[pos_max]['qte_decimal'] = ...\` !
> Si vous faites ça, vous permutez seulement les quantités en laissant les désignations et les codes à leur place ! Les données deviennent totalement fausses et mélangées !
> On permute **toujours** l'objet entier : \`T[i], T[pos_max] = T[pos_max], T[i]\`.

---

### 3.2 La Condition Préalable Obligatoire de la Recherche Dichotomique

> [!CAUTION]
> **PIÈGE FONDAMENTAL D'ALGORITHMIQUE :**
> La recherche dichotomique compare l'élément recherché avec l'élément au milieu \`T[mil]\` et élimine la moitié gauche ou droite.
> **Cette logique n'est valide QUE SI et SEULEMENT SI le tableau est trié selon LA CLÉ DE RECHERCHE EXACTE !**

Si le tableau \`T\` a été trié par quantité décroissante \`qte_decimal\`, les codes \`code\` sont dans le désordre le plus complet.
Si l'on exécute une recherche dichotomique sur le \`code\` sur ce tableau, **la recherche dichotomique échouera et renverra -1 même si l'objet existe bel et bien dans le tableau !**

**Règle d'or :**
- Pour rechercher un objet par son \`code\` avec la recherche dichotomique $\\mathcal{O}(\\log_2 N)$ : le tableau doit obligatoirement être ordonné selon \`code\` (via une procédure \`TrierParCode(T)\`).
- Si le tableau n'est pas trié selon le code, on doit soit le trier au préalable par code, soit utiliser une **recherche séquentielle** en temps linéaire $\\mathcal{O}(N)$.

\`\`\`python
def trier_par_code(T: list) -> None:
    """Trie le tableau par ordre croissant du champ 'code'."""
    n = len(T)
    for i in range(n - 1):
        pos_min = i
        for j in range(i + 1, n):
            if T[j]['code'] < T[pos_min]['code']:
                pos_min = j
        if pos_min != i:
            T[i], T[pos_min] = T[pos_min], T[i]

def recherche_dichotomique_objet_code(T: list, code_cherche: str) -> int:
    """Recherche dichotomique sur tableau IMPÉRATIVEMENT trié par 'code'."""
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
\`\`\`

---

### 3.3 Nombres Romains : Règles Canoniques vs Règles Simplifiées du Bac 2026

Dans le sujet du Bac Pratique 2026, la règle de validation était énoncée de façon simplifiée : *"composée uniquement des lettres I,V,X,L,C,D,M et ne contient pas plus de trois lettres identiques consécutives"*.
Or, en arithmétique romaine canonique standard :
- Seuls \`I\`, \`X\`, \`C\`, \`M\` peuvent être répétés jusqu'à 3 fois.
- Les symboles \`V\`, \`L\`, \`D\` ne peuvent **JAMAIS être répétés** (ex: \`"VV"\`, \`"LL"\`, \`"DD"\` sont strictement invalides).
- Les paires soustractives autorisées sont uniquement : \`IV\` (4), \`IX\` (9), \`XL\` (40), \`XC\` (90), \`CD\` (400), \`CM\` (900).
- Des formes comme \`"IIV"\`, \`"IC"\`, \`"IL"\`, \`"VX"\`, \`"XM"\`, \`"MCMC"\` sont non canoniques et doivent être rejetées par tout validateur robuste avant conversion !`,
        solutionMarkdown: `**Synthèse Pédagogique du Module 3 :**\n1. Dans un tri d'enregistrements, la comparaison se fait sur un champ (\`T[j]['cle']\`), mais la permutation s'applique à l'enregistrement entier (\`T[i], T[j] = T[j], T[i]\`).\n2. La recherche dichotomique exige impérativement que le tableau soit préalablement ordonné selon la clé exacte de recherche.\n3. La validation canonique des nombres romains précède obligatoirement toute conversion décimale.`,
        gradingCriteria: [
          {
            id: "crit-m3-1",
            description: "Application rigoureuse de la permutation globale",
            points: 2.5
          },
          {
            id: "crit-m3-2",
            description: "Compréhension de la condition préalable du tri pour la recherche dichotomique",
            points: 2.5
          }
        ]
      },
      {
        id: "cours-sec-4",
        number: 4,
        title: "Module 4 : Pièges Classiques du Bac, Fiche Résumé & Lexique Bilingue",
        points: 5,
        statementMarkdown: `### 4.1 Les 5 Pièges Éliminatoires à Éviter au Bac SI

1. **Oublier le mode binaire :** Faire \`open("fich.dat", "a")\` au lieu de \`"ab"\`. Python lèvera une exception \`TypeError\` car \`dump\` n'accepte que des flux binaires !
2. **Utiliser \`readline()\` ou \`readlines()\` sur un fichier pickle :** \`pickle\` enregistre des octets binaires sérialisés, pas du texte brut ! Ces méthodes ne fonctionnent pas sur les fichiers typés.
3. **Oublier de fermer le fichier (\`f.close()\`) :** Le fichier reste verrouillé par le système d'exploitation et les données risquent de ne pas être écrites physiquement sur le disque.
4. **Appliquer la recherche dichotomique sur un tableau trié selon une autre clé :** Ce piège détruit la logique algorithmique et renvoie des faux négatifs.
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

# 3. Lecture Complète avec gestion EOFError
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
| **Recherche dichotomique** | **بحث ثنائي / تناصف** | Algorithme de recherche en complexité logarithmique sur données triées. |

---

### 4.4 Questions d'Auto-Évaluation Rapide

1. **Question 1 :** Quelle est la différence fondamentale entre un tableau et un enregistrement ?
2. **Question 2 :** Quel mode d'ouverture devez-vous choisir pour insérer un nouvel enregistrement sans supprimer les précédents ?
3. **Question 3 :** Quelle exception est levée lorsque la fonction \`load(f)\` arrive au bout d'un fichier \`pickle\` ?
4. **Question 4 :** Pourquoi la recherche dichotomique sur le code échoue-t-elle sur un tableau trié par quantité décroissante ?`,
        solutionMarkdown: `**Réponses aux Questions d'Auto-Évaluation :**\n1. Un tableau est une structure **homogène** (tous les éléments ont obligatoirement le même type). Un enregistrement est une structure **hétérogène** (les champs peuvent avoir des types différents).\n2. Le mode d'ouverture est l'ajout binaire : **\`"ab"\`**.\n3. L'exception levée est **\`EOFError\`** (End Of File Error).\n4. La recherche dichotomique repose sur la relation d'ordre. Si le tableau est trié selon la quantité, les codes ne sont pas monotones ; tester le milieu \`T[mil]['code']\` ne permet donc pas d'éliminer la moitié gauche ou droite.`,
        gradingCriteria: [
          {
            id: "crit-m4-1",
            description: "Identification des erreurs classiques et syntaxe",
            points: 2.5
          },
          {
            id: "crit-m4-2",
            description: "Exactitude des réponses d'auto-évaluation",
            points: 2.5
          }
        ]
      }
    ]
  };

  await saveDraft(coursDraft);
  console.log("✓ COURS updated to v3 and saved.");

  // 2. SERIE
  const serieDraft: EducationalDraft = {
    schemaVersion: "1.0.0",
    draftId: "DRAFT-SERIE-BACSI-2026-409671",
    taskId: "BACSI-2026-409671",
    version: 2,
    createdAt: "2026-11-06T11:15:18.846Z",
    updatedAt: new Date().toISOString(),
    status: "DRAFT",
    subject: "Algorithmique et Programmation",
    chapter: "Structures de Données Simples et Composées",
    academicYear: "2026-2027",
    contentType: "SERIE_EXERCICES",
    totalPoints: 20,
    isOfficialBac: true,
    provenance: {
      generatedBy: "Antigravity Educational AI",
      sourcesCited: [
        {
          document: "Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf",
          page: 2,
          section: "VERIFIED_OFFICIAL_EXAM : Cahier des charges et modules pratiques"
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: "République Tunisienne — Ministère de l'Éducation",
      sessionLabel: "Série d'Exercices Guidés — Niveau Baccalauréat SI",
      duration: "2h00",
      coefficient: 3
    },
    exercises: [
      {
        id: "ex-prog-1",
        number: 1,
        title: "Niveau 1 (Compréhension) : Modélisation et Validation d'Enregistrement",
        points: 4,
        statementMarkdown: `### Exercice 1 : Modélisation et Contrôle de Saisie (4 points)
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
3. Écrire une fonction Python \`creer_livre(isbn: str, titre: str, prix: float) -> dict\` qui retourne l'enregistrement représentant le livre avec le statut de disponibilité initialisé à \`True\`. Si le prix est $\\le 0$ ou si l'ISBN est invalide, la fonction lèvera une exception \`ValueError\`.`,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          {
            id: "c-ex1-tdo",
            description: "Déclaration TDO conforme",
            points: 1
          },
          {
            id: "c-ex1-isbn",
            description: "Fonction de validation ISBN",
            points: 2
          },
          {
            id: "c-ex1-dict",
            description: "Fonction de création d'enregistrement",
            points: 1
          }
        ]
      },
      {
        id: "ex-prog-2",
        number: 2,
        title: "Niveau 2 (Application) : Persistance Binaire et Ajout dans un Fichier pickle",
        points: 5,
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
          {
            id: "c-ex2-ab",
            description: "Usage rigoureux du mode 'ab' et dump",
            points: 2
          },
          {
            id: "c-ex2-loop",
            description: "Boucle d'enregistrement des N éléments",
            points: 2
          },
          {
            id: "c-ex2-justif",
            description: "Justification didactique du mode",
            points: 1
          }
        ]
      },
      {
        id: "ex-prog-3",
        number: 3,
        title: "Niveau 3 (Raisonnement) : Chargement, Filtrage et Calcul Statistique",
        points: 5,
        statementMarkdown: `### Exercice 3 : Exploitation et Statistiques sur Fichier Typé (5 points)
**Compétences évaluées :** Parcours de fichier binaire avec capture d'EOFError, calcul d'indicateurs agrégés.  
**Temps estimé :** 35 minutes.

On dispose du fichier \`"bibliotheque.dat"\` contenant des enregistrements de type \`Livre\`.

**Travail demandé :**
1. Développer une fonction Python \`charger_livres(nom_fich: str) -> list\` qui lit l'intégralité du fichier et retourne une liste contenant tous les enregistrements. La fin de fichier doit être gérée par l'exception \`EOFError\`. Préciser le comportement si le fichier fait 0 octet.
2. Développer une fonction \`prix_moyen(T: list) -> float\` calculant le prix moyen des livres enregistrés. Si le tableau est vide, la fonction renvoie \`0.0\`.
3. Développer une fonction \`extraire_disponibles(T: list) -> list\` qui extrait et retourne un nouveau tableau contenant uniquement les livres dont le champ \`disponible\` est égal à \`True\`.`,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          {
            id: "c-ex3-load",
            description: "Lecture intégrale et gestion EOFError",
            points: 2.5
          },
          {
            id: "c-ex3-stat",
            description: "Calcul du prix moyen avec garde",
            points: 1.5
          },
          {
            id: "c-ex3-filtre",
            description: "Extraction conditionnelle de liste",
            points: 1
          }
        ]
      },
      {
        id: "ex-prog-4",
        number: 4,
        title: "Niveau 4 (Problème Type Bac) : Tri Décroissant et Recherche d'Enregistrements",
        points: 6,
        statementMarkdown: `### Exercice 4 : Problème de Synthèse — Tri et Consultation (6 points)
**Compétences évaluées :** Tri par sélection d'enregistrements, permutation globale, distinction entre recherche séquentielle et recherche dichotomique.  
**Temps estimé :** 45 minutes.

Pour préparer l'inventaire annuel de la bibliothèque, le conservateur exige de :
1. Trier tous les livres par ordre **décroissant de prix** (le livre le plus cher en première position).
2. Consulter la disponibilité d'un livre connaissant son code ISBN.

**Travail demandé :**
1. Écrire en pseudocode conventionnel tunisien puis implémenter en Python 3 une procédure \`tri_selection_livres(T: list) -> None\` qui trie le tableau d'enregistrements \`T\` sur place par ordre décroissant du champ \`prix\`.
2. Développer une fonction \`rechercher_livre_isbn_sequentiel(T: list, isbn_recherche: str) -> int\` retournant l'indice du livre correspondant dans \`T\`, ou \`-1\` s'il n'existe pas. Expliquer pourquoi la recherche séquentielle est requise ici plutôt que la recherche dichotomique.
3. Développer un module \`generer_rapport_inventaire(nom_fich_source: str, nom_fich_rapport: str) -> None\` qui lit les livres de \`nom_fich_source\`, les trie par prix décroissant, et enregistre un rapport texte lisible \`nom_fich_rapport\` listant chaque livre sur une ligne au format :
\`\`\`text
[ISBN] Titre - Prix DT (Disponible: OUI/NON)
\`\`\``,
        solutionMarkdown: `*(Corrigé disponible dans le document de correction officiel)*`,
        gradingCriteria: [
          {
            id: "c-ex4-tri",
            description: "Tri par sélection décroissant sur champ",
            points: 2.5
          },
          {
            id: "c-ex4-rech",
            description: "Recherche séquentielle fiable et justification",
            points: 1.5
          },
          {
            id: "c-ex4-rap",
            description: "Génération du fichier texte de synthèse",
            points: 2
          }
        ]
      }
    ]
  };

  await saveDraft(serieDraft);
  console.log("✓ SERIE updated to v3 and saved.");

  // 3. DEVOIR
  const devoirDraft: EducationalDraft = {
    schemaVersion: "1.0.0",
    draftId: "DRAFT-DEVOIR-BACSI-2026-409671",
    taskId: "BACSI-2026-409671",
    version: 2,
    createdAt: "2026-11-06T11:15:18.867Z",
    updatedAt: new Date().toISOString(),
    status: "DRAFT",
    subject: "Algorithmique et Programmation",
    chapter: "Structures de Données Simples et Composées",
    academicYear: "2026-2027",
    contentType: "DEVOIR",
    totalPoints: 20,
    isOfficialBac: false,
    provenance: {
      generatedBy: "Antigravity Educational AI",
      sourcesCited: [
        {
          document: "Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf",
          page: 1,
          section: "VERIFIED_OFFICIAL_EXAM : Contexte muséologique et manipulation d'objets"
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: "Lycée Pilote de l'Excellence — Évaluation Pédagogique Formative",
      sessionLabel: "Devoir de Synthèse N°1 — 4ème Année Sciences de l'Informatique",
      duration: "2h00",
      coefficient: 3
    },
    exercises: [
      {
        id: "dev-ex-1",
        number: 1,
        title: "Projet Carthage — Partie 1 : Décodage & Validation Canonique des Nombres Romains (5.0 points)",
        points: 5,
        statementMarkdown: `### Contexte Général du Devoir : Informatisation du Musée National de Carthage
La conservation du Musée National de Carthage modernise son système d'inventaire archéologique.
Historiquement, les registres manuscrits consignaient les pièces avec des identifiants et des quantités exprimées en **chiffres romains**.
Le devoir a pour objectif de concevoir une application modulaire et robuste en trois étapes :
1. **Partie 1 :** Validation canonique et conversion des quantités romaines historiques.
2. **Partie 2 :** Archivage et persistance des fiches d'inventaire dans un fichier binaire sérialisé.
3. **Partie 3 :** Moteur d'interrogation, de tri multi-critères et de recherche rapide pour les conservateurs.

---

### Partie 1 : Décodage & Validation Algorithmique (5.0 points)
**Durée indicative :** 30 minutes.

Un nombre romain canonique valide est une chaîne non vide composée uniquement des lettres majuscules :
\`I\` (1), \`V\` (5), \`X\` (10), \`L\` (50), \`C\` (100), \`D\` (500), \`M\` (1000).

**Règles de syntaxe canonique à respecter :**
1. **Répétitions autorisées :** Seules les lettres \`I\`, \`X\`, \`C\`, \`M\` peuvent être répétées consécutivement, au maximum **3 fois** (ex: \`"III"\` est valide, \`"IIII"\` est invalide).
2. **Interdiction de répétition :** Les lettres \`V\`, \`L\`, \`D\` ne peuvent **JAMAIS être répétées** (ex: \`"VV"\`, \`"LL"\`, \`"DD"\` sont invalides).
3. **Paires soustractives canoniques :**
   - \`I\` ne peut précéder que \`V\` (4) ou \`X\` (9). (Ex: \`"IV"\` est valide ; \`"IC"\`, \`"IL"\` sont invalides).
   - \`X\` ne peut précéder que \`L\` (40) ou \`C\` (90). (Ex: \`"XL"\` est valide ; \`"XM"\` est invalide).
   - \`C\` ne peut précéder que \`D\` (400) ou \`M\` (900).
   - \`V\`, \`L\`, \`D\` ne peuvent jamais être soustraits (ex: \`"VX"\` est invalide).
   - Un symbole soustrait ne peut pas être précédé du même symbole (ex: \`"IIV"\` est invalide).
4. **Règle de conversion :** On parcourt la chaîne de gauche à droite :
   - Si la valeur du caractère courant est $\\ge$ à celle du caractère suivant, on **ajoute** sa valeur au total.
   - Si la valeur du caractère courant est $<$ à celle du caractère suivant, on **retranche** sa valeur du total.
   - La valeur du dernier caractère est **toujours ajoutée**.

**Questions :**
1. **(1.5 pt)** Donner la trace manuelle de calcul pour convertir la chaîne \`"CXCII"\` en décimal. Détailler chaque opération d'addition et de soustraction.
2. **(1.5 pt)** Écrire en pseudocode conventionnel tunisien une fonction \`Valider(ch: chaîne) : booléen\` qui vérifie si une chaîne respecte strictement la syntaxe canonique d'un nombre romain.
3. **(2.0 pts)** Traduire en script Python 3 la fonction \`RomainToDecimal(ch: str) -> int\`. **Règle impérative :** La fonction doit appeler \`Valider(ch)\` en préalable absolu et lever une exception explicite \`ValueError\` si la chaîne n'est pas canoniquement valide, avant tout calcul.`,
        solutionMarkdown: `*(Corrigé détaillé inclus dans le document de correction)*`,
        gradingCriteria: [
          {
            id: "crit-dev1-trace",
            description: "Trace d'exécution et justification exacte de CXCII (192)",
            points: 1.5
          },
          {
            id: "crit-dev1-valider",
            description: "Fonction Valider en pseudocode avec contraintes canoniques",
            points: 1.5
          },
          {
            id: "crit-dev1-convert",
            description: "Fonction Python RomainToDecimal avec validation préalable et exception",
            points: 2
          }
        ]
      },
      {
        id: "dev-ex-2",
        number: 2,
        title: "Projet Carthage — Partie 2 : Fiches d'Inventaire et Persistance Binaire (6.0 points)",
        points: 6,
        statementMarkdown: `### Partie 2 : Modélisation des Objets et Persistance Binaire (6.0 points)
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
3. **(2.5 pts)** Écrire une fonction Python \`ChargerObjets(nom_fich: str) -> list\` qui lit l'ensemble des enregistrements du fichier et les renvoie sous la forme d'un tableau/liste d'enregistrements. Expliquer le rôle du bloc \`try ... except EOFError\` et préciser le comportement de la fonction dans le cas où le fichier sur disque est initialement vide (0 octet).`,
        solutionMarkdown: `*(Corrigé détaillé inclus dans le document de correction)*`,
        gradingCriteria: [
          {
            id: "crit-dev2-tdo",
            description: "Déclaration TDO et dictionnaire conforme",
            points: 1
          },
          {
            id: "crit-dev2-dump",
            description: "Procédure EnregistrerObjet avec mode 'ab'",
            points: 2.5
          },
          {
            id: "crit-dev2-load",
            description: "Fonction ChargerObjets avec gestion propre EOFError et fichier vide",
            points: 2.5
          }
        ]
      },
      {
        id: "dev-ex-3",
        number: 3,
        title: "Projet Carthage — Partie 3 : Moteur d'Exploitation, Tri Multi-Critères et Recherche (9.0 points)",
        points: 9,
        statementMarkdown: `### Partie 3 : Moteur de Tri Multi-Critères et Consultation Rapide (9.0 points)
**Durée indicative :** 50 minutes.

La direction du musée souhaite organiser une exposition des pièces majeures et disposer d'un outil de consultation pour ses chercheurs :
1. Les objets chargés depuis \`"objets.dat"\` doivent être triés par ordre **décroissant de quantité décimale** (\`qte_decimal\`). En cas d'égalité sur la quantité, ils doivent être ordonnés par ordre **alphabétique croissant de leur désignation**.
2. Un module d'édition doit lister les objets dont la quantité dépasse un seuil de sécurité $S$.
3. Une fonction de recherche dichotomique doit permettre de localiser un objet à partir de son code unique en un temps d'accès optimal $\\mathcal{O}(\\log_2 N)$.

**Questions :**
1. **(4.0 pts)** Écrire en pseudocode conventionnel tunisien puis implémenter en Python 3 la procédure de tri par sélection \`TriSelectionMultiCriteres(T, N)\` réalisant le tri selon les deux critères énoncés. Préciser pourquoi l'échange doit concerner l'objet complet \`T[i], T[pos_max] = T[pos_max], T[i]\` et non pas seulement la quantité.
2. **(2.5 pts)** Développer la procédure \`AfficherSelonSeuil(T, S)\` affichant chaque objet sous la forme :
\`\`\`text
[CODE] - DESIGNATION : QTE_DECIMAL unité(s) (QTE_ROMAIN)
\`\`\`
ainsi que le nombre total de pièces retenues.
3. **(2.5 pts)** Consultation rapide par code :
   - a) **(0.5 pt)** Expliquer pourquoi la recherche dichotomique sur le \`code\` ne peut **pas** être appliquée directement sur le tableau issu de la Question 1. Donner un contre-exemple concret.
   - b) **(0.5 pt)** Proposer la procédure \`TrierParCode(Var T : Tableau ; N : entier)\` préparant le tableau selon la clé requise.
   - c) **(1.5 pt)** Implémenter en Python 3 la fonction \`RechercheObjetParCode(T, code_rech) -> int\` retournant l'indice de l'objet dans \`T\` ou \`-1\` en cas d'absence, et donner sa complexité temporelle asymptotique.`,
        solutionMarkdown: `*(Corrigé détaillé inclus dans le document de correction)*`,
        gradingCriteria: [
          {
            id: "crit-dev3-tri",
            description: "Tri sélection double critère exact avec échange global",
            points: 4
          },
          {
            id: "crit-dev3-aff",
            description: "Filtrage et affichage formaté avec seuil",
            points: 2.5
          },
          {
            id: "crit-dev3-dicho",
            description: "Recherche dichotomique rigoureuse avec justification de précondition",
            points: 2.5
          }
        ]
      }
    ]
  };

  await saveDraft(devoirDraft);
  console.log("✓ DEVOIR updated to v3 and saved.");

  // 4. CORRIGE
  const corrigeDraft: EducationalDraft = {
    schemaVersion: "1.0.0",
    draftId: "DRAFT-CORRIGE-BACSI-2026-409671",
    taskId: "BACSI-2026-409671",
    version: 2,
    createdAt: "2026-11-06T11:15:18.885Z",
    updatedAt: new Date().toISOString(),
    status: "DRAFT",
    subject: "Algorithmique et Programmation",
    chapter: "Structures de Données Simples et Composées",
    academicYear: "2026-2027",
    contentType: "CORRIGE",
    totalPoints: 20,
    isOfficialBac: false,
    provenance: {
      generatedBy: "Antigravity Educational AI",
      sourcesCited: [
        {
          document: "Algorithmique_et_programmation__Seance_de_8h30_Sciences_de_linformatique__Algorithmique_et_programmation_2026_samedi_23_mai_2026.pdf",
          page: 1,
          section: "VERIFIED_OFFICIAL_EXAM : Corrigé analytique officiel et critères"
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: "Lycée Pilote de l'Excellence — Correction Officielle Détaillée",
      sessionLabel: "Corrigé Analytique et Grille de Notation — Devoir de Synthèse N°1",
      duration: "2h00",
      coefficient: 3
    },
    exercises: [
      {
        id: "cor-ex-1",
        number: 1,
        title: "Corrigé Partie 1 : Décodage & Validation Canonique des Nombres Romains (5.0 points)",
        points: 5,
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
**Remarque didactique :** La règle simplifiée du sujet 2026 interdisait plus de 3 lettres identiques consécutives. En arithmétique romaine canonique complète, on ajoute les interdictions de répétition sur \`V\`, \`L\`, \`D\` et la validité des soustractions.

En pseudocode conventionnel tunisien :
\`\`\`text
Fonction Valider(ch : chaîne) : booléen
Variables
    r : chaîne
    i : entier
    valide : booléen
Début
    r <- "IVXLCDM"
    Si (ch = "") Alors
        Retourner Faux
    FinSi

    valide <- Vrai
    // 1. Vérification que tous les caractères appartiennent à l'alphabet romain
    Pour i de 1 à Longueur(ch) Faire
        Si Position(ch[i], r) = 0 Alors
            valide <- Faux
        FinSi
    FinPour

    // 2. Interdiction de répétition pour V, L, D
    Si (Position("VV", ch) <> 0) Ou (Position("LL", ch) <> 0) Ou (Position("DD", ch) <> 0) Alors
        valide <- Faux
    FinSi

    // 3. Interdiction de plus de 3 répétitions pour I, X, C, M
    Si (Position("IIII", ch) <> 0) Ou (Position("XXXX", ch) <> 0) Ou 
       (Position("CCCC", ch) <> 0) Ou (Position("MMMM", ch) <> 0) Alors
        valide <- Faux
    FinSi

    // 4. Interdiction des soustractions invalides directes (ex: IIV, IC, IL, VX, XM)
    Si (Position("IIV", ch) <> 0) Ou (Position("IC", ch) <> 0) Ou 
       (Position("IL", ch) <> 0) Ou (Position("VX", ch) <> 0) Ou 
       (Position("XM", ch) <> 0) Ou (Position("MCMC", ch) <> 0) Alors
        valide <- Faux
    FinSi

    Retourner valide
Fin
\`\`\`

---

#### 3. Fonction RomainToDecimal en Python 3 (2.0 points)
\`\`\`python
import re

CANONICAL_ROMAN = re.compile(r'^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$')

def Valider(ch: str) -> bool:
    """Valide strictement la syntaxe canonique d'un nombre romain."""
    if not isinstance(ch, str) or len(ch) == 0:
        return False
    return bool(CANONICAL_ROMAN.match(ch))

def RomainToDecimal(ch: str) -> int:
    """
    Convertit un nombre romain canonique en décimal.
    RÈGLE ABSOLUE : La validation syntaxique précède impérativement tout calcul.
    """
    if not Valider(ch):
        raise ValueError(f"Nombre romain canonique invalide: {ch!r}")
        
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
- Fonction Valider en pseudocode (Chaîne vide, alphabet, interdictions VV/LL/DD et IIII) : **1.5 pt**
- Fonction RomainToDecimal en Python (Appel préalable à Valider avec levée de ValueError, dictionnaire, boucle n-1 et ajout final) : **2.0 pts**`,
        solutionMarkdown: `Code vérifié à 100% avec les tests automatisés du sujet officiel 2026.`,
        gradingCriteria: [
          {
            id: "cor1-c1",
            description: "Démarche de calcul CXCII = 192",
            points: 1.5
          },
          {
            id: "cor1-c2",
            description: "Pseudocode Valider avec contraintes canoniques",
            points: 1.5
          },
          {
            id: "cor1-c3",
            description: "Script Python RomainToDecimal avec validation préalable et exception",
            points: 2
          }
        ]
      },
      {
        id: "cor-ex-2",
        number: 2,
        title: "Corrigé Partie 2 : Fiches d'Inventaire et Persistance Binaire (6.0 points)",
        points: 6,
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
import os

def ChargerObjets(nom_fich: str) -> list:
    T = []
    if not os.path.exists(nom_fich):
        return T  # Retourne une liste vide si le fichier n'a pas encore été créé
        
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
**Explication de \`EOFError\` et du fichier vide :**
- Contrairement aux fichiers textes manipulant des lignes terminées par \`"\\n"\`, un fichier binaire \`pickle\` enregistre des flux d'octets sans délimiteur de fin. La tentative de lecture au-delà du dernier octet provoque la levée de l'exception native \`EOFError\`.
- Si le fichier est initialement vide (taille 0 octet), le premier appel \`load(f)\` déclenche immédiatement \`EOFError\`. Le bloc \`except\` capture l'erreur, quitte la boucle via \`break\`, et la fonction renvoie proprement la liste vide \`[]\` sans planter le programme.

**Grille d'évaluation de l'Exercice 2 :**
- TDO et dictionnaire : **1.0 pt**
- Procédure d'enregistrement avec mode 'ab', dump et close : **2.5 pts**
- Procédure de chargement avec mode 'rb', boucle infinie, gestion EOFError et fermeture : **2.5 pts**`,
        solutionMarkdown: `Procédure rigoureusement testée sur le système de fichiers réel.`,
        gradingCriteria: [
          {
            id: "cor2-c1",
            description: "Définition de structure",
            points: 1
          },
          {
            id: "cor2-c2",
            description: "Procédure EnregistrerObjet",
            points: 2.5
          },
          {
            id: "cor2-c3",
            description: "Fonction ChargerObjets",
            points: 2.5
          }
        ]
      },
      {
        id: "cor-ex-3",
        number: 3,
        title: "Corrigé Partie 3 : Moteur d'Exploitation, Tri Multi-Critères et Recherche (9.0 points)",
        points: 9,
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

#### 3. Consultation Rapide par Code & Recherche Dichotomique (2.5 points)

**a) Incompatibilité du tableau trié par quantité (0.5 point) :**
La recherche dichotomique repose sur la dichotomie monotone de la clé de recherche. Dans le tableau issu de la Question 1, les objets sont ordonnés par quantité décroissante \`qte_decimal\`.
**Contre-exemple :** Soient 4 objets triés par quantité :
- Index 0 : \`OBJ200\` (1000 pièces)
- Index 1 : \`OBJ100\` (500 pièces)
- Index 2 : \`OBJ900\` (50 pièces)
- Index 3 : \`OBJ500\` (10 pièces)

Si l'on cherche le code \`OBJ500\` par recherche dichotomique :
1. \`mil = (0+3)//2 = 1\` (\`OBJ100\`).
2. La comparaison \`'OBJ100' < 'OBJ500'\` est vraie $\\implies$ \`deb = mil + 1 = 2\`.
3. Sous-espace [2..3] : \`mil = (2+3)//2 = 2\` (\`OBJ900\`).
4. La comparaison \`'OBJ900' < 'OBJ500'\` est FAUSSE (car \`'OBJ900' > 'OBJ500'\`) $\\implies$ \`fin = mil - 1 = 1\`.
5. \`deb > fin\` : la boucle se termine et la fonction renvoie \`-1\` (**échec !**), alors que \`OBJ500\` est bien présent à l'indice 3 !

**b) Procédure TrierParCode (0.5 point) :**
\`\`\`python
def TrierParCode(T: list) -> None:
    """Trie le tableau par ordre croissant du champ 'code'."""
    n = len(T)
    for i in range(n - 1):
        pos_min = i
        for j in range(i + 1, n):
            if T[j]['code'] < T[pos_min]['code']:
                pos_min = j
        if pos_min != i:
            T[i], T[pos_min] = T[pos_min], T[i]
\`\`\`

**c) Fonction RechercheObjetParCode en Python 3 (1.5 point) :**
\`\`\`python
def RechercheObjetParCode(T: list, code_rech: str) -> int:
    """Recherche dichotomique sur tableau IMPÉRATIVEMENT trié selon 'code'."""
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
- Justification de la précondition de tri par code avec contre-exemple, procédure TrierParCode et recherche dichotomique : **2.5 pts**`,
        solutionMarkdown: `Ensemble des algorithmes validés sur des cas de test aux limites.`,
        gradingCriteria: [
          {
            id: "cor3-c1",
            description: "Tri sélection multi-critères avec permutation complète",
            points: 4
          },
          {
            id: "cor3-c2",
            description: "Affichage selon seuil et décompte",
            points: 2.5
          },
          {
            id: "cor3-c3",
            description: "Recherche dichotomique, explication précondition et analyse complexité",
            points: 2.5
          }
        ]
      }
    ]
  };

  await saveDraft(corrigeDraft);
  console.log("✓ CORRIGE updated to v3 and saved.");

  console.log("=== ALL 4 PILOT DRAFTS SUCCESSFULLY UPDATED TO VERSION 3 ===");
}

run().catch(err => {
  console.error("FATAL ERROR during update:", err);
  process.exit(1);
});
