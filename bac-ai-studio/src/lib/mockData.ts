import { DocumentRecord, EducationalDraft } from './types';

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-algo-2026-sujet',
    filename: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
    sizeBytes: 1254300,
    classification: 'OFFICIAL_EXAM',
    subject: 'Algorithmique et Programmation',
    academicYear: '2025-2026',
    session: 'PRINCIPALE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: true,
    verifiedCurriculum: true
  },
  {
    id: 'doc-algo-2025-sujet',
    filename: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2025_Sujet.pdf',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\Algorithmique_et_programmation_Sciences_de_l_informatique_2025_Sujet.pdf',
    sizeBytes: 1184900,
    classification: 'OFFICIAL_EXAM',
    subject: 'Algorithmique et Programmation',
    academicYear: '2024-2025',
    session: 'PRINCIPALE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: true,
    verifiedCurriculum: true
  },
  {
    id: 'doc-livre-bd',
    filename: 'livre bd.pdf',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\livre bd.pdf',
    sizeBytes: 8450120,
    classification: 'OFFICIAL_TEXTBOOK',
    subject: 'STI & Bases de Données',
    academicYear: '2026-2027',
    session: 'NON_APPLICABLE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: true,
    verifiedCurriculum: true
  },
  {
    id: 'doc-annexes-techniques',
    filename: 'Annexes html css sql php js 4si v2025_2.pdf',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\Annexes html css sql php js 4si v2025_2.pdf',
    sizeBytes: 642000,
    classification: 'OFFICIAL_TEXTBOOK',
    subject: 'STI & Bases de Données',
    academicYear: '2024-2025',
    session: 'NON_APPLICABLE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: true,
    verifiedCurriculum: true
  },
  {
    id: 'doc-sql-tezeghdenti',
    filename: 'bd_tezeghdenti_2027.sql',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\bd_tezeghdenti_2027.sql',
    sizeBytes: 14200,
    classification: 'EXERCISE_RESOURCE',
    subject: 'STI & Bases de Données',
    academicYear: '2026-2027',
    session: 'PRATIQUE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: false,
    verifiedCurriculum: false
  },
  {
    id: 'doc-maths-2026-correction',
    filename: 'Mathematiques_Sciences_de_l_informatique_2026_Correction.pdf',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\Mathematiques_Sciences_de_l_informatique_2026_Correction.pdf',
    sizeBytes: 1845000,
    classification: 'TEACHER_MATERIAL',
    subject: 'Mathématiques',
    academicYear: '2025-2026',
    session: 'PRINCIPALE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: false,
    verifiedCurriculum: true
  },
  {
    id: 'doc-bac-pratique-algo-zip',
    filename: 'bac-pratique-23052026-algo-8h30-fichiers.zip',
    path: 'D:\\EDUCATION RAYEN\\bac info cours exam resourse\\bac-pratique-23052026-algo-8h30-fichiers.zip',
    sizeBytes: 34500,
    classification: 'OFFICIAL_EXAM',
    subject: 'Algorithmique et Programmation',
    academicYear: '2025-2026',
    session: 'PRATIQUE',
    extractionStatus: 'NOT_INDEXED',
    isOfficial: true,
    verifiedCurriculum: true
  }
];

