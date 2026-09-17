"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on Landing / Auth Portal page, render clean full-width shell with full container
  if (pathname === "/") {
    return (
      <div className="min-h-screen bg-[#F4F3F8] text-gray-900 flex flex-col justify-center py-6 sm:py-10">
        <main className="w-full max-w-[1400px] px-4 sm:px-8 mx-auto">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F3F8] text-gray-900 flex">
      {/* Desktop Sidebar (Fixed on left with crisp border) */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed top-0 left-0 w-64 h-screen border-r-2 border-[#E5E0F2]">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Drawer (Slide over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white z-50 shadow-2xl animate-in slide-in-from-left duration-200 border-r-2 border-violet-200">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="w-full px-4 sm:px-8 py-6 sm:py-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
