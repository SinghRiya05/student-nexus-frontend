"use client";

import React from "react";
import { Search, Settings2 } from "lucide-react";

const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Engineering",
  "Business",
  "Arts & Media",
];

export default function ProfessorSearch() {
  return (
    <section className=" space-y-6 px-4 bg-[#ebeffc] py-4 rounded-2xl">
      <div className="relative group max-w-4xl">
        <div className="absolute inset-y-0  left-5 flex items-center pointer-events-none text-outline">
          <Search className="h-5 w-5" />
        </div>
        <input
          className="w-full pl-14 pr-6 outline-1 py-3 bg-surface-container-high rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/70"
          placeholder="Search by name, research area, or department..."
          type="text"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-on-surface uppercase tracking-widest opacity-80">
              Quick Filters
            </span>
          </div>
          <button className="text-xs font-bold text-primary hover:underline transition-all">
            Advanced Search
          </button>
        </div>

        <div className="flex flex-nowrap md:flex-wrap items-center gap-2.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-2 px-2">
          {DEPARTMENTS.map((dept, idx) => (
            <button
              key={dept}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 transform active:scale-95 shadow-sm ${idx === 0
                ? "bg-primary text-white shadow-xl shadow-primary/20 ring-2 ring-primary/10"
                : "bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-highest hover:shadow-md border border-outline-variant/10"
                }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
