import { saveDraft, getDraftById } from '../src/lib/server/draft-service';

async function main() {
  console.log("=== ALIGNING PILOT 01 DRAFTS 100% WITH OFFICIAL TUNISIAN CURRICULUM ===");

  // 1. UPDATE COURS
  const cours = await getDraftById("DRAFT-COURS-BACSI-2026-409671");
  if (cours) {
    // Update Module 3 section 3.3 to remove academic latin grammar and focus on Bac 2026 standard
    cours.exercises[2].statementMarkdown = `### 3.1 Tri d'un Tableau d'Enregistrements (Tri par Sélection Multi-Critères)

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

### 3.3 Traitement des Nombres Romains selon le Sujet Officiel du Bac 2026

Fil épreuve pratique officielle du **Bac 2026 (Séance 8h30)**, la consigne ministérielle est claire et directe :
> *"On supposera qu’un nombre romain est une chaine de caractères non vide, composée de chiffres romains choisis uniquement parmi les lettres suivantes : I, V, X, L, C, D et M et qu’elle ne contient pas plus de trois lettres identiques consécutives."*

En Python standard de 4ème SI (environnement Thonny, **sans aucune bibliothèque externe**) :
1. On vérifie que chaque caractère appartient à la chaîne autorisée \`"IVXLCDM"\`.
2. On vérifie qu'aucun quadruplet identique n'apparaît avec une simple boucle : \`ch[i] == ch[i+1] == ch[i+2] == ch[i+3]\`.
3. Pour la conversion en décimal : on utilise un dictionnaire de correspondances et on compare \`valeurs[ch[i]]\` avec \`valeurs[ch[i+1]]\`.`;

    await saveDraft(cours);
    console.log("✓ DRAFT-COURS updated and saved.");
  }

  // 2. UPDATE DEVOIR
  const devoir = await getDraftById("DRAFT-DEVOIR-BACSI-2026-409671");
  if (devoir) {
    devoir.exercises[0].statementMarkdown = `### Contexte Général du Devoir : Informatisation du Musée National de Carthage
La conservation du Musée National de Carthage modernise son système d'inventaire archéologique.
Dans les anciens registres manuscrits, les quantités des pièces sont exprimées en **chiffres romains** (contexte officiel du Bac Pratique 2026).
Le devoir a pour objectif de concevoir une application modulaire et robuste en trois étapes :
1. **Partie 1 :** Décodage et validation des quantités en chiffres romains.
2. **Partie 2 :** Archivage et persistance des fiches d'inventaire dans un fichier binaire sérialisé.
3. **Partie 3 :** Moteur d'interrogation, de tri multi-critères et de recherche rapide pour les conservateurs.

---

### Partie 1 : Décodage & Validation Algorithmique (5.0 points)
**Durée indicative :** 30 minutes.

Conformément au cahier des charges officiel du Ministère de l'Éducation :
Un nombre romain est une chaîne de caractères non vide, composée de chiffres romains choisis uniquement parmi les lettres :
\`I\` (1), \`V\` (5), \`X\` (10), \`L\` (50), \`C\` (100), \`D\` (500), \`M\` (1000).

**Contrainte officielle :**
La chaîne ne contient pas plus de trois lettres identiques consécutives (ex: \`"IIII"\` est invalide, \`"IV"\` est valide).

**Règles officielles de conversion en décimal :**
On parcourt la chaîne de gauche à droite :
- Si la valeur du caractère courant est $\\ge$ à celle du caractère suivant, on **ajoute** sa valeur.
- Si la valeur du caractère courant est $<$ à celle du caractère suivant, on **retranche** sa valeur.
- La valeur du dernier caractère est **toujours ajoutée**.

**Questions :**
1. **(1.5 pt)** Donner la trace manuelle de calcul pour convertir la chaîne \`"CXCII"\` en décimal. Détailler chaque opération d'addition et de soustraction.
2. **(1.5 pt)** Écrire en pseudocode conventionnel tunisien une fonction \`Valider(ch: chaîne) : booléen\` qui vérifie si une chaîne respecte strictement les deux conditions du sujet officiel (lettres autorisées et au plus 3 lettres identiques consécutives).
3. **(2.0 pts)** Traduire en script Python 3 la fonction \`RomainToDecimal(ch: str) -> int\` effectuant la conversion décimale selon les règles officielles du sujet.`;

    await saveDraft(devoir);
    console.log("✓ DRAFT-DEVOIR updated and saved.");
  }

  // 3. UPDATE CORRIGE
  const corrige = await getDraftById("DRAFT-CORRIGE-BACSI-2026-409671");
  if (corrige) {
    corrige.exercises[0].statementMarkdown = `### Corrigé Détaillé de l'Exercice 1 (5.0 points)

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

#### 2. Fonction Valider en pseudocode conventionnel tunisien (1.5 point)

\`\`\`text
Fonction Valider(ch : chaîne) : booléen
Variables
    r : chaîne
    i : entier
    valide : booléen
Début
    Si ch = "" Alors
        Retourner Faux
    FinSi

    r <- "IVXLCDM"
    valide <- Vrai
    i <- 1

    // 1. Vérification que tous les caractères appartiennent à l'alphabet romain
    TantQue (i <= Longueur(ch)) Et valide Faire
        Si Position(ch[i], r) = 0 Alors
            valide <- Faux
        Sinon
            i <- i + 1
        FinSi
    FinTantQue

    // 2. Vérification de la contrainte : pas plus de trois lettres identiques consécutives
    Si valide Et (Longueur(ch) >= 4) Alors
        i <- 1
        TantQue (i <= Longueur(ch) - 3) Et valide Faire
            Si (ch[i] = ch[i+1]) Et (ch[i] = ch[i+2]) Et (ch[i] = ch[i+3]) Alors
                valide <- Faux
            Sinon
                i <- i + 1
            FinSi
        FinTantQue
    FinSi

    Retourner valide
Fin
\`\`\`

---

#### 3. Fonctions Valider et RomainToDecimal en Python 3 Standard (2.0 points)
*(Conforme 100% au programme officiel de 4ème SI — sans aucune bibliothèque externe)*

\`\`\`python
def Valider(ch: str) -> bool:
    """Vérifie les contraintes officielles du Bac 2026."""
    if len(ch) == 0:
        return False
        
    lettres_autorisees = "IVXLCDM"
    
    # 1. Vérification de l'alphabet autorisé
    for c in ch:
        if c not in lettres_autorisees:
            return False
            
    # 2. Vérification : pas plus de 3 lettres identiques consécutives
    for i in range(len(ch) - 3):
        if ch[i] == ch[i + 1] == ch[i + 2] == ch[i + 3]:
            return False
            
    return True


def RomainToDecimal(ch: str) -> int:
    """Convertit un nombre romain selon les règles officielles du sujet 2026."""
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
            
    # Ajout obligatoire de la valeur du dernier caractère
    total += valeurs[ch[-1]]
    return total
\`\`\`

**Grille d'évaluation de l'Exercice 1 :**
- Calcul détaillé et résultat 192 : **1.5 pt**
- Fonction Valider en pseudocode (Chaîne non vide, alphabet autorisé et contrôle de 3 lettres identiques max) : **1.5 pt**
- Fonctions Python conformes Thonny / Bac SI (Dictionnaire de correspondances, boucle n-1 et addition/soustraction) : **2.0 pts**`;

    await saveDraft(corrige);
    console.log("✓ DRAFT-CORRIGE updated and saved.");
  }

  console.log("=== ALL DRAFTS SUCCESSFULLY RE-ALIGNED WITH TUNISIAN PROGRAMME ===");
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
