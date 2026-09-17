"use client";

import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-sm text-gray-400">ระบบจัดการเงินกองกลาง</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-violet-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
            <span className="text-violet-600 font-bold text-sm">A</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">เหรัญญิก</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
