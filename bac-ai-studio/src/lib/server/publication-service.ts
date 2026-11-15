import fs from 'fs/promises';
import path from 'path';
import { PublicationRecord } from '../types';
import { 
  CONTENT_ROOT, 
  generateUniquePublicationId, 
  resolveSafePath 
} from './path-security';
import { 
  atomicWriteFile, 
  fileExists, 
  readJsonFile 
} from './atomic-write';
import { validatePayloadSize } from './validation';
import { getDraftById, saveDraft } from './draft-service';
import { listReviews } from './review-service';
import { validateSourcesTraceability } from './source-policy-service';

export interface PublishDraftInput {
  draftId: string;
  publisher?: string;
}

/**
 * Exports an APPROVED educational draft into the production catalog (content/published/).
 * Strictly blocks any draft whose status is not APPROVED.
 * Never overwrites an existing publication record.
 */
export async function publishDraft(input: PublishDraftInput): Promise<PublicationRecord> {
  const draft = await getDraftById(input.draftId);
  if (!draft) {
    throw new Error(`Brouillon introuvable: "${input.draftId}". Impossible d'exporter.`);
  }

  // Strict Security Rule: ONLY drafts with APPROVED status can be published!
  if (draft.status !== 'APPROVED') {
    throw new Error(`Refus d'exportation: le brouillon "${draft.draftId}" a le statut "${draft.status}". Seuls les brouillons formellement approuvés ("APPROVED") peuvent être exportés vers le catalogue.`);
  }

  // Strict Closed Knowledge Rule: Verify complete source traceability
  const traceReport = await validateSourcesTraceability(draft.provenance.sourcesCited);
  if (!traceReport.valid) {
    throw new Error(`Exportation bloquée: la traçabilité des sources dans le répertoire fermé n'est pas vérifiée (${traceReport.errors.join(', ')}).`);
  }

  // Find corresponding review metadata
  const reviews = await listReviews(draft.draftId);
  const approvalReview = reviews.find(r => r.status === 'APPROVED');

  const publicationId = generateUniquePublicationId();
  const targetPath = resolveSafePath('published', publicationId, '.json');

  if (await fileExists(targetPath)) {
    throw new Error(`Conflit de publication: le fichier "${publicationId}" existe déjà. Écrasement interdit.`);
  }

  const publicationRecord: PublicationRecord = {
    schemaVersion: '1.0.0',
    publicationId,
    sourceDraftId: draft.draftId,
    sourceTaskId: draft.taskId,
    subject: draft.subject,
    chapter: draft.chapter,
    contentType: draft.contentType,
    language: 'fr_tn_derja',
    content: draft,
    approvalMetadata: {
      reviewer: approvalReview?.reviewer || input.publisher || 'Super Admin (Rayen)',
      approvedAt: approvalReview?.timestamp || new Date().toISOString(),
      reviewId: approvalReview?.reviewId || 'MANUAL-SUPER-ADMIN-APPROVAL'
    },
    publishedAt: new Date().toISOString()
  };

  const jsonContent = JSON.stringify(publicationRecord, null, 2);
  validatePayloadSize(jsonContent);

  await atomicWriteFile(targetPath, jsonContent);

  // Update draft status to EXPORTED while keeping the draft file intact
  draft.status = 'EXPORTED';
  await saveDraft(draft);

  return publicationRecord;
}

/**
 * Lists all approved and exported publications in content/published/
 */
export async function listPublications(): Promise<PublicationRecord[]> {
  const dir = path.resolve(CONTENT_ROOT, 'published');
  await fs.mkdir(dir, { recursive: true });

  const files = await fs.readdir(dir);
  const publications: PublicationRecord[] = [];

  for (const f of files) {
    if (f.endsWith('.json') && !f.includes('.tmp.')) {
      try {
        const fullPath = path.resolve(dir, f);
        const record = await readJsonFile<PublicationRecord>(fullPath);
        publications.push(record);
      } catch {
        // Skip corrupted publication files
      }
    }
  }

  return publications.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
