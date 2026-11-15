import './dom-polyfill';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import AdmZip from 'adm-zip';
import { PDFParse } from 'pdf-parse';
import { DocumentClassification, DocumentRecord, ExtractionStatus, IngestionRunRecord } from '../types';
import { CONTENT_ROOT, getWorkspaceRoot } from './path-security';
import { atomicWriteFile, fileExists, readJsonFile } from './atomic-write';

// Strictly READ-ONLY Knowledge Directory: <WORKSPACE_ROOT>/bac info cours exam resourse
export const SOURCE_KNOWLEDGE_DIR = path.resolve(getWorkspaceRoot(), 'bac info cours exam resourse');
export const CATALOG_FILE_PATH = path.resolve(CONTENT_ROOT, 'knowledge-catalog.json');
export const EXTRACTED_STORE_DIR = path.resolve(CONTENT_ROOT, 'knowledge-catalog', 'extracted');
export const INGESTION_HISTORY_FILE_PATH = path.resolve(CONTENT_ROOT, 'knowledge-catalog', 'ingestion-history.json');

export interface SearchChunk {
  chunkId: string;
  pageNumber?: number;
  text: string;
}

export interface ExtractedDocumentContent {
  documentId: string;
  filename: string;
  relPath?: string;
  sha256: string;
  extractedAt: string;
  pageCount: number;
  textSnippet: string;
  fullText: string;
  pages?: Array<{ pageNumber: number; text: string }>;
  chunks?: SearchChunk[];
  zipEntries?: Array<{ name: string; sizeBytes: number; isDirectory: boolean }>;
}

export interface CatalogSummary {
  catalogVersion: string;
  lastScannedAt: string;
  sourceDirectory: string;
  totalDocuments: number;
  byClassification: Record<string, number>;
  bySubject: Record<string, number>;
  byStatus: Record<string, number>;
  documents: DocumentRecord[];
}

export interface SearchKnowledgeOptions {
  query?: string;
  subject?: string;
  classification?: DocumentClassification;
  academicYear?: string;
  session?: 'PRINCIPALE' | 'CONTROLE' | 'PRATIQUE' | 'NON_APPLICABLE';
  limit?: number;
}

export interface SearchKnowledgeResult {
  document: DocumentRecord;
  relevanceScore: number;
  matchedSnippets: string[];
  matchedPages?: number[];
}

/**
 * Calculates SHA-256 hash of a file safely.
 */
