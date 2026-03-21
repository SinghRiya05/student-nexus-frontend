"use client";

import React, { useState } from "react";
import Sidebar from "../main/sidebar/Sidebar";
import Header from "@/components/layouts/Header";
import { usePathname } from "next/navigation";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <div className="h-screen w-full overflow-hidden bg-slate-50">
        {children}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out">
        <Header />
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
