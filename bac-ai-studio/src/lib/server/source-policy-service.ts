import path from 'path';
import { getWorkspaceRoot } from './path-security';
import { 
  getKnowledgeCatalog, 
  searchKnowledge, 
  SearchKnowledgeResult 
} from './knowledge-extractor';
import { 
  EvidenceStatus, 
  INFO_NOT_FOUND_MESSAGE, 
  DocumentRecord 
} from '../types';

/**
 * ============================================================================
 * CRITICAL SYSTEM RULE — STRICT CLOSED KNOWLEDGE BASE SERVICE
 * ============================================================================
 * The ONLY authorized educational knowledge source for BAC AI Tunisia is:
 * D:\EDUCATION RAYEN\bac info cours exam resourse
 * 
 * The system MUST NOT go outside this directory to obtain educational information.
 * Web search, external URLs, external APIs, and unverified pretrained hallucinations
 * are strictly prohibited across all educational workflows.
 * ============================================================================
 */

export const AUTHORIZED_KNOWLEDGE_DIR = path.resolve(getWorkspaceRoot(), 'bac info cours exam resourse');

export interface SourceValidationResult {
  authorized: boolean;
  reason?: string;
  documentRecord?: DocumentRecord;
  evidenceStatus: EvidenceStatus;
}

export interface TraceabilityReport {
  valid: boolean;
  evidenceStatus: EvidenceStatus;
  errors: string[];
  verifiedCount: number;
  sources: Array<{
    document: string;
    documentId?: string;
    page?: number;
    section?: string;
    evidenceStatus: EvidenceStatus;
    verified: boolean;
  }>;
}

export interface PolicyStatusReport {
  closedKnowledgeEnforced: true;
  authorizedDirectory: string;
  sourceRestriction: 'STRICTLY_CLOSED_TO_LOCAL_REPOSITORY';
  prohibitedSources: string[];
  totalAuthorizedDocuments: number;
  webSearchDisabled: true;
  externalAPIsDisabled: true;
  noFabricationRuleActive: true;
  infoNotFoundConstant: string;
}

/**
 * Strictly verifies that a given filesystem path resolves inside AUTHORIZED_KNOWLEDGE_DIR.
 * Throws a SecurityError if the path attempts directory traversal or points outside.
 */
