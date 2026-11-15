import { NextRequest, NextResponse } from 'next/server';
import { BAC_SI_CURRICULUM } from '@/lib/curriculum-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subject');

    if (subjectId) {
      const subject = BAC_SI_CURRICULUM.find(s => s.id === subjectId);
      if (!subject) {
        return NextResponse.json(
          { success: false, error: `Matière non trouvée : "${subjectId}"` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, subject });
    }

    return NextResponse.json({
      success: true,
      totalSubjects: BAC_SI_CURRICULUM.length,
      curriculum: BAC_SI_CURRICULUM
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur serveur curriculum' },
      { status: 500 }
    );
  }
}
