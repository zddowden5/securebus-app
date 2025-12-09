import { NextResponse } from 'next/server';

// TEMPORARY DIAGNOSTIC ENDPOINT - REMOVE AFTER DEBUGGING
export const dynamic = 'force-dynamic';

export async function GET() {
  const envCheck = {
    NEXTAUTH_URL: {
      value: process.env.NEXTAUTH_URL || 'NOT_SET',
      length: process.env.NEXTAUTH_URL?.length || 0,
      hasTrailingSlash: process.env.NEXTAUTH_URL?.endsWith('/') || false,
    },
    NEXTAUTH_SECRET: {
      value: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT_SET',
      length: process.env.NEXTAUTH_SECRET?.length || 0,
    },
    DATABASE_URL: {
      value: process.env.DATABASE_URL ? 'SET (hidden)' : 'NOT_SET',
      hasConnection: process.env.DATABASE_URL?.includes('postgresql://') || false,
    },
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
  };

  return NextResponse.json(envCheck);
}
