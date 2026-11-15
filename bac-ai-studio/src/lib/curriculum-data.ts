export type CurriculumVerificationStatus = 
  | 'VERIFIED_OFFICIAL' 
  | 'VERIFIED_SOURCE' 
  | 'UNVERIFIED' 
  | 'PLACEHOLDER';

export interface CurriculumSection {
  id: string;
  title: string;
  keyConcepts: string[];
}

export interface CurriculumChapter {
  id: string;
  number: number;
  title: string;
  titleAr?: string;
  sections: CurriculumSection[];
  learningObjectives: string[];
  competencies: string[];
  prerequisites: string[];
  assessmentCriteria: string[];
  officialReferences: string[];
  verificationStatus: CurriculumVerificationStatus;
}

export interface CurriculumSubject {
  id: string;
  name: string;
  nameAr: string;
  coeff: number;
  durationMinutes: number;
  examType: 'Écrit (3h) + Pratique (1h30)' | 'Écrit (3h)' | 'Écrit (2h)' | 'Oral / Écrit';
  calculatorAllowed: boolean;
  officialReference: string;
  verificationStatus: CurriculumVerificationStatus;
  verifiedBy: string;
  chapters: CurriculumChapter[];
}

export const BAC_SI_CURRICULUM: CurriculumSubject[] = [
  {
    id: 'algo-prog',
    name: 'Algorithmique et Programmation',
    nameAr: 'الخوارزميات والبرمجة',
    coeff: 3.0,
    durationMinutes: 180,
    examType: 'Écrit (3h) + Pratique (1h30)',
    calculatorAllowed: false,
    officialReference: 'Programme Officiel 4ème Année Secondaire SI — Ministère de l\'Éducation Tunisienne (Manuels CNP 201403P00 & 210402P00)',
    verificationStatus: 'VERIFIED_OFFICIAL',
    verifiedBy: 'Super Admin (Homologation CNP & Épreuves Bac 2025/2026)',
    chapters: [
      {
        id: 'algo-structures',
        number: 1,
        title: 'Structures de Données Simples et Composées',
        titleAr: 'هياكل البيانات البسيطة والمركبة',
        sections: [
          { id: 's-types-scalaires', title: 'Types scalaires et scalaires personnalisés', keyConcepts: ['Entier', 'Réel', 'Booléen', 'Caractère', 'Intervalle', 'Énuméré'] },
          { id: 's-chaines', title: 'Chaînes de caractères et fonctions associées', keyConcepts: ['Sous-chaînes', 'Conversions', 'Recherche de motif', 'Tranches Python'] },
          { id: 's-enregistrements', title: 'Enregistrements (Records / Dictionnaires)', keyConcepts: ['Définition de types', 'Champs', 'Tableaux d\'enregistrements'] },
          { id: 's-tableaux', title: 'Tableaux à une et deux dimensions (Matrices)', keyConcepts: ['Vecteurs', 'Matrices NxM', 'Parcours en lignes/colonnes'] },
          { id: 's-fichiers', title: 'Fichiers texte et fichiers typés d\'enregistrements', keyConcepts: ['Persistance', 'Modes d\'ouverture', 'Sérialisation', 'Pickle / open()'] }
        ],
        learningObjectives: [
          'Maîtriser le choix de la structure de données appropriée à un problème complexe.',
          'Manipuler les chaînes de caractères sans utiliser de fonctions interdites au Bac.',
          'Gérer la persistance des données via des fichiers texte et binaires.'
        ],
        competencies: [
          'Modéliser une situation réelle à l\'aide d\'enregistrements et de tableaux.',
          'Implémenter des algorithmes de traitement matriciel en Python et en pseudocode conventionnel.'
        ],
        prerequisites: ['Algorithmique de base de 3ème SI', 'Variables et boucles simples'],
        assessmentCriteria: [
          'Conformité stricte de la syntaxe Python 3',
          'Respect de la notation algorithmique tunisienne normalisée',
          'Gestion correcte des indices et bornes de tableaux'
        ],
        officialReferences: ['Manuel CNP 201403P00 p.12-65', 'Bac SI Session Principale 2025 Ex.1 & Ex.2'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'algo-modularite',
        number: 2,
        title: 'Modularité et Sous-Programmes',
        titleAr: 'التضمين والبرامج الفرعية',
        sections: [
          { id: 's-fonctions', title: 'Fonctions et retour de valeurs', keyConcepts: ['En-tête', 'Type de retour', 'Valeur unique/tuple'] },
          { id: 's-procedures', title: 'Procédures et effets de bord', keyConcepts: ['Paramètres formels et effectifs', 'Procédure d\'affichage/remplissage'] },
          { id: 's-modes-passage', title: 'Modes de passage des paramètres', keyConcepts: ['Passage par valeur', 'Passage par variable', 'Mutabilité des objets en Python'] },
          { id: 's-portee', title: 'Portée des identificateurs et variables locales/globales', keyConcepts: ['Variables locales', 'Visibilité', 'Interdiction du mot-clé global au Bac'] }
        ],
        learningObjectives: [
          'Décomposer un problème complexe en modules élémentaires indépendants.',
          'Distinguer rigoureusement les fonctions des procédures selon l\'objectif pédagogique.',
          'Gérer la portée des variables sans recourir à des variables globales non justifiées.'
        ],
        competencies: [
          'Concevoir une analyse modulaire hiérarchique avec TDO (Tableau de Déclaration des Objets).',
          'Traduire fidèlement une spécification modulaire en script Python 3 modulaire.'
        ],
        prerequisites: ['Structures simples', 'Typage strict'],
        assessmentCriteria: [
          'Absence de variables globales dans le corps des sous-programmes',
          'Cohérence entre paramètres formels et effectifs',
          'Justesse du typage des paramètres dans le TDO'
        ],
        officialReferences: ['Manuel CNP 201403P00 p.70-112', 'Bac SI 2026 Épreuve Pratique Samedi 23 Mai'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'algo-recursivite',
        number: 3,
        title: 'La Récursivité',
        titleAr: 'العودية والتكرار الذاتي',
        sections: [
          { id: 's-rec-notion', title: 'Principes de la récursivité', keyConcepts: ['Cas d\'arrêt (base)', 'Étape récursive', 'Arbre d\'appels'] },
          { id: 's-rec-formes', title: 'Formes de récursivité', keyConcepts: ['Récursivité terminale', 'Récursivité non terminale', 'Récursivité croisée'] },
          { id: 's-rec-conversions', title: 'Passage d\'une solution itérative à une solution récursive', keyConcepts: ['Décomposition', 'Invariants'] }
        ],
        learningObjectives: [
          'Identifier la nature récursive intrinsèque d\'un problème algorithmique.',
          'Définir rigoureusement les conditions de terminaison pour éviter la récursion infinie.',
          'Dérouler manuellement l\'arbre d\'exécution d\'un sous-programme récursif.'
        ],
        competencies: [
          'Rédiger des fonctions récursives de calcul arithmétique, de traitement de listes et de chaînes.',
          'Calculer la complexité spatiale liée à la pile d\'appels.'
        ],
        prerequisites: ['Sous-programmes', 'Modularité'],
        assessmentCriteria: [
          'Présence explicite du cas de base avant tout appel récursif',
          'Validité mathématique de la formule de récurrence',
          'Exactitude de la trace d\'exécution'
        ],
        officialReferences: ['Bac SI Session Principale 2026 Écrit Ex.2', 'Manuel CNP 201403P00 p.130-175'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'algo-tri-recherche',
        number: 4,
        title: 'Algorithmes de Tri et de Recherche',
        titleAr: 'خوارزميات الفرز والبحث',
        sections: [
          { id: 's-tri-bulles', title: 'Tri à bulles optimisé', keyConcepts: ['Permutations', 'Drapeau d\'arrêt'] },
          { id: 's-tri-selection', title: 'Tri par sélection du minimum/maximum', keyConcepts: ['Position du min', 'Échange'] },
          { id: 's-tri-insertion', title: 'Tri par insertion', keyConcepts: ['Décalage', 'Insertion ordonnée'] },
          { id: 's-recherche-seq', title: 'Recherche séquentielle', keyConcepts: ['Parcours complet', 'Arrêt anticipé'] },
          { id: 's-recherche-dicho', title: 'Recherche dichotomique (itérative et récursive)', keyConcepts: ['Tableau trié', 'Indices début/milieu/fin', 'Complexité O(log N)'] }
        ],
        learningObjectives: [
          'Connaître les algorithmes de tri canoniques au programme officiel du Bac.',
          'Appliquer la recherche dichotomique sur des tableaux ordonnés.',
          'Comparer l\'efficacité et le nombre d\'opérations entre tris élémentaires.'
        ],
        competencies: [
          'Implémenter sans hésitation chaque méthode de tri en Python 3.',
          'Adapter un tri sur un tableau d\'enregistrements selon une clé de tri spécifique.'
        ],
        prerequisites: ['Tableaux 1D', 'Boucles tant que et pour'],
        assessmentCriteria: [
          'Application exacte des algorithmes normalisés du programme',
          'Gestion correcte du critère d\'arrêt en recherche dichotomique'
        ],
        officialReferences: ['Programme d\'Informatique p.45', 'Bac SI 2025 Sujet Écrit'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'algo-arithmetique-approximation',
        number: 5,
        title: 'Algorithmes Arithmétiques et Approximation Numérique',
        titleAr: 'الخوارزميات الحسابية والتقريب العددي',
        sections: [
          { id: 's-arith-pgcd-ppcm', title: 'PGCD (Euclide / Différences) et PPCM', keyConcepts: ['Algorithme d\'Euclide', 'Modulo', 'Multiples'] },
          { id: 's-arith-premiers', title: 'Nombres premiers et Crible d\'Ératosthène', keyConcepts: ['Test de primalité', 'Crible', 'Facteurs premiers'] },
          { id: 's-arith-bases', title: 'Changements de base de numération', keyConcepts: ['Base 2, 8, 10, 16', 'Divisions successives', 'Puissances pondérées'] },
          { id: 's-approx-rectangles', title: 'Méthodes d\'approximation numérique d\'intégrales', keyConcepts: ['Méthode des rectangles', 'Méthode des trapèzes'] },
          { id: 's-approx-zeros', title: 'Recherche de racines (Dichotomie numérique)', keyConcepts: ['Précision epsilon', 'Théorème des valeurs intermédiaires'] }
        ],
        learningObjectives: [
          'Résoudre des problèmes arithmétiques classiques de l\'épreuve nationale.',
          'Mettre en œuvre des approximations numériques avec contrôle d\'erreur epsilon.'
        ],
        competencies: [
          'Traduire des formules mathématiques discrètes en algorithmes fiables.',
          'Manipuler les représentations binaires et hexadécimales en programmation.'
        ],
        prerequisites: ['Arithmétique entière', 'Mathématiques générales'],
        assessmentCriteria: [
          'Robustesse face aux cas particuliers (0, 1, nombres négatifs)',
          'Respect strict de la précision epsilon demandée'
        ],
        officialReferences: ['Bac SI Session de Contrôle 2025', 'Manuel CNP 201403P00'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      }
    ]
  },
  {
    id: 'base-donnees',
    name: 'Bases de Données (SGBD Relationnel)',
    nameAr: 'قواعد البيانات العلائقية',
    coeff: 1.5,
    durationMinutes: 90,
    examType: 'Écrit (3h)',
    calculatorAllowed: false,
    officialReference: 'Programme Officiel 4ème SI — Manuel CNP livre bd.pdf & Annexes Officielles 2025/2026',
    verificationStatus: 'VERIFIED_OFFICIAL',
    verifiedBy: 'Super Admin (Homologation CNP & Épreuves Bac)',
    chapters: [
      {
        id: 'bd-relationnel',
        number: 1,
        title: 'Modèle Relationnel et Dépendances Fonctionnelles',
        titleAr: 'النموذج العلائقي والتبعيات الوظيفية',
        sections: [
          { id: 's-concepts-relationnels', title: 'Concepts de base du modèle relationnel', keyConcepts: ['Relation', 'Attribut', 'Tuple', 'Domaine', 'Degré', 'Cardinalité'] },
          { id: 's-cles-contraintes', title: 'Clés et Contraintes d\'intégrité', keyConcepts: ['Clé primaire', 'Clé étrangère', 'Intégrité de domaine', 'Intégrité référentielle'] },
          { id: 's-normalisation', title: 'Normalisation (1FN, 2FN, 3FN)', keyConcepts: ['Dépendance fonctionnelle élémentaire', 'Élimination des redondances'] }
        ],
        learningObjectives: [
          'Comprendre et analyser un schéma relationnel normalisé.',
          'Identifier les clés primaires candidates et les contraintes référentielles.'
        ],
        competencies: [
          'Traduire un modèle conceptuel en schéma relationnel textuel standardisé.',
          'Vérifier la conformité d\'une relation en 3ème forme normale.'
        ],
        prerequisites: ['Logique relationnelle', 'Ensembles'],
        assessmentCriteria: [
          'Soulignement conventionnel des clés primaires (# ou souligné)',
          'Précision dans la désignation des relations sources et cibles'
        ],
        officialReferences: ['livre bd.pdf p.15-58', 'resume bdr sgbdr et contraintes.pdf'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'bd-sql-ddl-dml',
        number: 2,
        title: 'Langage SQL — LDD et LMD',
        titleAr: 'لغة SQL — تعريف ومعالجة البيانات',
        sections: [
          { id: 's-sql-create', title: 'Création et modification de tables (LDD)', keyConcepts: ['CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'PRIMARY KEY', 'FOREIGN KEY', 'CHECK', 'NOT NULL'] },
          { id: 's-sql-manipulation', title: 'Manipulation des données (LMD)', keyConcepts: ['INSERT INTO', 'UPDATE', 'DELETE', 'Gestion des transactions'] }
        ],
        learningObjectives: [
          'Écrire des scripts SQL syntaxiquement irréprochables sous MySQL / MariaDB.',
          'Appliquer des contraintes d\'intégrité de domaine avec CHECK et ENUM.'
        ],
        competencies: [
          'Générer la structure complète d\'une base relationnelle en respectant l\'ordre d\'intégrité référentielle.',
          'Mettre à jour les données cohérentes avec gestion des suppressions en cascade.'
        ],
        prerequisites: ['Modèle relationnel'],
        assessmentCriteria: [
          'Ordre de création respectant les dépendances de clés étrangères',
          'Typage exact (VARCHAR, INT, DATE, DECIMAL)'
        ],
        officialReferences: ['Annexes html css sql php js 4si v2025_2.pdf', 'bd_tezeghdenti_2027.sql'],
        verificationStatus: 'VERIFIED_SOURCE'
      },
      {
        id: 'bd-sql-select',
        number: 3,
        title: 'Langage SQL — Interrogation Complexe (SELECT)',
        titleAr: 'لغة SQL — الاستعلامات المعقدة والتجميع',
        sections: [
          { id: 's-select-base', title: 'Projections, Sélections et Tris', keyConcepts: ['SELECT DISTINCT', 'WHERE', 'AND / OR / NOT', 'BETWEEN', 'IN', 'LIKE', 'ORDER BY'] },
          { id: 's-select-jointures', title: 'Jointures de tables', keyConcepts: ['Jointure interne (INNER JOIN)', 'Jointure externe (LEFT JOIN)', 'Auto-jointure'] },
          { id: 's-select-agregats', title: 'Fonctions d\'agrégation et regroupement', keyConcepts: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'GROUP BY', 'HAVING'] },
          { id: 's-select-imbriquees', title: 'Sous-requêtes imbriquées', keyConcepts: ['Sous-requêtes dans WHERE', 'EXISTS / NOT EXISTS', 'Sous-requêtes synchronisées'] }
        ],
        learningObjectives: [
          'Rédiger des requêtes SQL d\'interrogation répondant à des questions métiers précises.',
          'Différencier sans erreur l\'usage de WHERE et de HAVING lors d\'un regroupement.'
        ],
        competencies: [
          'Construire des requêtes multi-tables intégrant des agrégats et filtres conditionnels.',
          'Optimiser les jointures relationnelles.'
        ],
        prerequisites: ['Algèbre relationnelle', 'SQL LDD'],
        assessmentCriteria: [
          'Présence obligatoire de toutes les colonnes non agrégées dans le GROUP BY',
          'Exactitude des conditions de jointure'
        ],
        officialReferences: ['Bac SI 2026 Épreuve STI Sujet Principal', 'Annexes Officielles SQL Bac SI'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      }
    ]
  },
  {
    id: 'sti-systemes',
    name: 'Systèmes et Technologies de l\'Informatique (STI)',
    nameAr: 'أنظمة وتكنولوجيات الإعلامية',
    coeff: 3.0,
    durationMinutes: 180,
    examType: 'Écrit (3h) + Pratique (1h30)',
    calculatorAllowed: false,
    officialReference: 'Programme Officiel 4ème SI — Ministère de l\'Éducation (Épreuves Nationales STI 2025/2026)',
    verificationStatus: 'VERIFIED_OFFICIAL',
    verifiedBy: 'Super Admin (Homologation Épreuves Nationales Bac)',
    chapters: [
      {
        id: 'sti-architecture',
        number: 1,
        title: 'Architecture des Ordinateurs et Composants',
        titleAr: 'بنية الحواسيب والمكونات المادية',
        sections: [
          { id: 's-cpu-bus', title: 'Microprocesseur et bus de communication', keyConcepts: ['ALU', 'Unité de contrôle', 'Registres', 'Bus de données / adresses / contrôle'] },
          { id: 's-memoires', title: 'Hiérarchie des mémoires', keyConcepts: ['Registres', 'Mémoire cache L1/L2/L3', 'RAM', 'ROM', 'Mémoire de masse'] }
        ],
        learningObjectives: ['Comprendre le cycle d\'exécution d\'une instruction et la gestion mémoire physique.'],
        competencies: ['Calculer l\'espace adressable d\'un processeur selon la largeur de son bus d\'adresses.'],
        prerequisites: ['Binaire et logique combinatoire'],
        assessmentCriteria: ['Formules de conversion octets / mots machine exactes'],
        officialReferences: ['STI_Systemes_et_technologies_de_l_informatique_Sciences_de_l_informatique_2026_Sujet.pdf'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'sti-reseaux',
        number: 2,
        title: 'Réseaux Informatiques et Protocoles',
        titleAr: 'شبكات الحاسوب والبروتوكولات',
        sections: [
          { id: 's-modeles-osi-tcp', title: 'Modèles en couches OSI et TCP/IP', keyConcepts: ['Encapsulation', 'Rôle des 7 couches OSI', 'Correspondance TCP/IP'] },
          { id: 's-adressage-ip', title: 'Adressage IPv4 et sous-réseaux (Subnetting)', keyConcepts: ['Classes IP A/B/C', 'Masque de sous-réseau', 'Adresse réseau / broadcast', 'CIDR'] },
          { id: 's-equipements-routage', title: 'Équipements d\'interconnexion et routage', keyConcepts: ['Commutateur (Switch)', 'Routeur', 'Passerelle', 'Table de routage'] }
        ],
        learningObjectives: ['Concevoir un plan d\'adressage IP pour une topologie réseau donnée.'],
        competencies: ['Découper une plage IP en sous-réseaux et configurer les masques associés.'],
        prerequisites: ['Conversion décimal-binaire'],
        assessmentCriteria: ['Exactitude des calculs binaires sur les masques et adresses de diffusion'],
        officialReferences: ['Bac STI Pratique 16 Mai 2026 Groupe 1 & 2'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'sti-securite',
        number: 3,
        title: 'Sécurité des Systèmes et Cryptographie',
        titleAr: 'أمن الأنظمة والتشفير',
        sections: [
          { id: 's-chiffrement', title: 'Chiffrement symétrique et asymétrique', keyConcepts: ['Clé secrète (AES)', 'Paire de clés publique/privée (RSA)', 'Confidentialité'] },
          { id: 's-integrite-signature', title: 'Fonctions de hachage et signature numérique', keyConcepts: ['MD5, SHA-256', 'Non-répudiation', 'Certificats numériques X.509'] }
        ],
        learningObjectives: ['Identifier les mécanismes cryptographiques garantissant la confidentialité et l\'intégrité.'],
        competencies: ['Expliquer le déroulement d\'une transaction sécurisée SSL/TLS.'],
        prerequisites: ['Réseaux informatiques'],
        assessmentCriteria: ['Distinction sans ambiguïté entre chiffrement et hachage'],
        officialReferences: ['Bac STI 2025 Sujet Principal'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      }
    ]
  },
  {
    id: 'tic-web',
    name: 'TIC & Développement Web (Client-Serveur)',
    nameAr: 'تكنولوجيات المعلومات والاتصال وتطوير الويب',
    coeff: 1.5,
    durationMinutes: 90,
    examType: 'Écrit (3h)',
    calculatorAllowed: false,
    officialReference: 'Manuel CNP & Annexes 4ème SI — Sujets TP PHP/JS Officiels & Travaux Pratiques',
    verificationStatus: 'VERIFIED_SOURCE',
    verifiedBy: 'Enseignants SI & Homologation TPs Pratiques',
    chapters: [
      {
        id: 'web-html-css',
        number: 1,
        title: 'Structuration HTML5 et Feuilles de Style CSS3',
        titleAr: 'هيكلة HTML5 والتنسيق عبر CSS3',
        sections: [
          { id: 's-html5-formulaires', title: 'Formulaires web interactifs', keyConcepts: ['<form>', '<input type="...">', '<select>', '<textarea>', 'Balises de validation required/pattern'] },
          { id: 's-css3-mise-en-page', title: 'Stylisation et mise en page responsive', keyConcepts: ['Sélecteurs', 'Flexbox', 'Pseudo-classes', 'Bordures et ombres'] }
        ],
        learningObjectives: ['Structurer des pages web conformes aux normes W3C pour les formulaires d\'examen.'],
        competencies: ['Créer des interfaces de saisie ergonomiques et adaptées aux cas pratiques.'],
        prerequisites: ['Syntaxe des balises'],
        assessmentCriteria: ['Attributs name et id correctement assignés pour la liaison PHP/JS'],
        officialReferences: ['TP1_PHP_HTML.pdf', 'formulaire_html.png'],
        verificationStatus: 'VERIFIED_SOURCE'
      },
      {
        id: 'web-javascript',
        number: 2,
        title: 'Validation Côté Client avec JavaScript',
        titleAr: 'التحقق من البيانات عبر JavaScript',
        sections: [
          { id: 's-js-dom', title: 'Manipulation du DOM et gestion des événements', keyConcepts: ['document.getElementById', 'onsubmit', 'onclick', 'event.preventDefault()'] },
          { id: 's-js-controles', title: 'Contrôles de cohérence des champs', keyConcepts: ['Longueur', 'Expressions régulières', 'Champs obligatoires', 'Alertes utilisateurs'] }
        ],
        learningObjectives: ['Valider l\'intégralité des champs d\'un formulaire avant envoi au serveur.'],
        competencies: ['Écrire des fonctions JavaScript de contrôle sans bibliothèque externe (Vanilla JS).'],
        prerequisites: ['Bases algorithmiques'],
        assessmentCriteria: ['Retour de false pour bloquer l\'envoi en cas d\'erreur'],
        officialReferences: ['Annexes html css sql php js 4si v2025_2.pdf'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'web-php-mysql',
        number: 3,
        title: 'Programmation Côté Serveur avec PHP & MySQL',
        titleAr: 'البرمجة من جانب الخادم عبر PHP وقواعد البيانات',
        sections: [
          { id: 's-php-superglobales', title: 'Récupération des données ($_POST, $_GET)', keyConcepts: ['Méthodes HTTP', 'Superglobales', 'htmlspecialchars()'] },
          { id: 's-php-pdo-mysql', title: 'Connexion sécurisée à la base de données', keyConcepts: ['mysqli_connect ou PDO', 'Exécution de requêtes INSERT/SELECT', 'fetch_assoc'] },
          { id: 's-php-sessions', title: 'Gestion de l\'authentification et des sessions', keyConcepts: ['session_start()', '$_SESSION', 'Redirection header()'] }
        ],
        learningObjectives: ['Traiter les formulaires, insérer en base de données et afficher les résultats dynamiques.'],
        competencies: ['Développer une application CRUD complète et sécurisée conforme aux TPs du Bac.'],
        prerequisites: ['SQL', 'HTML5', 'Logique algorithmique'],
        assessmentCriteria: ['Sécurisation contre les injections SQL simples et conformité aux énoncés officiels'],
        officialReferences: ['TP4 PHP Login.pdf', 'tp1php.php', 'Correction TP3 PHP.jpg', 'enoncé TP 3 PHP insertion 4 champs formulaire.pdf'],
        verificationStatus: 'VERIFIED_SOURCE'
      }
    ]
  },
  {
    id: 'mathematiques',
    name: 'Mathématiques (Section SI)',
    nameAr: 'الرياضيات (شعبة علوم الإعلامية)',
    coeff: 3.0,
    durationMinutes: 180,
    examType: 'Écrit (3h)',
    calculatorAllowed: true,
    officialReference: 'Programme Officiel Ministère de l\'Éducation — Manuels CNP 221402P00 & Épreuves Nationales Bac Math SI 2025/2026',
    verificationStatus: 'VERIFIED_OFFICIAL',
    verifiedBy: 'Super Admin (Homologation Épreuves Officielles Bac)',
    chapters: [
      {
        id: 'math-complexes',
        number: 1,
        title: 'Nombres Complexes',
        titleAr: 'الأعداد المركبة',
        sections: [
          { id: 's-complexes-algebrique', title: 'Forme algébrique, conjugué et module', keyConcepts: ['Partie réelle/imaginaire', 'Équations du second degré à coefficients réels'] },
          { id: 's-complexes-trigo', title: 'Forme trigonométrique et exponentielle', keyConcepts: ['Argument', 'Formule d\'Euler', 'Formule de Moivre'] },
          { id: 's-complexes-geometrie', title: 'Applications géométriques', keyConcepts: ['Affixes', 'Distances', 'Angles orientés', 'Transformations du plan'] }
        ],
        learningObjectives: ['Résoudre des équations dans C et interpréter géométriquement les affixes.'],
        competencies: ['Caractériser des configurations géométriques planes à l\'aide de nombres complexes.'],
        prerequisites: ['Trigonométrie', 'Géométrie vectorielle'],
        assessmentCriteria: ['Rigueur de la rédaction et exactitude des calculs d\'arguments'],
        officialReferences: ['Mathematiques_Sciences_de_l_informatique_2026_Sujet.pdf Ex.1'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'math-analyse-fonctions',
        number: 2,
        title: 'Analyse Fonctionnelle (Exponentielle & Logarithme)',
        titleAr: 'التحليل ودراسة الدوال الأسية واللوغاريتمية',
        sections: [
          { id: 's-limites-continuite', title: 'Limites et continuité', keyConcepts: ['Théorème des valeurs intermédiaires', 'Asymptotes'] },
          { id: 's-derivabilite', title: 'Dérivation et sens de variation', keyConcepts: ['Théorème de Rolle', 'Théorème des accroissements finis', 'Tableau de variation'] },
          { id: 's-exp-ln', title: 'Fonctions exponentielle et logarithme népérien', keyConcepts: ['Propriétés algébriques', 'Croissances comparées', 'Étude complète de courbes'] }
        ],
        learningObjectives: ['Étudier le comportement global et asymptotique de fonctions transcendantes.'],
        competencies: ['Dresser un tableau de variation complet et tracer avec précision la courbe représentative.'],
        prerequisites: ['Dérivées usuelles'],
        assessmentCriteria: ['Démonstration correcte des limites indéterminées via les croissances comparées'],
        officialReferences: ['Bac SI 2025 Sujet Math Problème d\'analyse'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'math-suites-integrales',
        number: 3,
        title: 'Suites Réelles et Calcul Intégral',
        titleAr: 'المتتاليات الحقيقية وحساب التكامل',
        sections: [
          { id: 's-suites-reelles', title: 'Suites arithmétiques, géométriques et récurrentes', keyConcepts: ['Convergence', 'Théorème de convergence monotone', 'Suites adjacentes'] },
          { id: 's-calcul-integral', title: 'Primitives et intégration', keyConcepts: ['Intégration par parties', 'Calcul d\'aires et de volumes', 'Encadrement d\'intégrales'] }
        ],
        learningObjectives: ['Calculer la limite d\'une suite récurrente et évaluer des aires par calcul d\'intégrales.'],
        competencies: ['Déterminer une primitive par décomposition ou par parties.'],
        prerequisites: ['Dérivation', 'Continuité'],
        assessmentCriteria: ['Justification de la convergence avant tout calcul de limite finie'],
        officialReferences: ['Mathematiques_Sciences_de_l_informatique_2025_Correction.pdf'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'math-probas',
        number: 4,
        title: 'Probabilités et Dénombrement',
        titleAr: 'الاحتمالات والعد الإحصائي',
        sections: [
          { id: 's-denombrement', title: 'Analyse combinatoire', keyConcepts: ['Arrangements', 'Combinaisons', 'Permutations'] },
          { id: 's-probas-conditionnelles', title: 'Probabilités conditionnelles et indépendance', keyConcepts: ['Formule des probabilités totales', 'Arbre pondéré', 'Loi binomiale'] }
        ],
        learningObjectives: ['Calculer les probabilités d\'événements composés et utiliser la loi binomiale.'],
        competencies: ['Modéliser une expérience aléatoire discrète.'],
        prerequisites: ['Ensembles', 'Fractions'],
        assessmentCriteria: ['Validation que la somme des probabilités élémentaires vaut 1'],
        officialReferences: ['Bac Math SI 2026 Sujet Ex.3'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      }
    ]
  },
  {
    id: 'sciences-physiques',
    name: 'Sciences Physiques (Section SI)',
    nameAr: 'العلوم الفيزيائية',
    coeff: 2.0,
    durationMinutes: 120,
    examType: 'Écrit (2h)',
    calculatorAllowed: true,
    officialReference: 'Programme Officiel 4ème SI — Manuel CNP 241403P00 & Épreuves Nationales Bac 2025/2026',
    verificationStatus: 'VERIFIED_OFFICIAL',
    verifiedBy: 'Super Admin (Homologation Épreuves Nationales Bac)',
    chapters: [
      {
        id: 'phys-electricite',
        number: 1,
        title: 'Circuits Électriques et Oscillations',
        titleAr: 'الدوائر الكهربائية والتذبذبات',
        sections: [
          { id: 's-circuit-rc-rl', title: 'Dipôles RC et RL', keyConcepts: ['Échelon de tension', 'Constante de temps tau', 'Équations différentielles', 'Énergie emmagasinée'] },
          { id: 's-oscillations-rlc', title: 'Oscillations électriques libres et amorties (RLC)', keyConcepts: ['Pseudo-période', 'Régimes apériodique/critique', 'Échange énergétique'] }
        ],
        learningObjectives: ['Résoudre les équations différentielles de charge/décharge et d\'oscillations libres.'],
        competencies: ['Exploiter des oscillogrammes pour déterminer la période, la constante de temps et les déphasages.'],
        prerequisites: ['Lois de Kirchhoff (mailles et nœuds)'],
        assessmentCriteria: ['Expression littérale avant toute application numérique avec unités correctes'],
        officialReferences: ['Sciences_physiques_Sciences_de_l_informatique_2026_Sujet.pdf'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      },
      {
        id: 'phys-ondes',
        number: 2,
        title: 'Ondes Mécaniques et Lumineuses',
        titleAr: 'الموجات الميكانيكية والضوئية',
        sections: [
          { id: 's-ondes-progressives', title: 'Propagation d\'une onde progressive le long d\'une corde', keyConcepts: ['Longueur d\'onde lambda', 'Célérité', 'Déphasage spatial/temporel'] },
          { id: 's-diffraction', title: 'Diffraction de la lumière', keyConcepts: ['Fente fine', 'Écart angulaire theta = lambda / a', 'Nature ondulatoire'] }
        ],
        learningObjectives: ['Différencier l\'aspect de la corde à un instant donné de l\'élongation d\'un point au cours du temps.'],
        competencies: ['Mesurer expérimentalement la longueur d\'onde et la célérité d\'une onde.'],
        prerequisites: ['Fonctions sinusoïdales'],
        assessmentCriteria: ['Respect rigoureux des unités SI (mètres, secondes, Hertz)'],
        officialReferences: ['Bac SI 2025 Sciences Physiques'],
        verificationStatus: 'VERIFIED_OFFICIAL'
      }
    ]
  }
];
