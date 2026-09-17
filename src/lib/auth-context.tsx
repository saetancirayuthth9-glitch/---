"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "ADMIN" | "TREASURER" | "MEMBER" | "STUDENT";

export type AuthUser = {
  id: string;
  full_name: string;
  username?: string;
  role: UserRole;
  student_no?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  loginAsStudent: () => void;
  logout: () => void;
  isAdmin: boolean;
  isTreasurer: boolean;
  canManage: boolean;
  isStudent: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("class_fund_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse auth user:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    try {
      localStorage.setItem("class_fund_auth_user", JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  const loginAsStudent = () => {
    const studentUser: AuthUser = {
      id: "guest_student",
      full_name: "นักเรียน / ผู้เข้าชมทั่วไป",
      role: "STUDENT",
    };
    login(studentUser);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("class_fund_auth_user");
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  };

  const isAdmin = user?.role === "ADMIN";
  const isTreasurer = user?.role === "TREASURER";
  const canManage = isAdmin || isTreasurer;
  const isStudent = !canManage;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsStudent,
        logout,
        isAdmin,
        isTreasurer,
        canManage,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
