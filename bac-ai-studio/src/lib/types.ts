export type StudioTab = 
  | 'dashboard' 
  | 'knowledge' 
  | 'curriculum' 
  | 'generator' 
  | 'editor' 
  | 'review' 
  | 'export'
  | 'student';

export type Language = 'fr' | 'ar' | 'en';

export type DocumentClassification = 
  | 'OFFICIAL_EXAM'
  | 'OFFICIAL_TEXTBOOK'
  | 'TEACHER_MATERIAL'
  | 'EXERCISE_RESOURCE'
  | 'STUDENT_RESOURCE'
  | 'UNKNOWN';

export type ExtractionStatus = 
  | 'NOT_INDEXED'
  | 'PARSING'
  | 'INDEXED'
  | 'TEXT_EXTRACTED'
  | 'OCR_REQUIRED'
  | 'FAILED'
  | 'DUPLICATE'
  | 'MISSING_ON_DISK';

export interface DocumentRecord {
  id: string;
  filename: string;
  path: string;
  sizeBytes: number;
  sha256?: string;
  classification: DocumentClassification;
  subject: string;
  academicYear?: string;
  session?: 'PRINCIPALE' | 'CONTROLE' | 'PRATIQUE' | 'NON_APPLICABLE';
  pageCount?: number;
  extractionStatus: ExtractionStatus;
  extractionQuality?: 'HIGH' | 'MEDIUM' | 'LOW' | 'PENDING';
  isOfficial: boolean;
  verifiedCurriculum: boolean;
  extractedTextSnippet?: string;
  extractedPath?: string;
  indexedAt?: string;
  duplicateOf?: string;
  charDensityPerPage?: number;
  topic?: string;
  chunksCount?: number;
}

export type EvidenceStatus = 
  | 'VERIFIED_FROM_SOURCE'
  | 'PARTIALLY_SUPPORTED'
  | 'CONFLICTING_SOURCES'
  | 'NOT_FOUND'
  | 'NEEDS_HUMAN_REVIEW';

export const INFO_NOT_FOUND_MESSAGE = 'INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE';

export type ContentType = 
  | 'COURS'
  | 'RESUME'
  | 'FICHE_REVISION'
  | 'SERIE_EXERCICES'
  | 'DEVOIR'
  | 'CONTROLE'
  | 'EXAMEN_BLANC'
  | 'EXAMEN_BAC'
  | 'CORRIGE'
  | 'QCM'
  | 'FLASHCARDS'
  | 'TP'
  | 'DEVOIR_DE_CONTROLE'
  | 'DEVOIR_DE_SYNTHESE'
  | 'EPREUVE_PRATIQUE'
  | 'CORRIGE_DETAILLE';

export type GenerationMode = 
  | 'STRICT_SOURCE_GROUNDED'
  | 'SOURCE_WITH_PEDAGOGICAL_EXPANSION'
  | 'PRACTICE_SYNTHESIS';

export type TaskStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'IMPORTED';

export interface GenerationTask {
  schemaVersion: string;
  taskId: string;
  createdAt: string;
  contentType: ContentType;
  subject: string;
  chapter: string;
  academicYear: string;
  level: string;
  durationMinutes?: number;
  totalPoints?: number;
  difficulty: 'APPLICATION_DIRECTE' | 'INTERMEDIAIRE' | 'BAC_OFFICIEL' | 'DEFI';
  language: 'fr_tn_derja' | 'fr' | 'ar' | 'en';
  generationMode: GenerationMode;
  sourceReferences: Array<{
    fileName: string;
    pageRange?: string;
    conceptNote?: string;
    documentId?: string;
    evidenceStatus?: EvidenceStatus;
  }>;
  instructions: string;
  expectedOutputStructure: {
    format: 'JSON';
    targetPath: string;
    requireMarkingScheme: boolean;
    requirePythonValidation: boolean;
  };
  status: TaskStatus;
  version: number;
}

export type DraftStatus = 
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPORTED';

export interface ExerciseItem {
  id: string;
  number: number;
  title: string;
  points: number;
  statementMarkdown: string;
  solutionMarkdown: string;
  gradingCriteria: Array<{
    id: string;
    description: string;
    points: number;
  }>;
}

export interface EducationalDraft {
  schemaVersion: string;
  draftId: string;
  taskId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  status: DraftStatus;
  subject: string;
  chapter: string;
  academicYear: string;
  contentType: ContentType;
  totalPoints: number;
  isOfficialBac: boolean;
  provenance: {
    generatedBy: 'Antigravity Educational AI' | 'Super Admin Edit';
    sourcesCited: Array<{
      document: string;
      page?: number;
      section?: string;
      documentId?: string;
      retrievedTopic?: string;
      evidenceStatus?: EvidenceStatus;
    }>;
    verifiedCurriculum: boolean;
  };
  header: {
    institution: string;
    sessionLabel: string;
    duration: string;
    coefficient: number;
  };
  exercises: ExerciseItem[];
  syntaxAnnexMarkdown?: string;
}

export interface ReviewRecord {
  schemaVersion: string;
  reviewId: string;
  draftId: string;
  draftVersion: number;
  reviewer: string;
  status: 'APPROVED' | 'REJECTED';
  checklist: {
    baremeValid: boolean;
    syntaxValid: boolean;
    curriculumCompliant: boolean;
    noHallucination: boolean;
    closedKnowledgeCompliant?: boolean;
  };
  reviewerNotes: string;
  rejectionReason?: string;
  timestamp: string;
}

export interface PublicationRecord {
  schemaVersion: string;
  publicationId: string;
  sourceDraftId: string;
  sourceTaskId: string;
  subject: string;
  chapter: string;
  contentType: ContentType;
  language: string;
  content: EducationalDraft;
  approvalMetadata: {
    reviewer: string;
    approvedAt: string;
    reviewId: string;
  };
  publishedAt: string;
}

export interface IngestionRunRecord {
  runId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  trigger: 'MANUAL_SCAN' | 'INCREMENTAL_DISCOVERY' | 'RETRY_FAILED' | 'API_TRIGGER';
  forceRescan: boolean;
  stats: {
    discoveredFiles: number;
    reusedFiles: number;
    addedFiles: number;
    modifiedFiles: number;
    duplicateFiles: number;
    failedFiles: number;
    ocrRequiredFiles: number;
    removedFiles: number;
  };
  addedDocuments: Array<{
    id: string;
    filename: string;
    path: string;
    subject: string;
    classification: string;
    sizeBytes: number;
  }>;
  modifiedDocuments: Array<{
    id: string;
    filename: string;
    path: string;
    oldSha256?: string;
    newSha256: string;
  }>;
  errors: Array<{
    filename: string;
    path: string;
    error: string;
  }>;
}
