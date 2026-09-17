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
  ChevronRight
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
      {/* Top Welcome / Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-violet-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">แดชบอร์ดเงินกองกลาง</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              isAdmin
                ? "bg-violet-100 text-violet-700"
                : isTreasurer
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {isAdmin ? "อาจารย์ที่ปรึกษา" : isTreasurer ? "เหรัญญิก" : "โหมดดูอย่างเดียว"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ยินดีต้อนรับคุณ <strong className="text-gray-700">{user?.full_name || "นักเรียน / ผู้เข้าชม"}</strong> • ตรวจสอบความเคลื่อนไหวเงินห้องได้ตลอด 24 ชม.
          </p>
        </div>

        {canManage ? (
          <Link
            href="/transactions/add"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-md shadow-violet-200 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ บันทึกรายการใหม่</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-xs text-violet-700 bg-violet-50 px-3.5 py-2.5 rounded-xl border border-violet-100 self-start sm:self-auto">
            <Eye className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span>ข้อมูลโปร่งใส อัปเดตล่าสุดเรียลไทม์</span>
          </div>
        )}
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-medium text-violet-100 uppercase tracking-wider">
              ยอดเงินคงเหลือสุทธิ
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ฿{summary.balance.toLocaleString()}
            </div>
            <p className="text-xs text-violet-200 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>เงินพร้อมใช้สำหรับกิจกรรมห้อง</span>
            </p>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              ยอดรับทั้งหมด
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              +฿{summary.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              เงินกองกลางและเงินสมทบ
            </p>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
              ยอดจ่ายทั้งหมด
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
              -฿{summary.totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ค่ากิจกรรม เอกสาร และของใช้
            </p>
          </div>
        </div>
      </div>

      {/* Role Notice for Students */}
      {!canManage && (
        <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-200 text-violet-900 text-xs sm:text-sm flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">โหมดนักเรียน (ดูข้อมูลได้อย่างเดียว)</p>
            <p className="text-violet-700 text-xs">
              คุณสามารถตรวจสอบประวัติการเงิน สลิปการโอน และยอดคงเหลือได้ตลอดเวลา หากต้องการบันทึกข้อมูล กรุณาให้เหรัญญิกหรืออาจารย์ที่ปรึกษาเป็นผู้บันทึกครับ
            </p>
          </div>
        </div>
      )}

      {/* Recent Transactions List */}
      <div className="bg-white rounded-3xl border border-violet-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">ประวัติรายการล่าสุด</h3>
            <p className="text-xs text-gray-400 mt-0.5">รายการรับ-จ่ายที่บันทึก 5 รายการล่าสุด</p>
          </div>
          <Link
            href="/transactions"
            className="text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 inline-flex items-center gap-1"
          >
            <span>ดูทั้งหมด ({transactions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400 animate-pulse">
            กำลังโหลดข้อมูลเงินห้อง... ⏳
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="p-10 text-center text-gray-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-400 flex items-center justify-center mx-auto text-xl">
              📭
            </div>
            <p className="text-sm font-medium text-gray-600">ยังไม่มีรายการบันทึกในขณะนี้</p>
            {canManage && (
              <Link
                href="/transactions/add"
                className="inline-block text-xs font-semibold text-violet-600 hover:underline"
              >
                คลิกที่นี่เพื่อเริ่มบันทึกรายการแรก
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-violet-50/30 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${
                    tx.type === "INCOME" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {tx.type === "INCOME" ? "💰" : "💸"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{tx.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-medium">
                        {tx.category?.name || "ทั่วไป"}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(tx.transaction_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {tx.payer && (
                        <span className="text-violet-600 font-medium">
                          • ผู้จ่าย: {tx.payer.full_name}
                        </span>
                      )}
                      {tx.receipt_url && (
                        <a
                          href={tx.receipt_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-violet-600 hover:underline font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          ดูสลิป
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right pl-14 sm:pl-0">
                  <span className={`text-base sm:text-lg font-black ${
                    tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {tx.type === "INCOME" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-gray-400">
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
