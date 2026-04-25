"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../main/sidebar/Sidebar";
import Header from "@/components/layouts/Header";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/utils/hook";
import { getMe } from "@/features/users/userThunk";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { me } = useAppSelector((state) => state.user);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Always verify session on mount — auth state may not be hydrated yet
    dispatch(getMe())
      .unwrap()
      .catch(() => {
        // Not authenticated — redirect to login
        router.replace("/");
      })
      .finally(() => {
        setChecking(false);
      });
  }, [dispatch, router]);

  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <div className="h-screen w-full overflow-hidden bg-slate-50">
        {children}
      </div>
    );
  }

  // ⏳ Verifying session
  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  // 🚫 Non-admin access attempt
  if (me && me.roleId?.name !== "ADMIN") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-5 text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-rose-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              You don&apos;t have permission to access the admin dashboard.
              Only <span className="text-indigo-600 font-bold">Administrators</span> can view this page.
            </p>
          </div>
          <button
            onClick={() => router.replace("/")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 pt-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