export const BAC_SUBJECTS = [
  {
    id: 'algo',
    name: 'Algorithmique et Programmation',
    nameAr: 'الخوارزميات والبرمجة',
    coeff: 3,
    type: 'Écrit (3h) + Pratique (1h30)',
    chapters: [
      'Les Structures de Données Avancées (Enregistrements, Fichiers typés et textes)',
      'La Récursivité (Fonctions et procédures récursives)',
      'Les Algorithmes d\'Arithmétique (PGCD, PPCM, Nombres premiers, Conversions)',
      'Les Algorithmes de Tri (Tri par sélection, insertion, bulles, tri fusion)',
      'Les Algorithmes d\'Approximation (Dichotomie, Méthode de Newton)',
      'Interface Graphique PyQt et Manipulation de Fichiers'
    ]
  },
  {
    id: 'sti',
    name: 'Systèmes et Technologies de l\'Informatique (STI)',
    nameAr: 'أنظمة وتكنولوجيات الإعلامية',
    coeff: 3,
    type: 'Écrit (2h) + Pratique (1h30)',
    chapters: [
      'Modèle Relationnel & Conception des Bases de Données (Normalisation, 1FN, 2FN, 3FN)',
      'Langage SQL (DDL, DML, Requêtes SELECT avancées, GROUP BY, Jointures)',
      'Développement Web Côté Client (HTML5, CSS3, JavaScript - Contrôle de saisie)',
      'Développement Web Côté Serveur (PHP, Connexion PDO/MySQL, Sessions, Formulaires)',
      'Architecture Réseau & Protocoles Internet (IP, DNS, HTTP, Modèle OSI/TCP-IP)'
    ]
  },
  {
    id: 'maths',
    name: 'Mathématiques',
    nameAr: 'الرياضيات',
    coeff: 3,
    type: 'Écrit (3h)',
    chapters: [
      'Suites Numériques et Récurrence',
      'Continuité, Dérivabilité et Étude de Fonctions',
      'Fonctions Logarithme Népérien et Exponentielle',
      'Calcul Intégral et Équations Différentielles',
      'Nombres Complexes et Géométrie dans le Plan',
      'Arithmétique dans Z (Congruences, Théorème de Gauss, Bezout)'
    ]
  },
  {
    id: 'physique',
    name: 'Sciences Physiques',
    nameAr: 'العلوم الفيزيائية',
    coeff: 2,
    type: 'Écrit (2h)',
    chapters: [
      'Circuit RC, RL et RLC en Oscillations Libres et Forcées',
      'Ondes Mécaniques Progressives',
      'Interférences Lumineuses et Diffraction',
      'Cinétique Chimique et Équilibre Chimique',
      'Réactions Acido-Basiques et Dosages'
    ]
  },
  {
    id: 'francais',
    name: 'Français',
    nameAr: 'الفرنسية',
    coeff: 1,
    type: 'Écrit (2h)',
    chapters: ['L\'Homme et la Science', 'Guerre et Paix', 'Appels et Témoignages']
  },
  {
    id: 'anglais',
    name: 'Anglais',
    nameAr: 'الإنجليزية',
    coeff: 1,
    type: 'Écrit (2h)',
    chapters: ['Science and Technology', 'Artificial Intelligence', 'Education and Careers']
  },
  {
    id: 'arabe',
    name: 'Arabe',
    nameAr: 'العربية',
    coeff: 1,
    type: 'Écrit (2h)',
    chapters: ['في التفكير العلمي', 'قضايا معاصرة', 'الأدب والتجديد']
  },
  {
    id: 'philo',
    name: 'Philosophie',
    nameAr: 'الفلسفة',
    coeff: 1,
    type: 'Écrit (2h)',
    chapters: ['الإنساني واللاإنساني', 'العلم والتقنية', 'النمذجة والمعرفة']
  }
];

