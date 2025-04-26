import { NextResponse } from 'next/server';
import { ARBITRUM_TOKENS } from '@/src/lib/tokens';

export async function GET() {
  return NextResponse.json(ARBITRUM_TOKENS);
}