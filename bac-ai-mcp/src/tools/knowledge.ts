import fs from 'fs';
import path from 'path';
import { getWorkspacePaths, assertSafePath } from '../security.js';
import { McpNotFoundError } from '../types.js';

interface KnowledgeDoc {
  id: string;
  filename: string;
  path: string;
  sizeBytes: number;
  classification: string;
  subject: string;
  academicYear: string;
  session?: string;
  pageCount?: number;
  extractionStatus?: string;
  isOfficial?: boolean;
  extractedTextSnippet?: string;
  extractedPath?: string;
}

export function searchKnowledgeHandler(args: {
  query?: string;
  subject?: string;
  classification?: string;
  isOfficialOnly?: boolean;
  limit?: number;
}) {
  const paths = getWorkspacePaths();
  if (!fs.existsSync(paths.catalogJsonPath)) {
    return { totalMatches: 0, documents: [] };
  }

  const raw = fs.readFileSync(paths.catalogJsonPath, 'utf8');
  const catalog = JSON.parse(raw);
  const docs: KnowledgeDoc[] = catalog.documents || [];

  const query = args.query ? args.query.toLowerCase().trim() : null;
  const subject = args.subject ? args.subject.toLowerCase().trim() : null;
  const classification = args.classification ? args.classification.toLowerCase().trim() : null;
  const isOfficialOnly = args.isOfficialOnly ?? false;
  const limit = args.limit || 20;

  const filtered = docs.filter((doc) => {
    if (isOfficialOnly && !doc.isOfficial) return false;
    if (subject && (!doc.subject || !doc.subject.toLowerCase().includes(subject))) return false;
    if (classification && (!doc.classification || !doc.classification.toLowerCase().includes(classification))) return false;
    if (query) {
      const matchName = doc.filename.toLowerCase().includes(query);
      const matchSubject = doc.subject ? doc.subject.toLowerCase().includes(query) : false;
      const matchSnippet = doc.extractedTextSnippet ? doc.extractedTextSnippet.toLowerCase().includes(query) : false;
      const matchClass = doc.classification ? doc.classification.toLowerCase().includes(query) : false;
      if (!matchName && !matchSubject && !matchSnippet && !matchClass) {
        return false;
      }
    }
    return true;
  });

  const sliced = filtered.slice(0, limit).map((d) => ({
    id: d.id,
    filename: d.filename,
    classification: d.classification,
    subject: d.subject,
    academicYear: d.academicYear,
    session: d.session || 'N/A',
    pageCount: d.pageCount || 0,
    isOfficial: !!d.isOfficial,
    extractionStatus: d.extractionStatus || 'PENDING',
    snippet: d.extractedTextSnippet ? d.extractedTextSnippet.substring(0, 300) + '...' : '',
  }));

  return {
    totalMatches: filtered.length,
    returnedCount: sliced.length,
    documents: sliced,
  };
}

export function readKnowledgeFileHandler(args: { documentId: string }) {
  const paths = getWorkspacePaths();
  if (!fs.existsSync(paths.catalogJsonPath)) {
    throw new McpNotFoundError('Knowledge catalog not found on disk.');
  }

  const raw = fs.readFileSync(paths.catalogJsonPath, 'utf8');
  const catalog = JSON.parse(raw);
  const docs: KnowledgeDoc[] = catalog.documents || [];

  const doc = docs.find((d) => d.id === args.documentId);
  if (!doc) {
    throw new McpNotFoundError(`Knowledge document with ID "${args.documentId}" was not found in the catalog.`);
  }

  let extractedContent: any = null;
  if (doc.extractedPath) {
    const fullExtractedPath = path.isAbsolute(doc.extractedPath)
      ? doc.extractedPath
      : path.resolve(paths.workspaceRoot, doc.extractedPath);

    // Validate path is within workspace and safe
    assertSafePath(fullExtractedPath, [paths.workspaceRoot]);

    if (fs.existsSync(fullExtractedPath)) {
      try {
        extractedContent = JSON.parse(fs.readFileSync(fullExtractedPath, 'utf8'));
      } catch {
        extractedContent = fs.readFileSync(fullExtractedPath, 'utf8');
      }
    }
  }

  return {
    documentId: doc.id,
    filename: doc.filename,
    classification: doc.classification,
    subject: doc.subject,
    academicYear: doc.academicYear,
    isOfficial: doc.isOfficial,
    pageCount: doc.pageCount,
    extractionStatus: doc.extractionStatus,
    snippet: doc.extractedTextSnippet || '',
    extractedData: extractedContent,
    readOnlyNotice: 'Source document verified from read-only official repository.',
  };
}