export async function calculateSha256(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

/**
 * Determines Subject, Classification, and Educational Metadata from relative path, filename, and snippet.
 */
export function classifyDocument(
  relPathOrFilename: string,
  optionalFilename?: string,
  contentSnippet: string = ''
): {
  classification: DocumentClassification;
  subject: string;
  isOfficial: boolean;
  academicYear?: string;
  session?: 'PRINCIPALE' | 'CONTROLE' | 'PRATIQUE' | 'NON_APPLICABLE';
  topic?: string;
} {
  const relPath = relPathOrFilename.toLowerCase();
  const filename = (optionalFilename || path.basename(relPathOrFilename)).toLowerCase();
  const combined = `${relPath} ${filename} ${contentSnippet.substring(0, 500).toLowerCase()}`;

  // 1. Academic Year detection
  let academicYear = '2026';
  if (combined.includes('2024')) academicYear = '2024';
  else if (combined.includes('2025')) academicYear = '2025';
  else if (combined.includes('2026')) academicYear = '2026';
  else if (combined.includes('2027')) academicYear = '2027';

  // 2. Session detection
  let session: 'PRINCIPALE' | 'CONTROLE' | 'PRATIQUE' | 'NON_APPLICABLE' = 'NON_APPLICABLE';
  if (combined.includes('pratique') || combined.includes('seance') || combined.includes('groupe') || combined.includes('ep ')) {
    session = 'PRATIQUE';
  } else if (combined.includes('controle') || combined.includes('dc1') || combined.includes('dc2') || combined.includes('ressources_dc')) {
    session = 'CONTROLE';
  } else if (combined.includes('principale') || combined.includes('synthese') || combined.includes('ds') || combined.includes('sujet')) {
    session = 'PRINCIPALE';
  }

  // 3. Subject detection
  let subject = 'Informatique';
  let topic: string | undefined = undefined;

  if (combined.includes('anglais') || combined.includes('english')) {
    subject = 'Anglais';
    if (combined.includes('writing')) topic = 'Writing & Composition';
    else if (combined.includes('gramma')) topic = 'Grammar & Syntax';
    else if (combined.includes('unit')) topic = 'Curriculum Units';
  } else if (combined.includes('philosophie') || combined.includes('philo')) {
    subject = 'Philosophie';
  } else if (combined.includes('arabe') || combined.includes('arabic')) {
    subject = 'Arabe';
  } else if (combined.includes('francais') || combined.includes('french')) {
    subject = 'Français';
  } else if (combined.includes('sciences_physiques') || combined.includes('physique')) {
    subject = 'Sciences Physiques';
  } else if (combined.includes('mathematiques') || combined.includes('math') || combined.includes('maths')) {
    subject = 'Mathématiques';
  } else if (combined.includes('sti') || combined.includes('systemes_et_technologies')) {
    subject = 'STI (Systèmes et Technologies)';
  } else if (combined.includes('bd') || combined.includes('sgbdr') || combined.includes('sql') || combined.includes('livre bd') || filename.endsWith('.sql')) {
    subject = 'Bases de Données';
    topic = 'Modélisation & SQL (MariaDB)';
  } else if (combined.includes('php') || combined.includes('html') || combined.includes('css') || combined.includes('js') || combined.includes('web') || combined.includes('formulaire') || combined.includes('login') || filename.endsWith('.php') || filename.endsWith('.html')) {
    subject = 'TIC & Développement Web';
    topic = 'Développement Web & Formulaires';
  } else if (
    combined.includes('algorithmique') || 
    combined.includes('algo') || 
    combined.includes('python') || 
    combined.includes('fichiers binaires') || 
    combined.includes('fichiers textes') ||
    combined.includes('fibonacci') ||
    combined.includes('triangle pascal') ||
    combined.includes('nombre or') ||
    filename.endsWith('.py') ||
    filename.endsWith('.ui')
  ) {
    subject = 'Algorithmique et Programmation';
    if (combined.includes('fichiers binaires') || combined.includes('pickle') || combined.includes('.dat') || combined.includes('.bin')) {
      topic = 'Enregistrements & Fichiers Binaires';
    } else if (combined.includes('fichiers textes')) {
      topic = 'Fichiers Textes';
    } else if (combined.includes('fibonacci') || combined.includes('pascal') || combined.includes('or')) {
      topic = 'Algorithmes Arithmétiques & Suites';
    } else if (filename.endsWith('.ui') || combined.includes('ui')) {
      topic = 'Interfaces Graphiques PyQt';
    }
  } else if (/^[0-9]{6}p[0-9]{2}\.pdf$/.test(filename)) {
    // Official Tunisian CNP textbook codes
    const code = filename.substring(0, 6);
    if (code.startsWith('201403') || code.startsWith('210402')) subject = 'Algorithmique et Programmation';
    else if (code.startsWith('221402') || code.startsWith('222472') || code.startsWith('223471') || code.startsWith('224471')) subject = 'Mathématiques';
    else if (code.startsWith('241403')) subject = 'Sciences Physiques';
    else if (code.startsWith('261401')) subject = 'Français';
    else if (code.startsWith('281403')) subject = 'Anglais';
    else if (code.startsWith('291401')) subject = 'Arabe';
    else if (code.startsWith('641404')) subject = 'Informatique Complémentaire';
  }

  // 4. Classification & Official Status
  let classification: DocumentClassification = 'UNKNOWN';
  let isOfficial = false;

  if (
    combined.includes('sujet') || 
    combined.includes('correction') || 
    combined.includes('corrige') || 
    combined.includes('bac-pratique') || 
    combined.includes('seance_de_') ||
    combined.includes('bac 2024') ||
    combined.includes('bac 2025') ||
    combined.includes('epreuve blanc') ||
    combined.includes('prototype bac pratique')
  ) {
    classification = 'OFFICIAL_EXAM';
    isOfficial = true;
  } else if (
    combined.includes('livre bd') || 
    combined.includes('annexes html') || 
    /^[0-9]{6}p[0-9]{2}\.pdf$/.test(filename)
  ) {
    classification = 'OFFICIAL_TEXTBOOK';
    isOfficial = true;
  } else if (
    combined.includes('tp') || 
    combined.includes('td') || 
    combined.includes('serie') || 
    combined.includes('exercice') ||
    combined.includes('activite') ||
    combined.includes('fichiers') ||
    filename.endsWith('.py') ||
    filename.endsWith('.sql') ||
    filename.endsWith('.php') ||
    filename.endsWith('.html') ||
    filename.endsWith('.ui')
  ) {
    classification = 'EXERCISE_RESOURCE';
    isOfficial = false;
  } else if (
    combined.includes('resume') || 
    combined.includes('cours') || 
    combined.includes('cours-') || 
    combined.includes('chapitre') ||
    combined.includes('summary') ||
    combined.includes('unit ') ||
    filename.endsWith('.docx')
  ) {
    classification = 'TEACHER_MATERIAL';
    isOfficial = false;
  } else if (
    filename.endsWith('.png') || 
    filename.endsWith('.jpg') || 
    filename.endsWith('.jpeg') ||
    filename.endsWith('.webp')
  ) {
    classification = 'STUDENT_RESOURCE';
    isOfficial = false;
  }

  return { classification, subject, isOfficial, academicYear, session, topic };
}

/**
 * Splits text content into structured, searchable chunks with stable identifiers.
 */
export function generateSearchChunks(docId: string, fullText: string, pages?: Array<{ pageNumber: number; text: string }>): SearchChunk[] {
  const chunks: SearchChunk[] = [];
  let chunkIdx = 1;

  if (pages && pages.length > 0) {
    for (const page of pages) {
      const pageText = page.text.trim();
      if (!pageText) continue;

      // Split page by paragraph groups of ~600 chars
      const paras = pageText.split(/\n\s*\n/);
      let currentChunk = '';

      for (const p of paras) {
        if (currentChunk.length + p.length > 800) {
          if (currentChunk.trim().length > 0) {
            chunks.push({
              chunkId: `${docId}-CHK-${String(chunkIdx++).padStart(3, '0')}`,
              pageNumber: page.pageNumber,
              text: currentChunk.trim()
            });
          }
          currentChunk = p;
        } else {
          currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
        }
      }

      if (currentChunk.trim().length > 0) {
        chunks.push({
          chunkId: `${docId}-CHK-${String(chunkIdx++).padStart(3, '0')}`,
          pageNumber: page.pageNumber,
          text: currentChunk.trim()
        });
      }
    }
  } else {
    // Non-paginated document (code, docx, txt): split by paragraphs
    const paras = fullText.split(/\n\s*\n/);
    let currentChunk = '';

    for (const p of paras) {
      if (currentChunk.length + p.length > 800) {
        if (currentChunk.trim().length > 0) {
          chunks.push({
            chunkId: `${docId}-CHK-${String(chunkIdx++).padStart(3, '0')}`,
            text: currentChunk.trim()
          });
        }
        currentChunk = p;
      } else {
        currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        chunkId: `${docId}-CHK-${String(chunkIdx++).padStart(3, '0')}`,
        text: currentChunk.trim()
      });
    }
  }

  return chunks;
}

