"use client";

import React from "react";
import ProfessorHero from "./ProfessorHero";
import StudyResources from "./StudyResources";
import ScheduledClasses from "./ScheduledClasses";
import JoinedGroups from "./JoinedGroups";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function ProfessorProfileMain() {
  return (
    <div className="mx-auto w-full max-w-[1300px] space-y-6 pb-20 pt-2 lg:pt-4">
      {/* Top Section: Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProfessorHero
          name="Pro. Rachhor Das Chachhar"
          qualifications="Phd. | MBA | Finance"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Content: Study Resources */}
        <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
          <StudyResources />

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2 px-4 py-8 border-t border-primary/5">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-primary/10 bg-white text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {[1, 2, 3, "...", 12].map((page, index) => (
              <Button
                key={index}
                variant={page === 1 ? "default" : "outline"}
                className={`h-10 w-10 rounded-xl font-black text-xs transition-all ${page === 1
                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"
                    : "border-primary/5 bg-white text-on-surface-variant hover:bg-primary/5 hover:text-primary"
                  }`}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-primary/10 bg-white text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar Sections */}
        <aside className="lg:col-span-4 space-y-8 order-1 lg:order-2">
          <div className="sticky top-24 space-y-10">
            <ScheduledClasses />
            <JoinedGroups />
          </div>
        </aside>
      </div>
    </div>
  );
}
