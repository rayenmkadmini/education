import { NextRequest, NextResponse } from 'next/server';
import { listReviews, submitReview } from '@/lib/server/review-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('draftId') || undefined;
    const reviews = await listReviews(draftId);
    return NextResponse.json({ success: true, reviews, count: reviews.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la lecture des révisions.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await submitReview(body);
    return NextResponse.json({ success: true, review: result.review, updatedDraftStatus: result.updatedDraftStatus }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de l\'enregistrement de la révision.';
    const status = message.includes('Validation échouée') || message.includes('Brouillon introuvable') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
