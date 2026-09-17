"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  ArrowLeftRight,
  UserPlus,
  FileBarChart,
  PlusCircle,
  GraduationCap,
  Briefcase,
  Eye,
  LogOut,
  X
} from "lucide-react";

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, canManage, isAdmin, isTreasurer, logout } = useAuth();

  const baseMenuItems = [
    { href: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
    ...(canManage
      ? [{ href: "/transactions/add", label: "บันทึกรายการ", icon: PlusCircle, highlight: true }]
      : []),
    { href: "/transactions", label: "ประวัติการเงิน", icon: ArrowLeftRight },
    { href: "/summary", label: "สรุปรายงาน", icon: FileBarChart },
    { href: "/members", label: "สมาชิกในห้อง", icon: UserPlus },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-violet-100 flex flex-col justify-between shadow-sm">
      {/* Top Brand */}
      <div>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-violet-200">
              ฿
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 block leading-tight">เงินห้องเรียน</span>
              <span className="text-[10px] text-violet-500 font-medium tracking-wide">CLASS BUDGET</span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Role Card */}
        <div className="p-4 mx-3 mt-4 rounded-2xl bg-violet-50/70 border border-violet-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-violet-700 shadow-sm border border-violet-100">
              {isAdmin ? (
                <GraduationCap className="w-5 h-5 text-violet-600" />
              ) : isTreasurer ? (
                <Briefcase className="w-5 h-5 text-purple-600" />
              ) : (
                <Eye className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {user?.full_name || "นักเรียน / ผู้เข้าชม"}
              </p>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                isAdmin
                  ? "bg-violet-600 text-white"
                  : isTreasurer
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}>
                {isAdmin ? "อาจารย์ที่ปรึกษา" : isTreasurer ? "เหรัญญิกห้อง" : "โหมดนักเรียน"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1.5">
          {baseMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  item.highlight
                    ? isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200 font-semibold"
                      : "bg-violet-50 text-violet-700 hover:bg-violet-100 font-semibold border border-violet-200"
                    : isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                    : "text-gray-600 hover:bg-violet-50/60 hover:text-violet-700"
                }`}
              >
                <Icon className={`w-5 h-5 ${item.highlight && !isActive ? "text-violet-600" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer / Logout */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {!canManage && (
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500 leading-relaxed">
            👀 ดูข้อมูลได้เท่านั้น อาจารย์และเหรัญญิกสามารถเข้าสู่ระบบเพื่อบันทึกข้อมูลได้
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกจากระบบ / สลับบทบาท</span>
        </button>
      </div>
    </aside>
  );
}
