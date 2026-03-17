"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import {
  Eye, EyeOff, ArrowRight, GraduationCap,
  ShieldCheck, Users, Network, Briefcase, BookOpen, Star,
} from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Schema ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid university email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Network nodes ────────────────────────────────────────────────────────────
const nodes = [
  { id: "you",    x: 50, y: 50, label: "You",          role: "student",       size: 44, color: "#6366f1" },
  { id: "peer1",  x: 22, y: 24, label: "Arjun",        role: "Peer · IIT",    size: 34, color: "#8b5cf6" },
  { id: "peer2",  x: 78, y: 22, label: "Priya",        role: "Peer · NIT",    size: 34, color: "#8b5cf6" },
  { id: "senior", x: 83, y: 55, label: "Rahul",        role: "Senior · 3yr",  size: 36, color: "#06b6d4" },
  { id: "alumni", x: 68, y: 82, label: "Sneha",        role: "Alumni · Google",size:38, color: "#10b981" },
  { id: "alum2",  x: 30, y: 80, label: "Vikram",       role: "Alumni · Amazon",size:36, color: "#10b981" },
  { id: "mentor", x: 15, y: 58, label: "Prof. Sharma", role: "Faculty",       size: 36, color: "#f59e0b" },
  { id: "collab", x: 50, y: 14, label: "BITS Student", role: "Cross-Univ",    size: 30, color: "#ec4899" },
];

const edges = [
  ["you","peer1"],["you","peer2"],["you","senior"],["you","alumni"],
  ["you","alum2"],["you","mentor"],["you","collab"],
  ["peer1","mentor"],["peer2","collab"],["senior","alumni"],["alumni","alum2"],
];

const taglines = [
  "Connect with verified peers across 500+ universities.",
  "Get mentored by alumni at top companies.",
  "Collaborate on projects with students nationwide.",
  "Find seniors who've walked your exact path.",
  "Build your academic network. Shape your career.",
];

const roleBadgeClass: Record<string, string> = {
  student:          "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Peer · IIT":     "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Peer · NIT":     "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Senior · 3yr":   "bg-cyan-500/20   text-cyan-300   border-cyan-500/30",
  "Alumni · Google":"bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Alumni · Amazon":"bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Faculty:          "bg-amber-500/20  text-amber-300  border-amber-500/30",
  "Cross-Univ":     "bg-pink-500/20   text-pink-300   border-pink-500/30",
};

const statPills = [
  { icon: Users,        value: "50K+", label: "Students"     },
  { icon: GraduationCap,value: "500+", label: "Universities" },
  { icon: Briefcase,    value: "12K+", label: "Alumni"       },
  { icon: BookOpen,     value: "200+", label: "Courses"      },
];

const trustItems = [
  { icon: ShieldCheck, text: "Verified via official college email"  },
  { icon: Network,     text: "Multi-university networking"          },
  { icon: Star,        text: "Peer learning & alumni mentorship"    },
];

