"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp, PlusCircle } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: { name: string };
  payer?: { full_name: string };
  creator: { full_name: string };
  transaction_date: string;
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

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTransactions(data.transactions);
        if (data.summary) setSummary(data.summary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h1>
          <p className="text-gray-400 text-sm mt-1">ภาพรวมเงินกองกลางห้อง</p>
        </div>
        <Link
          href="/transactions/add"
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors shadow-md shadow-violet-200"
        >
          <PlusCircle className="w-4 h-4" />
          เพิ่มรายการ
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-violet-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-violet-200 text-sm font-medium">ยอดคงเหลือ</p>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">฿{summary.balance.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-1 text-violet-200 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>ข้อมูลล่าสุด</span>
          </div>
        </div>

        {/* Income */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-medium">รายรับรวม</p>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">฿{summary.totalIncome.toLocaleString()}</p>
          <p className="mt-3 text-xs text-emerald-500 font-medium">+ รายรับทั้งหมด</p>
        </div>

        {/* Expense */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-medium">รายจ่ายรวม</p>
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">฿{summary.totalExpense.toLocaleString()}</p>
          <p className="mt-3 text-xs text-rose-500 font-medium">- รายจ่ายทั้งหมด</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800">รายการล่าสุด</h3>
          <Link href="/transactions" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p>ยังไม่มีรายการ</p>
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    tx.type === "INCOME" ? "bg-emerald-50" : "bg-rose-50"
                  }`}>
                    {tx.type === "INCOME" ? "💰" : "💸"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{tx.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.category?.name} • {new Date(tx.transaction_date).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${tx.type === "INCOME" ? "text-emerald-500" : "text-rose-500"}`}>
                  {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
