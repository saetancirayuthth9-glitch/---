"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, UserPlus, FileBarChart, PlusCircle } from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/transactions", label: "รายการทั้งหมด", icon: ArrowLeftRight },
  { href: "/transactions/add", label: "เพิ่มรายการ", icon: PlusCircle },
  { href: "/members", label: "สมาชิก", icon: UserPlus },
  { href: "/summary", label: "สรุปรายงาน", icon: FileBarChart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">฿</span>
          </div>
          <span className="font-bold text-lg text-gray-800">เงินห้องเรา</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                  : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Classroom Budget Tracker</p>
      </div>
    </aside>
  );
}
