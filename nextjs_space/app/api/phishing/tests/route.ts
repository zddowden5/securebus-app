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

    const tests = await prisma.phishingTest.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Get phishing tests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phishing tests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, targetEmail, testType } = body;

    if (!subject || !targetEmail || !testType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const test = await prisma.phishingTest.create({
      data: {
        userId: (session.user as any).id,
        subject,
        targetEmail,
        testType,
        status: 'draft',
      },
    });

    return NextResponse.json({ test }, { status: 201 });
  } catch (error) {
    console.error('Create phishing test error:', error);
    return NextResponse.json(
      { error: 'Failed to create phishing test' },
      { status: 500 }
    );
  }
}
