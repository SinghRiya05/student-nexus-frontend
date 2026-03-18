"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  GraduationCap,
  Users,
  Briefcase,
  BookOpen,
  Star,
  ShieldCheck,
  Network,
  FileText,
  Video,
  Link2,
} from "lucide-react";

/* ─── Data ────────────────────────────────────────────────── */

const taglines = [
  "Connect with verified peers across 500+ universities.",
  "Get mentored by alumni at top companies worldwide.",
  "Collaborate on projects with students nationwide.",
  "Find seniors who've walked your exact path.",
  "Build your academic network. Shape your career.",
  "Share resources, grow together, go further.",
];

const statPills = [
  { icon: Users, value: "50K+", label: "Students" },
  { icon: GraduationCap, value: "500+", label: "Universities" },
  { icon: Briefcase, value: "12K+", label: "Alumni" },
  { icon: BookOpen, value: "8K+", label: "Resources" },
];

const trustItems = [
  { icon: ShieldCheck, text: "Verified via official college email" },
  { icon: Network, text: "Multi-university networking hub" },
  { icon: Star, text: "Peer learning & alumni mentorship" },
];

/* ─── Node positions (SVG viewBox 440 × 360) ─────────────── */
const NODES = {
  student: { x: 100, y: 90, label: "Student", sub: "Learns & Connects", color: "#818cf8", glow: "rgba(99,102,241,0.55)", icon: "🎓" },
  teacher: { x: 340, y: 90, label: "Teacher", sub: "Teaches & Assigns", color: "#f59e0b", glow: "rgba(245,158,11,0.55)", icon: "📋" },
  alumni: { x: 100, y: 270, label: "Alumni", sub: "Mentors & Guides", color: "#34d399", glow: "rgba(52,211,153,0.55)", icon: "💼" },
  peer: { x: 340, y: 270, label: "Peer", sub: "Collaborates", color: "#f87171", glow: "rgba(248,113,113,0.55)", icon: "🤝" },
  hub: { x: 220, y: 180, label: "Nexus", sub: "Hub", color: "#a78bfa", glow: "rgba(167,139,250,0.6)", icon: "⚡" },
};

type NodeKey = keyof typeof NODES;

const EDGES: { from: NodeKey; to: NodeKey; color: string; speed: number }[] = [
  { from: "student", to: "hub", color: "#818cf8", speed: 1.8 },
  { from: "teacher", to: "hub", color: "#f59e0b", speed: 2.2 },
  { from: "alumni", to: "hub", color: "#34d399", speed: 2.0 },
  { from: "peer", to: "hub", color: "#f87171", speed: 2.4 },
  { from: "student", to: "teacher", color: "#c4b5fd", speed: 3.0 },
  { from: "alumni", to: "peer", color: "#6ee7b7", speed: 3.4 },
];

const RESOURCE_LABELS = ["PDF", "Video", "Notes", "Link", "Quiz"];

