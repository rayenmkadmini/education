import { scanAndIndexKnowledgeRepository, searchKnowledge } from '../src/lib/server/knowledge-extractor';
import { CATALOG_FILE_PATH } from '../src/lib/server/knowledge-extractor';
import fs from 'fs';

async function main() {
  console.log('=== BAC AI TUNISIA — INCREMENTAL KNOWLEDGE INGESTION ===\n');

  // Check previous catalog
  let prevCount = 0;
  if (fs.existsSync(CATALOG_FILE_PATH)) {
    const prevCat = JSON.parse(fs.readFileSync(CATALOG_FILE_PATH, 'utf8'));
    prevCount = prevCat.totalDocuments || prevCat.documents?.length || 0;
    console.log(`Previous catalog state: ${prevCount} indexed documents.`);
  } else {
    console.log('No prior catalog found on disk.');
  }

  const t0 = Date.now();
  console.log('\nStarting incremental scanning and multi-format extraction...\n');
  const catalog = await scanAndIndexKnowledgeRepository(false);
  const durationSec = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`\n=== INGESTION FINISHED IN ${durationSec}s ===\n`);
  console.log(`Total indexed documents: ${catalog.totalDocuments}`);
  console.log(`New documents added: ${catalog.totalDocuments - prevCount}`);

  console.log('\nClassifications Breakdown:');
  console.table(catalog.byClassification);

  console.log('\nSubjects Breakdown:');
  console.table(catalog.bySubject);

  console.log('\nExtraction Status Breakdown:');
  console.table(catalog.byStatus);

  // Verification searches
  console.log('\n=== REAL SEARCH VERIFICATION TESTS ===\n');

  const testQueries = [
    { name: 'Algorithmique & Python', query: 'Algorithmique Python' },
    { name: 'Bases de Données & SQL', query: 'SQL' },
    { name: 'Bac Pratique Examens', query: 'Bac pratique' },
    { name: 'Fichiers Binaires & Textes', query: 'fichiers binaires' },
    { name: 'Anglais Writing & Grammar', query: 'Anglais writing' }
  ];

  for (const t of testQueries) {
    const results = await searchKnowledge({ query: t.query, limit: 3 });
    console.log(`Query "${t.name}" ("${t.query}") -> Found ${results.length} matches:`);
    for (const r of results) {
      console.log(`  - [Score ${r.relevanceScore}] ${r.document.path || r.document.filename} (${r.document.subject} • ${r.document.classification})`);
      if (r.matchedSnippets[0]) {
        console.log(`    Snippet: "${r.matchedSnippets[0].substring(0, 100).replace(/\s+/g, ' ')}..."`);
      }
    }
    console.log('');
  }
}

main().catch(err => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});
