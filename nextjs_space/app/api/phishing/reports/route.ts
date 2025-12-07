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

    const reports = await prisma.phishingReport.findMany({
      orderBy: { createdAt: 'asc' },
      take: 12,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get phishing reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phishing reports' },
      { status: 500 }
    );
  }
}
