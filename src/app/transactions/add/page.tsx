"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  PlusCircle,
  Image as ImageIcon,
  ArrowLeft,
  ShieldAlert,
  Calendar,
  Tag,
  User,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";

type UserType = { id: string; full_name: string; role: string };
type Category = { id: string; name: string; type: string };

export default function AddTransactionPage() {
  const router = useRouter();
  const { user, canManage, isAdmin, isTreasurer } = useAuth();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [categoryId, setCategoryId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [transactionDate, setTransactionDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [note, setNote] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [users, setUsers] = useState<UserType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([u, c]) => {
        if (Array.isArray(u)) setUsers(u);
        if (Array.isArray(c)) {
          setCategories(c);
          // Set first matching category
          const firstCat = c.find((item: Category) => item.type === "INCOME");
          if (firstCat) setCategoryId(firstCat.id);
        }
      })
      .catch(console.error);
  }, []);

  // Update default category when type changes
  const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
    setType(newType);
    const firstCat = categories.find((item) => item.type === newType);
    if (firstCat) setCategoryId(firstCat.id);
    else setCategoryId("");
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  // If user is a student or not authorized to add
  if (!canManage) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          หน้านี้สงวนสิทธิ์เฉพาะ <strong>อาจารย์ที่ปรึกษา (Admin)</strong> และ <strong>เหรัญญิก</strong> สำหรับบันทึกเงินห้องเท่านั้นครับ นักเรียนสามารถดูข้อมูลได้ที่หน้าแดชบอร์ดและประวัติการเงิน
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-2xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-all shadow-md shadow-violet-200"
          >
            กลับสู่แดชบอร์ด
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
          >
            เข้าสู่ระบบด้วยบัญชีผู้ดูแล
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!title.trim() || !amount || !categoryId) {
      setErrorMessage("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          type,
          category_id: categoryId,
          created_by: user?.id,
          payer_id: payerId || undefined,
          transaction_date: transactionDate,
          note: note.trim() || undefined,
          receipt_url: receiptUrl.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("บันทึกรายการสำเร็จแล้ว! นักเรียนทุกคนสามารถดูรายการนี้ได้ทันที");
        setTimeout(() => {
          router.push("/transactions");
        }, 1000);
      } else {
        setErrorMessage(data.error || "เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (err) {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all";
  const labelClass = "block text-xs sm:text-sm font-bold text-gray-700 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/transactions"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-violet-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับไปหน้ารวมรายการ</span>
      </Link>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-violet-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">บันทึกรายรับ - รายจ่าย</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
              {isAdmin ? "อาจารย์ที่ปรึกษา" : "เหรัญญิก"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ข้อมูลที่ท่านบันทึกจะแสดงให้นักเรียนทุกคนในห้องเห็นแบบเรียลไทม์
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-violet-100 shadow-sm space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Transaction Type Toggle */}
        <div>
          <label className={labelClass}>1. ประเภทของรายการ *</label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange("INCOME")}
              className={`py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                type === "INCOME"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-2 ring-emerald-300"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <span>💰 รายรับ (+)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("EXPENSE")}
              className={`py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                type === "EXPENSE"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-200 ring-2 ring-rose-300"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-rose-50 hover:text-rose-700"
              }`}
            >
              <span>💸 รายจ่าย (-)</span>
            </button>
          </div>
        </div>

        {/* 2. Title / Details */}
        <div>
          <label className={labelClass}>2. ชื่อรายการ / รายละเอียด *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น เก็บเงินห้องประจำเดือนกันยายน, ซื้อกระดาษรายงานจัดบอร์ด"
            className={inputClass}
          />
        </div>

        {/* 3. Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>3. จำนวนเงิน (บาท) *</label>
            <div className="relative">
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`${inputClass} font-bold text-base text-gray-800`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                THB
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass}>4. วันที่ทำรายการ *</label>
            <input
              type="date"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* 4. Category & Payer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>5. หมวดหมู่รายการ *</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>-- เลือกหมวดหมู่ --</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>6. นักเรียนที่จ่ายเงิน (ถ้ามี)</label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className={inputClass}
            >
              <option value="">-- ไม่ระบุ / เงินส่วนรวมของห้อง --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.role === 'ADMIN' ? 'อาจารย์' : u.role === 'TREASURER' ? 'เหรัญญิก' : 'นักเรียน'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Receipt URL */}
        <div>
          <label className={labelClass}>7. แนบลิงก์รูปภาพสลิป / ใบเสร็จ (ถ้ามี)</label>
          <div className="relative">
            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              placeholder="https://... (เช่น ลิงก์จาก Supabase Storage หรือเว็บฝากรูป)"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* 6. Note */}
        <div>
          <label className={labelClass}>8. หมายเหตุเพิ่มเติม</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="รายละเอียดเพิ่มเติม เช่น ร้านค้าที่ซื้อ, เล่มที่ใบเสร็จ..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-base transition-all shadow-lg shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {loading ? "กำลังบันทึกข้อมูล..." : (
              <>
                <PlusCircle className="w-5 h-5" />
                บันทึกรายการเงินห้อง
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
