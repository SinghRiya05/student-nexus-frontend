"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  X,
  GraduationCap,
  CalendarCheck,
  Globe,
  MapPin,
  Users,
  BookOpen,
  Settings2,
  Map,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "University",
    href: "/dashboard/university",
    icon: GraduationCap,
  },
  {
    title: "Semester",
    href: "/dashboard/semester",
    icon: CalendarCheck,
  },
  {
    title: "Countries",
    href: "/dashboard/countries",
    icon: Globe,
  },
  {
    title: "State",
    href: "/dashboard/state",
    icon: MapPin,
  },
  {
    title: "City",
    href: "/dashboard/cities",
    icon: MapPin,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Roles",
    href: "/dashboard/roles",
    icon: ShieldCheck,
  },
  {
    title: "Permissions",
    href: "/dashboard/permissions",
    icon: Lock,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings2,
    subItems: [
      { title: "Profile Settings", href: "/dashboard/settings/profile" },
      { title: "Company Settings", href: "/dashboard/settings/company" },
    ],
  },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-foreground border-r border-slate-800 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">
                Student Nexus
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto lg:hidden text-muted-foreground hover:text-white hover:bg-muted-foreground/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.title}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.title)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-md text-muted text-sm font-medium transition-colors hover:bg-muted-foreground hover:text-white",
                          expandedItems.includes(item.title)
                            ? "text-white bg-muted-foreground font-medium"
                            : "text-muted",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.title}
                        </div>
                        {expandedItems.includes(item.title) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedItems.includes(item.title) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-10 pr-3 py-1 space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={cn(
                                    "block px-3 py-2 rounded-md text-sm transition-colors hover:text-white hover:bg-muted-foreground",
                                    pathname === subItem.href
                                      ? "text-white bg-muted-foreground font-medium"
                                      : "text-muted",
                                  )}
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted-foreground hover:text-white",
                        pathname === item.href
                          ? "bg-muted-foreground text-white"
                          : "text-muted",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
