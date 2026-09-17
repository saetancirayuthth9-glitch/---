"use client";

import { useState, useEffect } from "react";
import { Users, GraduationCap, Briefcase, UserCheck } from "lucide-react";

type User = {
  id: string;
  full_name: string;
  student_no?: string;
  role: string;
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

  const advisors = users.filter((u) => u.role === "ADMIN");
  const treasurers = users.filter((u) => u.role === "TREASURER");
  const members = users.filter((u) => u.role === "MEMBER" || u.role === "STUDENT");

  return (
    <div className="space-y-8">
      {/* Header Card with Framing */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#DCD6EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">สมาชิกในห้องเรียน</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            ผู้ดูแลระบบและรายชื่อนักเรียนทั้งหมดในห้อง
          </p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border-2 border-violet-200 self-start sm:self-auto">
          <Users className="w-4 h-4" />
          <span>รวมผู้ใช้งาน {users.length} คน</span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400 animate-pulse">
          กำลังโหลดรายชื่อสมาชิก... ⏳
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. อาจารย์ที่ปรึกษา */}
          <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
            <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-600" />
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                  อาจารย์ที่ปรึกษา (Admin - 1 ท่าน)
                </h3>
              </div>
              <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-200">
                ผู้คุมระบบ
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {advisors.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-center text-gray-400 text-sm font-medium">
                  ยังไม่มีอาจารย์ที่ปรึกษาลงทะเบียนในระบบ
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {advisors.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl border-2 border-violet-200 bg-violet-50/40 shadow-sm flex items-center gap-4 hover:border-violet-400 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-violet-200 border-2 border-violet-400">
                        {u.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900 text-sm sm:text-base truncate">{u.full_name}</p>
                        <p className="text-xs text-gray-500 font-medium">อาจารย์ที่ปรึกษา</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-violet-600 text-white">
                        ADMIN
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. เหรัญญิกห้อง */}
          <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
            <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                  เหรัญญิกประจำห้อง (Treasurer - 1 คน)
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                ผู้จัดการเงินห้อง
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {treasurers.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-center text-gray-400 text-sm font-medium">
                  ยังไม่มีเหรัญญิกลงทะเบียนในระบบ
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {treasurers.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl border-2 border-purple-200 bg-purple-50/40 shadow-sm flex items-center gap-4 hover:border-purple-400 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-purple-200 border-2 border-purple-400">
                        {u.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900 text-sm sm:text-base truncate">{u.full_name}</p>
                        <p className="text-xs text-gray-500 font-medium">เหรัญญิกห้อง</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-600 text-white">
                        TREASURER
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. เพื่อนและสมาชิกในห้อง */}
          <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm overflow-hidden">
            <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-gray-500" />
                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                  สมาชิกในห้อง ({members.length} คน)
                </h3>
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-xl border border-gray-200">
                นักเรียน
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {members.length === 0 ? (
                <div className="p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 text-center text-gray-400 text-sm font-medium">
                  ยังไม่มีรายชื่อสมาชิกเพิ่มเติม
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl border-2 border-gray-200 bg-white shadow-sm flex items-center gap-4 hover:border-violet-300 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-base border border-gray-200">
                        {u.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{u.full_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">เลขที่ {u.student_no || "-"}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                        นักเรียน
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
