import { EducationalDraft, GenerationTask, ReviewRecord } from '../types';

export const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export function validatePayloadSize(content: string): void {
  const byteLength = Buffer.byteLength(content, 'utf8');
  if (byteLength > MAX_PAYLOAD_BYTES) {
    throw new Error(`Charge utile trop volumineuse: ${byteLength} octets (maximum autorisé: ${MAX_PAYLOAD_BYTES} octets).`);
  }
}

export function validateTaskPayload(data: unknown): GenerationTask {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de tâche invalides: un objet JSON est requis.');
  }

  const t = data as Record<string, unknown>;

  if (!t.subject || typeof t.subject !== 'string' || t.subject.trim() === '') {
    throw new Error('Validation échouée: le champ "subject" est obligatoire.');
  }

  if (!t.chapter || typeof t.chapter !== 'string' || t.chapter.trim() === '') {
    throw new Error('Validation échouée: le champ "chapter" est obligatoire.');
  }

  if (!t.contentType || typeof t.contentType !== 'string') {
    throw new Error('Validation échouée: le champ "contentType" est obligatoire.');
  }

  if (!t.instructions || typeof t.instructions !== 'string' || t.instructions.trim() === '') {
    throw new Error('Validation échouée: des "instructions" pédagogiques sont obligatoires.');
  }

  return data as GenerationTask;
}

export function validateDraftPayload(data: unknown): EducationalDraft {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de brouillon invalides: un objet JSON est requis.');
  }

  const d = data as Record<string, unknown>;

  if (!d.draftId || typeof d.draftId !== 'string') {
    throw new Error('Validation échouée: le champ "draftId" est obligatoire.');
  }

  if (!d.subject || typeof d.subject !== 'string') {
    throw new Error('Validation échouée: le champ "subject" est obligatoire.');
  }

  if (!d.chapter || typeof d.chapter !== 'string') {
    throw new Error('Validation échouée: le champ "chapter" est obligatoire.');
  }

  if (!Array.isArray(d.exercises) || d.exercises.length === 0) {
    throw new Error('Validation échouée: le brouillon doit contenir au moins un exercice dans "exercises".');
  }

  for (let i = 0; i < d.exercises.length; i++) {
    const ex = d.exercises[i] as Record<string, unknown>;
    if (!ex || typeof ex !== 'object') {
      throw new Error(`Exercice #${i + 1} invalide.`);
    }
    if (typeof ex.points !== 'number' || isNaN(ex.points) || ex.points < 0) {
      throw new Error(`Exercice #${i + 1}: le barème (points) doit être un nombre positif.`);
    }
    if (!ex.statementMarkdown || typeof ex.statementMarkdown !== 'string') {
      throw new Error(`Exercice #${i + 1}: l'énoncé (statementMarkdown) est obligatoire.`);
    }
  }

  // Strict Closed Knowledge Base Validation on Draft Provenance
  const prov = d.provenance as Record<string, unknown> | undefined;
  if (!prov || typeof prov !== 'object') {
    throw new Error('Validation échouée: le bloc "provenance" est obligatoire pour garantir la traçabilité des sources.');
  }

  const sources = prov.sourcesCited as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error('Validation échouée: au moins une source interne issue de "bac info cours exam resourse" doit être citée dans "provenance.sourcesCited".');
  }

  for (let sIdx = 0; sIdx < sources.length; sIdx++) {
    const src = sources[sIdx];
    if (!src || typeof src.document !== 'string' || src.document.trim() === '') {
      throw new Error(`Validation échouée: la source #${sIdx + 1} doit comporter un nom de document valide.`);
    }

    const docStr = src.document.trim();
    if (/^https?:\/\/|^ftp:\/\/|^www\./i.test(docStr)) {
      throw new Error(`Violation Règle Source Fermée: La source "${docStr}" est une URL externe. Seuls les documents de "bac info cours exam resourse" sont autorisés.`);
    }

    if (docStr.includes('..') || (docStr.startsWith('/') && !docStr.includes('bac info cours exam resourse'))) {
      throw new Error(`Violation Règle Source Fermée: La source "${docStr}" tente de référencer un répertoire non autorisé.`);
    }
  }

  return data as EducationalDraft;
}

export function validateReviewPayload(data: unknown): ReviewRecord {
  if (!data || typeof data !== 'object') {
    throw new Error('Données de révision invalides: un objet JSON est requis.');
  }

  const r = data as Record<string, unknown>;

  if (!r.draftId || typeof r.draftId !== 'string') {
    throw new Error('Validation échouée: "draftId" manquant.');
  }

  if (r.status !== 'APPROVED' && r.status !== 'REJECTED') {
    throw new Error('Validation échouée: le statut doit être "APPROVED" ou "REJECTED".');
  }

  if (r.status === 'REJECTED' && (!r.rejectionReason || typeof r.rejectionReason !== 'string' || r.rejectionReason.trim() === '')) {
    throw new Error('Validation échouée: un motif de rejet explicite ("rejectionReason") est obligatoire pour rejeter un brouillon.');
  }

  return data as ReviewRecord;
}
