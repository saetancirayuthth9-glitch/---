"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Image as ImageIcon } from "lucide-react";

type User = { id: string; full_name: string; role: string };
type Category = { id: string; name: string; type: "INCOME" | "EXPENSE" };

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [categoryId, setCategoryId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [creatorId, setCreatorId] = useState(""); // Mock logged-in user
  const [note, setNote] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch users & categories
    Promise.all([
      fetch("/api/users").then(res => res.json()),
      fetch("/api/categories").then(res => res.json())
    ]).then(([usersData, categoriesData]) => {
      if (Array.isArray(usersData)) {
        setUsers(usersData);
        // auto-select first admin as creator for demo
        const admin = usersData.find(u => u.role === "ADMIN");
        if (admin) setCreatorId(admin.id);
      }
      if (Array.isArray(categoriesData)) setCategories(categoriesData);
    });
  }, []);

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !creatorId) return alert("Please select category and make sure admin is loaded.");
    
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
        setTitle("");
        setAmount("");
        setNote("");
        setReceiptUrl("");
        onSuccess();
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "flex h-11 w-full rounded-2xl border-2 border-pink-200 bg-white px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-pink-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-200 focus-visible:border-pink-400";
  const labelClasses = "text-sm font-bold text-pink-500 leading-none mb-2 block pl-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className={labelClasses}>ชื่อรายการ 📝</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="เช่น เก็บเงินห้องเดือนนี้, ค่ากระดาษ"
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>จำนวนเงิน (บาท) 💰</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>ประเภท 📊</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as "INCOME" | "EXPENSE");
              setCategoryId(""); // reset category when type changes
            }}
            className={inputClasses}
          >
            <option value="INCOME">รายรับ (+)</option>
            <option value="EXPENSE">รายจ่าย (-)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>หมวดหมู่ 📁</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>-- เลือก --</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>คนจ่ายเงิน (ถ้ามี) 🙋‍♀️</label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className={inputClasses}
          >
            <option value="">-- ไม่ระบุ / ส่วนรวม --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClasses}>ลิงก์รูปสลิป / ไฟล์แนบ 🖼️</label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-3 h-5 w-5 text-pink-300" />
          <input
            type="url"
            value={receiptUrl}
            onChange={(e) => setReceiptUrl(e.target.value)}
            placeholder="https://supabase.../receipt.jpg"
            className={`${inputClasses} pl-10`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !creatorId}
        className="w-full h-12 inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-pink-400 to-pink-500 text-white cartoon-shadow hover:-translate-y-1 mt-4"
      >
        {loading ? "กำลังบันทึก... ⏳" : (
          <>
            <PlusCircle className="mr-2 h-5 w-5" />
            บันทึกรายการ 💖
          </>
        )}
      </button>
    </form>
  );
}
