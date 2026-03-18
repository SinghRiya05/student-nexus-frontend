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
    <footer className="relative mt-20 border-t border-slate-800 bg-slate-950 pb-8 pt-16">
      {/* Decorative top gradient */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* ─── Brand Section ─── */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <GraduationCap size={20} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                StudentNexus
              </span>
            </Link>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-gray-400">
              Empowering students to connect, learn, and grow together. A centralized hub for open source, internships, and communities.
            </p>
            <div className="mt-4 flex gap-4">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-gray-400 transition-all hover:border-indigo-500 hover:bg-slate-800 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Quick Links ─── */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {["Dashboard", "Courses", "Community", "Jobs"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-[0.85rem] font-medium text-gray-400 transition-colors hover:text-indigo-400 focus:outline-none focus:text-indigo-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Resources ─── */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Resources</h3>
            <ul className="space-y-3">
              {["Help Center", "Blog", "Interview Prep", "Student Guidelines"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-[0.85rem] font-medium text-gray-400 transition-colors hover:text-indigo-400 focus:outline-none focus:text-indigo-400"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* ─── Newsletter ─── */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Stay Updated</h3>
            <p className="mb-4 text-[0.82rem] text-gray-400">
              Get the latest news on internships and tech events directly to your inbox.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-[0.85rem] text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-[0.8rem] text-gray-500">
            © {currentYear} StudentNexus. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 sm:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[0.8rem] text-gray-500 transition-colors hover:text-indigo-400"
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