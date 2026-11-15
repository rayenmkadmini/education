import { NextRequest, NextResponse } from 'next/server';
import { getTaskById } from '@/lib/server/task-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({ success: false, error: `Tâche introuvable: "${id}"` }, { status: 404 });
    }
    return NextResponse.json({ success: true, task });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la lecture de la tâche.';
    const status = message.includes('Identifiant invalide') || message.includes('Path Traversal') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
