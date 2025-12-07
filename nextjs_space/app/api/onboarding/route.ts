import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      industryType,
      companySize,
      currentSecurity,
      primaryConcerns,
      dataTypes,
      complianceRequirements,
      budget,
      hasITStaff,
    } = body;

    if (!industryType || !companySize) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const survey = await prisma.onboardingSurvey.create({
      data: {
        userId: (session.user as any).id,
        industryType,
        companySize,
        currentSecurity: currentSecurity || [],
        primaryConcerns: primaryConcerns || [],
        dataTypes: dataTypes || [],
        complianceRequirements: complianceRequirements || [],
        budget: budget || null,
        hasITStaff: hasITStaff || false,
      },
    });

    return NextResponse.json({ survey }, { status: 201 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to submit onboarding survey' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const survey = await prisma.onboardingSurvey.findUnique({
      where: { userId: (session.user as any).id },
    });

    return NextResponse.json({ survey });
  } catch (error) {
    console.error('Get onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding survey' },
      { status: 500 }
    );
  }
}