/* ─── Animated Network Diagram ───────────────────────────── */
function NetworkDiagram() {
  const [tick, setTick] = useState(0);
  const raf = useRef<number>(0);
  const st = useRef(Date.now());

  useEffect(() => {
    const loop = () => {
      setTick(Date.now() - st.current);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const t = tick / 1000; // seconds

  /* helper: point along edge at progress p ∈ [0,1] */
  function edgePoint(from: NodeKey, to: NodeKey, p: number) {
    const a = NODES[from], b = NODES[to];
    return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
  }

  /* Packet progress for each edge */
  function packetP(speed: number, offset = 0) {
    return ((t * speed * 0.12 + offset) % 1 + 1) % 1;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <style>{`
        @keyframes nodeGlow {
          0%,100% { filter: drop-shadow(0 0 6px var(--glow)); }
          50%      { filter: drop-shadow(0 0 18px var(--glow)); }
        }
        @keyframes hubPulse {
          0%,100% { r:28; opacity:0.15; }
          50%      { r:40; opacity:0.06; }
        }
        @keyframes hubRing {
          to { stroke-dashoffset: -64; }
        }
        @keyframes fadeLabel {
          0%,100% { opacity:0.45; }
          50%      { opacity:0.85; }
        }
        .node-ring { animation: hubRing 3s linear infinite; }
        .hub-pulse { animation: hubPulse 2.2s ease-in-out infinite; }
      `}</style>

      <svg viewBox="0 0 440 360" className="w-full h-full" style={{ maxHeight: "100%" }}>
        <defs>
          {/* Glow filters for each node */}
          {(Object.entries(NODES) as [NodeKey, typeof NODES[NodeKey]][]).map(([k, n]) => (
            <filter key={k} id={`gf-${k}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feFlood floodColor={n.color} floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
          <filter id="gf-hub" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feFlood floodColor="#a78bfa" floodOpacity="0.7" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="hubBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        {/* ── Edges ── */}
        {EDGES.map((e, i) => {
          const a = NODES[e.from], b = NODES[e.to];
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          return (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={e.color} strokeWidth="1.2" strokeOpacity="0.25"
              strokeDasharray="5 5"
            />
          );
        })}

        {/* ── Animated packets on edges ── */}
        {EDGES.map((e, i) => {
          const p1 = packetP(e.speed, i * 0.19);
          const p2 = packetP(e.speed, i * 0.19 + 0.5);
          const pt1 = edgePoint(e.from, e.to, p1);
          const pt2 = edgePoint(e.from, e.to, p2);
          const label = RESOURCE_LABELS[i % RESOURCE_LABELS.length];
          return (
            <g key={`pkt-${i}`}>
              {/* packet 1 */}
              <circle cx={pt1.x} cy={pt1.y} r="8" fill={e.color} fillOpacity="0.9" />
              <circle cx={pt1.x} cy={pt1.y} r="8" fill={e.color} fillOpacity="0.15" />
              <text x={pt1.x} y={pt1.y - 6} textAnchor="middle" fontSize="8"
                fill="white" fillOpacity="0.7" fontFamily="sans-serif">{label}</text>
              {/* packet 2 (reverse direction) */}
              <circle cx={pt2.x} cy={pt2.y} r="8" fill={e.color} fillOpacity="0.6" />
              <circle cx={pt2.x} cy={pt2.y} r="8" fill={e.color} fillOpacity="0.1" />
            </g>
          );
        })}

        {/* ── Hub node ── */}
        {(() => {
          const n = NODES.hub;
          const ringOffset = (t * 40) % 64;
          return (
            <g filter="url(#gf-hub)">
              {/* Pulse ring */}
              <circle cx={n.x} cy={n.y} r="38" fill="none"
                stroke="#a78bfa" strokeWidth="1"
                strokeDasharray="8 6"
                style={{ strokeDashoffset: -ringOffset }}
                opacity="0.35"
              />
              <circle cx={n.x} cy={n.y} r="35" fill="url(#hubBg)" />
              <text x={n.x} y={n.y - 6} textAnchor="middle" fontSize="20" fill="white" fontFamily="sans-serif">⚡</text>
              <text x={n.x} y={n.y + 8} textAnchor="middle" fontSize="10" fontWeight="700"
                fill="white" fontFamily="sans-serif">NEXUS</text>
              <text x={n.x} y={n.y + 19} textAnchor="middle" fontSize="10"
                fill="rgba(255,255,255,0.55)" fontFamily="sans-serif">HUB</text>
            </g>
          );
        })()}

        {/* ── Outer nodes ── */}
        {(["student", "teacher", "alumni", "peer"] as NodeKey[]).map((key) => {
          const n = NODES[key];
          const pulse = Math.sin(t * 1.5 + ["student", "teacher", "alumni", "peer"].indexOf(key)) * 0.5 + 0.5;
          return (
            <g key={key}>
              {/* Glow ring */}
              <circle cx={n.x} cy={n.y} r={28 + pulse * 6} fill={n.color} opacity={0.06 + pulse * 0.05} />
              {/* Main circle */}
              <circle cx={n.x} cy={n.y} r="35" fill="rgba(15,15,30,0.85)"
                stroke={n.color} strokeWidth="1.8" strokeOpacity="0.7" filter={`url(#gf-${key})`} />
              {/* Icon */}
              <text x={n.x} y={n.y - 5} textAnchor="middle" fontSize="18" fontFamily="sans-serif">{n.icon}</text>
              {/* Label */}
              <text x={n.x} y={n.y + 10} textAnchor="middle" fontSize="10" fontWeight="700"
                fill={n.color} fontFamily="sans-serif">{n.label}</text>
              {/* Sub */}
              <text x={n.x} y={n.y + 50} textAnchor="middle" fontSize="10"
                fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">{n.sub}</text>
            </g>
          );
        })}

        {/* ── Resource labels on student↔alumni cross edge ── */}
        {(() => {
          const icons = [
            { comp: <text fontSize="15" fontFamily="sans-serif">📄</text>, label: "Notes", xOff: -14 },
            { comp: <text fontSize="15" fontFamily="sans-serif">🎥</text>, label: "Video", xOff: 14 },
          ];
          return null; // handled by packets above
        })()}
      </svg>
    </div>
  );
}

/* ─── Main Layout ─────────────────────────────────────────── */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [tagIdx, setTagIdx] = useState(0);
  const [tagFade, setTagFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setTagFade(false);
      setTimeout(() => {
        setTagIdx((i) => (i + 1) % taglines.length);
        setTagFade(true);
      }, 350);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-screen">
      {/* ── LEFT PANEL ── */}
      <div className="relative hidden w-[52%] shrink-0 overflow-hidden bg-[#080817] lg:flex lg:flex-col">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[110px]"
          style={{
            background: "radial-gradient(circle,rgba(99,102,241,0.28) 0%,transparent 70%)",
            animation: "snDrift1 14s ease-in-out infinite alternate"
          }} />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle,rgba(52,211,153,0.13) 0%,transparent 70%)",
            animation: "snDrift2 18s ease-in-out infinite alternate"
          }} />
        <div className="pointer-events-none absolute left-[40%] top-[35%] h-[300px] w-[300px] rounded-full blur-[90px]"
          style={{
            background: "radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 70%)",
            animation: "snDrift3 22s ease-in-out infinite alternate"
          }} />

        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col px-10 py-8">

          {/* ── Logo ── */}
          <div className="shrink-0" style={{ animation: "snFadeUp 0.5s ease both" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_24px_rgba(99,102,241,0.6)]">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-[1.2rem] font-bold leading-none tracking-tight text-white">
                  Student<span className="text-indigo-400">Nexus</span>
                </p>
                <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-white/30">
                  Verified Academic Network
                </p>
              </div>
            </div>
          </div>

          {/* ── Headline ── */}
          <div className="mt-6 shrink-0" style={{ animation: "snFadeUp 0.5s 0.08s ease both" }}>
            <h1 className="text-[2.1rem] font-extrabold leading-[1.16] tracking-tight text-white">
              Your Academic<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                Universe Awaits
              </span>
            </h1>
            <p className="mt-2 text-[0.82rem] text-white/40 leading-relaxed">
              The all-in-one platform where students, teachers &amp; alumni{" "}
              <br />collaborate, learn, and grow — together.
            </p>
          </div>

          {/* ── Rotating tagline ── */}
          <div className="mt-3 shrink-0 flex items-center gap-2" style={{ animation: "snFadeUp 0.5s 0.14s ease both" }}>
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-400 text-[10px]">✦</span>
            <p className="text-[0.78rem] font-medium text-indigo-300/80 transition-opacity duration-300 min-h-[1.1rem]"
              style={{ opacity: tagFade ? 1 : 0 }}>
              {taglines[tagIdx]}
            </p>
          </div>

          {/* ── Network Diagram ── */}
          <div className="relative mt-4 min-h-0 flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
            style={{ animation: "snFadeUp 0.5s 0.2s ease both" }}>
            <NetworkDiagram />
            {/* legend */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-10">
              {[
                { color: "#818cf8", name: "Student" },
                { color: "#f59e0b", name: "Teacher" },
                { color: "#34d399", name: "Alumni" },
                { color: "#f87171", name: "Peer" },
              ].map((n) => (
                <div key={n.name} className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: n.color }} />
                  <span className="text-[0.62rem] text-white/35 font-medium tracking-wide">{n.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trust badges ── */}
          <div className="mt-4 shrink-0 flex flex-col gap-1.5" style={{ animation: "snFadeUp 0.5s 0.28s ease both" }}>
            {trustItems.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-400">
                  <Icon size={11} strokeWidth={2} />
                </div>
                <span className="text-[0.72rem] text-white/40">{text}</span>
              </div>
            ))}
          </div>

          {/* ── Stats strip ── */}
          <div className="mt-4 shrink-0 grid grid-cols-4 gap-2 border-t border-white/[0.07] pt-4"
            style={{ animation: "snFadeUp 0.5s 0.36s ease both" }}>
            {statPills.map(({ icon: Icon, value, label }) => (
              <div key={label}
                className="flex flex-col items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] py-2.5 px-1 hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] transition-all duration-300">
                <Icon size={12} className="text-indigo-400" strokeWidth={2} />
                <p className="text-[0.98rem] font-bold tracking-tight text-white">{value}</p>
                <p className="text-[0.58rem] uppercase tracking-[0.05em] text-white/25">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: children ── */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
