import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const summary = transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'INCOME') {
          acc.totalIncome += curr.amount;
          acc.balance += curr.amount;
        } else {
          acc.totalExpense += curr.amount;
          acc.balance -= curr.amount;
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
    const { title, amount, type, category } = body;

    if (!title || !amount || !type || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        category,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
