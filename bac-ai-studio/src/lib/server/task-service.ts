import fs from 'fs/promises';
import path from 'path';
import { GenerationTask } from '../types';
import { 
  CONTENT_ROOT, 
  generateUniqueTaskId, 
  resolveSafePath 
} from './path-security';
import { 
  atomicWriteFile, 
  fileExists, 
  readJsonFile 
} from './atomic-write';
import { validatePayloadSize, validateTaskPayload } from './validation';
import { validateSourceReference } from './source-policy-service';

export interface CreateTaskInput {
  contentType: GenerationTask['contentType'];
  subject: string;
  chapter: string;
  academicYear?: string;
  level?: string;
  durationMinutes?: number;
  totalPoints?: number;
  difficulty?: GenerationTask['difficulty'];
  language?: GenerationTask['language'];
  generationMode?: GenerationTask['generationMode'];
  sourceReferences?: GenerationTask['sourceReferences'];
  instructions: string;
}

/**
 * Creates and persists an Antigravity Generation Task to content/tasks/pending/
 */
export async function createTask(input: CreateTaskInput): Promise<{ task: GenerationTask; promptMarkdown: string }> {
  validateTaskPayload(input);

  // Enforce Strict Closed Knowledge Base: All source references must be authorized repository files
  if (Array.isArray(input.sourceReferences) && input.sourceReferences.length > 0) {
    for (const src of input.sourceReferences) {
      const val = await validateSourceReference(src.fileName);
      if (!val.authorized) {
        throw new Error(`Règle de Base Fermée Violée: Source non autorisée "${src.fileName}". ${val.reason}`);
      }
      src.documentId = val.documentRecord?.id;
      src.evidenceStatus = val.evidenceStatus;
    }
  }

  const taskId = generateUniqueTaskId('BACSI-2026');
  const targetPath = resolveSafePath('tasks/pending', taskId, '.json');

  if (await fileExists(targetPath)) {
    throw new Error(`Conflit d'identifiant: la tâche "${taskId}" existe déjà.`);
  }

  const task: GenerationTask = {
    schemaVersion: '1.0.0',
    taskId,
    createdAt: new Date().toISOString(),
    contentType: input.contentType,
    subject: input.subject,
    chapter: input.chapter,
    academicYear: input.academicYear || '2026-2027',
    level: input.level || '4ème Année Secondaire — Sciences de l\'Informatique',
    durationMinutes: input.durationMinutes || 120,
    totalPoints: input.totalPoints || 20.0,
    difficulty: input.difficulty || 'BAC_OFFICIEL',
    language: input.language || 'fr_tn_derja',
    generationMode: input.generationMode || 'STRICT_SOURCE_GROUNDED',
    sourceReferences: input.sourceReferences || [],
    instructions: input.instructions,
    expectedOutputStructure: {
      format: 'JSON',
      targetPath: `content/drafts/active/DRAFT-${taskId}.json`,
      requireMarkingScheme: true,
      requirePythonValidation: true
    },
    status: 'PENDING',
    version: 1
  };

  const jsonContent = JSON.stringify(task, null, 2);
  validatePayloadSize(jsonContent);

  await atomicWriteFile(targetPath, jsonContent);

  const promptMarkdown = generateAntigravityPrompt(task);
  return { task, promptMarkdown };
}

/**
 * Generates the formal Markdown prompt instructing the Antigravity Agent.
 */
