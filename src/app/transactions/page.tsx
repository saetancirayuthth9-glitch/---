"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, FileText } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: { name: string };
  payer?: { full_name: string };
  creator: { full_name: string };
  receipt_url?: string;
  note?: string;
  transaction_date: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) setTransactions(data.transactions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchType = filterType === "ALL" || tx.type === filterType;
    const matchSearch =
      searchQuery === "" ||
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">รายการทั้งหมด</h1>
        <p className="text-gray-400 text-sm mt-1">ประวัติรายรับ-รายจ่ายทั้งหมดของห้อง</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหารายการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "INCOME", "EXPENSE"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filterType === t
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-violet-50"
              }`}
            >
              {t === "ALL" ? "ทั้งหมด" : t === "INCOME" ? "รายรับ" : "รายจ่าย"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>ไม่พบรายการที่ค้นหา</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">รายการ</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">หมวดหมู่</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ผู้จ่าย</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">วันที่</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">จำนวน</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">สลิป</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        tx.type === "INCOME" ? "bg-emerald-50" : "bg-rose-50"
                      }`}>
                        {tx.type === "INCOME" ? "💰" : "💸"}
                      </div>
                      <span className="font-medium text-gray-700 text-sm">{tx.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 text-xs font-medium">
                      {tx.category?.name || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tx.payer?.full_name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.transaction_date).toLocaleDateString("th-TH")}</td>
                  <td className={`px-6 py-4 text-right font-bold text-sm ${
                    tx.type === "INCOME" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tx.receipt_url ? (
                      <a href={tx.receipt_url} target="_blank" rel="noreferrer"
                        className="text-violet-500 hover:text-violet-700">
                        <FileText className="w-4 h-4 mx-auto" />
                      </a>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
