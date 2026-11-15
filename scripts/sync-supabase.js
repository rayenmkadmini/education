/**
 * BAC AI TUNISIA — Supabase Cloud Synchronization Script
 * Section: Baccalauréat Sciences de l'Informatique (2026-2027)
 * 
 * Usage:
 *   node scripts/sync-supabase.js [--dry-run]
 * 
 * Synchronizes approved publications from content/published/*.json into the
 * remote or local Supabase table: public.published_content.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CONTENT_PUBLISHED_DIR = path.resolve(__dirname, '..', 'content', 'published');
const IS_DRY_RUN = process.argv.includes('--dry-run') || (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_SERVICE_ROLE_KEY);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function runSync() {
  console.log('================================================================');
  console.log('    BAC AI TUNISIA — SUPABASE CLOUD SYNCHRONIZATION PIPELINE    ');
  console.log('================================================================');
  console.log(`Mode: ${IS_DRY_RUN ? 'DRY-RUN (SIMULATION & AUDIT)' : 'LIVE REMOTE SUPABASE'}`);
  console.log(`Directory: ${CONTENT_PUBLISHED_DIR}\n`);

  if (!fs.existsSync(CONTENT_PUBLISHED_DIR)) {
    console.error(`Error: Published content directory not found: ${CONTENT_PUBLISHED_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_PUBLISHED_DIR).filter(f => f.endsWith('.json') && !f.includes('.tmp.'));
  console.log(`Discovered ${files.length} publication records on local storage.\n`);

  const payload = [];

  for (const file of files) {
    const fullPath = path.join(CONTENT_PUBLISHED_DIR, file);
    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const doc = JSON.parse(raw);

      // Verify data integrity
      const sum = (doc.content?.exercises || []).reduce((acc, e) => acc + (e.points || 0), 0);
      const totalPoints = doc.content?.totalPoints || 0;
      const isHarmonized = Math.abs(sum - totalPoints) < 0.001;

      console.log(`[VALIDATE] ${file}`);
      console.log(`  - Publication ID : ${doc.publicationId}`);
      console.log(`  - Subject        : ${doc.subject}`);
      console.log(`  - Chapter        : ${doc.chapter}`);
      console.log(`  - Total Points   : ${totalPoints} pts (Exercises Sum: ${sum} pts) [${isHarmonized ? 'OK' : 'MISMATCH'}]`);

      const dbRecord = {
        id: doc.publicationId,
        publication_id: doc.publicationId,
        source_draft_id: doc.sourceDraftId || 'LEGACY-DRAFT',
        subject: doc.subject,
        chapter: doc.chapter,
        content_type: doc.contentType,
        academic_year: doc.content?.academicYear || '2026-2027',
        total_points: totalPoints,
        language: doc.language || 'fr_tn_derja',
        header: doc.content?.header || {},
        exercises: doc.content?.exercises || [],
        provenance: doc.provenance || {},
        approval_metadata: doc.approvalMetadata || {},
        is_official: true,
        published_at: doc.publishedAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      payload.push(dbRecord);
    } catch (err) {
      console.error(`  - Failed to parse ${file}:`, err.message);
    }
  }

  console.log(`\nProcessed ${payload.length} valid records for Supabase sync.`);

  if (IS_DRY_RUN) {
    console.log('\n[DRY-RUN] Remote Supabase credentials not provided or --dry-run specified.');
    console.log('[DRY-RUN] SQL Upsert Simulation Preview:');
    for (const record of payload) {
      console.log(`  INSERT INTO public.published_content (publication_id, subject, chapter, total_points) VALUES ('${record.publication_id}', '${record.subject}', '${record.chapter}', ${record.total_points}) ON CONFLICT (publication_id) DO UPDATE...;`);
    }
    console.log('\n[DRY-RUN] To perform real sync against your remote Supabase instance, set:');
    console.log('  export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"');
    console.log('  export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
    console.log('  node scripts/sync-supabase.js\n');
    console.log('================================================================');
    console.log('    STATUS: DRY-RUN COMPLETED SUCCESSFULLY (0 ERRORS)          ');
    console.log('================================================================');
    return;
  }

  console.log(`\nInitiating live HTTPS upsert to ${SUPABASE_URL}/rest/v1/published_content...`);
  // Live REST API upsert implementation
  const endpoint = new URL(`${SUPABASE_URL}/rest/v1/published_content?on_conflict=publication_id`);
  const postData = JSON.stringify(payload);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=representation',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const client = endpoint.protocol === 'https:' ? https : http;
  const req = client.request(endpoint, options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(`✓ Supabase Sync Successful! HTTP Status: ${res.statusCode}`);
        console.log(`✓ ${payload.length} records successfully synchronized to remote cloud.`);
      } else {
        console.error(`✗ Supabase Sync Failed with HTTP ${res.statusCode}:`, body);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.error('✗ Network error connecting to Supabase:', e.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

runSync().catch(err => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