/**
 * Extracts content from a single file across all supported formats.
 */
export async function extractFileContent(
  filePath: string,
  docId: string,
  sha256: string,
  relPath?: string
): Promise<ExtractedDocumentContent> {
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();

  let pageCount = 1;
  let fullText = '';
  let textSnippet = '';
  const pages: Array<{ pageNumber: number; text: string }> = [];
  let zipEntries: Array<{ name: string; sizeBytes: number; isDirectory: boolean }> | undefined = undefined;

  if (ext === '.pdf') {
    const dataBuffer = await fs.readFile(filePath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parser: any = null;
    try {
      parser = new PDFParse({ data: dataBuffer });
      const textResult = await parser.getText();
      pageCount = textResult.total || 1;
      fullText = (textResult.text || '').trim();
      textSnippet = fullText.substring(0, 500).replace(/\s+/g, ' ').trim();

      if (Array.isArray(textResult.pages)) {
        for (let i = 0; i < textResult.pages.length; i++) {
          const pt = (textResult.pages[i]?.text || '').trim();
          if (pt) {
            pages.push({ pageNumber: i + 1, text: pt });
          }
        }
      }
    } catch (pdfErr) {
      fullText = `[Échec partiel de parsing PDF: ${pdfErr instanceof Error ? pdfErr.message : String(pdfErr)}]`;
      textSnippet = fullText;
    } finally {
      if (parser && typeof parser.destroy === 'function') {
        try {
          await parser.destroy();
        } catch {
          // ignore destroy errors
        }
      }
    }

    // Check if scanned document with insufficient selectable text
    if (!textSnippet || fullText.length < 50) {
      textSnippet = `[Document PDF "${filename}" numérisé ou graphique sans couche texte extractible — Requiert OCR]`;
      fullText = textSnippet;
    }
  } else if (ext === '.docx') {
    try {
      const zip = new AdmZip(filePath);
      const entry = zip.getEntry('word/document.xml');
      if (entry) {
        const xml = entry.getData().toString('utf8');
        fullText = xml
          .replace(/<w:p[^>]*>/g, '\n\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .trim();
        textSnippet = fullText.substring(0, 500).replace(/\s+/g, ' ').trim();
      } else {
        fullText = `[Document Word (.docx): ${filename} — Aucune section de texte word/document.xml détectée]`;
        textSnippet = fullText;
      }
    } catch (docxErr) {
      fullText = `[Échec de lecture DOCX: ${docxErr instanceof Error ? docxErr.message : String(docxErr)}]`;
      textSnippet = fullText;
    }
  } else if (ext === '.ui') {
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const clean = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      fullText = `Fichier Interface Graphique Qt (PyQt5 / PyQt6) : ${filename}\n\nDescription XML Dérivée :\n${raw.substring(0, 3000)}`;
      textSnippet = `Interface UI Qt (${filename}): ${clean.substring(0, 400)}`;
    } catch {
      fullText = `[Fichier UI: ${filename}]`;
      textSnippet = fullText;
    }
  } else if (ext === '.zip') {
    try {
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      zipEntries = [];
      let aggregatedZipText = `Archive ZIP: ${filename}\nNombre d'éléments: ${entries.length}\n\n`;

      for (const entry of entries) {
        if (entry.entryName.includes('..') || path.isAbsolute(entry.entryName)) {
          continue;
        }

        zipEntries.push({
          name: entry.entryName,
          sizeBytes: entry.header.size,
          isDirectory: entry.isDirectory
        });

        const entryLower = entry.entryName.toLowerCase();
        if (!entry.isDirectory && (
          entryLower.endsWith('.py') ||
          entryLower.endsWith('.sql') ||
          entryLower.endsWith('.php') ||
          entryLower.endsWith('.html') ||
          entryLower.endsWith('.css') ||
          entryLower.endsWith('.txt') ||
          entryLower.endsWith('.ui')
        )) {
          try {
            const entryData = entry.getData().toString('utf8');
            aggregatedZipText += `--- FICHIER: ${entry.entryName} ---\n${entryData.substring(0, 4000)}\n\n`;
          } catch {
            // Ignore non-utf8 entries
          }
        }
      }

      fullText = aggregatedZipText;
      textSnippet = aggregatedZipText.substring(0, 500).replace(/\s+/g, ' ').trim();
    } catch (zipErr) {
      fullText = `[Archive ZIP endommagée ou protégée: ${zipErr instanceof Error ? zipErr.message : String(zipErr)}]`;
      textSnippet = fullText;
    }
  } else if (
    ext === '.sql' || 
    ext === '.php' || 
    ext === '.py' || 
    ext === '.txt' || 
    ext === '.html' || 
    ext === '.css' || 
    ext === '.js' || 
    ext === '.json' ||
    ext === '.csv'
  ) {
    try {
      fullText = await fs.readFile(filePath, 'utf-8');
      textSnippet = fullText.substring(0, 500).replace(/\s+/g, ' ').trim();
    } catch {
      fullText = `[Fichier texte ${filename} non encodé en UTF-8]`;
      textSnippet = fullText;
    }
  } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
    fullText = `[Fichier Image Pédagogique: ${filename}] — Document visuel sans outil OCR local installé. Requiert OCR.`;
    textSnippet = fullText;
  } else if (ext === '.crdownload') {
    fullText = `[Fichier de téléchargement incomplet: ${filename}] — Non exploitable.`;
    textSnippet = fullText;
  } else if (ext === '.bin' || ext === '.dat') {
    fullText = `[Fichier de données binaires / persistance pickle Bac SI: ${filename}] — Support pour exercices de fichiers.`;
    textSnippet = fullText;
  } else {
    fullText = `[Format de document non textuel ou binaire: ${filename} (${ext})]`;
    textSnippet = fullText;
  }

  const chunks = generateSearchChunks(docId, fullText, pages.length > 0 ? pages : undefined);

  const extractedRecord: ExtractedDocumentContent = {
    documentId: docId,
    filename,
    relPath,
    sha256,
    extractedAt: new Date().toISOString(),
    pageCount,
    textSnippet,
    fullText,
    pages: pages.length > 0 ? pages : undefined,
    chunks: chunks.length > 0 ? chunks : undefined,
    zipEntries
  };

  await fs.mkdir(EXTRACTED_STORE_DIR, { recursive: true });
  const extractedFilePath = path.resolve(EXTRACTED_STORE_DIR, `${docId}.json`);
  await atomicWriteFile(extractedFilePath, JSON.stringify(extractedRecord, null, 2));

  return extractedRecord;
}

