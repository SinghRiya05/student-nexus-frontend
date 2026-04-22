"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Auth from "@/components/auth/Auth";
import AuthLayout from "@/components/layouts/AuthLayout";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import LeftSection from "@/components/main/home/LeftSection";
import { useAppSelector, useAppDispatch } from "@/utils/hook";
import { getMe } from "@/features/users/userThunk";
import { forceLogout } from "@/features/auth/authSlice";
import { useEffect } from "react";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { me } = useAppSelector((state) => state.user);
  const searchParams = useSearchParams();

  // 🛡️ Verify user existence on boot if authenticated
  useEffect(() => {
    if (isAuthenticated && !me) {
      dispatch(getMe()).unwrap().catch(() => {
        // If getMe fails, the user likely doesn't exist anymore
        dispatch(forceLogout());
      });
    }
  }, [isAuthenticated, me, dispatch]);

  const mode = (searchParams.get("mode") as
    "login" |
    "signup" |
    "verify-otp" |
    "reset-password" |
    "forgot-password"
  ) || "login";

  const type = searchParams.get("type") as
    | "signup"
    | "reset-password"
    | undefined;

  // ❌ If not authenticated, always show the Auth gateway
  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Auth mode={mode} type={type} />
      </AuthLayout>
    );
  }

  // ✅ Authenticated View: Header, Sidebar, and Page Content
  return (
    <div className="flex min-h-screen flex-col bg-white/10">
      <Header />
      <div className="w-full max-w-[85rem] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Persistent Left Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <LeftSection />
          </div>
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function MainLayoutClient({ children, }: { children: React.ReactNode; }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e]">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
      }
    >
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}