export const SAMPLE_DRAFT: EducationalDraft = {
  schemaVersion: '1.0.0',
  draftId: 'draft-algo-rec-2026-01',
  taskId: 'task-algo-rec-01',
  version: 1,
  createdAt: '2026-11-05T21:40:00Z',
  updatedAt: '2026-11-05T21:40:00Z',
  status: 'DRAFT',
  subject: 'Algorithmique et Programmation',
  chapter: 'La Récursivité',
  academicYear: '2026-2027',
  contentType: 'DEVOIR_DE_CONTROLE',
  totalPoints: 20.0,
  isOfficialBac: false,
  provenance: {
    generatedBy: 'Antigravity Educational AI',
    sourcesCited: [
      {
        document: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
        page: 2,
        section: 'Exercice 2'
      },
      {
        document: 'livre bd.pdf',
        page: 45,
        section: 'Règles de décomposition'
      }
    ],
    verifiedCurriculum: true
  },
  header: {
    institution: 'République Tunisienne — Ministère de l\'Éducation',
    sessionLabel: 'Épreuve d\'entraînement — Document non officiel conçu par BAC AI Tunisia',
    duration: '2 Heures',
    coefficient: 3
  },
  exercises: [
    {
      id: 'ex-1',
      number: 1,
      title: 'QCM & Analyse de fonctions récursives',
      points: 4.0,
      statementMarkdown: 'Soit la fonction récursive suivante écrite en Python (environnement Thonny Bac) :\n\n```python\ndef f(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\n```\n\n1. Déterminer la condition d\'arrêt de cette fonction récursive.\n2. Calculer la valeur renvoyée par l\'appel `f(4)` en traçant l\'arbre des appels.',
      solutionMarkdown: '1. **Condition d\'arrêt :** `if n <= 1: return 1`. Elle garantit la terminaison pour tout entier naturel positif.\n2. **Trace des appels :**\n   - `f(4) = 4 * f(3)`\n   - `f(3) = 3 * f(2)`\n   - `f(2) = 2 * f(1)`\n   - `f(1) = 1` (cas de base)\n   - D\'où : `f(4) = 4 * 3 * 2 * 1 = 24`.',
      gradingCriteria: [
        { id: 'crit-1.1', description: 'Identification correcte de la condition d\'arrêt', points: 1.5 },
        { id: 'crit-1.2', description: 'Arbre des appels et résultat final 24', points: 2.5 }
      ]
    },
    {
      id: 'ex-2',
      number: 2,
      title: 'Calcul d\'une suite récurrente',
      points: 6.0,
      statementMarkdown: 'On considère la suite mathématique définie pour tout $n \\in \\mathbb{N}$ par :\n$$U_0 = 2, \\quad U_n = 3 \\cdot U_{n-1} + 1$$\n\nÉcrire en Python une fonction récursive `suite_u(n: int) -> int` qui calcule et renvoie le terme $U_n$.',
      solutionMarkdown: '```python\ndef suite_u(n: int) -> int:\n    # Cas de base\n    if n == 0:\n        return 2\n    # Appel récursif\n    return 3 * suite_u(n - 1) + 1\n```\n\n**Justification de la complexité :** La complexité temporelle est linéaire $\\mathcal{O}(n)$ car chaque appel décrémente $n$ de 1.',
      gradingCriteria: [
        { id: 'crit-2.1', description: 'Traitement du cas de base n = 0', points: 2.0 },
        { id: 'crit-2.2', description: 'Formulation correcte de l\'appel récursif', points: 3.0 },
        { id: 'crit-2.3', description: 'Typage et syntaxe Python conforme Bac', points: 1.0 }
      ]
    },
    {
      id: 'ex-3',
      number: 3,
      title: 'Problème : Palindrome récursif et manipulation de chaînes',
      points: 10.0,
      statementMarkdown: 'Une chaîne de caractères est dite un *palindrome* si elle se lit de la même façon de gauche à droite et de droite à gauche (exemples : `"radar"`, `"kayak"`).\n\n1. Définir la règle récursive pour vérifier si un mot `mot` est un palindrome.\n2. Écrire la fonction `est_palindrome(mot: str) -> bool` en Python.',
      solutionMarkdown: '```python\ndef est_palindrome(mot: str) -> bool:\n    # Cas de base : chaîne vide ou à un seul caractère\n    if len(mot) <= 1:\n        return True\n    # Cas récursif : vérifier les extrémités et tester la sous-chaîne\n    if mot[0] != mot[-1]:\n        return False\n    return est_palindrome(mot[1:-1])\n```',
      gradingCriteria: [
        { id: 'crit-3.1', description: 'Cas de base longueur <= 1', points: 3.0 },
        { id: 'crit-3.2', description: 'Comparaison des extrémités mot[0] == mot[-1]', points: 3.0 },
        { id: 'crit-3.3', description: 'Tranche récursive mot[1:-1]', points: 4.0 }
      ]
    }
  ]
};
