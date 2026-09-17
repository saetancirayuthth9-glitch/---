"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

type User = { id: string; full_name: string; role: string };
type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

export default function AddTransactionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [categoryId, setCategoryId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [note, setNote] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([u, c]) => {
      if (Array.isArray(u)) {
        setUsers(u);
        const admin = u.find((x: User) => x.role === "ADMIN");
        if (admin) setCreatorId(admin.id);
      }
      if (Array.isArray(c)) setCategories(c);
    });
  }, []);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !creatorId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          type,
          category_id: categoryId,
          created_by: creatorId,
          payer_id: payerId || undefined,
          note,
          receipt_url: receiptUrl,
        }),
      });
      if (res.ok) {
        router.push("/transactions");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/transactions" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-violet-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับไปหน้ารายการ
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">เพิ่มรายการใหม่</h1>
        <p className="text-gray-400 text-sm mt-1">บันทึกรายรับหรือรายจ่ายของห้อง</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        {/* Type Toggle */}
        <div>
          <label className={labelCls}>ประเภท</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setType("INCOME"); setCategoryId(""); }}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                type === "INCOME"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-emerald-50"
              }`}>
              💰 รายรับ
            </button>
            <button type="button" onClick={() => { setType("EXPENSE"); setCategoryId(""); }}
              className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                type === "EXPENSE"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-rose-50"
              }`}>
              💸 รายจ่าย
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className={labelCls}>ชื่อรายการ</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น เก็บเงินห้องเดือน ก.ย., ค่าถ่ายเอกสาร" className={inputCls} />
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>จำนวนเงิน (บาท)</label>
            <input type="number" required min="1" step="0.01" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>หมวดหมู่</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
              <option value="" disabled>-- เลือก --</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payer */}
        <div>
          <label className={labelCls}>ผู้จ่ายเงิน (ถ้ามี)</label>
          <select value={payerId} onChange={(e) => setPayerId(e.target.value)} className={inputCls}>
            <option value="">-- ไม่ระบุ / ส่วนรวม --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name}</option>
            ))}
          </select>
        </div>

        {/* Receipt URL */}
        <div>
          <label className={labelCls}>ลิงก์รูปสลิป (ถ้ามี)</label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="url" value={receiptUrl} onChange={(e) => setReceiptUrl(e.target.value)}
              placeholder="https://..." className={`${inputCls} pl-10`} />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className={labelCls}>หมายเหตุ</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)}
            rows={3} placeholder="หมายเหตุเพิ่มเติม..."
            className={`${inputCls} resize-none`} />
        </div>

        <button type="submit" disabled={loading || !creatorId}
          className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-all shadow-md shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2">
          <PlusCircle className="w-4 h-4" />
          {loading ? "กำลังบันทึก..." : "บันทึกรายการ"}
        </button>
      </form>
    </div>
  );
}
