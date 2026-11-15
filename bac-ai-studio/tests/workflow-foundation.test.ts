import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import { 
  resolveSafePath, 
  sanitizeId, 
  generateUniqueDraftId,
  CONTENT_ROOT 
} from '../src/lib/server/path-security';
import { atomicWriteFile, fileExists, readJsonFile } from '../src/lib/server/atomic-write';
import { createTask, getTaskById } from '../src/lib/server/task-service';
import { saveDraft, getDraftById } from '../src/lib/server/draft-service';
import { submitReview } from '../src/lib/server/review-service';
import { publishDraft } from '../src/lib/server/publication-service';
import { EducationalDraft } from '../src/lib/types';

async function runWorkflowFoundationTests() {
  console.log('--- STARTING WORKFLOW FOUNDATION TESTS ---');

  // TEST 1: Path Traversal Protection
  console.log('Testing Path Traversal Security...');
  assert.throws(() => sanitizeId('../evil'), /Identifiant invalide/);
  assert.throws(() => sanitizeId('/etc/passwd'), /Identifiant invalide/);
  assert.throws(() => sanitizeId('task/test'), /Identifiant invalide/);
  assert.throws(() => sanitizeId('task\\test'), /Identifiant invalide/);
  assert.throws(() => sanitizeId('a'.repeat(65)), /Identifiant trop long/);
  
  const validPath = resolveSafePath('tasks/pending', 'TEST-TASK-001', '.json');
  assert.strictEqual(validPath, path.resolve(CONTENT_ROOT, 'tasks/pending/TEST-TASK-001.json'));
  console.log('✓ Path Traversal tests passed.');

  // TEST 2: Atomic File Write
  console.log('Testing Atomic File Write...');
  const testTmpFile = path.resolve(CONTENT_ROOT, 'tasks/pending/TEST-ATOMIC.tmp.test');
  await atomicWriteFile(testTmpFile, JSON.stringify({ atomic: true }));
  assert.strictEqual(await fileExists(testTmpFile), true);
  const readBack = await readJsonFile<{ atomic: boolean }>(testTmpFile);
  assert.strictEqual(readBack.atomic, true);
  await fs.unlink(testTmpFile);
  console.log('✓ Atomic write tests passed.');

  // TEST 3: Task Creation and Prompt Generation
  console.log('Testing Task Creation & Persistence...');
  const taskRes = await createTask({
    contentType: 'SERIE_EXERCICES',
    subject: 'Algorithmique et Programmation',
    chapter: 'La Récursivité',
    instructions: 'Générer une série de 3 exercices récursifs avec barème conforme Bac SI.'
  });
  assert.ok(taskRes.task.taskId.startsWith('BACSI-2026-'));
  assert.strictEqual(taskRes.task.status, 'PENDING');
  assert.ok(taskRes.promptMarkdown.includes('MISSION PÉDAGOGIQUE ANTIGRAVITY'));
  
  const loadedTask = await getTaskById(taskRes.task.taskId);
  assert.ok(loadedTask !== null);
  assert.strictEqual(loadedTask?.taskId, taskRes.task.taskId);
  console.log(`✓ Task created and persisted: ${taskRes.task.taskId}`);

  // TEST 4: Draft Persistence and Pre-Save Backup
  console.log('Testing Draft Persistence and Automatic Backup...');
  const testDraftId = generateUniqueDraftId('DRAFT-TEST');
  const testDraft: EducationalDraft = {
    schemaVersion: '1.0.0',
    draftId: testDraftId,
    taskId: taskRes.task.taskId,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'DRAFT',
    subject: 'Algorithmique et Programmation',
    chapter: 'La Récursivité',
    academicYear: '2026-2027',
    contentType: 'SERIE_EXERCICES',
    totalPoints: 20.0,
    isOfficialBac: false,
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      sourcesCited: [{ document: 'Algorithmique_et_programmation_Sciences_de_l_informatique_2026_Sujet.pdf', page: 1 }],
      verifiedCurriculum: false
    },
    header: {
      institution: 'République Tunisienne — Ministère de l\'Éducation',
      sessionLabel: 'Série d\'exercices d\'entraînement',
      duration: '2 Heures',
      coefficient: 3
    },
    exercises: [
      {
        id: 'ex-1',
        number: 1,
        title: 'Fonction Factorielle Récursive',
        points: 5.0,
        statementMarkdown: 'Écrire une fonction récursive en Python calculant la factorielle d\'un entier $n$.',
        solutionMarkdown: '```python\ndef fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n```',
        gradingCriteria: [{ id: 'c-1', description: 'Cas de base vérifié', points: 2.0 }]
      }
    ]
  };

  const savedV1 = await saveDraft(testDraft);
  assert.strictEqual(savedV1.version, 1);

  // Modify draft and save again -> MUST trigger backup
  testDraft.header.sessionLabel = 'Série d\'exercices modifiée v2';
  const savedV2 = await saveDraft(testDraft);
  assert.strictEqual(savedV2.version, 2);

  // Verify backup exists
  const backupsDir = path.resolve(CONTENT_ROOT, 'drafts/backups');
  const backupFiles = await fs.readdir(backupsDir);
  const matchingBackup = backupFiles.find(f => f.startsWith(`${testDraftId}.v1.`));
  assert.ok(matchingBackup, 'Automatic backup before overwrite was not found in content/drafts/backups/');
  console.log(`✓ Draft saved (v1 -> v2) and automatic backup created: ${matchingBackup}`);

  // TEST 5: Review Gate & Quality Barrier
  console.log('Testing Review Gate...');
  // Rejection without reason MUST fail
  await assert.rejects(async () => {
    await submitReview({
      draftId: testDraftId,
      status: 'REJECTED',
      checklist: { baremeValid: false, syntaxValid: true, curriculumCompliant: false, noHallucination: true },
      reviewerNotes: 'Rejeté',
      rejectionReason: '' // empty!
    });
  }, /motif de rejet explicite/);

  // Approval on draft
  const approvalRes = await submitReview({
    draftId: testDraftId,
    status: 'APPROVED',
    checklist: { baremeValid: true, syntaxValid: true, curriculumCompliant: true, noHallucination: true },
    reviewerNotes: 'Exercice conforme au programme officiel et barème cohérent.'
  });
  assert.strictEqual(approvalRes.updatedDraftStatus, 'APPROVED');

  const reloadedDraft = await getDraftById(testDraftId);
  assert.strictEqual(reloadedDraft?.status, 'APPROVED');
  assert.strictEqual(reloadedDraft?.provenance.verifiedCurriculum, true);
  console.log('✓ Review submission and state transition validated.');

  // TEST 6: Publication Gate
  console.log('Testing Publication Gating...');
  // Unapproved draft must NOT be publishable
  const unapprovedDraftId = generateUniqueDraftId('DRAFT-UNAPPROVED');
  const unapprovedDraft = { ...testDraft, draftId: unapprovedDraftId, status: 'DRAFT' as const };
  await saveDraft(unapprovedDraft);

  await assert.rejects(async () => {
    await publishDraft({ draftId: unapprovedDraftId });
  }, /Refus d'exportation.*Seuls les brouillons formellement approuvés/);
  console.log('✓ Publication barrier rejected unapproved draft as expected.');

  // Approved draft publication MUST succeed
  const published = await publishDraft({ draftId: testDraftId });
  assert.ok(published.publicationId.startsWith('PUB-2026-'));
  assert.strictEqual(published.sourceDraftId, testDraftId);
  console.log(`✓ Approved draft successfully published: ${published.publicationId}`);

  // Clean up test items
  try {
    const taskPath = resolveSafePath('tasks/pending', taskRes.task.taskId, '.json');
    await fs.unlink(taskPath);
    const draftV1Path = resolveSafePath('drafts/active', testDraftId, '.json');
    await fs.unlink(draftV1Path);
    const draftUnappPath = resolveSafePath('drafts/active', unapprovedDraftId, '.json');
    await fs.unlink(draftUnappPath);
    const pubPath = resolveSafePath('published', published.publicationId, '.json');
    await fs.unlink(pubPath);
    if (matchingBackup) {
      await fs.unlink(path.resolve(backupsDir, matchingBackup));
    }
  } catch (err) {
    console.warn('Cleanup note:', err);
  }

  console.log('--- ALL WORKFLOW FOUNDATION TESTS PASSED (100%) ---');
}

runWorkflowFoundationTests().catch(err => {
  console.error('TEST SUITE FAILED:', err);
  process.exit(1);
});
