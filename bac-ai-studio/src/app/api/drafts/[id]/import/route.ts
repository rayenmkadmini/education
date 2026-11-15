import { NextRequest, NextResponse } from 'next/server';
import { importDraft } from '@/lib/server/draft-service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Enforce matching ID if provided
    if (body.draftId && body.draftId !== id) {
      return NextResponse.json({ 
        success: false, 
        error: `Incohérence d'identifiant: l'URL cible "${id}" ne correspond pas au champ draftId "${body.draftId}".` 
      }, { status: 400 });
    }

    body.draftId = id;
    const imported = await importDraft(body);
    return NextResponse.json({ success: true, draft: imported }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de l\'importation du brouillon.';
    const status = message.includes('Validation échouée') || message.includes('Identifiant invalide') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
