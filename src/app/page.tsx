"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Eye,
  Lock,
  UserCheck,
  ArrowRight,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Sparkles
} from "lucide-react";

type RoleStatus = {
  hasAdmin: boolean;
  adminName: string | null;
  hasTreasurer: boolean;
  treasurerName: string | null;
};

export default function AuthPortalPage() {
  const router = useRouter();
  const { user, login, loginAsStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [roleStatus, setRoleStatus] = useState<RoleStatus>({
    hasAdmin: false,
    adminName: null,
    hasTreasurer: false,
    treasurerName: null,
  });

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"ADMIN" | "TREASURER">("ADMIN");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/auth/status");
      if (res.ok) {
        const data = await res.json();
        setRoleStatus(data);
        if (data.hasAdmin && !data.hasTreasurer) {
          setRegRole("TREASURER");
        } else if (!data.hasAdmin) {
          setRegRole("ADMIN");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);
        router.push("/dashboard");
      } else {
        setLoginError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      setLoginError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setRegLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: regFullName,
          username: regUsername,
          password: regPassword,
          role: regRole,
        }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setRegSuccess("ลงทะเบียนสำเร็จแล้ว! กำลังเข้าสู่ระบบ...");
        login(data.user);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setRegError(data.error || "ไม่สามารถลงทะเบียนได้");
      }
    } catch (err) {
      setRegError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setRegLoading(false);
      fetchStatus();
    }
  };

  const isRoleFull = (role: "ADMIN" | "TREASURER") => {
    return role === "ADMIN" ? roleStatus.hasAdmin : roleStatus.hasTreasurer;
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Top Banner with Frame */}
      <div className="bg-white rounded-3xl border-2 border-[#DCD6EE] p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-violet-100/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200 border-2 border-violet-400">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            ระบบจัดการเงินห้องเรียน
          </h1>
          <p className="text-xs sm:text-base text-gray-500 max-w-xl mx-auto font-medium">
            โปร่งใส ตรวจสอบง่าย นักเรียนทุกคนเข้าดูยอดเงินคงเหลือและประวัติได้ทันที
          </p>

          {user && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-violet-50 border-2 border-violet-200 text-xs sm:text-sm text-violet-800 shadow-sm">
                <span>เข้าสู่ระบบอยู่แล้วในฐานะ: <strong>{user.full_name}</strong> ({user.role === 'ADMIN' ? 'อาจารย์ที่ปรึกษา' : user.role === 'TREASURER' ? 'เหรัญญิก' : 'นักเรียน'})</span>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="font-bold underline text-violet-600 hover:text-violet-900 ml-1"
                >
                  ไปที่แดชบอร์ด →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: 2 Distinct Framed Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* ================= ZONE 1: FOR STUDENTS ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-violet-200 border-2 border-violet-400 flex flex-col justify-between relative overflow-hidden">
          
          <div className="space-y-6">
            {/* Header Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>โซนที่ 1: สำหรับนักเรียน / เพื่อนในห้อง</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                เข้าดูเงินห้องทันที
              </h2>
              <p className="text-violet-100 text-xs sm:text-sm leading-relaxed">
                ไม่ต้องสมัครสมาชิก ไม่ต้องจำรหัสผ่าน สามารถเข้าไปดูยอดเงินคงเหลือ รายรับ-รายจ่าย และสลิปการโอนได้ตลอดเวลา
              </p>
            </div>

            {/* Checklist Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-violet-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>ตรวจสอบยอดเงินคงเหลือปัจจุบันได้ 24 ชม.</span>
              </div>
              <div className="flex items-center gap-3 text-violet-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>เห็นข้อมูลที่อาจารย์/เหรัญญิกบันทึกแบบ Real-time</span>
              </div>
              <div className="flex items-center gap-3 text-violet-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>โหมดดูอย่างเดียว ปลอดภัย ไร้กังวล</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={loginAsStudent}
              className="w-full py-4 px-6 rounded-2xl bg-white text-violet-700 font-extrabold text-sm sm:text-base hover:bg-violet-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2.5 group border-2 border-white"
            >
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>เข้าดูเงินห้องทันที (สำหรับนักเรียน)</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ================= ZONE 2: FOR MANAGERS ================= */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#DCD6EE] shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Card Header with Division */}
          <div className="bg-[#FAF9FD] border-b-2 border-[#EAE6F4] p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wider block">
                  โซนที่ 2: ผู้ดูแลระบบ
                </span>
                <h2 className="text-base sm:text-xl font-bold text-gray-900">
                  อาจารย์ที่ปรึกษา & เหรัญญิก
                </h2>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => { setActiveTab("login"); setLoginError(""); }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "login"
                    ? "bg-white text-violet-700 shadow-sm border border-gray-200/60"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("register"); setRegError(""); setRegSuccess(""); }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  activeTab === "register"
                    ? "bg-white text-violet-700 shadow-sm border border-gray-200/60"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6 flex-1">
            {/* Status Boxes for the 2 Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Advisor Status */}
              <div className={`p-4 rounded-2xl border-2 text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                roleStatus.hasAdmin
                  ? "bg-gray-50 border-gray-200 text-gray-600"
                  : "bg-violet-50/70 border-violet-200 text-violet-900"
              }`}>
                <GraduationCap className={`w-5 h-5 flex-shrink-0 mt-0.5 ${roleStatus.hasAdmin ? "text-gray-400" : "text-violet-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold truncate">1. อาจารย์ที่ปรึกษา</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      roleStatus.hasAdmin ? "bg-gray-200 text-gray-700" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {roleStatus.hasAdmin ? "มีแล้ว" : "ว่าง"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 truncate">
                    {roleStatus.hasAdmin ? `ผู้ลงทะเบียน: ${roleStatus.adminName}` : "จำกัด 1 ท่าน"}
                  </p>
                </div>
              </div>

              {/* Treasurer Status */}
              <div className={`p-4 rounded-2xl border-2 text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                roleStatus.hasTreasurer
                  ? "bg-gray-50 border-gray-200 text-gray-600"
                  : "bg-purple-50/70 border-purple-200 text-purple-900"
              }`}>
                <Briefcase className={`w-5 h-5 flex-shrink-0 mt-0.5 ${roleStatus.hasTreasurer ? "text-gray-400" : "text-purple-600"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold truncate">2. เหรัญญิก</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      roleStatus.hasTreasurer ? "bg-gray-200 text-gray-700" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {roleStatus.hasTreasurer ? "มีแล้ว" : "ว่าง"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 truncate">
                    {roleStatus.hasTreasurer ? `ผู้ลงทะเบียน: ${roleStatus.treasurerName}` : "จำกัด 1 คน"}
                  </p>
                </div>
              </div>
            </div>

            {/* TAB: LOGIN */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    ชื่อผู้ใช้ (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="เช่น admin หรือ treasurer"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DCD6EE] focus:border-violet-600 text-sm focus:outline-none focus:ring-4 focus:ring-violet-100 transition-all bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    รหัสผ่าน (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DCD6EE] focus:border-violet-600 text-sm focus:outline-none focus:ring-4 focus:ring-violet-100 transition-all bg-white font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all shadow-md shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-violet-500 active:scale-[0.99]"
                >
                  {loginLoading ? "กำลังตรวจสอบ..." : (
                    <>
                      <Lock className="w-4 h-4" />
                      เข้าสู่ระบบเพื่อจัดการเงินห้อง
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB: REGISTER */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                {regError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                {/* Role Picker with Boxes */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                    เลือกตำแหน่งที่ต้องการสมัคร (1 ตำแหน่ง ต่อ 1 คน)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        regRole === "ADMIN"
                          ? "border-violet-600 bg-violet-50/70 ring-2 ring-violet-200"
                          : "border-[#DCD6EE] hover:bg-gray-50"
                      } ${roleStatus.hasAdmin ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        disabled={roleStatus.hasAdmin}
                        checked={regRole === "ADMIN"}
                        onChange={() => setRegRole("ADMIN")}
                        className="text-violet-600 w-4 h-4"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">อาจารย์ที่ปรึกษา</p>
                        <p className="text-[11px] text-gray-500">Admin ผู้คุมระบบ</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        regRole === "TREASURER"
                          ? "border-violet-600 bg-violet-50/70 ring-2 ring-violet-200"
                          : "border-[#DCD6EE] hover:bg-gray-50"
                      } ${roleStatus.hasTreasurer ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="TREASURER"
                        disabled={roleStatus.hasTreasurer}
                        checked={regRole === "TREASURER"}
                        onChange={() => setRegRole("TREASURER")}
                        className="text-violet-600 w-4 h-4"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">เหรัญญิก</p>
                        <p className="text-[11px] text-gray-500">ผู้บันทึก/จัดการเงินห้อง</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                    ชื่อ-นามสกุล จริง
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="เช่น อ.กฤษฎา หรือ ด.ช.วิชัย การเงินดี"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#DCD6EE] focus:border-violet-600 text-sm focus:outline-none focus:ring-4 focus:ring-violet-100 transition-all bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                      ชื่อผู้ใช้ (Username)
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="ภาษาอังกฤษหรือตัวเลข"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#DCD6EE] focus:border-violet-600 text-sm focus:outline-none focus:ring-4 focus:ring-violet-100 transition-all bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                      รหัสผ่าน (Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="อย่างน้อย 4 ตัวอักษร"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-[#DCD6EE] focus:border-violet-600 text-sm focus:outline-none focus:ring-4 focus:ring-violet-100 transition-all bg-white font-medium"
                    />
                  </div>
                </div>

                {roleStatus.hasAdmin && roleStatus.hasTreasurer ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-800 text-xs sm:text-sm">
                    ทั้ง 2 ตำแหน่ง (อาจารย์ที่ปรึกษา และ เหรัญญิก) มีผู้ลงทะเบียนครบแล้ว หากคุณคือผู้ดูแลกรุณาเลือกแท็บ <strong>"เข้าสู่ระบบ"</strong> ด้านบนครับ
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={regLoading || isRoleFull(regRole)}
                    className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all shadow-md shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-violet-500 active:scale-[0.99]"
                  >
                    {regLoading ? "กำลังบันทึก..." : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        ลงทะเบียนตำแหน่งผู้ดูแล
                      </>
                    )}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
