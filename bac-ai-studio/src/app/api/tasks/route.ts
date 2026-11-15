import { NextRequest, NextResponse } from 'next/server';
import { createTask, listPendingTasks } from '@/lib/server/task-service';

export async function GET() {
  try {
    const tasks = await listPendingTasks();
    return NextResponse.json({ success: true, tasks, count: tasks.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la récupération des tâches.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createTask(body);
    return NextResponse.json({ success: true, task: result.task, promptMarkdown: result.promptMarkdown }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne lors de la création de la tâche.';
    const status = message.includes('Validation échouée') || message.includes('Identifiant invalide') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
