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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">สมาชิกในห้องเรียน</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ผู้ดูแลระบบและรายชื่อนักเรียนทั้งหมดในห้อง
          </p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold border border-violet-100 self-start sm:self-auto">
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider px-1">
              <GraduationCap className="w-4 h-4 text-violet-600" />
              <span>อาจารย์ที่ปรึกษา (ผู้คุมระบบ - 1 ท่าน)</span>
            </div>

            {advisors.length === 0 ? (
              <div className="p-6 rounded-3xl bg-white border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                ยังไม่มีอาจารย์ที่ปรึกษาลงทะเบียนในระบบ
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisors.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 rounded-3xl bg-white border border-violet-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-violet-200">
                      {u.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{u.full_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">อาจารย์ที่ปรึกษา</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-100 text-violet-700">
                      ADMIN
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. เหรัญญิกห้อง */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider px-1">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>เหรัญญิกประจำห้อง (ผู้บันทึกเงินห้อง - 1 คน)</span>
            </div>

            {treasurers.length === 0 ? (
              <div className="p-6 rounded-3xl bg-white border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                ยังไม่มีเหรัญญิกลงทะเบียนในระบบ
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {treasurers.map((u) => (
                  <div
                    key={u.id}
                    className="p-5 rounded-3xl bg-white border border-purple-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-purple-200">
                      {u.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{u.full_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">เหรัญญิกห้อง</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                      TREASURER
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. เพื่อนและสมาชิกในห้อง */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider px-1">
              <UserCheck className="w-4 h-4 text-gray-400" />
              <span>สมาชิกในห้อง ({members.length} คน)</span>
            </div>

            {members.length === 0 ? (
              <div className="p-6 rounded-3xl bg-white border border-dashed border-gray-200 text-center text-gray-400 text-sm">
                ยังไม่มีรายชื่อสมาชิกเพิ่มเติม
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-base">
                      {u.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{u.full_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">เลขที่ {u.student_no || "-"}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                      นักเรียน
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
