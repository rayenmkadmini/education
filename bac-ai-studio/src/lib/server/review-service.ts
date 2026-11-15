import fs from 'fs/promises';
import path from 'path';
import { ReviewRecord } from '../types';
import { 
  CONTENT_ROOT, 
  generateUniqueReviewId, 
  resolveSafePath 
} from './path-security';
import { 
  atomicWriteFile, 
  readJsonFile 
} from './atomic-write';
import { validatePayloadSize, validateReviewPayload } from './validation';
import { getDraftById, saveDraft } from './draft-service';
import { validateSourcesTraceability } from './source-policy-service';

export interface SubmitReviewInput {
  draftId: string;
  reviewer?: string;
  status: 'APPROVED' | 'REJECTED';
  checklist: {
    baremeValid: boolean;
    syntaxValid: boolean;
    curriculumCompliant: boolean;
    noHallucination: boolean;
  };
  reviewerNotes: string;
  rejectionReason?: string;
}

/**
 * Persists a formal Super Admin review and updates the draft status.
 * Approval is NEVER automatic — it requires explicit submission through this service.
 */
export async function submitReview(input: SubmitReviewInput): Promise<{ review: ReviewRecord; updatedDraftStatus: string }> {
  validateReviewPayload(input);

  const draft = await getDraftById(input.draftId);
  if (!draft) {
    throw new Error(`Brouillon introuvable: "${input.draftId}". Impossible d'enregistrer la révision.`);
  }

  // Enforce Strict Closed Knowledge Rule upon approval
  if (input.status === 'APPROVED') {
    const traceReport = await validateSourcesTraceability(draft.provenance.sourcesCited);
    if (!traceReport.valid) {
      throw new Error(`Homologation refusée par la Règle de Base Fermée: ${traceReport.errors.join(' ')}`);
    }
  }

  const reviewId = generateUniqueReviewId();
  const review: ReviewRecord = {
    schemaVersion: '1.0.0',
    reviewId,
    draftId: input.draftId,
    draftVersion: draft.version,
    reviewer: input.reviewer || 'Super Admin (Rayen)',
    status: input.status,
    checklist: input.checklist,
    reviewerNotes: input.reviewerNotes,
    rejectionReason: input.status === 'REJECTED' ? input.rejectionReason : undefined,
    timestamp: new Date().toISOString()
  };

  const targetPath = resolveSafePath('reviews', reviewId, '.json');
  const jsonContent = JSON.stringify(review, null, 2);
  validatePayloadSize(jsonContent);

  await atomicWriteFile(targetPath, jsonContent);

  // Update draft status
  draft.status = input.status === 'APPROVED' ? 'APPROVED' : 'REJECTED';
  if (input.status === 'APPROVED') {
    draft.provenance.verifiedCurriculum = true;
  }
  await saveDraft(draft);

  return { review, updatedDraftStatus: draft.status };
}

/**
 * Lists all reviews recorded for a specific draft or all reviews.
 */
export async function listReviews(draftId?: string): Promise<ReviewRecord[]> {
  const dir = path.resolve(CONTENT_ROOT, 'reviews');
  await fs.mkdir(dir, { recursive: true });

  const files = await fs.readdir(dir);
  const reviews: ReviewRecord[] = [];

  for (const f of files) {
    if (f.endsWith('.json') && !f.includes('.tmp.')) {
      try {
        const fullPath = path.resolve(dir, f);
        const record = await readJsonFile<ReviewRecord>(fullPath);
        if (!draftId || record.draftId === draftId) {
          reviews.push(record);
        }
      } catch {
        // Skip corrupted review files
      }
    }
  }

  return reviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
