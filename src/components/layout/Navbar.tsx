"use client";

import { useAuth } from "@/lib/auth-context";
import { Menu, LogOut, GraduationCap, Briefcase, Eye } from "lucide-react";

type NavbarProps = {
  onOpenMobileMenu: () => void;
};

export default function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { user, isAdmin, isTreasurer, logout } = useAuth();

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-violet-100/80 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-800 hidden sm:block">
            ระบบจัดการเงินห้องเรียน
          </h2>
          <p className="text-[11px] text-gray-400">Classroom Budget & Expense Tracker</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100">
          <div className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
            {isAdmin ? (
              <GraduationCap className="w-3.5 h-3.5" />
            ) : isTreasurer ? (
              <Briefcase className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="text-left hidden xs:block">
            <p className="text-xs font-bold text-gray-800 leading-tight">
              {user?.full_name || "นักเรียน / ผู้เข้าชม"}
            </p>
            <p className="text-[10px] text-violet-600 font-semibold">
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
          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