export function generateAntigravityPrompt(task: GenerationTask): string {
  const sourcesText = task.sourceReferences && task.sourceReferences.length > 0
    ? task.sourceReferences.map(s => `- Fichier source : "${s.fileName}"${s.pageRange ? ` (Pages : ${s.pageRange})` : ''}${s.conceptNote ? ` [Note: ${s.conceptNote}]` : ''}`).join('\n')
    : '- Utiliser les documents officiels indexés pertinents dans le répertoire de ressources.';

  return `# MISSION PÉDAGOGIQUE ANTIGRAVITY — BAC INFORMATIQUE TUNISIE
**Tâche ID :** \`${task.taskId}\`  
**Matière :** ${task.subject}  
**Chapitre :** ${task.chapter}  
**Type de Contenu :** ${task.contentType}  
**Niveau :** ${task.level} (${task.academicYear})  
**Durée indicative :** ${task.durationMinutes} minutes | **Barème total :** ${task.totalPoints} points  
**Mode d'ancrage :** \`${task.generationMode}\`  
**Langue cible :** \`${task.language}\`  

---

## ⚠️ RÈGLE SYSTÈME CRUCIALE — BASE DE CONNAISSANCES STRICTEMENT FERMÉE
1. **Source Unique Autorisée :** L'UNIQUE source de connaissances autorisée est le répertoire local \`D:\\EDUCATION RAYEN\\bac info cours exam resourse\`.
2. **Interdiction Absolue :** INTERDICTION d'utiliser Google, le web, Wikipédia, YouTube ou des APIs externes. Ne JAMAIS combler un manque documentaire par des suppositions du modèle pré-entraîné.
3. **Absence d'Invention & Message Obligatoire :** Si le dossier autorisé ne contient pas les informations nécessaires, renvoyez EXACTEMENT ce message :
   \`INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE\`
   puis explicitez en français quelles preuves sont manquantes.
4. **Traçabilité des Sources :** Chaque affirmation et exercice doit être sourcé dans \`provenance.sourcesCited\` avec : nom du fichier original, identifiant document, page ou section, et statut (\`VERIFIED_FROM_SOURCE\` | \`PARTIALLY_SUPPORTED\` | \`NEEDS_HUMAN_REVIEW\`).

---

## 1. DOCUMENTS SOURCES DU DISQUE D: À CONSULTER EXCLUSIVEMENT
Consultez le dossier \`D:\\EDUCATION RAYEN\\bac info cours exam resourse\` pour extraire les concepts nécessaires :
${sourcesText}

## 2. CONSIGNES PÉDAGOGIQUES ET RIGUEUR DU BACCALAURÉAT TUNISIEN
1. **Conformité officielle :** Respectez scrupuleusement le programme officiel tunisien 2026–2027. N'inventez aucune règle non enseignée.
2. **Environnement Informatique :** Le code Python doit être strictement compatible avec **Thonny** et le paquet officiel \`thonny-tunisiaschools\` (types standard, listes, dictionnaires, fichiers, fonctions récursives, SQL/SQLite/MariaDB).
3. **Formules Mathématiques :** Utilisez la notation LaTeX standard (inline avec \`$...$\`, display avec \`$$...$$\`).
4. **Notation & Barème :** Chaque exercice doit comporter une ventilation claire des points (somme totale exactement égale à ${task.totalPoints} points).
5. **Directives spécifiques :**
${task.instructions}

## 3. FICHIER DE SORTIE EXIGÉ
Rédigez le document complet sous forme de JSON structuré et sauvegardez-le dans le fichier suivant :
\`${task.expectedOutputStructure.targetPath}\`

Le JSON doit respecter le schéma EducationalDraft (version: 1, status: "DRAFT", exercises: [...], provenance: { generatedBy: "Antigravity Educational AI", sourcesCited: [...] }).`;
}

/**
 * Reads a single task by ID.
 */
export async function getTaskById(taskId: string): Promise<GenerationTask | null> {
  const pendingPath = resolveSafePath('tasks/pending', taskId, '.json');
  if (await fileExists(pendingPath)) {
    return await readJsonFile<GenerationTask>(pendingPath);
  }

  const completedPath = resolveSafePath('tasks/completed', taskId, '.json');
  if (await fileExists(completedPath)) {
    return await readJsonFile<GenerationTask>(completedPath);
  }

  return null;
}

/**
 * Lists all pending tasks.
 */
export async function listPendingTasks(): Promise<GenerationTask[]> {
  const dir = path.resolve(CONTENT_ROOT, 'tasks/pending');
  await fs.mkdir(dir, { recursive: true });

  const files = await fs.readdir(dir);
  const tasks: GenerationTask[] = [];

  for (const f of files) {
    if (f.endsWith('.json') && !f.includes('.tmp.')) {
      try {
        const fullPath = path.resolve(dir, f);
        const task = await readJsonFile<GenerationTask>(fullPath);
        tasks.push(task);
      } catch {
        // Skip corrupted or temporary files
      }
    }
  }

  return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
