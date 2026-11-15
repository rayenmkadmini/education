import { NextRequest, NextResponse } from 'next/server';
import { getExtractedDocumentContent } from '@/lib/server/knowledge-extractor';
import { sanitizeId } from '@/lib/server/path-security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sanitizedId = sanitizeId(id);
    const extracted = await getExtractedDocumentContent(sanitizedId);

    if (!extracted) {
      return NextResponse.json(
        { success: false, error: `Document extrait introuvable pour l'identifiant "${id}"` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      extracted
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur de lecture du document' },
      { status: 500 }
    );
  }
}
