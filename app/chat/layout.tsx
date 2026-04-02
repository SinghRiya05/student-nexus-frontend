import React from "react";
import Header from "@/components/layouts/Header";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fcf8ff]">
      <Header />
      <main className="flex-1 flex flex-col min-w-0 w-full max-w-[85rem] mx-auto px-4 py-4 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