export interface DiscoveredFileItem {
  relPath: string;
  filename: string;
  fullPath: string;
  sizeBytes: number;
}

/**
 * Recursively scans directory and returns all files.
 */
async function walkDirectory(dir: string, baseDir: string = dir): Promise<DiscoveredFileItem[]> {
  let list: DiscoveredFileItem[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const ent of entries) {
    const full = path.resolve(dir, ent.name);
    if (ent.isDirectory()) {
      if (!ent.name.startsWith('.')) {
        const subs = await walkDirectory(full, baseDir);
        list = list.concat(subs);
      }
    } else if (ent.isFile()) {
      if (!ent.name.startsWith('.')) {
        const stats = await fs.stat(full);
        const rel = path.relative(baseDir, full).replace(/\\/g, '/');
        list.push({
          relPath: rel,
          filename: ent.name,
          fullPath: full,
          sizeBytes: stats.size
        });
      }
    }
  }

  return list;
}

/**
 * Concurrency worker pool runner.
 */
async function runWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const pool = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      results[idx] = await worker(items[idx], idx);
    }
  });

  await Promise.all(pool);
  return results;
}

/**
 * Retrieves the historical log of ingestion runs.
 */
export async function getIngestionHistory(): Promise<IngestionRunRecord[]> {
  if (await fileExists(INGESTION_HISTORY_FILE_PATH)) {
    try {
      const history = await readJsonFile<IngestionRunRecord[]>(INGESTION_HISTORY_FILE_PATH);
      if (Array.isArray(history)) {
        return history.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
      }
    } catch {
      // Return empty array if file corrupted
    }
  }
  return [];
}

