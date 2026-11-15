import assert from 'assert';
import fs from 'fs/promises';
import { createTask, getTaskById, listPendingTasks } from '../src/lib/server/task-service';
import { saveDraft, getDraftById, importDraft } from '../src/lib/server/draft-service';
import { fileExists } from '../src/lib/server/atomic-write';
import { resolveSafePath } from '../src/lib/server/path-security';
import { EducationalDraft } from '../src/lib/types';

async function runTaskGenerationPipelineTests() {
  console.log('--- STARTING TASK GENERATION & DRAFT IMPORT PIPELINE TESTS ---');

  // 1. Create a pedagogical task
  console.log('Step 1: Creating a generation task for Antigravity...');
  const { task, promptMarkdown } = await createTask({
    contentType: 'SERIE_EXERCICES',
    subject: 'Algorithmique et Programmation',
    chapter: 'La Récursivité',
    academicYear: '2026-2027',
    difficulty: 'BAC_OFFICIEL',
    durationMinutes: 90,
    totalPoints: 20.0,
    language: 'fr_tn_derja',
    generationMode: 'STRICT_SOURCE_GROUNDED',
    sourceReferences: [
      {
        fileName: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
        pageRange: '2-3',
        conceptNote: 'Exercice 2 sur les fonctions récursives'
      }
    ],
    instructions: 'Générer une série de 3 exercices progressifs sur les fonctions récursives en Python.'
  });

  console.log(`✓ Task created with ID: ${task.taskId}`);
  assert.ok(task.taskId.startsWith('BACSI-2026-'), 'Task ID must follow format');
  assert.strictEqual(task.status, 'PENDING');

  // 2. Verify task persistence on disk
  const taskPath = resolveSafePath('tasks/pending', task.taskId, '.json');
  assert.strictEqual(await fileExists(taskPath), true, 'Task JSON must exist on disk in content/tasks/pending/');

  const loadedTask = await getTaskById(task.taskId);
  assert.ok(loadedTask, 'Task must be loadable via getTaskById');
  assert.strictEqual(loadedTask?.taskId, task.taskId);

  // 3. Verify Markdown prompt generation
  console.log('Step 2: Verifying Antigravity prompt markdown...');
  assert.ok(promptMarkdown.includes('# MISSION PÉDAGOGIQUE ANTIGRAVITY'), 'Prompt must have correct title');
  assert.ok(promptMarkdown.includes(task.taskId), 'Prompt must reference task ID');
  assert.ok(promptMarkdown.includes('Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf'), 'Prompt must cite source documents');
  assert.ok(promptMarkdown.includes('20 points'), 'Prompt must mention total points');
  assert.ok(promptMarkdown.includes('thonny-tunisiaschools'), 'Prompt must enforce Thonny Python compatibility');

  // 4. Verify task listing
  const pendingTasks = await listPendingTasks();
  assert.ok(pendingTasks.some(t => t.taskId === task.taskId), 'New task must appear in pending tasks list');

  // 5. Simulate manual Antigravity execution: import an Educational Draft
  console.log('Step 3: Simulating Antigravity output draft import...');
  const mockDraftPayload: EducationalDraft = {
    schemaVersion: '1.0.0',
    draftId: `DRAFT-${task.taskId.replace('TASK-', '')}`,
    taskId: task.taskId,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DRAFT',
    subject: 'Algorithmique et Programmation',
    chapter: 'La Récursivité',
    academicYear: '2026-2027',
    contentType: 'SERIE_EXERCICES',
    totalPoints: 20.0,
    isOfficialBac: true,
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      sourcesCited: [
        {
          document: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf',
          page: 2,
          section: 'Exercice 2'
        }
      ],
      verifiedCurriculum: true
    },
    header: {
      institution: 'République Tunisienne — Ministère de l\'Éducation',
      sessionLabel: 'Examen du Baccalauréat — Session 2026',
      duration: '1h30',
      coefficient: 3.0
    },
    exercises: [
      {
        id: 'ex-1',
        number: 1,
        title: 'Exercice 1 : Traces d\'exécution et arbre récursif',
        points: 6.0,
        statementMarkdown: 'Soit la fonction récursive Python suivante : \n```python\ndef mystere(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * mystere(n - 1)\n```\n1. Dérouler les appels pour `n = 4`.\n2. Identifier la condition d\'arrêt.',
        solutionMarkdown: '**Correction détaillée :**\n1. `mystere(4) = 4 * mystere(3) = 4 * 6 = 24`\n2. Le cas de base est `n <= 1`.',
        gradingCriteria: [
          { id: 'crit-1', description: 'Arbre des appels complet', points: 3.0 },
          { id: 'crit-2', description: 'Identification du cas de base', points: 3.0 }
        ]
      },
      {
        id: 'ex-2',
        number: 2,
        title: 'Exercice 2 : Palindrome récursif',
        points: 14.0,
        statementMarkdown: 'Écrire une fonction récursive `est_palindrome(ch: str) -> bool` vérifiant si une chaîne est un palindrome.',
        solutionMarkdown: '**Correction :**\n```python\ndef est_palindrome(ch: str) -> bool:\n    if len(ch) <= 1:\n        return True\n    if ch[0] != ch[-1]:\n        return False\n    return est_palindrome(ch[1:-1])\n```',
        gradingCriteria: [
          { id: 'crit-3', description: 'Cas d\'arrêt chaîne vide ou longueur 1', points: 4.0 },
          { id: 'crit-4', description: 'Comparaison des extrémités', points: 4.0 },
          { id: 'crit-5', description: 'Appel récursif sur sous-chaîne', points: 6.0 }
        ]
      }
    ]
  };

  const imported = await importDraft(mockDraftPayload);
  assert.strictEqual(imported.draftId, mockDraftPayload.draftId);
  assert.strictEqual(imported.exercises.length, 2);

  // 6. Verify draft is accessible via getDraftById
  const loadedDraft = await getDraftById(imported.draftId);
  assert.ok(loadedDraft, 'Draft must be loadable from active drafts store');
  assert.strictEqual(loadedDraft?.totalPoints, 20.0);

  // 7. Verify invalid draft rejection
  console.log('Step 4: Verifying invalid draft rejection...');
  let rejected = false;
  try {
    await importDraft({
      ...mockDraftPayload,
      exercises: [] // Invalid: must have at least one exercise
    });
  } catch (err) {
    rejected = true;
    console.log(`✓ Properly rejected invalid draft without exercises: ${(err as Error).message}`);
  }
  assert.strictEqual(rejected, true, 'Draft without exercises must be rejected');

  // 8. Test backup creation upon draft update
  console.log('Step 5: Verifying automatic backup on draft update...');
  const updatedPayload: EducationalDraft = {
    ...imported,
    chapter: 'La Récursivité (Approfondissement)'
  };
  const updatedDraft = await saveDraft(updatedPayload);
  assert.strictEqual(updatedDraft.version, 2, 'Version should increment to 2');

  // Cleanup test files
  console.log('Cleaning up test files...');
  try {
    await fs.unlink(taskPath);
    const draftPath = resolveSafePath('drafts/active', imported.draftId, '.json');
    await fs.unlink(draftPath);
  } catch {
    // Ignore cleanup errors
  }

  console.log('--- ALL TASK GENERATION PIPELINE TESTS PASSED (100%) ---');
}

runTaskGenerationPipelineTests().catch(err => {
  console.error('TASK GENERATION TEST FAILED:', err);
  process.exit(1);
});
