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

    const devices = await prisma.device.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ devices });
  } catch (error) {
    console.error('Get devices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
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
    const { name, type, os, ipAddress, macAddress, location, notes } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const device = await prisma.device.create({
      data: {
        name,
        type,
        os: os || null,
        ipAddress: ipAddress || null,
        macAddress: macAddress || null,
        location: location || null,
        notes: notes || null,
        userId: (session.user as any).id,
        lastScan: new Date(),
        status: 'active',
      },
    });

    return NextResponse.json({ device }, { status: 201 });
  } catch (error) {
    console.error('Create device error:', error);
    return NextResponse.json(
      { error: 'Failed to create device' },
      { status: 500 }
    );
  }
}
