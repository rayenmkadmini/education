import { NextRequest, NextResponse } from 'next/server';
import { getDraftById, saveDraft } from '@/lib/server/draft-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const draft = await getDraftById(id);
    if (!draft) {
      return NextResponse.json({ success: false, error: `Brouillon introuvable: "${id}"` }, { status: 404 });
    }
    return NextResponse.json({ success: true, draft });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la lecture du brouillon.';
    const status = message.includes('Identifiant invalide') || message.includes('Path Traversal') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.draftId && body.draftId !== id) {
      return NextResponse.json({ success: false, error: 'Identifiant incohérent entre URL et payload.' }, { status: 400 });
    }
    body.draftId = id;
    const draft = await saveDraft(body);
    return NextResponse.json({ success: true, draft }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la mise à jour du brouillon.';
    const status = message.includes('Validation échouée') || message.includes('Identifiant invalide') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

