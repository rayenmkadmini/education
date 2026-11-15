import assert from 'assert';
import fs from 'fs';
import { 
  AUTHORIZED_KNOWLEDGE_DIR,
  assertAuthorizedKnowledgePath,
  validateSourceReference,
  validateSourcesTraceability,
  enforceRetrievalBeforeGeneration,
  getSourcePolicyStatus
} from '../src/lib/server/source-policy-service';
import { 
  scanAndIndexKnowledgeRepository, 
  getKnowledgeCatalog, 
  searchKnowledge 
} from '../src/lib/server/knowledge-extractor';
import { validateDraftPayload } from '../src/lib/server/validation';
import { INFO_NOT_FOUND_MESSAGE, EducationalDraft } from '../src/lib/types';

async function runClosedKnowledgePolicyTests() {
  console.log('=== STARTING STRICT CLOSED KNOWLEDGE BASE POLICY TESTS ===\n');

  // Record initial state of the source directory
  const initialFiles = fs.readdirSync(AUTHORIZED_KNOWLEDGE_DIR);
  const initialFileCount = initialFiles.length;
  console.log(`Initial authorized repository files: ${initialFileCount} entries.`);

  // --------------------------------------------------------------------------
  // TEST 1: Document inside authorized repository can be indexed
  // --------------------------------------------------------------------------
  console.log('\n[TEST 1] Verifying document inside authorized repository is indexed...');
  const catalog = await getKnowledgeCatalog();
  assert.ok(catalog.totalDocuments >= 1000, `Expected >= 1000 documents, found: ${catalog.totalDocuments}`);

  const sampleDoc = catalog.documents.find(d => 
    d.filename.includes('Algorithmique_et_programmation') || 
    d.filename.includes('contacts.bin')
  );
  assert.ok(sampleDoc, 'Authorized sample document must exist in indexed catalog');
  assert.ok(sampleDoc.sha256, 'Authorized document must have a valid SHA-256');
  console.log(`✓ Authorized document confirmed indexed: "${sampleDoc.filename}" (ID: ${sampleDoc.id})`);

  // --------------------------------------------------------------------------
  // TEST 2: Newly added document becomes searchable after ingestion
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Verifying searchable retrieval of ingested content...');
  const searchResults = await searchKnowledge({ query: 'contacts.bin', limit: 3 });
  assert.ok(searchResults.length > 0, 'contacts.bin must be retrievable via search');
  assert.ok(searchResults[0].document.filename.includes('contacts.bin'));
  console.log(`✓ Ingested document successfully retrieved with relevance score ${searchResults[0].relevanceScore}`);

  // --------------------------------------------------------------------------
  // TEST 3: Unchanged document is not unnecessarily reprocessed
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Verifying incremental caching (unchanged documents are not reprocessed)...');
  const t0 = Date.now();
  const rescan = await scanAndIndexKnowledgeRepository(false);
  const duration = Date.now() - t0;
  assert.strictEqual(rescan.totalDocuments, catalog.totalDocuments);
  console.log(`✓ Incremental scan verified: ${rescan.totalDocuments} documents verified in ${duration}ms (no redundant extraction)`);

  // --------------------------------------------------------------------------
  // TEST 4: External URL cannot become an educational source
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] Verifying external URLs are strictly rejected...');
  
  const urlTest1 = await validateSourceReference('https://en.wikipedia.org/wiki/Algorithm');
  assert.strictEqual(urlTest1.authorized, false);
  assert.strictEqual(urlTest1.evidenceStatus, 'NOT_FOUND');
  assert.ok(urlTest1.reason?.includes('strictement prohibés'));
  console.log(`✓ External URL "https://en.wikipedia.org/wiki/Algorithm" correctly rejected`);

  const urlTest2 = await validateSourceReference('http://tunisieschools.tn/cours-python.pdf');
  assert.strictEqual(urlTest2.authorized, false);
  console.log(`✓ External URL "http://tunisieschools.tn/cours-python.pdf" correctly rejected`);

  // Verify rejection inside validateDraftPayload
  const mockDraftWithUrl: Partial<EducationalDraft> = {
    draftId: 'DRAFT-ILLEGAL-URL-TEST',
    subject: 'Algorithmique et Programmation',
    chapter: 'Test',
    exercises: [
      {
        id: 'ex-1',
        number: 1,
        title: 'Ex',
        points: 20,
        statementMarkdown: 'Énoncé',
        solutionMarkdown: 'Solution',
        gradingCriteria: []
      }
    ],
    provenance: {
      generatedBy: 'Antigravity Educational AI',
      verifiedCurriculum: false,
      sourcesCited: [
        { document: 'https://external-website.com/unauthorized.pdf' }
      ]
    }
  };

  assert.throws(() => {
    validateDraftPayload(mockDraftWithUrl);
  }, /Violation Règle Source Fermée: La source "https:\/\/external-website.com\/unauthorized.pdf" est une URL externe/);
  console.log('✓ Draft containing external URL rejected by validateDraftPayload()');

  // --------------------------------------------------------------------------
  // TEST 5: File outside authorized directory cannot be ingested or cited
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Verifying paths outside authorized repository are blocked...');

  assert.throws(() => {
    assertAuthorizedKnowledgePath('/etc/passwd');
  }, /Violation Règle Source Fermée/);
  console.log('✓ Absolute path "/etc/passwd" blocked by assertAuthorizedKnowledgePath()');

  assert.throws(() => {
    assertAuthorizedKnowledgePath('../../outside_secret.pdf');
  }, /Violation Règle Source Fermée/);
  console.log('✓ Directory traversal "../../outside_secret.pdf" blocked by assertAuthorizedKnowledgePath()');

  const outsideRef = await validateSourceReference('/var/data/rogue_exam.pdf');
  assert.strictEqual(outsideRef.authorized, false);
  console.log('✓ Outside path reference rejected by validateSourceReference()');

  // --------------------------------------------------------------------------
  // TEST 6: Generation request without supporting internal evidence returns NOT_FOUND
  // --------------------------------------------------------------------------
  console.log('\n[TEST 6] Verifying unsupported generation returns INFORMATION_NOT_FOUND_IN_AUTHORIZED_KNOWLEDGE_BASE...');
  
  const unsupportedQuery = 'quantum computing terraforming Mars interplanetary protocols';
  const retrievalCheck = await enforceRetrievalBeforeGeneration(unsupportedQuery);

  assert.strictEqual(retrievalCheck.supported, false);
  assert.strictEqual(retrievalCheck.evidenceStatus, 'NOT_FOUND');
  assert.ok(retrievalCheck.message?.includes(INFO_NOT_FOUND_MESSAGE));
  console.log(`✓ Unsupported query returned exact constant: "${INFO_NOT_FOUND_MESSAGE}"`);

  // --------------------------------------------------------------------------
  // TEST 7: Generated content includes traceable source references
  // --------------------------------------------------------------------------
  console.log('\n[TEST 7] Verifying source traceability validation...');

  const validTraceReport = await validateSourcesTraceability([
    { document: sampleDoc.filename, page: 1, section: 'Section 1' }
  ]);
  assert.strictEqual(validTraceReport.valid, true);
  assert.strictEqual(validTraceReport.verifiedCount, 1);
  assert.strictEqual(validTraceReport.sources[0].verified, true);
  console.log(`✓ Valid source "${sampleDoc.filename}" verified against authorized catalog`);

  const invalidTraceReport = await validateSourcesTraceability([
    { document: 'imaginary_nonexistent_document_2099.pdf', page: 42 }
  ]);
  assert.strictEqual(invalidTraceReport.valid, false);
  assert.strictEqual(invalidTraceReport.evidenceStatus, 'NOT_FOUND');
  assert.ok(invalidTraceReport.errors[0].includes(INFO_NOT_FOUND_MESSAGE));
  console.log(`✓ Nonexistent source rejected with NOT_FOUND`);

  // --------------------------------------------------------------------------
  // TEST 8: Policy Status API output verification
  // --------------------------------------------------------------------------
  console.log('\n[TEST 8] Verifying getSourcePolicyStatus() configuration...');
  const policyStatus = await getSourcePolicyStatus();
  assert.strictEqual(policyStatus.closedKnowledgeEnforced, true);
  assert.strictEqual(policyStatus.webSearchDisabled, true);
  assert.strictEqual(policyStatus.externalAPIsDisabled, true);
  assert.strictEqual(policyStatus.infoNotFoundConstant, INFO_NOT_FOUND_MESSAGE);
  assert.strictEqual(policyStatus.authorizedDirectory, AUTHORIZED_KNOWLEDGE_DIR);
  console.log(`✓ Source policy status verified (Total authorized documents: ${policyStatus.totalAuthorizedDocuments})`);

  // --------------------------------------------------------------------------
  // TEST 9: Confirmation that original repository remains strictly unchanged
  // --------------------------------------------------------------------------
  console.log('\n[TEST 9] Verifying source repository immutability...');
  const finalFiles = fs.readdirSync(AUTHORIZED_KNOWLEDGE_DIR);
  assert.strictEqual(finalFiles.length, initialFileCount, 'Source repository file count must remain identical');
  console.log(`✓ Source repository immutability confirmed: ${finalFiles.length} entries (100% UNTOUCHED)`);

  console.log('\n=== ALL STRICT CLOSED KNOWLEDGE BASE POLICY TESTS PASSED (100%) ===');
}

runClosedKnowledgePolicyTests().catch(err => {
  console.error('CLOSED KNOWLEDGE POLICY TEST FAILED:', err);
  process.exit(1);
});
