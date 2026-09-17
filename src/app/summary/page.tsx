"use client";

import { useState, useEffect } from "react";
import { FileBarChart, ArrowUpCircle, ArrowDownCircle, Calendar } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: { name: string };
  transaction_date: string;
};

type Summary = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
};

export default function SummaryPage() {
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

  // Group by category
  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};

  transactions.forEach((tx) => {
    const catName = tx.category?.name || "อื่นๆ";
    if (tx.type === "INCOME") {
      incomeByCategory[catName] = (incomeByCategory[catName] || 0) + Number(tx.amount);
    } else {
      expenseByCategory[catName] = (expenseByCategory[catName] || 0) + Number(tx.amount);
    }
  });

  const incomePercent = summary.totalIncome + summary.totalExpense > 0
    ? Math.round((summary.totalIncome / (summary.totalIncome + summary.totalExpense)) * 100)
    : 0;
  const expensePercent = 100 - incomePercent;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">สรุปรายงาน</h1>
        <p className="text-gray-400 text-sm mt-1">สรุปภาพรวมรายรับ-รายจ่ายของห้อง</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">กำลังโหลด...</div>
      ) : (
        <>
          {/* Overview Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-semibold text-gray-700 mb-6">สัดส่วนรายรับ-รายจ่าย</h3>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex-1">
                <div className="h-6 rounded-full bg-gray-100 overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                    style={{ width: `${incomePercent}%` }}
                  />
                  <div
                    className="h-full bg-rose-400 rounded-r-full transition-all duration-500"
                    style={{ width: `${expensePercent}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">ยอดคงเหลือ</p>
                <p className="text-2xl font-bold text-violet-600">฿{summary.balance.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1 flex items-center justify-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> รายรับ ({incomePercent}%)
                </p>
                <p className="text-2xl font-bold text-emerald-500">฿{summary.totalIncome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1 flex items-center justify-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span> รายจ่าย ({expensePercent}%)
                </p>
                <p className="text-2xl font-bold text-rose-500">฿{summary.totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Income Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                รายรับแยกตามหมวดหมู่
              </h3>
              {Object.keys(incomeByCategory).length === 0 ? (
                <p className="text-gray-400 text-sm">ยังไม่มีข้อมูล</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(incomeByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amt]) => {
                      const pct = summary.totalIncome > 0 ? Math.round((amt / summary.totalIncome) * 100) : 0;
                      return (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{cat}</span>
                            <span className="text-sm font-semibold text-emerald-500">฿{amt.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-emerald-50 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Expense Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-rose-500" />
                รายจ่ายแยกตามหมวดหมู่
              </h3>
              {Object.keys(expenseByCategory).length === 0 ? (
                <p className="text-gray-400 text-sm">ยังไม่มีข้อมูล</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(expenseByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amt]) => {
                      const pct = summary.totalExpense > 0 ? Math.round((amt / summary.totalExpense) * 100) : 0;
                      return (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{cat}</span>
                            <span className="text-sm font-semibold text-rose-500">฿{amt.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-rose-50 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-violet-500" />
              สถิติรวม
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
                <p className="text-sm text-gray-400 mt-1">รายการทั้งหมด</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-500">{transactions.filter(t => t.type === "INCOME").length}</p>
                <p className="text-sm text-gray-400 mt-1">รายการรายรับ</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-rose-500">{transactions.filter(t => t.type === "EXPENSE").length}</p>
                <p className="text-sm text-gray-400 mt-1">รายการรายจ่าย</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-violet-600">{Object.keys(incomeByCategory).length + Object.keys(expenseByCategory).length}</p>
                <p className="text-sm text-gray-400 mt-1">หมวดหมู่ที่ใช้</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
