import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let users = await prisma.user.findMany({
      orderBy: { full_name: 'asc' },
    });

    // Auto-seed for demo purposes if empty
    if (users.length === 0) {
      const defaultUser = await prisma.user.create({
        data: {
          full_name: 'เหรัญญิก น่ารัก',
          student_no: '01',
          role: 'ADMIN',
        },
      });
      const memberUser = await prisma.user.create({
        data: {
          full_name: 'เพื่อน ร่วมห้อง',
          student_no: '02',
          role: 'MEMBER',
        },
      });
      users = [defaultUser, memberUser];
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