export function assertAuthorizedKnowledgePath(targetPath: string): string {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new Error('Violation Source Sécurisée: le chemin cible doit être une chaîne valide.');
  }

  // Reject URLs
  if (/^https?:\/\/|^ftp:\/\/|^file:\/\//i.test(targetPath)) {
    throw new Error(`Violation Source Fermée: Les URLs externes (${targetPath}) sont formellement interdites comme source éducative.`);
  }

  // Resolve canonical path
  const resolved = path.isAbsolute(targetPath) 
    ? path.resolve(targetPath)
    : path.resolve(AUTHORIZED_KNOWLEDGE_DIR, targetPath);

  const relative = path.relative(AUTHORIZED_KNOWLEDGE_DIR, resolved);

  // If relative path starts with '..' or is absolute, it resolves outside AUTHORIZED_KNOWLEDGE_DIR
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Violation Règle Source Fermée: Le chemin "${targetPath}" pointe hors du répertoire autorisé "${AUTHORIZED_KNOWLEDGE_DIR}".`);
  }

  return resolved;
}

/**
 * Validates whether a single source document reference originates from the authorized repository.
 */
export async function validateSourceReference(sourceRef: string): Promise<SourceValidationResult> {
  if (!sourceRef || typeof sourceRef !== 'string') {
    return {
      authorized: false,
      reason: 'Référence source vide ou non textuelle.',
      evidenceStatus: 'NOT_FOUND'
    };
  }

  // Check for prohibited URLs or web domains
  if (/^https?:\/\/|^www\.|\.(com|org|net|tn|fr|io|ai)\b/i.test(sourceRef)) {
    return {
      authorized: false,
      reason: `Source interdite: Les URLs ou sites web externes (${sourceRef}) sont strictement prohibés par la règle de base fermée.`,
      evidenceStatus: 'NOT_FOUND'
    };
  }

  // Check if reference is an external path
  if (path.isAbsolute(sourceRef) && !sourceRef.startsWith(AUTHORIZED_KNOWLEDGE_DIR)) {
    return {
      authorized: false,
      reason: `Source externe interdite: Le fichier "${sourceRef}" ne fait pas partie du répertoire autorisé.`,
      evidenceStatus: 'NOT_FOUND'
    };
  }

  // Normalize source name (remove folder prefixes if looking up by base name)
  const baseName = path.basename(sourceRef);
  const catalog = await getKnowledgeCatalog();

  const matchingDoc = catalog.documents.find(d => 
    d.filename.toLowerCase() === baseName.toLowerCase() ||
    (d.path && d.path.toLowerCase() === sourceRef.toLowerCase()) ||
    d.id.toLowerCase() === sourceRef.toLowerCase()
  );

  if (!matchingDoc) {
    return {
      authorized: false,
      reason: `Document non trouvé dans le répertoire autorisé: "${sourceRef}". ${INFO_NOT_FOUND_MESSAGE}`,
      evidenceStatus: 'NOT_FOUND'
    };
  }

  return {
    authorized: true,
    documentRecord: matchingDoc,
    evidenceStatus: matchingDoc.isOfficial ? 'VERIFIED_FROM_SOURCE' : 'PARTIALLY_SUPPORTED'
  };
}

/**
 * Comprehensive traceability check for all sources cited in an Educational Draft or Generation Task.
 */
export async function validateSourcesTraceability(
  sourcesCited: Array<{
    document: string;
    documentId?: string;
    page?: number;
    section?: string;
    evidenceStatus?: EvidenceStatus;
  }>
): Promise<TraceabilityReport> {
  const errors: string[] = [];
  const verifiedSources: TraceabilityReport['sources'] = [];

  if (!Array.isArray(sourcesCited) || sourcesCited.length === 0) {
    return {
      valid: false,
      evidenceStatus: 'NOT_FOUND',
      errors: ['Aucune source citée. La règle de base fermée exige au moins une source traçable.'],
      verifiedCount: 0,
      sources: []
    };
  }

  let overallStatus: EvidenceStatus = 'VERIFIED_FROM_SOURCE';

  for (const s of sourcesCited) {
    const val = await validateSourceReference(s.document);
    if (!val.authorized) {
      errors.push(val.reason || `Source non autorisée: "${s.document}".`);
      overallStatus = 'NOT_FOUND';
      verifiedSources.push({
        document: s.document,
        documentId: s.documentId,
        page: s.page,
        section: s.section,
        evidenceStatus: 'NOT_FOUND',
        verified: false
      });
    } else {
      const doc = val.documentRecord!;
      const status = s.evidenceStatus || val.evidenceStatus;
      if (status !== 'VERIFIED_FROM_SOURCE' && overallStatus === 'VERIFIED_FROM_SOURCE') {
        overallStatus = status;
      }
      verifiedSources.push({
        document: doc.filename,
        documentId: doc.id,
        page: s.page,
        section: s.section,
        evidenceStatus: status,
        verified: true
      });
    }
  }

  const valid = errors.length === 0;

  return {
    valid,
    evidenceStatus: valid ? overallStatus : 'NOT_FOUND',
    errors,
    verifiedCount: verifiedSources.filter(s => s.verified).length,
    sources: verifiedSources
  };
}

/**
 * Mandatory Retrieval Before Generation:
 * Verifies that the internal authorized knowledge base contains genuine supporting evidence
 * for the requested topic before generation proceeds.
 * If no evidence exists, returns INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE.
 */
export async function enforceRetrievalBeforeGeneration(
  query: string,
  options?: {
    subject?: string;
    minScore?: number;
    limit?: number;
  }
): Promise<{
  supported: boolean;
  evidenceStatus: EvidenceStatus;
  message?: string;
  matches: SearchKnowledgeResult[];
}> {
  const matches = await searchKnowledge({
    query,
    subject: options?.subject,
    limit: options?.limit || 5
  });

  const minScore = options?.minScore || 10;
  const qualifiedMatches = matches.filter(m => m.relevanceScore >= minScore);

  if (qualifiedMatches.length === 0) {
    return {
      supported: false,
      evidenceStatus: 'NOT_FOUND',
      message: `${INFO_NOT_FOUND_MESSAGE}: Aucun document ou passage probant n'a été trouvé dans le répertoire autorisé pour la requête "${query}". Génération bloquée conformément à la règle de base fermée.`,
      matches: []
    };
  }

  const hasOfficial = qualifiedMatches.some(m => m.document.isOfficial);

  return {
    supported: true,
    evidenceStatus: hasOfficial ? 'VERIFIED_FROM_SOURCE' : 'PARTIALLY_SUPPORTED',
    matches: qualifiedMatches
  };
}

/**
 * Retrieves the live status of the Closed Knowledge Base Policy for Studio UI display.
 */
export async function getSourcePolicyStatus(): Promise<PolicyStatusReport> {
  const catalog = await getKnowledgeCatalog();

  return {
    closedKnowledgeEnforced: true,
    authorizedDirectory: AUTHORIZED_KNOWLEDGE_DIR,
    sourceRestriction: 'STRICTLY_CLOSED_TO_LOCAL_REPOSITORY',
    prohibitedSources: [
      'Google & Moteurs de recherche',
      'Sites web et plateformes externes',
      'Wikipédia',
      'YouTube & Vidéos externes',
      'APIs de connaissances tierces',
      'Fichiers hors de D:\\EDUCATION RAYEN\\bac info cours exam resourse'
    ],
    totalAuthorizedDocuments: catalog.totalDocuments,
    webSearchDisabled: true,
    externalAPIsDisabled: true,
    noFabricationRuleActive: true,
    infoNotFoundConstant: INFO_NOT_FOUND_MESSAGE
  };
}
