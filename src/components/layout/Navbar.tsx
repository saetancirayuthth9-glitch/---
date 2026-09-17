"use client";

import { useAuth } from "@/lib/auth-context";
import { Menu, LogOut, GraduationCap, Briefcase, Eye } from "lucide-react";

type NavbarProps = {
  onOpenMobileMenu: () => void;
};

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { user, isAdmin, isTreasurer, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b-2 border-[#E5E0F2] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-2xl text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-colors border-2 border-gray-200"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-gray-900 hidden sm:block">
            ระบบจัดการเงินห้องเรียน
          </h2>
          <p className="text-[11px] text-gray-400 font-medium">Classroom Budget & Expense Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Framed Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-violet-50 border-2 border-violet-200 shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
            {isAdmin ? (
              <GraduationCap className="w-4 h-4" />
            ) : isTreasurer ? (
              <Briefcase className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </div>
          <div className="text-left hidden xs:block">
            <p className="text-xs font-extrabold text-gray-900 leading-tight">
              {user?.full_name || "นักเรียน / ผู้เข้าชม"}
            </p>
            <p className="text-[10px] text-violet-700 font-bold">
              {isAdmin
                ? "อาจารย์ที่ปรึกษา"
                : isTreasurer
                ? "เหรัญญิก"
                : "โหมดดูข้อมูล"}
            </p>
          </div>
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={logout}
          title="ออกจากระบบ / เปลี่ยนบทบาท"
          className="p-2 rounded-2xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border-2 border-transparent hover:border-rose-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
