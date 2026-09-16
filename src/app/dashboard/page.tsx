"use client";

import { useState, useEffect } from "react";
import TransactionForm from "@/components/TransactionForm";
import { ArrowDownCircle, ArrowUpCircle, Wallet, FileText, CheckCircle2 } from "lucide-react";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: { name: string };
  payer?: { full_name: string };
  creator: { full_name: string };
  receipt_url?: string;
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

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      
      if (res.ok) {
        setTransactions(data.transactions || []);
        setSummary(data.summary || { balance: 0, totalIncome: 0, totalExpense: 0 });
      } else {
        console.error("API Error:", data.error);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-pink-600 tracking-wider drop-shadow-sm">สรุปยอดเงินห้อง 🌟</h2>
        <p className="text-pink-400">มาดูกันว่าเงินกองกลางเราเหลือเท่าไหร่แล้ว~</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border-4 border-white bg-pink-100 cartoon-shadow p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-pink-200 opacity-50">
            <Wallet className="w-32 h-32" />
          </div>
          <h3 className="text-pink-500 font-bold mb-2 relative z-10 text-lg">ยอดคงเหลือ 🌸</h3>
          <div className="text-4xl font-black text-pink-600 relative z-10">
            ฿{summary.balance.toLocaleString()}
          </div>
        </div>
        
        <div className="rounded-3xl border-4 border-white bg-green-50 cartoon-shadow p-6 relative overflow-hidden">
          <h3 className="text-green-600 font-bold mb-2 relative z-10 text-lg flex items-center">
            <ArrowUpCircle className="mr-2" /> รายรับรวม
          </h3>
          <div className="text-3xl font-black text-green-500 relative z-10">
            + ฿{summary.totalIncome.toLocaleString()}
          </div>
        </div>

        <div className="rounded-3xl border-4 border-white bg-rose-50 cartoon-shadow p-6 relative overflow-hidden">
          <h3 className="text-rose-600 font-bold mb-2 relative z-10 text-lg flex items-center">
            <ArrowDownCircle className="mr-2" /> รายจ่ายรวม
          </h3>
          <div className="text-3xl font-black text-rose-500 relative z-10">
            - ฿{summary.totalExpense.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        
        {/* Transaction Form */}
        <div className="md:col-span-3">
          <div className="rounded-3xl border-4 border-white bg-pink-50 p-6 cartoon-shadow">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-xl shadow-inner">
                ✨
              </div>
              <h3 className="text-xl font-bold text-pink-600">เพิ่มรายการใหม่</h3>
            </div>
            <TransactionForm onSuccess={fetchTransactions} />
          </div>
        </div>

        {/* Transaction List */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-2xl font-bold text-pink-600 mb-4 px-2">ประวัติการทำรายการ 📜</h3>
          
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-pink-100 shadow-sm min-h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-pink-400 font-bold animate-pulse">
                กำลังโหลดข้อมูล... 🪄
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-pink-400 mt-20">
                <div className="text-5xl mb-4">📭</div>
                <p>ยังไม่มีรายการเลยจ้า เริ่มบันทึกกันเถอะ!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white border-2 border-transparent hover:border-pink-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                    
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-rose-100'}`}>
                        {tx.type === 'INCOME' ? '💰' : '💸'}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{tx.title}</p>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-3 gap-y-1 mt-1">
                          <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded-md">
                            📁 {tx.category?.name || "ไม่ระบุ"}
                          </span>
                          <span className="flex items-center">
                            📅 {new Date(tx.transaction_date).toLocaleDateString('th-TH')}
                          </span>
                          {tx.payer && (
                            <span className="flex items-center text-pink-500 font-medium bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                              🙋‍♀️ {tx.payer.full_name}
                            </span>
                          )}
                          {tx.receipt_url && (
                            <a href={tx.receipt_url} target="_blank" rel="noreferrer" className="flex items-center text-blue-500 hover:underline">
                              <FileText className="w-3 h-3 mr-1" /> ดูสลิป
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`font-black text-xl whitespace-nowrap ${tx.type === 'INCOME' ? 'text-green-500' : 'text-rose-500'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
