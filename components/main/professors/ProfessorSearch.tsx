"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfessorSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export default function ProfessorSearch({ searchQuery, onSearchChange, onSearch }: ProfessorSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <section className="py-3 sm:py-5 flex flex-col sm:flex-row gap-3">
      <div className="relative group flex-1">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-outline">
          <Search className="h-5 w-5" />
        </div>
        <input
          className="w-full pl-14 pr-6 outline-1 py-3 bg-surface-container-high rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/70"
          placeholder="Search by name, research area, or department..."
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="w-full sm:w-auto">
        <Button 
          onClick={onSearch}
          className="w-full sm:w-auto py-6 cursor-pointer rounded-3xl px-5 hover:bg-primary/90"
        >
          Search
        </Button>
      </div>
    </section>
  );
}
