# BAC AI TUNISIA — ARCHITECTURE TECHNIQUE & FLUX DE DONNÉES

**Dernière mise à jour :** 2026-11-06T06:26:00+01:00  
**Section :** 4ème Année Secondaire — Sciences de l'Informatique (Tunisie)

---

## 1. Principes Directeurs et Séparation des Préoccupations

Le système **BAC AI Tunisia** repose sur une architecture sobre, sécurisée et totalement découplée :
1. **Zéro dépendance d'IA permanente ou de serveur LLM local :** Ni Ollama, ni téléchargements de modèles lourds, ni serveurs d'arrière-plan perpétuels.
2. **Workflow asynchrone explicite assisté par Antigravity :**
   $$\text{Studio} \xrightarrow{\text{Création Tâche}} \text{Tâche JSON + Prompt MD} \xrightarrow{\text{Exécution Manuelle Antigravity}} \text{Brouillon JSON} \xrightarrow{\text{Import}} \text{Validation Humaine} \xrightarrow{\text{Publication}}$$
3. **Persistance locale atomique :** Tous les artefacts pédagogiques sont stockés sous forme de fichiers JSON versionnés dans le répertoire racine `content/`, protégés par une prison d'accès aux chemins (`path-security.ts`) et des écritures atomiques via fichiers temporaires (`atomic-write.ts`).
4. **Indépendance de la plateforme étudiante :** La consultation des ressources publiées par les élèves ne dépend jamais de la mise sous tension de la machine de l'auteur.

---

## 2. Structure Pédagogique et Répertoires du Système

```
D:\EDUCATION RAYEN\  (ou /mnt/d/EDUCATION RAYEN/)
│
├── bac info cours exam resourse/     [STRICTEMENT LECTURE SEULE]
│   ├── 201403P00.pdf                 (Manuel CNP Algorithmique et Programmation)
│   ├── livre bd.pdf                  (Manuel CNP Bases de Données)
│   ├── 221402P00.pdf                 (Manuel CNP Mathématiques SI)
│   ├── 241403P00.pdf                 (Manuel CNP Sciences Physiques SI)
│   ├── Algorithmique_..._2026_Sujet.pdf (Épreuve nationale officielle)
│   └── ... (71 documents authentiques inventoriés et vérifiés)
│
├── bac-ai-studio/                    [APPLICATION NEXT.JS 15.5 / TURBOPACK]
│   ├── src/
│   │   ├── app/                      (Routes App Router & Endpoints API REST)
│   │   │   ├── api/curriculum/       (Référentiel officiel du Bac SI)
│   │   │   ├── api/drafts/           (Gestion et persistance des brouillons)
│   │   │   ├── api/knowledge/        (Catalogue et extractions de documents)
│   │   │   ├── api/publications/     (Barrière et stockage des contenus publiés)
│   │   │   ├── api/reviews/          (Grille de validation et conformité QA)
│   │   │   └── api/tasks/            (Génération de tâches et prompts Antigravity)
│   │   ├── components/               (Vues de l'interface Studio)
│   │   │   ├── CurriculumView.tsx    (Explorateur de compétences)
│   │   │   ├── EditorView.tsx        (Éditeur pédagogique A4 avec KaTeX)
│   │   │   ├── ExportView.tsx        (Exportateur JSON/MD/A4 et publication)
│   │   │   ├── GeneratorView.tsx     (Créateur de tâches de génération)
│   │   │   ├── KnowledgeView.tsx     (Bibliothèque de ressources indexées)
│   │   │   ├── MathMarkdownRenderer.tsx (Moteur KaTeX et coloration syntaxique)
│   │   │   ├── ReviewView.tsx        (Audit QA en 10 critères de conformité)
│   │   │   └── StudentPlatformView.tsx (Plateforme étudiante hors-ligne & aperçu)
│   │   └── lib/
│   │       ├── server/
│   │       │   ├── atomic-write.ts   (Écritures atomiques et copies de sauvegarde)
│   │       │   ├── draft-service.ts  (Sauvegarde, versionnage et import de brouillons)
│   │       │   ├── knowledge-extractor.ts (Moteur d'indexation et extraction PDF/ZIP)
│   │       │   ├── path-security.ts  (Découverte de racine et prison anti-traversal)
│   │       │   ├── publication-service.ts (Validation d'approbation et publication)
│   │       │   ├── review-service.ts (Enregistrement des revues et audit log)
│   │       │   ├── task-service.ts   (Génération de tâches et formatage du prompt MD)
│   │       │   └── validation.ts     (Schémas Zod-like stricts et taille de payload)
│   │       ├── curriculum-data.ts    (Matrice officielle vérifiée du Bac SI)
│   │       └── types.ts              (Modèle de données typé TypeScript)
│   └── tests/
│       ├── workflow-foundation.test.ts (Tests d'isolation, jail, et barrières)
│       ├── knowledge-indexing.test.ts  (Tests d'indexation incrémentale et extraction)
│       └── task-generation.test.ts     (Tests de bout en bout du pipeline de génération)
│
├── content/                          [STOCKAGE PERSISTANT LOCAL]
│   ├── drafts/
│   │   ├── active/                   (Brouillons en cours de révision)
│   │   └── backups/                  (Sauvegardes historiques horodatées)
│   ├── knowledge-catalog/
│   │   └── extracted/                (Contenus texte extraits par document)
│   ├── published/                    (Contenus validés et approuvés pour étudiants)
│   ├── reviews/                      (Comptes-rendus d'évaluation QA)
│   ├── tasks/
│   │   ├── completed/                (Tâches exécutées)
│   │   └── pending/                  (Tâches en attente d'exécution manuelle)
│   └── knowledge-catalog.json        (Catalogue global des 71 documents avec statuts)
│
└── supabase/
    └── migrations/
        └── 20261105_bac_ai_tunisia_schema.sql (Schéma SQL de production préparé)
```

---

## 3. Matrice de Sécurité et Garanties de Robustesse

1. **Jail d'accès aux chemins (`resolveSafePath`) :**
   - L'identifiant fourni est validé par l'expression régulière strict `^[A-Za-z0-9_.-]+$`.
   - Tout caractère suspect (`/`, `\`, `..`, octet nul) déclenche une exception immédiate (`Identifiant invalide`).
   - Le chemin final résolu est vérifié avec `startsWith(CONTENT_ROOT)`.
2. **Écriture atomique (`atomicWriteFile`) :**
   - Écriture dans un fichier temporaire unique `.tmp.<timestamp>.<rand>`.
   - Renommage atomique via `fs.rename` garantissant qu'aucune panne d'alimentation ne corrompt le fichier cible.
3. **Préservation historique automatique (`saveDraft`) :**
   - Toute mise à jour d'un brouillon existant crée automatiquement un cliché dans `content/drafts/backups/<id>.v<ver>.<timestamp>.bak.json`.
4. **Barrière d'approbation stricte (`publishDraft`) :**
   - Une publication est formellement interdite si le statut du document n'est pas `APPROVED`. Tout brouillon au statut `DRAFT`, `PENDING_REVIEW` ou `REJECTED` est rejeté avec un code d'erreur explicite.
5. **Protection contre l'exposition de solutions aux élèves :**
   - Dans la plateforme étudiante, les solutions et barèmes détaillés sont masqués par défaut et déverrouillés uniquement à la demande de l'élève pour préserver la démarche de recherche active.
