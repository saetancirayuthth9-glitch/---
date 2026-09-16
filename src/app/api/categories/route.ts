import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Auto-seed for demo purposes if empty
    if (categories.length === 0) {
      await prisma.category.createMany({
        data: [
          { name: 'เงินกองกลางรายเดือน', type: 'INCOME' },
          { name: 'ค่าถ่ายเอกสาร', type: 'EXPENSE' },
          { name: 'ค่าจัดบอร์ด', type: 'EXPENSE' },
          { name: 'รายรับอื่นๆ', type: 'INCOME' },
        ],
      });
      categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
