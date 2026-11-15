import { NextRequest, NextResponse } from 'next/server';
import { 
  getKnowledgeCatalog, 
  scanAndIndexKnowledgeRepository,
  searchKnowledge,
  getIngestionHistory,
  retryFailedExtractions
} from '@/lib/server/knowledge-extractor';
import { DocumentClassification } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // If history requested
    if (searchParams.get('history') === 'true') {
      const history = await getIngestionHistory();
      return NextResponse.json({
        success: true,
        count: history.length,
        history
      });
    }

    const query = searchParams.get('q') || searchParams.get('query') || '';
    const subject = searchParams.get('subject') || undefined;
    const classification = (searchParams.get('classification') as DocumentClassification) || undefined;
    const academicYear = searchParams.get('academicYear') || undefined;
    const session = (searchParams.get('session') as 'PRINCIPALE' | 'CONTROLE' | 'PRATIQUE' | 'NON_APPLICABLE') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

    // If search parameters are provided, perform ranked multi-criteria search
    if (query || subject || classification || academicYear || session) {
      const results = await searchKnowledge({
        query,
        subject,
        classification,
        academicYear,
        session,
        limit
      });
      return NextResponse.json({
        success: true,
        count: results.length,
        results
      });
    }

    // Default: return complete catalog summary
    const catalog = await getKnowledgeCatalog();
    return NextResponse.json({
      success: true,
      catalog
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la lecture du catalogue' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body?.action || 'scan';

    if (action === 'history') {
      const history = await getIngestionHistory();
      return NextResponse.json({ success: true, history });
    }

    if (action === 'retry') {
      const retryResult = await retryFailedExtractions();
      const catalog = await getKnowledgeCatalog();
      return NextResponse.json({
        success: true,
        message: `Tentative de récupération terminée: ${retryResult.recovered}/${retryResult.attempted} fichiers réparés.`,
        retryResult,
        catalog
      });
    }

    const forceRescan = body?.force === true;
    const catalog = await scanAndIndexKnowledgeRepository(forceRescan, 'API_TRIGGER');
    
    return NextResponse.json({
      success: true,
      message: forceRescan ? 'Réindexation complète effectuée avec succès.' : 'Synchronisation incrémentale terminée.',
      catalog
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur lors de la synchronisation du catalogue' },
      { status: 500 }
    );
  }
}
