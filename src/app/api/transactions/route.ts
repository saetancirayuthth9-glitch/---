import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const { title, amount, type, category_id, created_by, payer_id, note, receipt_url } = body;

    if (!title || !amount || !type || !category_id || !created_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        category_id,
        created_by,
        payer_id: payer_id || null,
        note: note || null,
        receipt_url: receipt_url || null,
      },
      include: {
        category: true,
        payer: true,
      }
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
