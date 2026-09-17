import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { transaction_date: 'desc' },
      include: {
        category: true,
        payer: true,
        creator: true,
      }
    });

    const summary = transactions.reduce(
      (acc, curr) => {
        const amount = Number(curr.amount);
        if (curr.type === 'INCOME') {
          acc.totalIncome += amount;
          acc.balance += amount;
        } else {
          acc.totalExpense += amount;
          acc.balance -= amount;
        }
        return acc;
      },
      { balance: 0, totalIncome: 0, totalExpense: 0 }
    );

    return NextResponse.json({ transactions, summary });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, type, category_id, created_by, payer_id, note, receipt_url, transaction_date } = body;

    if (!title || !amount || !type || !category_id) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อรายการ, จำนวนเงิน, ประเภท, หมวดหมู่)' }, { status: 400 });
    }

    // Resolve creator ID
    let creatorId = created_by;
    if (!creatorId) {
      const manager = await prisma.user.findFirst({
        where: { role: { in: ['ADMIN', 'TREASURER'] } },
      });
      if (manager) {
        creatorId = manager.id;
      } else {
        const fallbackUser = await prisma.user.create({
          data: {
            full_name: 'เหรัญญิกห้องเรียน',
            role: 'TREASURER',
            student_no: 'เหรัญญิก',
          }
        });
        creatorId = fallbackUser.id;
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        title: title.trim(),
        amount: parseFloat(amount),
        type,
        category_id,
        created_by: creatorId,
        payer_id: payer_id || null,
        note: note ? note.trim() : null,
        receipt_url: receipt_url ? receipt_url.trim() : null,
        transaction_date: transaction_date ? new Date(transaction_date) : new Date(),
      },
      include: {
        category: true,
        payer: true,
        creator: true,
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกรายการ' }, { status: 500 });
  }
}
