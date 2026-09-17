"use client";

import { useState, useEffect } from "react";
import { UserPlus, Users } from "lucide-react";

type User = {
  id: string;
  full_name: string;
  student_no: string;
  role: "ADMIN" | "MEMBER";
  created_at: string;
};

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const admins = users.filter((u) => u.role === "ADMIN");
  const members = users.filter((u) => u.role === "MEMBER");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">สมาชิก</h1>
          <p className="text-gray-400 text-sm mt-1">รายชื่อเพื่อนในห้องทั้งหมด</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-xl text-sm font-medium">
          <Users className="w-4 h-4" />
          ทั้งหมด {users.length} คน
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-10">กำลังโหลด...</div>
      ) : (
        <div className="space-y-6">
          {/* Admins */}
          {admins.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                เหรัญญิก / หัวหน้า ({admins.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {admins.map((user) => (
                  <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                      <span className="text-violet-600 font-bold text-lg">{user.full_name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{user.full_name}</p>
                      <p className="text-sm text-gray-400">เลขที่ {user.student_no}</p>
                    </div>
                    <span className="px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-lg">ADMIN</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          {members.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                สมาชิก ({members.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((user) => (
                  <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 font-bold text-lg">{user.full_name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{user.full_name}</p>
                      <p className="text-sm text-gray-400">เลขที่ {user.student_no}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">MEMBER</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
