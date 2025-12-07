import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const partners = await prisma.securityPartner.findMany({
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json({ partners });
  } catch (error) {
    console.error('Get security partners error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security partners' },
      { status: 500 }
    );
  }
}
