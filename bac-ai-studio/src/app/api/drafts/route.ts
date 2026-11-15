import { NextRequest, NextResponse } from 'next/server';
import { listActiveDrafts, saveDraft } from '@/lib/server/draft-service';

export async function GET() {
  try {
    const drafts = await listActiveDrafts();
    return NextResponse.json({ success: true, drafts, count: drafts.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la récupération des brouillons.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const draft = await saveDraft(body);
    return NextResponse.json({ success: true, draft }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la sauvegarde du brouillon.';
    const status = message.includes('Validation échouée') || message.includes('Identifiant invalide') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
