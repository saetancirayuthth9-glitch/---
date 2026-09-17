"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Search,
  Filter,
  FileText,
  PlusCircle,
  Clock,
  User,
  Tag
} from "lucide-react";

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
  const { canManage } = useAuth();
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
    const q = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === "" ||
      tx.title.toLowerCase().includes(q) ||
      tx.category?.name.toLowerCase().includes(q) ||
      tx.payer?.full_name.toLowerCase().includes(q) ||
      (tx.note && tx.note.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card with Framing */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#DCD6EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">ประวัติการเงินทั้งหมด</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            รายการรับ-จ่ายทั้งหมดของห้องเรียน ข้อมูลโปร่งใสทุกคนสามารถตรวจสอบได้
          </p>
        </div>

        {canManage && (
          <Link
            href="/transactions/add"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-md shadow-violet-200 border-2 border-violet-500 active:scale-95 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ บันทึกรายการใหม่</span>
          </Link>
        )}
      </div>

      {/* Search and Filters with Distinct Framing */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-[#DCD6EE] shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อรายการ, หมวดหมู่, หรือชื่อผู้จ่าย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-[#DCD6EE] rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-600 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filter Type Buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border-2 border-gray-200 self-start sm:self-auto">
          {(["ALL", "INCOME", "EXPENSE"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filterType === t
                  ? "bg-white text-violet-700 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t === "ALL" ? "ทั้งหมด" : t === "INCOME" ? "💰 รายรับ" : "💸 รายจ่าย"}
            </button>
          ))}
        </div>
      </div>

      {/* Main List: Framed Table for Desktop & Framed Cards for Mobile */}
      <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400 animate-pulse">
            กำลังโหลดข้อมูลรายการ... ⏳
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-base font-bold text-gray-700">ไม่พบรายการที่ตรงกับการค้นหา</p>
            <p className="text-xs text-gray-400">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรอง "ทั้งหมด"</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-[#EAE6F4] bg-[#FAF9FD] text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <th className="px-6 py-4">รายการ</th>
                    <th className="px-6 py-4">หมวดหมู่</th>
                    <th className="px-6 py-4">ผู้จ่ายเงิน</th>
                    <th className="px-6 py-4">วันที่ทำรายการ</th>
                    <th className="px-6 py-4 text-right">จำนวนเงิน</th>
                    <th className="px-6 py-4 text-center">หลักฐานสลิป</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100 text-sm">
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-violet-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 border ${
                            tx.type === "INCOME" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}>
                            {tx.type === "INCOME" ? "💰" : "💸"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{tx.title}</p>
                            {tx.note && <p className="text-xs text-gray-400 mt-0.5">{tx.note}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold border border-violet-200">
                          {tx.category?.name || "ทั่วไป"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {tx.payer?.full_name ? (
                          <span className="font-bold text-gray-800">{tx.payer.full_name}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">- เงินส่วนรวม -</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-medium">
                        {new Date(tx.transaction_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className={`px-6 py-4 text-right font-black text-base ${
                        tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {tx.receipt_url ? (
                          <a
                            href={tx.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl border border-violet-200 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>ดูสลิป</span>
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Visible on mobile only) */}
            <div className="md:hidden p-4 space-y-3">
              {filtered.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl border-2 border-[#EAE6F4] bg-white shadow-sm space-y-3 hover:border-violet-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${
                        tx.type === "INCOME" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}>
                        {tx.type === "INCOME" ? "💰" : "💸"}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{tx.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                          {new Date(tx.transaction_date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-base font-black block ${
                        tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 font-bold border border-violet-100">
                        {tx.category?.name || "ทั่วไป"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-gray-500 border-t border-gray-100 font-medium">
                    <div>
                      {tx.payer?.full_name ? (
                        <span>ผู้จ่าย: <strong className="text-gray-800">{tx.payer.full_name}</strong></span>
                      ) : (
                        <span className="text-gray-400">- เงินส่วนรวม -</span>
                      )}
                    </div>

                    {tx.receipt_url && (
                      <a
                        href={tx.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-violet-600 font-bold text-xs bg-violet-50 px-2 py-1 rounded-lg border border-violet-100"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        ดูสลิปโอนเงิน
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
