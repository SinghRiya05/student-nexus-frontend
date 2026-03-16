"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Auth from "@/components/auth/Auth";
import AuthLayout from "@/components/layouts/AuthLayout";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") as
   "login" |
   "signup"|
   "verify-otp"|
   "reset-password"|
   "forgot-password"
  ) || "login";

  const type = searchParams.get("type") as
  | "signup"
  | "reset-password"
  | undefined;

  if (!isLoggedIn) {
    return (
      <AuthLayout>
        <Auth mode={mode} type={type} />
      </AuthLayout>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}

export default function MainLayoutClient({children,}: {children: React.ReactNode;}) {
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
