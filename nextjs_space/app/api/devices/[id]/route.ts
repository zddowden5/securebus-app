import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const device = await prisma.device.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    return NextResponse.json({ device });
  } catch (error) {
    console.error('Get device error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch device' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, os, ipAddress, macAddress, location, notes, status } = body;

    const device = await prisma.device.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const updatedDevice = await prisma.device.update({
      where: { id: params.id },
      data: {
        name: name ?? device.name,
        type: type ?? device.type,
        os: os ?? device.os,
        ipAddress: ipAddress ?? device.ipAddress,
        macAddress: macAddress ?? device.macAddress,
        location: location ?? device.location,
        notes: notes ?? device.notes,
        status: status ?? device.status,
      },
    });

    return NextResponse.json({ device: updatedDevice });
  } catch (error) {
    console.error('Update device error:', error);
    return NextResponse.json(
      { error: 'Failed to update device' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const device = await prisma.device.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    await prisma.device.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete device error:', error);
    return NextResponse.json(
      { error: 'Failed to delete device' },
      { status: 500 }
    );
  }
}
