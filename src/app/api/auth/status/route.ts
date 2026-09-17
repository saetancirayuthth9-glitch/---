import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true, full_name: true, username: true }
    });

    const treasurer = await prisma.user.findFirst({
      where: { role: 'TREASURER' },
      select: { id: true, full_name: true, username: true }
    });

    return NextResponse.json({
      hasAdmin: Boolean(admin),
      adminName: admin?.full_name || null,
      hasTreasurer: Boolean(treasurer),
      treasurerName: treasurer?.full_name || null,
    });
  } catch (error) {
    console.error('Error fetching role status:', error);
    return NextResponse.json({
      hasAdmin: false,
      adminName: null,
      hasTreasurer: false,
      treasurerName: null,
    });
  }
}
