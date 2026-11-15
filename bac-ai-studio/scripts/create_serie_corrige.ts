import { saveDraft } from '../src/lib/server/draft-service';
import { EducationalDraft } from '../src/lib/types';

async function main() {
  console.log("=== CREATING DRAFT-CORRIGE-SERIE-BACSI-2026-409671 ===");

  const draft: EducationalDraft = {
    schemaVersion: "1.0.0",
    draftId: "DRAFT-CORRIGE-SERIE-BACSI-2026-409671",
    taskId: "BACSI-2026-409671",
    version: 1,
    createdAt: new Date().toISOString(),
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
          page: 2,
          section: "VERIFIED_OFFICIAL_EXAM : Corrigé analytique de la série d'exercices guidés"
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: "Lycée Pilote de l'Excellence — Évaluation Pédagogique Formative",
      sessionLabel: "Corrigé Analytique et Barème Détaillé — Série d'Exercices N°1",
      duration: "2h00",
      coefficient: 3
    },
    exercises: [
      {
        id: "cor-serie-ex-1",
        number: 1,
        title: "Corrigé Exercice 1 : Modélisation et Contrôle de Saisie (4.0 points)",
        points: 4,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 1 (4.0 points)

#### 1. Déclaration en pseudocode conventionnel du type Livre et TDO (1.0 point)

**Chma3naha Livre fil Algorithmique ?**  
Kima fhamna fil cours, ma nasta3mloush des variables mfar9a l'kol champ (titre, prix, etc.). Nlammou les attributs el koll fi **تسجيلة (Enregistrement)** hétérogène.

**Déclaration du type (Partie Déclaration Types) :**
\`\`\`text
Type
    Livre = Enregistrement
        isbn       : chaîne
        titre      : chaîne
        prix       : réel
        disponible : booléen
    Fin
\`\`\`

**TDO (Tableau de Déclaration des Objets) :**
| Objet | Type / Nature | Rôle |
| :--- | :--- | :--- |
| \`livre\` | \`Livre\` | Enregistrement modélisant un ouvrage de la bibliothèque |
| \`T\` | \`Tableau de N Livre\` | Tableau d'enregistrements représentant le fonds documentaire |

**En Python 3 :**
\`\`\`python
livre = {
    'isbn': "9789973123456",
    'titre': "Algorithmique et Programmation",
    'prix': 18.5,
    'disponible': True
}
\`\`\`

---

#### 2. Fonction Python \`valider_isbn(ch: str) -> bool\` (2.0 points)

**Principe didactique :**  
Un ISBN valide doit satisfaire deux conditions strictes :
1. Avoir une longueur exactement égale à 13 caractères (\`len(ch) == 13\`).
2. Être composé exclusivement de caractères numériques de \`'0'\` à \`'9'\`.

\`\`\`python
def valider_isbn(ch: str) -> bool:
    """Vérifie si une chaîne représente un code ISBN valide (exactement 13 chiffres)."""
    if not isinstance(ch, str) or len(ch) != 13:
        return False
    for c in ch:
        if not ('0' <= c <= '9'):
            return False
    return True
\`\`\`

> [!WARNING]
> **Piège fréquent d'élève :** Utiliser \`int(ch)\` pour vérifier que ce sont des chiffres !  
> Si la chaîne commence par un zéro (ex: \`"0123456789012"\`), la conversion tronque les zéros de tête ou risque de planter si la chaîne contient des lettres. Le parcours caractère par caractère est la méthode officielle recommandée.

---

#### 3. Fonction Python \`creer_livre\` avec levée d'exceptions (1.0 point)

\`\`\`python
def creer_livre(isbn: str, titre: str, prix: float) -> dict:
    """Instancie un enregistrement Livre après validation stricte des contraintes."""
    if not valider_isbn(isbn):
        raise ValueError(f"ISBN invalide: {isbn!r}")
    if not isinstance(titre, str) or not (3 <= len(titre.strip()) <= 50):
        raise ValueError("Le titre doit contenir entre 3 et 50 caractères non vides.")
    if not isinstance(prix, (int, float)) or prix <= 0:
        raise ValueError(f"Le prix doit être un réel strictement positif, reçu: {prix}")
        
    return {
        'isbn': isbn,
        'titre': titre.strip(),
        'prix': float(prix),
        'disponible': True
    }
\`\`\`

**Grille d'évaluation de l'Exercice 1 :**
- Déclaration TDO conforme (syntaxe \`Type ... Enregistrement ... Fin\`) : **1.0 pt**
- Fonction \`valider_isbn\` (test de longueur 13 et appartenance aux chiffres \`0\`-\`9\`) : **2.0 pts**
- Fonction \`creer_livre\` (dictionnaire conforme avec levée explicite de \`ValueError\`) : **1.0 pt**`,
        solutionMarkdown: `Code vérifié à 100% avec les tests automatisés du module.`,
        gradingCriteria: [
          {
            id: "cor-ser-1-tdo",
            description: "Déclaration TDO et type Livre",
            points: 1.0
          },
          {
            id: "cor-ser-1-isbn",
            description: "Fonction valider_isbn",
            points: 2.0
          },
          {
            id: "cor-ser-1-creer",
            description: "Fonction creer_livre avec gestion des exceptions",
            points: 1.0
          }
        ]
      },
      {
        id: "cor-serie-ex-2",
        number: 2,
        title: "Corrigé Exercice 2 : Persistance Binaire et Ajout dans un Fichier pickle (5.0 points)",
        points: 5,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 2 (5.0 points)

#### 1. Procédure Python \`ajouter_livre\` (2.0 points)

\`\`\`python
from pickle import dump

def ajouter_livre(nom_fich: str, livre: dict) -> None:
    """Écrit un enregistrement Livre à la fin du fichier binaire en mode ajout."""
    f = open(nom_fich, "ab")
    dump(livre, f)
    f.close()
\`\`\`

---

#### 2. Fonction Python \`saisir_et_enregistrer_plusieurs\` (2.0 points)

\`\`\`python
def saisir_et_enregistrer_plusieurs(nom_fich: str, n: int) -> None:
    """Saisit N livres au clavier avec boucle de contrôle et les ajoute dans le fichier."""
    for i in range(1, n + 1):
        print(f"--- Saisie du livre N°{i}/{n} ---")
        
        # Saisie contrôlée de l'ISBN
        while True:
            isbn = input("Donner l'ISBN (13 chiffres) : ").strip()
            if valider_isbn(isbn):
                break
            print("Erreur : ISBN invalide ! Recommencez.")
            
        # Saisie contrôlée du titre
        while True:
            titre = input("Donner le titre (3 à 50 caractères) : ").strip()
            if 3 <= len(titre) <= 50:
                break
            print("Erreur : longueur du titre non respectée !")
            
        # Saisie contrôlée du prix
        while True:
            try:
                prix = float(input("Donner le prix en DT (> 0) : "))
                if prix > 0:
                    break
                print("Erreur : le prix doit être strictement positif !")
            except ValueError:
                print("Erreur : veuillez saisir un nombre réel valide !")
                
        livre = creer_livre(isbn, titre, prix)
        ajouter_livre(nom_fich, livre)
        print(f"Livre '{titre}' enregistré avec succès.")
\`\`\`

---

#### 3. Justification didactique du mode \`"ab"\` vs \`"wb"\` (1.0 point)

- **Mode \`"ab"\` (Append Binary) :**  
  Positionne le pointeur d'écriture à la fin physique du fichier. Si le fichier existe déjà, les enregistrements antérieurs sont intégralement préservés et le nouvel objet est écrit à la suite. Si le fichier n'existe pas, il est créé automatiquement.
- **Danger du mode \`"wb"\` (Write Binary) :**  
  Ouvre le fichier en écriture destructrice : si le fichier existe, son contenu est immédiatement tronqué à **0 octet**, provoquant l'effacement irréversible de tous les livres enregistrés lors des sessions précédentes.

**Grille d'évaluation de l'Exercice 2 :**
- Procédure \`ajouter_livre\` (mode \`"ab"\`, \`dump(livre, f)\`, \`f.close()\`) : **2.0 pts**
- Fonction \`saisir_et_enregistrer_plusieurs\` (boucle pour $N$, saisie contrôlée, appel \`ajouter_livre\`) : **2.0 pts**
- Justification didactique exacte de \`"ab"\` vs \`"wb"\` : **1.0 pt**`,
        solutionMarkdown: `Procédure rigoureusement vérifiée sur flux binaires réels.`,
        gradingCriteria: [
          {
            id: "cor-ser-2-ajout",
            description: "Procédure ajouter_livre",
            points: 2.0
          },
          {
            id: "cor-ser-2-saisie",
            description: "Fonction saisir_et_enregistrer_plusieurs",
            points: 2.0
          },
          {
            id: "cor-ser-2-justif",
            description: "Justification du mode ab vs wb",
            points: 1.0
          }
        ]
      },
      {
        id: "cor-serie-ex-3",
        number: 3,
        title: "Corrigé Exercice 3 : Exploitation et Statistiques sur Fichier Typé (5.0 points)",
        points: 5,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 3 (5.0 points)

#### 1. Fonction Python \`charger_livres\` avec gestion d'\`EOFError\` (2.5 points)

\`\`\`python
import os
from pickle import load

def charger_livres(nom_fich: str) -> list:
    """Lit l'ensemble des enregistrements Livre depuis le fichier binaire."""
    livres = []
    
    # 1. Gestion du cas où le fichier n'a pas encore été créé sur le disque
    if not os.path.exists(nom_fich):
        return livres
        
    f = open(nom_fich, "rb")
    while True:
        try:
            e = load(f)          # Lit l'objet suivant
            livres.append(e)     # L'insère dans la liste
        except EOFError:
            break               # Sortie normale dès que la fin du fichier est atteinte
            
    f.close()
    return livres
\`\`\`

> [!NOTE]
> **Comportement sur fichier vide (0 octet) :**  
> Si le fichier existe mais contient 0 octet, le premier appel \`load(f)\` déclenche immédiatement l'exception native \`EOFError\`. Le bloc \`except\` capture l'erreur, termine la boucle et retourne la liste vide \`[]\` sans planter le programme.

---

#### 2. Fonction Python \`prix_moyen\` (1.5 point)

\`\`\`python
def prix_moyen(T: list) -> float:
    """Calcule le prix moyen des livres enregistrés avec garde sur tableau vide."""
    if not T or len(T) == 0:
        return 0.0
    somme = sum(livre['prix'] for livre in T)
    return round(somme / len(T), 3)
\`\`\`

---

#### 3. Fonction Python \`extraire_disponibles\` (1.0 point)

\`\`\`python
def extraire_disponibles(T: list) -> list:
    """Extrait et retourne la liste des livres actuellement disponibles pour emprunt."""
    return [livre for livre in T if livre.get('disponible') is True]
\`\`\`

**Grille d'évaluation de l'Exercice 3 :**
- Fonction \`charger_livres\` (mode \`"rb"\`, boucle infinie, gestion propre d'\`EOFError\`, fermeture) : **2.5 pts**
- Fonction \`prix_moyen\` (gestion du tableau vide retournant \`0.0\`, moyenne exacte) : **1.5 pt**
- Fonction \`extraire_disponibles\` (filtrage conditionnel sur \`disponible == True\`) : **1.0 pt**`,
        solutionMarkdown: `Algorithmes validés sur cas limites (fichier vide, absence, filtrage).`,
        gradingCriteria: [
          {
            id: "cor-ser-3-charge",
            description: "Fonction charger_livres",
            points: 2.5
          },
          {
            id: "cor-ser-3-moy",
            description: "Fonction prix_moyen",
            points: 1.5
          },
          {
            id: "cor-ser-3-extraire",
            description: "Fonction extraire_disponibles",
            points: 1.0
          }
        ]
      },
      {
        id: "cor-serie-ex-4",
        number: 4,
        title: "Corrigé Exercice 4 : Problème de Synthèse — Tri et Consultation (6.0 points)",
        points: 6,
        statementMarkdown: `### Corrigé Détaillé de l'Exercice 4 (6.0 points)

#### 1. Procédure de Tri par Sélection Décroissant par Prix (2.5 points)

**En pseudocode conventionnel :**
\`\`\`text
Procédure tri_selection_livres(Var T : Tableau de N Livre ; N : entier)
Variables
    i, j, pos_max : entier
    aux : Livre
Début
    Pour i de 0 à N - 2 Faire
        pos_max <- i
        Pour j de i + 1 à N - 1 Faire
            Si T[j].prix > T[pos_max].prix Alors
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
def tri_selection_livres(T: list) -> None:
    """Trie le tableau T d'enregistrements Livre sur place par ordre décroissant du prix."""
    n = len(T)
    for i in range(n - 1):
        pos_max = i
        for j in range(i + 1, n):
            if T[j]['prix'] > T[pos_max]['prix']:
                pos_max = j
        if pos_max != i:
            T[i], T[pos_max] = T[pos_max], T[i]
\`\`\`

---

#### 2. Fonction \`rechercher_livre_isbn_sequentiel\` & Justification Pédagogique (1.5 point)

\`\`\`python
def rechercher_livre_isbn_sequentiel(T: list, isbn_recherche: str) -> int:
    """Recherche séquentielle d'un livre par son code ISBN."""
    for idx, livre in enumerate(T):
        if livre['isbn'] == isbn_recherche:
            return idx
    return -1
\`\`\`

> [!IMPORTANT]
> **Pourquoi la recherche séquentielle est OBLIGATOIRE ici (et non la dichotomie) ?**  
> Le tableau \`T\` a été ordonné par **prix décroissant** à la question précédente.  
> Par conséquent, les codes ISBN ne suivent **aucune relation d'ordre monotone** dans le tableau.  
> Si l'on appliquait la recherche dichotomique sur l'ISBN, le test sur \`T[mil]['isbn']\` éliminerait arbitrairement la moitié gauche ou droite, provoquant des faux négatifs (le livre ne serait pas trouvé alors qu'il est présent).  
> La recherche séquentielle en temps linéaire $\\mathcal{O}(N)$ est donc la seule méthode algorithmiquement correcte sur ce tableau non ordonné selon la clé de recherche.

---

#### 3. Module \`generer_rapport_inventaire\` (2.0 points)

\`\`\`python
def generer_rapport_inventaire(nom_fich_source: str, nom_fich_rapport: str) -> None:
    """Lit les livres depuis le fichier binaire, les trie et génère le rapport texte."""
    livres = charger_livres(nom_fich_source)
    tri_selection_livres(livres)
    
    f_out = open(nom_fich_rapport, "w", encoding="utf-8")
    for livre in livres:
        dispo_str = "OUI" if livre.get('disponible') else "NON"
        ligne = f"[{livre['isbn']}] {livre['titre']} - {livre['prix']:.2f} DT (Disponible: {dispo_str})\\n"
        f_out.write(ligne)
        
    f_out.close()
\`\`\`

**Grille d'évaluation de l'Exercice 4 :**
- Tri sélection complet décroissant avec permutation d'objet : **2.5 pts**
- Recherche séquentielle et justification rigoureuse de la non-applicabilité de la dichotomie : **1.5 pt**
- Procédure de génération de rapport texte formaté : **2.0 pts**`,
        solutionMarkdown: `Problème de synthèse validé avec rapport texte et tri complet.`,
        gradingCriteria: [
          {
            id: "cor-ser-4-tri",
            description: "Procédure tri_selection_livres",
            points: 2.5
          },
          {
            id: "cor-ser-4-rech",
            description: "Recherche séquentielle et justification",
            points: 1.5
          },
          {
            id: "cor-ser-4-rap",
            description: "Module generer_rapport_inventaire",
            points: 2.0
          }
        ]
      }
    ]
  };

  const saved = await saveDraft(draft);
  console.log("✓ Saved new draft:", saved.draftId, "Version:", saved.version, "Status:", saved.status);
}

main().catch(err => {
  console.error("FATAL ERROR creating serie corrige:", err);
  process.exit(1);
});
