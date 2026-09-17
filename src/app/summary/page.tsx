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
      {/* Header Card with Framing */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#DCD6EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">สรุปรายงานเงินห้อง</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            รายงานสัดส่วนรายรับ-รายจ่าย และการกระจายตัวของงบประมาณสำหรับครูและเพื่อนในห้อง
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400 animate-pulse">
          กำลังประมวลผลรายงาน... ⏳
        </div>
      ) : (
        <>
          {/* Main Visual Ratio Card with Header Framing */}
          <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
            <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-600" />
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  สัดส่วนรายรับ vs รายจ่าย
                </h3>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200">
                คิดเป็นร้อยละ
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Proportion Bar */}
              <div className="space-y-2">
                <div className="h-7 sm:h-8 rounded-2xl bg-gray-100 overflow-hidden flex shadow-inner border-2 border-gray-200">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-bold"
                    style={{ width: `${incomePercent}%` }}
                  >
                    {incomePercent > 10 && `${incomePercent}%`}
                  </div>
                  <div
                    className="h-full bg-rose-500 transition-all duration-500 flex items-center justify-center text-xs text-white font-bold"
                    style={{ width: `${expensePercent}%` }}
                  >
                    {expensePercent > 10 && `${expensePercent}%`}
                  </div>
                </div>
              </div>

              {/* Metric Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-violet-50/70 border-2 border-violet-200 text-center">
                  <p className="text-xs font-bold text-violet-900 mb-1">ยอดเงินคงเหลือปัจจุบัน</p>
                  <p className="text-2xl sm:text-3xl font-black text-violet-700">
                    ฿{summary.balance.toLocaleString()}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 text-center">
                  <p className="text-xs font-bold text-emerald-900 mb-1 flex items-center justify-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    รายรับรวม ({incomePercent}%)
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                    ฿{summary.totalIncome.toLocaleString()}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-200 text-center">
                  <p className="text-xs font-bold text-rose-900 mb-1 flex items-center justify-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    รายจ่ายรวม ({expensePercent}%)
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-rose-600">
                    ฿{summary.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown By Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Categories Box */}
            <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm overflow-hidden">
              <div className="bg-emerald-50/70 border-b-2 border-emerald-200 p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
                  <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                  <span>รายรับแยกตามหมวดหมู่</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
                  {Object.keys(incomeByCategory).length} หมวด
                </span>
              </div>

              <div className="p-5 sm:p-6">
                {Object.keys(incomeByCategory).length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center font-medium">ยังไม่มีข้อมูลรายรับ</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(incomeByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, amt]) => {
                        const pct = summary.totalIncome > 0 ? Math.round((amt / summary.totalIncome) * 100) : 0;
                        return (
                          <div key={cat} className="space-y-1.5 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-gray-800">{cat}</span>
                              <span className="font-extrabold text-emerald-700">
                                ฿{amt.toLocaleString()} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-emerald-100 overflow-hidden">
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
            </div>

            {/* Expense Categories Box */}
            <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-sm overflow-hidden">
              <div className="bg-rose-50/70 border-b-2 border-rose-200 p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm sm:text-base">
                  <ArrowDownCircle className="w-5 h-5 text-rose-600" />
                  <span>รายจ่ายแยกตามหมวดหมู่</span>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-white px-2.5 py-1 rounded-xl border border-rose-200">
                  {Object.keys(expenseByCategory).length} หมวด
                </span>
              </div>

              <div className="p-5 sm:p-6">
                {Object.keys(expenseByCategory).length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center font-medium">ยังไม่มีข้อมูลรายจ่าย</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(expenseByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, amt]) => {
                        const pct = summary.totalExpense > 0 ? Math.round((amt / summary.totalExpense) * 100) : 0;
                        return (
                          <div key={cat} className="space-y-1.5 p-3 rounded-xl bg-rose-50/30 border border-rose-100">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span className="font-bold text-gray-800">{cat}</span>
                              <span className="font-extrabold text-rose-700">
                                ฿{amt.toLocaleString()} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-rose-100 overflow-hidden">
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
          </div>

          {/* Quick Statistics Framed Box */}
          <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
            <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-4 sm:p-5 flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                สถิติภาพรวมการบันทึกข้อมูล
              </h3>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200">
                  <p className="text-2xl sm:text-3xl font-black text-gray-800">{transactions.length}</p>
                  <p className="text-xs text-gray-500 font-bold mt-1">รายการทั้งหมด</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border-2 border-emerald-200">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {transactions.filter((t) => t.type === "INCOME").length}
                  </p>
                  <p className="text-xs text-emerald-800 font-bold mt-1">รายการรายรับ</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border-2 border-rose-200">
                  <p className="text-2xl sm:text-3xl font-black text-rose-600">
                    {transactions.filter((t) => t.type === "EXPENSE").length}
                  </p>
                  <p className="text-xs text-rose-800 font-bold mt-1">รายการรายจ่าย</p>
                </div>

                <div className="p-4 rounded-2xl bg-violet-50/60 border-2 border-violet-200">
                  <p className="text-2xl sm:text-3xl font-black text-violet-700">
                    {Object.keys(incomeByCategory).length + Object.keys(expenseByCategory).length}
                  </p>
                  <p className="text-xs text-violet-800 font-bold mt-1">หมวดหมู่ที่ใช้งาน</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
