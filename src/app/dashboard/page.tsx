"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  createdAt: string;
};

type Summary = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions);
      setSummary(data.summary);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Balance</h3>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">฿{summary.balance.toLocaleString()}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Income</h3>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-emerald-500">
              +฿{summary.totalIncome.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Expense</h3>
            <ArrowDownCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-rose-500">
              -฿{summary.totalExpense.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Transactions</h3>
          </div>
          <div className="p-6 pt-0">
            {loading ? (
              <p>Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <div className="space-y-8">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{tx.title}</p>
                      <p className="text-sm text-muted-foreground">{tx.category} • {new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`ml-auto font-medium ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-3 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Add Transaction</h3>
          </div>
          <div className="p-6 pt-0">
            <TransactionForm onSuccess={fetchTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
