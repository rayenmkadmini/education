import assert from 'assert';
import { 
  scanAndIndexKnowledgeRepository, 
  getKnowledgeCatalog, 
  getExtractedDocumentContent,
  searchKnowledge,
  CATALOG_FILE_PATH
} from '../src/lib/server/knowledge-extractor';
import { fileExists } from '../src/lib/server/atomic-write';

async function runKnowledgeIndexingTests() {
  console.log('--- STARTING KNOWLEDGE INDEXING & CATALOG TESTS ---');

  console.log('Running incremental scanAndIndexKnowledgeRepository(false)...');
  const catalog = await scanAndIndexKnowledgeRepository(false);

  console.log(`✓ Total documents discovered: ${catalog.totalDocuments}`);
  assert.ok(catalog.totalDocuments >= 1000, `Expected at least 1000 documents, found: ${catalog.totalDocuments}`);

  console.log('Classifications breakdown:');
  console.table(catalog.byClassification);

  console.log('Subjects breakdown:');
  console.table(catalog.bySubject);

  console.log('Extraction status breakdown:');
  console.table(catalog.byStatus);

  // Check catalog file existence
  assert.strictEqual(await fileExists(CATALOG_FILE_PATH), true, 'content/knowledge-catalog.json must exist');
  
  // Verify a sample document record
  const sampleDoc = catalog.documents.find(d => d.filename.includes('Algorithmique_et_programmation'));
  assert.ok(sampleDoc, 'Official exam Algorithmique_et_programmation must be indexed');
  assert.ok(sampleDoc.sha256, 'Document must have a valid SHA-256');
  assert.strictEqual(sampleDoc.isOfficial, true, 'Official national exam must have isOfficial = true');
  assert.strictEqual(sampleDoc.classification, 'OFFICIAL_EXAM');

  // Verify extracted content persistence
  const extracted = await getExtractedDocumentContent(sampleDoc.id);
  assert.ok(extracted !== null, `Extracted content for ${sampleDoc.id} must be loadable`);
  assert.ok(extracted.fullText.length > 50, 'Extracted text should not be empty');
  console.log(`✓ Extracted sample text snippet for "${sampleDoc.filename}":`);
  console.log(`  "${extracted.textSnippet.substring(0, 150)}..."`);

  // Verify ZIP handling
  const zipDoc = catalog.documents.find(d => d.filename.endsWith('.zip'));
  if (zipDoc) {
    const zipExtracted = await getExtractedDocumentContent(zipDoc.id);
    assert.ok(zipExtracted?.zipEntries && zipExtracted.zipEntries.length > 0, 'ZIP document must have listed zip entries');
    console.log(`✓ Safe ZIP inspection verified: ${zipDoc.filename} contains ${zipExtracted.zipEntries.length} entries.`);
  }

  // Test incremental speed: second call must be instantaneous
  console.log('Testing incremental caching...');
  const t0 = Date.now();
  const cached = await getKnowledgeCatalog();
  const t1 = Date.now();
  assert.strictEqual(cached.totalDocuments, catalog.totalDocuments);
  console.log(`✓ Incremental retrieval completed in ${t1 - t0}ms`);

  // Test multi-criteria search
  console.log('Testing searchKnowledge()...');
  const searchRes = await searchKnowledge({ query: 'Algorithmique Python', limit: 5 });
  assert.ok(searchRes.length > 0, 'Search for Algorithmique Python must return matches');
  console.log(`✓ Multi-criteria search verified: returned ${searchRes.length} matches for "Algorithmique Python"`);

  console.log('--- ALL KNOWLEDGE INDEXING TESTS PASSED (100%) ---');
}

runKnowledgeIndexingTests().catch(err => {
  console.error('KNOWLEDGE INDEXING TEST FAILED:', err);
  process.exit(1);
});
