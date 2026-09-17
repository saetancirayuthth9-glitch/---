"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  PlusCircle,
  Clock,
  FileText,
  ShieldCheck,
  Eye,
  ChevronRight,
  Sparkles
} from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: { name: string };
  payer?: { full_name: string };
  creator: { full_name: string; role: string };
  transaction_date: string;
  receipt_url?: string;
};

type Summary = {
  balance: number;
  totalIncome: number;
  totalExpense: number;
};

export default function Dashboard() {
  const { user, canManage, isAdmin, isTreasurer } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ balance: 0, totalIncome: 0, totalExpense: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.transactions) setTransactions(data.transactions);
      if (data.summary) setSummary(data.summary);
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome / Title Card with Distinct Framing */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#DCD6EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">แดชบอร์ดเงินกองกลาง</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
              isAdmin
                ? "bg-violet-50 text-violet-700 border-violet-200"
                : isTreasurer
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}>
              {isAdmin ? "🎓 อาจารย์ที่ปรึกษา" : isTreasurer ? "💼 เหรัญญิกห้อง" : "👀 โหมดดูอย่างเดียว"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            ยินดีต้อนรับคุณ <strong className="text-violet-700">{user?.full_name || "นักเรียน / ผู้เข้าชม"}</strong> • ตรวจสอบความเคลื่อนไหวเงินห้องได้ตลอด 24 ชม.
          </p>
        </div>

        {canManage ? (
          <Link
            href="/transactions/add"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-md shadow-violet-200 border-2 border-violet-500 active:scale-95 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ บันทึกรายการใหม่</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50/80 px-3.5 py-2.5 rounded-2xl border-2 border-violet-200 self-start sm:self-auto">
            <Eye className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span>ข้อมูลโปร่งใส อัปเดตเรียลไทม์</span>
          </div>
        )}
      </div>

      {/* 3 Summary Cards - Strongly Framed */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 border-2 border-violet-400 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-bold text-violet-100 uppercase tracking-wider">
              ยอดเงินคงเหลือสุทธิ
            </span>
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              ฿{summary.balance.toLocaleString()}
            </div>
            <p className="text-xs text-violet-200 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ยอดเงินพร้อมใช้งานในกองกลาง</span>
            </p>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider">
              ยอดรับรวมทั้งหมด
            </span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              +฿{summary.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-600/70 mt-2 font-medium">
              เงินกองกลางและเงินสนับสนุน
            </p>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-bold text-rose-700 uppercase tracking-wider">
              ยอดจ่ายรวมทั้งหมด
            </span>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <ArrowDownCircle className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              -฿{summary.totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-rose-600/70 mt-2 font-medium">
              ค่ากิจกรรม อุปกรณ์ และของใช้
            </p>
          </div>
        </div>
      </div>

      {/* Role Notice for Students */}
      {!canManage && (
        <div className="p-4 rounded-3xl bg-violet-50 border-2 border-violet-200 text-violet-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-violet-950">โหมดนักเรียน (ดูข้อมูลได้อย่างเดียว)</p>
            <p className="text-violet-800 text-xs leading-relaxed">
              คุณสามารถตรวจสอบประวัติการเงิน สลิปการโอน และยอดคงเหลือได้ตลอดเวลา หากต้องการบันทึกรายการ กรุณาแจ้งเหรัญญิกหรืออาจารย์ที่ปรึกษาครับ
            </p>
          </div>
        </div>
      )}

      {/* Recent Transactions Box with Distinct Header and Rows */}
      <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
        {/* Box Header */}
        <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-5 sm:p-6 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">ประวัติรายการล่าสุด</h3>
            <p className="text-xs text-gray-500 mt-0.5">รายการรับ-จ่ายที่บันทึก 5 รายการล่าสุด</p>
          </div>
          <Link
            href="/transactions"
            className="text-xs sm:text-sm font-bold text-violet-600 hover:text-violet-800 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200"
          >
            <span>ดูทั้งหมด ({transactions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Box Content */}
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400 animate-pulse">
            กำลังโหลดข้อมูลเงินห้อง... ⏳
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-400 flex items-center justify-center mx-auto text-2xl border-2 border-violet-100">
              📭
            </div>
            <p className="text-base font-bold text-gray-700">ยังไม่มีรายการบันทึกในขณะนี้</p>
            {canManage && (
              <Link
                href="/transactions/add"
                className="inline-block text-xs font-bold text-violet-600 hover:underline"
              >
                คลิกที่นี่เพื่อเริ่มบันทึกรายการแรก
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-100">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-violet-50/40 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 border-2 ${
                    tx.type === "INCOME" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
                  }`}>
                    {tx.type === "INCOME" ? "💰" : "💸"}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm sm:text-base">{tx.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-bold border border-gray-200">
                        {tx.category?.name || "ทั่วไป"}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(tx.transaction_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {tx.payer && (
                        <span className="text-violet-700 font-semibold bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100">
                          ผู้จ่าย: {tx.payer.full_name}
                        </span>
                      )}
                      {tx.receipt_url && (
                        <a
                          href={tx.receipt_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-violet-600 hover:underline font-bold bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          ดูสลิป
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right pl-14 sm:pl-0">
                  <span className={`text-base sm:text-xl font-black ${
                    tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    บันทึกโดย: {tx.creator?.full_name || "เหรัญญิก"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