/**
 * Persists an ingestion run record into the ingestion history.
 */
export async function recordIngestionRun(runRecord: IngestionRunRecord): Promise<void> {
  try {
    const existing = await getIngestionHistory();
    const updated = [runRecord, ...existing].slice(0, 50); // keep last 50 runs
    await atomicWriteFile(INGESTION_HISTORY_FILE_PATH, JSON.stringify(updated, null, 2));
  } catch (err) {
    console.warn('[Ingestion History Error] Failed to write ingestion history:', err);
  }
}

export interface RetryFailedResult {
  attempted: number;
  recovered: number;
  remainingFailed: number;
  recoveredDocs: DocumentRecord[];
  errors: Array<{ id: string; filename: string; error: string }>;
}

/**
 * Retries extraction for documents previously marked with extractionStatus === 'FAILED'.
 */
export async function retryFailedExtractions(): Promise<RetryFailedResult> {
  const catalog = await getKnowledgeCatalog();
  const failedDocs = catalog.documents.filter(d => d.extractionStatus === 'FAILED');

  if (failedDocs.length === 0) {
    return { attempted: 0, recovered: 0, remainingFailed: 0, recoveredDocs: [], errors: [] };
  }

  const startTime = Date.now();
  let recoveredCount = 0;
  const recoveredDocs: DocumentRecord[] = [];
  const errors: Array<{ id: string; filename: string; error: string }> = [];

  for (const doc of failedDocs) {
    try {
      const fullPath = path.resolve(SOURCE_KNOWLEDGE_DIR, doc.path);
      if (!(await fileExists(fullPath))) {
        errors.push({ id: doc.id, filename: doc.filename, error: 'Fichier non trouvé sur le disque' });
        continue;
      }

      const sha256 = await calculateSha256(fullPath);
      const extracted = await extractFileContent(fullPath, doc.id, sha256, doc.path);

      if (extracted.textSnippet && !extracted.textSnippet.startsWith('[Échec')) {
        doc.extractionStatus = 'TEXT_EXTRACTED';
        doc.extractionQuality = 'HIGH';
        doc.extractedTextSnippet = extracted.textSnippet;
        doc.sha256 = sha256;
        doc.pageCount = extracted.pageCount;
        doc.chunksCount = extracted.chunks?.length || 0;
        recoveredCount++;
        recoveredDocs.push(doc);
      } else {
        errors.push({ id: doc.id, filename: doc.filename, error: 'Extraction texte toujours infructueuse' });
      }
    } catch (err) {
      errors.push({ id: doc.id, filename: doc.filename, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // Update catalog summary
  if (recoveredCount > 0) {
    catalog.lastScannedAt = new Date().toISOString();
    catalog.byStatus['FAILED'] = Math.max(0, (catalog.byStatus['FAILED'] || 0) - recoveredCount);
    catalog.byStatus['TEXT_EXTRACTED'] = (catalog.byStatus['TEXT_EXTRACTED'] || 0) + recoveredCount;
    await atomicWriteFile(CATALOG_FILE_PATH, JSON.stringify(catalog, null, 2));

    await recordIngestionRun({
      runId: `RUN-RETRY-${Date.now()}`,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      status: errors.length === 0 ? 'SUCCESS' : 'PARTIAL',
      trigger: 'RETRY_FAILED',
      forceRescan: false,
      stats: {
        discoveredFiles: failedDocs.length,
        reusedFiles: 0,
        addedFiles: 0,
        modifiedFiles: recoveredCount,
        duplicateFiles: 0,
        failedFiles: failedDocs.length - recoveredCount,
        ocrRequiredFiles: 0,
        removedFiles: 0
      },
      addedDocuments: [],
      modifiedDocuments: recoveredDocs.map(d => ({
        id: d.id,
        filename: d.filename,
        path: d.path,
        newSha256: d.sha256 || ''
      })),
      errors: errors.map(e => ({ filename: e.filename, path: e.filename, error: e.error }))
    });
  }

  return {
    attempted: failedDocs.length,
    recovered: recoveredCount,
    remainingFailed: failedDocs.length - recoveredCount,
    recoveredDocs,
    errors
  };
}

/**
 * Incremental Scanning and Indexing of D:\EDUCATION RAYEN\bac info cours exam resourse.
 * Automatically discovers new and modified files, computes SHA-256, extracts content,
 * generates chunks, and updates catalog and history.
 */
export async function scanAndIndexKnowledgeRepository(
  forceFullRescan: boolean = false,
  trigger: 'MANUAL_SCAN' | 'INCREMENTAL_DISCOVERY' | 'RETRY_FAILED' | 'API_TRIGGER' = 'INCREMENTAL_DISCOVERY'
): Promise<CatalogSummary> {
  const startTime = Date.now();
  await fs.mkdir(path.dirname(CATALOG_FILE_PATH), { recursive: true });
  await fs.mkdir(EXTRACTED_STORE_DIR, { recursive: true });

  // Read existing catalog to enable lightning-fast incremental synchronization
  let existingCatalog: CatalogSummary | null = null;
  if (!forceFullRescan && await fileExists(CATALOG_FILE_PATH)) {
    try {
      existingCatalog = await readJsonFile<CatalogSummary>(CATALOG_FILE_PATH);
    } catch {
      existingCatalog = null;
    }
  }

  const existingDocsByPath = new Map<string, DocumentRecord>();
  const existingDocsByFilename = new Map<string, DocumentRecord>();
  const existingDocsBySha = new Map<string, DocumentRecord>();

  if (existingCatalog && Array.isArray(existingCatalog.documents)) {
    for (const d of existingCatalog.documents) {
      if (d.path) existingDocsByPath.set(d.path, d);
      if (d.filename) existingDocsByFilename.set(d.filename, d);
      if (d.sha256) existingDocsBySha.set(d.sha256, d);
    }
  }

  console.log(`[Ingestion] Scanning source directory recursively: ${SOURCE_KNOWLEDGE_DIR}...`);
  const discoveredFiles = await walkDirectory(SOURCE_KNOWLEDGE_DIR);
  console.log(`[Ingestion] Discovered ${discoveredFiles.length} files across directory tree.`);

  const documents: DocumentRecord[] = [];
  const knownHashes = new Set<string>();
  const filesToProcess: Array<DiscoveredFileItem & { isModified?: boolean; oldSha256?: string }> = [];
  const discoveredRelPaths = new Set<string>();

  const addedDocsMeta: IngestionRunRecord['addedDocuments'] = [];
  const modifiedDocsMeta: IngestionRunRecord['modifiedDocuments'] = [];
  const runErrors: IngestionRunRecord['errors'] = [];

  for (const file of discoveredFiles) {
    discoveredRelPaths.add(file.relPath);
    const existing = existingDocsByPath.get(file.relPath) || existingDocsByFilename.get(file.filename);
    const extractedExists = existing?.id ? await fileExists(path.resolve(EXTRACTED_STORE_DIR, `${existing.id}.json`)) : false;

    // Fast-path: unchanged file with existing hash, size match & extracted content on disk
    if (!forceFullRescan && existing && existing.sizeBytes === file.sizeBytes && existing.sha256 && extractedExists) {
      const isDup = knownHashes.has(existing.sha256);
      if (!isDup) knownHashes.add(existing.sha256);

      documents.push({
        ...existing,
        path: file.relPath,
        extractionStatus: isDup ? 'DUPLICATE' : existing.extractionStatus,
        duplicateOf: isDup ? (existing.duplicateOf || 'Previous identical file') : undefined
      });
    } else {
      const isModified = !!(existing && (existing.sizeBytes !== file.sizeBytes || !extractedExists));
      filesToProcess.push({
        ...file,
        isModified,
        oldSha256: existing?.sha256
      });
    }
  }

  console.log(`[Ingestion] ${documents.length} files reused from cache. ${filesToProcess.length} new or modified files to extract.`);

  // Process new or modified files with concurrency of 8
  if (filesToProcess.length > 0) {
    let processedCount = 0;
    const extractedResults = await runWithConcurrency(filesToProcess, 8, async (file) => {
      try {
        const sha256 = await calculateSha256(file.fullPath);
        const docId = `DOC-${sha256.substring(0, 16).toUpperCase()}`;

        let extracted: ExtractedDocumentContent;
        const extractedPath = path.resolve(EXTRACTED_STORE_DIR, `${docId}.json`);

        if (!forceFullRescan && await fileExists(extractedPath)) {
          extracted = await readJsonFile<ExtractedDocumentContent>(extractedPath);
        } else {
          extracted = await extractFileContent(file.fullPath, docId, sha256, file.relPath);
        }

        const { classification, subject, isOfficial, academicYear, session, topic } = 
          classifyDocument(file.relPath, file.filename, extracted.textSnippet);

        const ext = path.extname(file.filename).toLowerCase();
        let status: ExtractionStatus = 'TEXT_EXTRACTED';
        let quality: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';

        if (ext === '.crdownload') {
          status = 'FAILED';
          quality = 'LOW';
        } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
          status = 'OCR_REQUIRED';
          quality = 'LOW';
        } else if (ext === '.pdf' && extracted.textSnippet.includes('Requiert OCR')) {
          status = 'OCR_REQUIRED';
          quality = 'LOW';
        } else if (extracted.textSnippet.startsWith('[Échec')) {
          status = 'FAILED';
          quality = 'LOW';
        } else if (ext === '.bin' || ext === '.dat') {
          status = 'INDEXED';
          quality = 'MEDIUM';
        }

        const isDup = knownHashes.has(sha256) || existingDocsBySha.has(sha256);
        if (isDup) {
          status = 'DUPLICATE';
          quality = 'LOW';
        } else {
          knownHashes.add(sha256);
        }

        const docRecord: DocumentRecord = {
          id: docId,
          filename: file.filename,
          path: file.relPath,
          sizeBytes: file.sizeBytes,
          sha256,
          classification,
          subject,
          academicYear,
          session,
          pageCount: extracted.pageCount,
          extractionStatus: status,
          extractionQuality: quality,
          isOfficial,
          verifiedCurriculum: isOfficial,
          extractedTextSnippet: extracted.textSnippet,
          extractedPath: `content/knowledge-catalog/extracted/${docId}.json`,
          indexedAt: new Date().toISOString(),
          duplicateOf: isDup ? 'Identical content detected via SHA-256' : undefined,
          charDensityPerPage: Math.round(extracted.fullText.length / Math.max(extracted.pageCount, 1)),
          topic,
          chunksCount: extracted.chunks?.length || 0
        };

        if (file.isModified) {
          modifiedDocsMeta.push({
            id: docId,
            filename: file.filename,
            path: file.relPath,
            oldSha256: file.oldSha256,
            newSha256: sha256
          });
        } else {
          addedDocsMeta.push({
            id: docId,
            filename: file.filename,
            path: file.relPath,
            subject,
            classification,
            sizeBytes: file.sizeBytes
          });
        }

        processedCount++;
        if (processedCount % 50 === 0 || processedCount === filesToProcess.length) {
          console.log(`[Ingestion] Progress: ${processedCount}/${filesToProcess.length} newly ingested files.`);
        }

        return docRecord;
      } catch (err) {
        console.warn(`[Ingestion Error] File ${file.relPath}:`, err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        runErrors.push({ filename: file.filename, path: file.relPath, error: errorMsg });

        const fallbackId = `DOC-ERR-${crypto.createHash('md5').update(file.relPath).digest('hex').substring(0, 12).toUpperCase()}`;
        return {
          id: fallbackId,
          filename: file.filename,
          path: file.relPath,
          sizeBytes: file.sizeBytes,
          classification: 'UNKNOWN' as DocumentClassification,
          subject: 'Informatique',
          extractionStatus: 'FAILED' as ExtractionStatus,
          extractionQuality: 'LOW' as const,
          isOfficial: false,
          verifiedCurriculum: false,
          extractedTextSnippet: `Erreur d'ingestion: ${errorMsg}`,
          indexedAt: new Date().toISOString()
        };
      }
    });

    documents.push(...extractedResults);
  }

  // Detect removed files from catalog
  let removedCount = 0;
  if (existingCatalog && Array.isArray(existingCatalog.documents)) {
    for (const oldDoc of existingCatalog.documents) {
      if (oldDoc.path && !discoveredRelPaths.has(oldDoc.path)) {
        removedCount++;
      }
    }
  }

  // Calculate aggregation counts
  const byClassification: Record<string, number> = {};
  const bySubject: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const doc of documents) {
    byClassification[doc.classification] = (byClassification[doc.classification] || 0) + 1;
    bySubject[doc.subject] = (bySubject[doc.subject] || 0) + 1;
    byStatus[doc.extractionStatus] = (byStatus[doc.extractionStatus] || 0) + 1;
  }

  const catalogSummary: CatalogSummary = {
    catalogVersion: '2.1.0',
    lastScannedAt: new Date().toISOString(),
    sourceDirectory: SOURCE_KNOWLEDGE_DIR,
    totalDocuments: documents.length,
    byClassification,
    bySubject,
    byStatus,
    documents: documents.sort((a, b) => a.path.localeCompare(b.path))
  };

  // Atomically persist updated catalog
  await atomicWriteFile(CATALOG_FILE_PATH, JSON.stringify(catalogSummary, null, 2));
  console.log(`[Ingestion] Catalog updated successfully! Total indexed documents: ${catalogSummary.totalDocuments}`);

  // Record Ingestion Run
  const durationMs = Date.now() - startTime;
  const runRecord: IngestionRunRecord = {
    runId: `RUN-${Date.now()}`,
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
    durationMs,
    status: runErrors.length > 0 ? 'PARTIAL' : 'SUCCESS',
    trigger,
    forceRescan: forceFullRescan,
    stats: {
      discoveredFiles: discoveredFiles.length,
      reusedFiles: discoveredFiles.length - filesToProcess.length,
      addedFiles: addedDocsMeta.length,
      modifiedFiles: modifiedDocsMeta.length,
      duplicateFiles: byStatus['DUPLICATE'] || 0,
      failedFiles: byStatus['FAILED'] || 0,
      ocrRequiredFiles: byStatus['OCR_REQUIRED'] || 0,
      removedFiles: removedCount
    },
    addedDocuments: addedDocsMeta.slice(0, 50),
    modifiedDocuments: modifiedDocsMeta.slice(0, 50),
    errors: runErrors
  };

  await recordIngestionRun(runRecord);

  return catalogSummary;
}

/**
 * Retrieves the cached or fresh catalog.
 */
export async function getKnowledgeCatalog(): Promise<CatalogSummary> {
  if (await fileExists(CATALOG_FILE_PATH)) {
    try {
      return await readJsonFile<CatalogSummary>(CATALOG_FILE_PATH);
    } catch {
      // Fallback to scan if file corrupted
    }
  }
  return await scanAndIndexKnowledgeRepository(false);
}

/**
 * Retrieves full extracted content for a specific document ID.
 */
export async function getExtractedDocumentContent(docId: string): Promise<ExtractedDocumentContent | null> {
  const filePath = path.resolve(EXTRACTED_STORE_DIR, `${docId}.json`);
  if (await fileExists(filePath)) {
    return await readJsonFile<ExtractedDocumentContent>(filePath);
  }
  return null;
}

/**
 * Multi-criteria search across indexed knowledge documents and extracted content.
 */
export async function searchKnowledge(
  options: SearchKnowledgeOptions
): Promise<SearchKnowledgeResult[]> {
  const catalog = await getKnowledgeCatalog();
  const query = (options.query || '').trim().toLowerCase();
  const queryTerms = query.split(/\s+/).filter(t => t.length > 1);

  const results: SearchKnowledgeResult[] = [];

  for (const doc of catalog.documents) {
    // Subject filter
    if (options.subject && options.subject !== 'ALL') {
      const matchSub = doc.subject.toLowerCase() === options.subject.toLowerCase();
      if (!matchSub) continue;
    }

    // Classification filter
    if (options.classification && doc.classification !== options.classification) {
      continue;
    }

    // Academic Year filter
    if (options.academicYear && doc.academicYear !== options.academicYear) {
      continue;
    }

    // Session filter
    if (options.session && doc.session !== options.session) {
      continue;
    }

    if (queryTerms.length === 0) {
      results.push({
        document: doc,
        relevanceScore: 1.0,
        matchedSnippets: doc.extractedTextSnippet ? [doc.extractedTextSnippet] : []
      });
      continue;
    }

    // Scoring calculation
    let score = 0;
    const docPath = (doc.path || doc.filename).toLowerCase();
    const docSnippet = (doc.extractedTextSnippet || '').toLowerCase();
    const docSubject = doc.subject.toLowerCase();
    const docTopic = (doc.topic || '').toLowerCase();

    for (const term of queryTerms) {
      if (docPath.includes(term)) score += 10;
      if (docSubject.includes(term)) score += 8;
      if (docTopic.includes(term)) score += 8;
      if (docSnippet.includes(term)) score += 5;
    }

    // If matches metadata, load extracted chunks if score can be deepened
    if (score > 0) {
      const matchedSnippets: string[] = [];
      const matchedPages: number[] = [];

      if (doc.extractedTextSnippet) {
        matchedSnippets.push(doc.extractedTextSnippet);
      }

      results.push({
        document: doc,
        relevanceScore: score,
        matchedSnippets,
        matchedPages: matchedPages.length > 0 ? matchedPages : undefined
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  if (options.limit && options.limit > 0) {
    return results.slice(0, options.limit);
  }

  return results;
}