// ─── SVG Network Graph ────────────────────────────────────────────────────────
function NetworkGraph({ active }: { active: string | null }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" style={{ overflow: "visible" }}>
      {/* Edges */}
      {edges.map(([a, b], i) => {
        const na = nodes.find(n => n.id === a)!;
        const nb = nodes.find(n => n.id === b)!;
        const lit = active === a || active === b;
        return (
          <line key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={lit ? "#6366f1" : "rgba(255,255,255,0.07)"}
            strokeWidth={lit ? "0.55" : "0.28"}
            style={{ transition: "stroke 0.5s, stroke-width 0.5s" }}
          />
        );
      })}
      {/* Nodes */}
      {nodes.map(node => {
        const lit  = active === node.id;
        const isYou = node.id === "you";
        const r    = (node.size / 2) / 8;
        return (
          <g key={node.id} transform={`translate(${node.x},${node.y})`}>
            {lit && (
              <circle r={r + 1.8} fill="none" stroke={node.color}
                strokeWidth="0.4" opacity="0.45"
                style={{ animation: "snPing 1.6s ease-out infinite" }} />
            )}
            <circle r={r + 0.9} fill={node.color}
              opacity={lit ? 0.28 : 0.09}
              style={{ transition: "opacity 0.5s" }} />
            <circle r={r}
              fill={isYou ? "#6366f1" : "#181630"}
              stroke={node.color}
              strokeWidth={isYou ? "0.65" : "0.35"}
              style={{ transition: "all 0.5s", filter: lit ? `drop-shadow(0 0 3px ${node.color})` : "none" }}
            />
            <circle r={isYou ? r * 0.36 : r * 0.3} fill={node.color} opacity={0.9} />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPw,       setShowPw]       = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);
  const [activeNode,   setActiveNode]   = useState<string | null>(null);
  const [hoveredNode,  setHoveredNode]  = useState<string | null>(null);
  const [tagIdx,       setTagIdx]       = useState(0);
  const [tagFade,      setTagFade]      = useState(true);

  // Rotate taglines
  useEffect(() => {
    const t = setInterval(() => {
      setTagFade(false);
      setTimeout(() => { setTagIdx(i => (i + 1) % taglines.length); setTagFade(true); }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Animate network nodes
  useEffect(() => {
    const ids = nodes.map(n => n.id);
    let i = 0;
    const t = setInterval(() => { setActiveNode(ids[i++ % ids.length]); }, 1600);
    return () => clearInterval(t);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    console.log(values);
    setIsLoading(false);
  }

  const displayed = hoveredNode ?? activeNode;

  return (
    <>
      <style>{`
        @keyframes snFadeUp { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
        @keyframes snPing   { 0%{transform:scale(1);opacity:.55;} 100%{transform:scale(2.4);opacity:0;} }
        @keyframes snDrift1 { from{transform:translate(0,0) scale(1);}     to{transform:translate(32px,22px) scale(1.08);} }
        @keyframes snDrift2 { from{transform:translate(0,0);}              to{transform:translate(-22px,-32px);} }
        @keyframes snDrift3 { from{transform:translate(0,0) scale(1);}     to{transform:translate(-16px,16px) scale(1.1);} }
        @keyframes snShimmer{ 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes snFadeIn { from{opacity:0;} to{opacity:1;} }
        .sn-shimmer {
          background: linear-gradient(90deg,#818cf8,#67e8f9,#a78bfa,#818cf8);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: snShimmer 4s linear infinite;
        }
      `}</style>

      {/* ── Root wrapper: h-screen, two columns ── */}
      <div className="flex h-screen w-full overflow-hidden">

        {/* ══════════════════════════════════════════════════════════
            LEFT PANEL — dark, interactive, fits any screen height
        ══════════════════════════════════════════════════════════ */}
        <div className="relative hidden w-[52%] shrink-0 overflow-hidden bg-[#0a0918] lg:flex lg:flex-col">

          {/* Ambient orbs — purely decorative */}
          <div className="pointer-events-none absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full blur-[90px]"
            style={{ background:"radial-gradient(circle,rgba(99,102,241,0.32) 0%,transparent 70%)", animation:"snDrift1 14s ease-in-out infinite alternate" }} />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-[400px] w-[400px] rounded-full blur-[90px]"
            style={{ background:"radial-gradient(circle,rgba(6,182,212,0.18) 0%,transparent 70%)", animation:"snDrift2 18s ease-in-out infinite alternate" }} />
          <div className="pointer-events-none absolute left-[48%] top-[38%] h-[280px] w-[280px] rounded-full blur-[80px]"
            style={{ background:"radial-gradient(circle,rgba(139,92,246,0.16) 0%,transparent 70%)", animation:"snDrift3 22s ease-in-out infinite alternate" }} />

          {/* Subtle grid texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize:"36px 36px" }} />

          {/* ── Inner flex column: fills height, no overflow ── */}
          <div className="relative z-10 flex h-full flex-col px-10 py-8 gap-0">

            {/* Logo — fixed height */}
            <div className="shrink-0" style={{ animation:"snFadeUp 0.5s ease both" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[1.15rem] font-bold -tracking-wide leading-none text-white">
                    Student<span className="text-indigo-400">Nexus</span>
                  </p>
                  <p className="text-[0.58rem] uppercase tracking-[0.14em] text-white/30 mt-0.5">
                    Verified Academic Network
                  </p>
                </div>
              </div>
            </div>

            {/* Tagline — fixed height */}
            <div className="mt-5 shrink-0" style={{ animation:"snFadeUp 0.5s 0.08s ease both" }}>
              <p className="text-[0.78rem] font-medium text-white/45 transition-opacity duration-300 min-h-[1.4rem]"
                style={{ opacity: tagFade ? 1 : 0 }}>
                ✦ &nbsp;{taglines[tagIdx]}
              </p>
            </div>

            {/* Hero heading — fixed height */}
            <div className="mt-2 shrink-0" style={{ animation:"snFadeUp 0.5s 0.14s ease both" }}>
              <h1 className="text-[1.95rem] font-bold leading-[1.18] -tracking-[0.03em] text-white">
                Your Academic<br />
                <span className="sn-shimmer">Universe Awaits</span>
              </h1>
            </div>

            {/* ── Network Graph — flex-1, takes remaining space ── */}
            <div className="relative mt-4 min-h-0 flex-1" style={{ animation:"snFadeUp 0.5s 0.2s ease both" }}>
              <div className="relative h-full w-full">
                <NetworkGraph active={displayed} />

                {/* Invisible hover targets over each node */}
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${node.x}%`, top: `${node.y}%`,
                      width: `${node.size + 8}px`, height: `${node.size + 8}px`,
                      transform: "translate(-50%,-50%)",
                    }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {hoveredNode === node.id && (
                      <div
                        className="pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border border-white/10 bg-[#13112b]/95 px-2.5 py-1.5 shadow-xl backdrop-blur-sm"
                        style={{ bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)", animation:"snFadeIn 0.18s ease both" }}
                      >
                        <p className="text-[0.72rem] font-semibold text-white">{node.label}</p>
                        <span className={`mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[0.6rem] font-medium ${roleBadgeClass[node.role] ?? "bg-white/10 text-white/50 border-white/10"}`}>
                          {node.role}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Node legend — bottom right */}
                <div className="absolute bottom-1 right-0 flex flex-col gap-1 rounded-xl border border-white/[0.07] bg-[#0a0918]/80 px-2.5 py-2 backdrop-blur-sm">
                  {[
                    { color:"#6366f1", label:"You"        },
                    { color:"#8b5cf6", label:"Peers"      },
                    { color:"#06b6d4", label:"Seniors"    },
                    { color:"#10b981", label:"Alumni"     },
                    { color:"#f59e0b", label:"Faculty"    },
                    { color:"#ec4899", label:"Cross-Univ" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background:item.color }} />
                      <span className="text-[0.6rem] text-white/40">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust badges — fixed height */}
            <div className="mt-3 shrink-0 flex flex-col gap-1.5" style={{ animation:"snFadeUp 0.5s 0.28s ease both" }}>
              {trustItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-400">
                    <Icon size={11} strokeWidth={2} />
                  </div>
                  <span className="text-[0.72rem] text-white/42">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats strip — fixed height, pinned to bottom */}
            <div className="mt-4 shrink-0 grid grid-cols-4 gap-2 border-t border-white/[0.07] pt-4"
              style={{ animation:"snFadeUp 0.5s 0.35s ease both" }}>
              {statPills.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.03] py-2 px-1">
                  <Icon size={11} className="text-indigo-400" strokeWidth={2} />
                  <p className="text-[0.95rem] font-bold -tracking-wide text-white">{value}</p>
                  <p className="text-[0.58rem] uppercase tracking-[0.04em] text-white/28">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            RIGHT PANEL — clean white / light, form centered
        ══════════════════════════════════════════════════════════ */}
        <div className="relative flex flex-1 items-center justify-center overflow-y-auto bg-white px-8 py-10">

          {/* Soft indigo glow top-right */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-indigo-100/60 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-violet-100/40 blur-[70px]" />

          <div className="relative z-10 mx-auto w-full max-w-[400px]"
            style={{ animation:"snFadeUp 0.65s 0.15s ease both" }}>

            {/* Mobile-only logo */}
            <div className="mb-7 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <GraduationCap size={17} />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Student<span className="text-indigo-600">Nexus</span>
              </span>
            </div>

            {/* Header */}
            <div className="mb-7">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                Verified Student Access
              </div>
              <h2 className="mb-1.5 text-[1.85rem] font-bold leading-[1.15] -tracking-[0.03em] text-gray-900">
                Welcome back
              </h2>
              <p className="text-[0.84rem] leading-relaxed text-gray-500">
                Sign in with your university email to access your academic network.
              </p>
            </div>

            {/* ── React Hook Form ── */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {/* Email */}
                <FormField control={form.control} name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[0.78rem] font-semibold text-gray-700">
                        University Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@university.edu" autoComplete="email"
                          className="h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0"
                          {...field} />
                      </FormControl>
                      <FormMessage className="text-[0.72rem] text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField control={form.control} name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-[0.78rem] font-semibold text-gray-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            type={showPw ? "text" : "password"}
                            placeholder="••••••••••"
                            autoComplete="current-password"
                            className="h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-3.5 pr-11 text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0"
                            {...field}
                          />
                          <button type="button" tabIndex={-1}
                            onClick={() => setShowPw(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700">
                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[0.72rem] text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Remember + Forgot */}
                <FormField control={form.control} name="remember"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer select-none items-center gap-2 text-[0.79rem] text-gray-500">
                          <Checkbox checked={field.value} onCheckedChange={field.onChange}
                            className="h-4 w-4 rounded-[4px] border-gray-300 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600" />
                          Remember me
                        </label>
                        <a href="#" className="text-[0.79rem] font-semibold text-indigo-600 transition-opacity hover:opacity-70">
                          Forgot password?
                        </a>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <button type="submit" disabled={isLoading}
                  className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 text-[0.88rem] font-semibold text-white shadow-[0_4px_18px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_26px_rgba(99,102,241,0.45)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55">
                  {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>Enter Your Network <ArrowRight size={15} strokeWidth={2.5} /></>
                  )}
                </button>

              </form>
            </Form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3 text-[0.73rem] text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              or continue with
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google SSO */}
            <button type="button"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-gray-200 bg-white text-[0.84rem] font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
              <svg width="17" height="17" viewBox="0 0 48 48" className="shrink-0" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.9 0-14.7 4.4-18.4 10.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7l-6.5 5C9.5 39.7 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-1 2.7-2.8 5-5.2 6.5l6.2 5.2C40.3 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign up */}
            <p className="mt-6 text-center text-[0.8rem] text-gray-500">
              New to StudentNexus?{" "}
              <a href="#" className="font-bold text-indigo-600 transition-opacity hover:opacity-75">
                Create your verified account →
              </a>
            </p>

            {/* Verification strip */}
            <div className="mt-5 flex items-center justify-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
              <ShieldCheck size={12} className="shrink-0 text-emerald-500" />
              <span className="text-[0.67rem] text-gray-400">
                Verified via official university email · Trusted by 500+ institutions
              </span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}