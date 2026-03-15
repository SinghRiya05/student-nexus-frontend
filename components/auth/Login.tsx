"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import {
  Eye, EyeOff, BookOpen, Users, BarChart3,
  Zap, ArrowRight, GraduationCap,
} from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Validation Schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Static Data ─────────────────────────────────────────────────────────────
const features = [
  {
    icon: BookOpen,
    title: "Smart Course Management",
    desc: "Track assignments, deadlines & grades in one unified view.",
  },
  {
    icon: Users,
    title: "Study Group Collaboration",
    desc: "Connect with peers, share notes, and solve problems together.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Visualise your academic progress with detailed insights.",
  },
  {
    icon: Zap,
    title: "AI-Powered Assistance",
    desc: "Get instant help with concepts and study planning.",
  },
];

const stats = [
  { value: "12", suffix: "K+", label: "Students" },
  { value: "340", suffix: "+",  label: "Courses" },
  { value: "98",  suffix: "%",  label: "Satisfaction" },
];

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc }: {
  icon: React.ElementType; title: string; desc: string;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 transition-all duration-200 hover:translate-x-1 hover:border-white/[0.13] hover:bg-white/[0.07]">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/30 bg-gradient-to-br from-indigo-500/30 to-cyan-400/20 text-indigo-300">
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[0.8rem] font-semibold tracking-tight text-white/90">{title}</p>
        <p className="mt-0.5 text-[0.73rem] leading-relaxed text-white/40">{desc}</p>
      </div>
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    console.log(values);
    setIsLoading(false);
  }

  return (
    <>
      {/* Only keyframe @keyframes live here — all styling is Tailwind */}
      <style>{`
        @keyframes drift1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px,30px) scale(1.08); }
        }
        @keyframes drift2 {
          from { transform: translate(0,0); }
          to   { transform: translate(-30px,-40px); }
        }
        @keyframes drift3 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-20px,20px) scale(1.1); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div className="flex min-h-screen overflow-hidden bg-[#f5f4f0]">

        {/* ══════════════════════════════════════════
            LEFT PANEL
        ══════════════════════════════════════════ */}
        <div className="relative hidden w-[52%] shrink-0 flex-col justify-between overflow-hidden bg-[#0a0a0f] px-14 py-12 lg:flex">

          {/* Ambient orbs */}
          <div
            className="pointer-events-none absolute -left-32 -top-44 h-[500px] w-[500px] rounded-full blur-[80px]"
            style={{
              background: "radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%)",
              animation: "drift1 12s ease-in-out infinite alternate",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-20 h-[380px] w-[380px] rounded-full blur-[80px]"
            style={{
              background: "radial-gradient(circle, rgba(6,182,212,0.22) 0%, transparent 70%)",
              animation: "drift2 15s ease-in-out infinite alternate",
            }}
          />
          <div
            className="pointer-events-none absolute left-[55%] top-[45%] h-[280px] w-[280px] rounded-full blur-[80px]"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)",
              animation: "drift3 18s ease-in-out infinite alternate",
            }}
          />

          {/* Top content */}
          <div className="relative z-10">

            {/* Logo */}
            <div
              className="flex items-center gap-2.5"
              style={{ animation: "fadeUp 0.6s ease both" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-[0_4px_20px_rgba(79,70,229,0.45)]">
                <GraduationCap size={20} />
              </div>
              <span className="text-[1.3rem] font-bold -tracking-wide text-white">
                Student<span className="text-cyan-400">Nexus</span>
              </span>
            </div>

            {/* Hero */}
            <div
              className="mt-14"
              style={{ animation: "fadeUp 0.7s 0.15s ease both" }}
            >
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-indigo-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                Academic Platform · 2025
              </div>

              {/* Heading */}
              <h1 className="mb-4 font-bold leading-[1.12] -tracking-[0.03em] text-white"
                  style={{ fontSize: "clamp(2.2rem, 3vw, 3rem)" }}>
                Your campus.<br />
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                  Connected.
                </span>
              </h1>

              <p className="max-w-[380px] text-[0.93rem] font-light leading-[1.7] text-white/50">
                One unified hub for courses, collaboration, assignments, and academic growth — built for students who think ahead.
              </p>

              {/* Feature cards */}
              <div className="mt-8 flex flex-col gap-3">
                {features.map((f) => (
                  <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                ))}
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div
            className="relative z-10 flex gap-8 border-t border-white/[0.08] pt-8"
            style={{ animation: "fadeUp 0.6s 0.5s ease both" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold -tracking-[0.03em] text-white">
                  {s.value}<span className="text-cyan-400">{s.suffix}</span>
                </p>
                <p className="mt-0.5 text-[0.7rem] uppercase tracking-[0.04em] text-white/35">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT PANEL
        ══════════════════════════════════════════ */}
        <div className="relative flex flex-1 items-center justify-center bg-[#f5f4f0] p-8">
          {/* Subtle radial glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_30%,rgba(79,70,229,0.06)_0%,transparent_70%)]" />

          <div
            className="relative z-10 w-full max-w-[420px]"
            style={{ animation: "fadeUp 0.7s 0.2s ease both" }}
          >
            {/* Form header */}
            <div className="mb-9">
              <p className="mb-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                Welcome back
              </p>
              <h2 className="mb-1.5 text-[2rem] font-bold -tracking-[0.03em] leading-[1.15] text-[#0a0a0f]">
                Sign in to your account
              </h2>
              <p className="text-[0.875rem] leading-relaxed text-gray-500">
                Enter your credentials to continue where you left off.
              </p>
            </div>

            {/* React Hook Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

                {/* Email field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.8rem] font-semibold text-[#0a0a0f]">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@university.edu"
                          autoComplete="email"
                          className="h-11 rounded-[10px] border-[1.5px] border-black/10 bg-white px-3.5 text-[0.88rem] text-[#0a0a0f] shadow-none placeholder:text-gray-300 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="mt-1 text-[0.75rem] text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.8rem] font-semibold text-[#0a0a0f]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            autoComplete="current-password"
                            className="h-11 rounded-[10px] border-[1.5px] border-black/10 bg-white pl-3.5 pr-11 text-[0.88rem] text-[#0a0a0f] shadow-none placeholder:text-gray-300 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0"
                            {...field}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0a0a0f]"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="mt-1 text-[0.75rem] text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Remember me + Forgot password */}
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer select-none items-center gap-2 text-[0.82rem] text-gray-500">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-[4px] border-black/20 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                          />
                          Remember me
                        </label>
                        <a
                          href="#"
                          className="text-[0.82rem] font-semibold text-indigo-600 transition-opacity hover:opacity-70"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-br from-indigo-600 to-violet-600 text-[0.92rem] font-semibold text-white shadow-[0_4px_20px_rgba(79,70,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(79,70,229,0.4)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Sign in to Nexus
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>
            </Form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3 text-[0.78rem] text-gray-400">
              <span className="h-px flex-1 bg-black/10" />
              or continue with
              <span className="h-px flex-1 bg-black/10" />
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-black/10 bg-white text-[0.85rem] font-semibold text-[#0a0a0f] transition-all duration-200 hover:border-indigo-500/30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.07)]"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.9 0-14.7 4.4-18.4 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7l-6.5 5C9.5 39.7 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-1 2.7-2.8 5-5.2 6.5l6.2 5.2C40.3 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign-up prompt */}
            <p className="mt-7 text-center text-[0.83rem] text-gray-400">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-bold text-indigo-600 transition-opacity hover:opacity-75">
                Create one free →
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}