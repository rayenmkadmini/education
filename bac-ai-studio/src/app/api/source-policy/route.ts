import { NextResponse } from 'next/server';
import { getSourcePolicyStatus } from '@/lib/server/source-policy-service';

export async function GET() {
  try {
    const policyStatus = await getSourcePolicyStatus();
    return NextResponse.json({
      success: true,
      policy: policyStatus
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la vérification de la politique de source fermée.'
    }, { status: 500 });
  }
}
