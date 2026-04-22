"use client";

import Link from "next/link";
import {
  GraduationCap,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-foreground pb-10 pt-16">
      {/* Decorative top accent */}

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* ─── Brand Section ─── */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <GraduationCap size={22} className="text-primary" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                StudentNexus
              </span>
            </Link>
            <p className="mt-2 text-[0.88rem] font-medium leading-relaxed text-white/70">
              The ultimate platform for university students to bridge the gap between academics and the professional world. Connect with peers, find mentors, and explore career-defining opportunities.
            </p>
            <div className="mt-4 flex gap-3">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-all hover:bg-secondary hover:text-white hover:scale-110 active:scale-95 border border-white/10"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Quick Links ─── */}
          <div>
            <h3 className="mb-5 text-[15px] font-bold uppercase tracking-wider text-white/90">Platform</h3>
            <ul className="space-y-3.5">
              {[
                { label: "Home", href: "/" },
                { label: "Community Feed", href: "/feeds" },
                { label: "Universities", href: "/university" },
                { label: "Professors", href: "/professors" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[0.88rem] font-medium text-white/60 transition-colors hover:text-accent focus:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Resources ─── */}
          <div>
            <h3 className="mb-5 text-[15px] font-bold uppercase tracking-wider text-white/90">Connect</h3>
            <ul className="space-y-3.5">
              {[
                { label: "Alumni Network", href: "/alumni" },
                { label: "Student Directory", href: "/students" },
                { label: "Messages", href: "/chat" },
                { label: "My Profile", href: "/profile" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[0.88rem] font-medium text-white/60 transition-colors hover:text-accent focus:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Newsletter ─── */}
          <div>
            <h3 className="mb-5 text-[15px] font-bold uppercase tracking-wider text-white/90">Stay Updated</h3>
            <p className="mb-5 text-[0.85rem] font-medium text-white/60">
              Get the latest news on internships and tech events directly to your inbox.
            </p>
            <form className="flex gap-2.5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[0.85rem] text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center rounded-xl bg-secondary px-4 py-2.5 text-white shadow-lg transition-all hover:bg-accent hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[0.85rem] font-medium text-white/40">
            © {currentYear} StudentNexus. Built for students, by students. All rights reserved.
          </p>
          <div className="mt-4 flex gap-8 sm:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[0.85rem] font-medium text-white/40 transition-colors hover:text-accent"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}