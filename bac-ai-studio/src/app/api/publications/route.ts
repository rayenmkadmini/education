import { NextRequest, NextResponse } from 'next/server';
import { listPublications, publishDraft } from '@/lib/server/publication-service';

export async function GET() {
  try {
    const publications = await listPublications();
    return NextResponse.json({ success: true, publications, count: publications.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la lecture des publications.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const publication = await publishDraft(body);
    return NextResponse.json({ success: true, publication }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la publication.';
    const status = message.includes('Refus d\'exportation') || message.includes('Brouillon introuvable') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
