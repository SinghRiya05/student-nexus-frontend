"use client";

import React from "react";

// ─── Auth Layout ─────────────────────────────────────────────────────────────
export default function AuthLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
