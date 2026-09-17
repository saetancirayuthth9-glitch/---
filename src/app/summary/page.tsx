"use client";

import { useState, useEffect } from "react";
import {
  FileBarChart,
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart,
  Wallet,
  Calendar,
  Layers
} from "lucide-react";

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
    const catName = tx.category?.name || "ทั่วไป";
    const amt = Number(tx.amount);
    if (tx.type === "INCOME") {
      incomeByCategory[catName] = (incomeByCategory[catName] || 0) + amt;
    } else {
      expenseByCategory[catName] = (expenseByCategory[catName] || 0) + amt;
    }
  });

  const totalVolume = summary.totalIncome + summary.totalExpense;
  const incomePercent = totalVolume > 0 ? Math.round((summary.totalIncome / totalVolume) * 100) : 0;
  const expensePercent = totalVolume > 0 ? 100 - incomePercent : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">สรุปรายงานเงินห้อง</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          รายงานสัดส่วนรายรับ-รายจ่าย และการกระจายตัวของงบประมาณสำหรับครูและเพื่อนในห้อง
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400 animate-pulse">
          กำลังประมวลผลรายงาน... ⏳
        </div>
      ) : (
        <>
          {/* Main Visual Ratio Bar */}
          <div className="bg-white rounded-3xl border border-violet-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-600" />
                <span>สัดส่วนรายรับ vs รายจ่าย</span>
              </h3>
              <span className="text-xs text-gray-400">คิดเป็นร้อยละจากยอดรวม</span>
            </div>

            {/* Proportion Bar */}
            <div className="space-y-2">
              <div className="h-6 sm:h-7 rounded-2xl bg-gray-100 overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${incomePercent}%` }}
                >
                  {incomePercent > 10 && `${incomePercent}%`}
                </div>
                <div
                  className="h-full bg-rose-500 transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ width: `${expensePercent}%` }}
                >
                  {expensePercent > 10 && `${expensePercent}%`}
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-1">ยอดเงินคงเหลือปัจจุบัน</p>
                <p className="text-2xl sm:text-3xl font-black text-violet-700">
                  ฿{summary.balance.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  รายรับรวม ({incomePercent}%)
                </p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                  ฿{summary.totalIncome.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                <p className="text-xs font-semibold text-rose-700 mb-1 flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  รายจ่ายรวม ({expensePercent}%)
                </p>
                <p className="text-2xl sm:text-3xl font-black text-rose-600">
                  ฿{summary.totalExpense.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown By Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Categories */}
            <div className="bg-white rounded-3xl border border-violet-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
                <span>รายรับแยกตามหมวดหมู่</span>
              </div>

              {Object.keys(incomeByCategory).length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">ยังไม่มีข้อมูลรายรับ</p>
              ) : (
                <div className="space-y-3 pt-2">
                  {Object.entries(incomeByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amt]) => {
                      const pct = summary.totalIncome > 0 ? Math.round((amt / summary.totalIncome) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-gray-700">{cat}</span>
                            <span className="font-bold text-emerald-600">
                              ฿{amt.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-emerald-50 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Expense Categories */}
            <div className="bg-white rounded-3xl border border-violet-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
                <ArrowDownCircle className="w-5 h-5 text-rose-500" />
                <span>รายจ่ายแยกตามหมวดหมู่</span>
              </div>

              {Object.keys(expenseByCategory).length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">ยังไม่มีข้อมูลรายจ่าย</p>
              ) : (
                <div className="space-y-3 pt-2">
                  {Object.entries(expenseByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amt]) => {
                      const pct = summary.totalExpense > 0 ? Math.round((amt / summary.totalExpense) * 100) : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="font-medium text-gray-700">{cat}</span>
                            <span className="font-bold text-rose-600">
                              ฿{amt.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-rose-50 overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Statistics Bar */}
          <div className="bg-white rounded-3xl border border-violet-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-600" />
              <span>สถิติภาพรวมการบันทึกข้อมูล</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-gray-50">
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-800">{transactions.length}</p>
                <p className="text-xs text-gray-400 mt-1">รายการทั้งหมด</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {transactions.filter((t) => t.type === "INCOME").length}
                </p>
                <p className="text-xs text-emerald-700 mt-1">รายการรายรับ</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50">
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                  {transactions.filter((t) => t.type === "EXPENSE").length}
                </p>
                <p className="text-xs text-rose-700 mt-1">รายการรายจ่าย</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-violet-50/50">
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-700">
                  {Object.keys(incomeByCategory).length + Object.keys(expenseByCategory).length}
                </p>
                <p className="text-xs text-violet-700 mt-1">หมวดหมู่ที่ใช้งาน</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
