"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Eye,
  Lock,
  UserCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Wallet
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

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"ADMIN" | "TREASURER">("ADMIN");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Fetch role quota status
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/auth/status");
      if (res.ok) {
        const data = await res.json();
        setRoleStatus(data);
        // Default role selection based on what's available
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
    <div className="min-h-[85vh] flex flex-col justify-center py-6 sm:py-10">
      {/* Top Banner / Logo */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200 mb-2">
          <Wallet className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          ระบบจัดการเงินห้องเรียน
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
          โปร่งใส ตรวจสอบง่าย นักเรียนทุกคนเข้าดูยอดเงินคงเหลือและประวัติได้ทันที
        </p>

        {user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-xs sm:text-sm text-violet-700 mt-2">
            <span>เข้าสู่ระบบอยู่แล้วในฐานะ: <strong>{user.full_name}</strong> ({user.role === 'ADMIN' ? 'อาจารย์ที่ปรึกษา' : user.role === 'TREASURER' ? 'เหรัญญิก' : 'นักเรียน'})</span>
            <button
              onClick={() => router.push("/dashboard")}
              className="underline font-semibold hover:text-violet-900 ml-1"
            >
              ไปที่แดชบอร์ด →
            </button>
          </div>
        )}
      </div>

      {/* Main Container - 90% Width */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ================= ZONE 1: FOR STUDENTS (No Registration Required) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-violet-200 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-6">
              <Eye className="w-4 h-4" />
              สำหรับนักเรียน / เพื่อนในห้อง
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
              เข้าดูเงินห้องทันที
            </h2>
            <p className="text-violet-100 text-sm sm:text-base leading-relaxed mb-6">
              ไม่ต้องสมัครสมาชิก ไม่ต้องจำรหัสผ่าน สามารถเข้าไปดูยอดเงินคงเหลือ รายรับ-รายจ่าย ประวัติ และสลิปการโอนได้ตลอดเวลา
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-violet-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span>ตรวจสอบยอดเงินคงเหลือปัจจุบันได้ 24 ชม.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-violet-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span>เห็นทุกรายการที่อาจารย์หรือเหรัญญิกบันทึกแบบ Real-time</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-violet-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <span>โหมดดูข้อมูลอย่างเดียว ปลอดภัย ไม่เสี่ยงข้อมูลผิดพลาด</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loginAsStudent}
            className="w-full py-4 px-6 rounded-2xl bg-white text-violet-700 font-bold text-base sm:text-lg hover:bg-violet-50 transition-all shadow-lg shadow-black/10 hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            <span>เข้าดูเงินห้องทันที (โหมดนักเรียน)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ================= ZONE 2: FOR MANAGERS (Advisor & Treasurer) ================= */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-violet-100 p-6 sm:p-8 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                สำหรับผู้ดูแล (จำกัดตำแหน่งละ 1 คน)
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                อาจารย์ที่ปรึกษา & เหรัญญิก
              </h2>
            </div>

            {/* Toggle Login / Register */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setActiveTab("login"); setLoginError(""); }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "login"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("register"); setRegError(""); setRegSuccess(""); }}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "register"
                    ? "bg-white text-violet-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>
          </div>

          {/* Role Quota Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {/* Advisor Status */}
            <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
              roleStatus.hasAdmin
                ? "bg-gray-50 border-gray-200 text-gray-600"
                : "bg-violet-50/60 border-violet-200 text-violet-800"
            }`}>
              <GraduationCap className={`w-5 h-5 flex-shrink-0 ${roleStatus.hasAdmin ? "text-gray-400" : "text-violet-600"}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">1. อาจารย์ที่ปรึกษา (Admin)</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    roleStatus.hasAdmin ? "bg-gray-200 text-gray-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {roleStatus.hasAdmin ? "มีแล้ว" : "ตำแหน่งว่าง"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {roleStatus.hasAdmin ? `ผู้ลงทะเบียน: ${roleStatus.adminName}` : "สามารถลงทะเบียนได้ (จำกัด 1 ท่าน)"}
                </p>
              </div>
            </div>

            {/* Treasurer Status */}
            <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
              roleStatus.hasTreasurer
                ? "bg-gray-50 border-gray-200 text-gray-600"
                : "bg-purple-50/60 border-purple-200 text-purple-800"
            }`}>
              <Briefcase className={`w-5 h-5 flex-shrink-0 ${roleStatus.hasTreasurer ? "text-gray-400" : "text-purple-600"}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">2. เหรัญญิก (Treasurer)</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    roleStatus.hasTreasurer ? "bg-gray-200 text-gray-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {roleStatus.hasTreasurer ? "มีแล้ว" : "ตำแหน่งว่าง"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {roleStatus.hasTreasurer ? `ผู้ลงทะเบียน: ${roleStatus.treasurerName}` : "สามารถลงทะเบียนได้ (จำกัด 1 คน)"}
                </p>
              </div>
            </div>
          </div>

          {/* ================= TAB 1: LOGIN ================= */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  ชื่อผู้ใช้ (Username)
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="เช่น admin หรือ treasurer"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  รหัสผ่าน (Password)
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-md shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? "กำลังตรวจสอบ..." : (
                  <>
                    <Lock className="w-4 h-4" />
                    เข้าสู่ระบบผู้ดูแล
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= TAB 2: REGISTER ================= */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  เลือกตำแหน่งที่ต้องการสมัคร (1 คนต่อตำแหน่ง)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      regRole === "ADMIN"
                        ? "border-violet-600 bg-violet-50/50 ring-2 ring-violet-200"
                        : "border-gray-200 hover:bg-gray-50"
                    } ${roleStatus.hasAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      disabled={roleStatus.hasAdmin}
                      checked={regRole === "ADMIN"}
                      onChange={() => setRegRole("ADMIN")}
                      className="text-violet-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">อาจารย์ที่ปรึกษา</p>
                      <p className="text-xs text-gray-500">Admin ผู้คุมระบบ</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      regRole === "TREASURER"
                        ? "border-violet-600 bg-violet-50/50 ring-2 ring-violet-200"
                        : "border-gray-200 hover:bg-gray-50"
                    } ${roleStatus.hasTreasurer ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="TREASURER"
                      disabled={roleStatus.hasTreasurer}
                      checked={regRole === "TREASURER"}
                      onChange={() => setRegRole("TREASURER")}
                      className="text-violet-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-800">เหรัญญิก</p>
                      <p className="text-xs text-gray-500">ผู้บันทึก/จัดการเงินห้อง</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  ชื่อ-นามสกุล จริง
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="เช่น อ.กฤษฎา หรือ ด.ช.วิชัย การเงินดี"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    ชื่อผู้ใช้ (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ภาษาอังกฤษหรือตัวเลข"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    รหัสผ่าน (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="อย่างน้อย 4 ตัวอักษร"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>

              {roleStatus.hasAdmin && roleStatus.hasTreasurer ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm">
                  ทั้ง 2 ตำแหน่ง (อาจารย์ที่ปรึกษา และ เหรัญญิก) มีผู้ลงทะเบียนครบแล้ว หากคุณคือผู้ดูแลกรุณาเลือกแท็บ <strong>"เข้าสู่ระบบ"</strong> ด้านบนครับ
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={regLoading || isRoleFull(regRole)}
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all shadow-md shadow-violet-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
  );
}
