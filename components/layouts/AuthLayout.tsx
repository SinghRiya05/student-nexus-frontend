"use client";

import React , {useEffect,useState} from "react";
import { Users,
  Network,
  Briefcase,
  BookOpen,
  Star,GraduationCap,ShieldCheck,} from "lucide-react";


const taglines = [
  "Connect with verified peers across 500+ universities.",
  "Get mentored by alumni at top companies.",
  "Collaborate on projects with students nationwide.",
  "Find seniors who've walked your exact path.",
  "Build your academic network. Shape your career.",
];

const statPills = [
  { icon: Users, value: "50K+", label: "Students" },
  { icon: GraduationCap, value: "500+", label: "Universities" },
  { icon: Briefcase, value: "12K+", label: "Alumni" },
  { icon: BookOpen, value: "200+", label: "Courses" },
];


const trustItems = [
  { icon: ShieldCheck, text: "Verified via official college email" },
  { icon: Network, text: "Multi-university networking" },
  { icon: Star, text: "Peer learning & alumni mentorship" },
];

function CommunicationDiagram() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <style>{`
        @keyframes flowDash  { to { stroke-dashoffset: -24; } }
        .sn-flow1 { stroke-dasharray: 6 6; animation: flowDash 1.8s linear infinite; }
        .sn-flow2 { stroke-dasharray: 6 6; animation: flowDash 2.2s linear infinite reverse; }
        .sn-flow3 { stroke-dasharray: 6 6; animation: flowDash 2.0s linear infinite; }
        .sn-flow4 { stroke-dasharray: 6 6; animation: flowDash 2.4s linear infinite reverse; }
      `}</style>

      <svg
        viewBox="0 0 420 340"
        className="w-full h-full"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      >
        <defs>
          <marker
            id="sn-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke="context-stroke"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* ── Connection lines ── */}
        <line
          x1="128"
          y1="108"
          x2="185"
          y2="158"
          stroke="#8b5cf6"
          strokeWidth="1.5"
          fill="none"
          className="sn-flow1"
          markerEnd="url(#sn-arrow)"
          markerStart="url(#sn-arrow)"
        />
        <line
          x1="128"
          y1="232"
          x2="185"
          y2="182"
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
          className="sn-flow2"
          markerEnd="url(#sn-arrow)"
          markerStart="url(#sn-arrow)"
        />
        <line
          x1="292"
          y1="108"
          x2="235"
          y2="158"
          stroke="#f59e0b"
          strokeWidth="1.5"
          fill="none"
          className="sn-flow3"
          markerEnd="url(#sn-arrow)"
          markerStart="url(#sn-arrow)"
        />
        <line
          x1="292"
          y1="232"
          x2="235"
          y2="182"
          stroke="#f87171"
          strokeWidth="1.5"
          fill="none"
          className="sn-flow4"
          markerEnd="url(#sn-arrow)"
          markerStart="url(#sn-arrow)"
        />

        {/* ── Centre: Message Hub ── */}
        <rect
          x="160"
          y="148"
          width="100"
          height="64"
          rx="14"
          fill="rgba(99,102,241,0.15)"
          stroke="rgba(99,102,241,0.5)"
          strokeWidth="1.5"
        />
        <rect
          x="178"
          y="158"
          width="44"
          height="30"
          rx="7"
          fill="rgba(99,102,241,0.85)"
        />
        <rect
          x="183"
          y="163"
          width="14"
          height="2.5"
          rx="1.2"
          fill="rgba(255,255,255,0.8)"
        />
        <rect
          x="183"
          y="168"
          width="20"
          height="2.5"
          rx="1.2"
          fill="rgba(255,255,255,0.8)"
        />
        <rect
          x="183"
          y="173"
          width="10"
          height="2.5"
          rx="1.2"
          fill="rgba(255,255,255,0.8)"
        />
        <polygon
          points="182,188 190,188 182,196"
          fill="rgba(99,102,241,0.85)"
        />
        <text
          x="210"
          y="162"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="rgba(255,255,255,0.9)"
          fontFamily="sans-serif"
        >
          MSG
        </text>
        <text
          x="210"
          y="204"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="white"
          fontFamily="sans-serif"
        >
          Message
        </text>

        {/* ── Node: Student (top-left) ── */}
        <rect
          x="60"
          y="56"
          width="96"
          height="88"
          rx="14"
          fill="rgba(139,92,246,0.12)"
          stroke="rgba(139,92,246,0.4)"
          strokeWidth="1"
        />
        <ellipse cx="108" cy="96" rx="18" ry="5" fill="rgba(139,92,246,0.7)" />
        <rect
          x="98"
          y="84"
          width="20"
          height="13"
          rx="3"
          fill="rgba(109,40,217,0.8)"
        />
        <rect
          x="93"
          y="82"
          width="30"
          height="5"
          rx="2"
          fill="rgba(109,40,217,0.9)"
        />
        <line
          x1="123"
          y1="82"
          x2="127"
          y2="95"
          stroke="rgba(139,92,246,0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="127" cy="96" r="2.5" fill="rgba(139,92,246,0.9)" />
        <text
          x="108"
          y="120"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="rgba(255,255,255,0.95)"
          fontFamily="sans-serif"
        >
          Student
        </text>
        <text
          x="108"
          y="133"
          textAnchor="middle"
          fontSize="8"
          fontWeight="400"
          fill="rgba(255,255,255,0.45)"
          fontFamily="sans-serif"
        >
          Learns &amp; connects
        </text>

        {/* ── Node: Alumni (bottom-left) ── */}
        <rect
          x="60"
          y="196"
          width="96"
          height="88"
          rx="14"
          fill="rgba(16,185,129,0.1)"
          stroke="rgba(16,185,129,0.35)"
          strokeWidth="1"
        />
        <rect
          x="90"
          y="226"
          width="36"
          height="26"
          rx="4"
          fill="rgba(16,185,129,0.75)"
        />
        <rect
          x="100"
          y="221"
          width="16"
          height="7"
          rx="3"
          fill="rgba(5,150,105,0.9)"
        />
        <line
          x1="90"
          y1="237"
          x2="126"
          y2="237"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        <line
          x1="108"
          y1="226"
          x2="108"
          y2="252"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        <text
          x="108"
          y="266"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="rgba(255,255,255,0.95)"
          fontFamily="sans-serif"
        >
          Alumni
        </text>
        <text
          x="108"
          y="279"
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255,255,255,0.45)"
          fontFamily="sans-serif"
        >
          Mentors &amp; guides
        </text>

        {/* ── Node: Teacher (top-right) ── */}
        <rect
          x="264"
          y="56"
          width="96"
          height="88"
          rx="14"
          fill="rgba(245,158,11,0.1)"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="1"
        />
        <rect
          x="296"
          y="82"
          width="28"
          height="22"
          rx="3"
          fill="rgba(217,119,6,0.8)"
        />
        <line
          x1="301"
          y1="89"
          x2="319"
          y2="89"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.3"
        />
        <line
          x1="301"
          y1="94"
          x2="316"
          y2="94"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.3"
        />
        <line
          x1="301"
          y1="99"
          x2="314"
          y2="99"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth="1.3"
        />
        <polygon points="326,104 330,96 322,98" fill="rgba(245,158,11,0.9)" />
        <text
          x="312"
          y="120"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="rgba(255,255,255,0.95)"
          fontFamily="sans-serif"
        >
          Teacher
        </text>
        <text
          x="312"
          y="133"
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255,255,255,0.45)"
          fontFamily="sans-serif"
        >
          Teaches &amp; assigns
        </text>

        {/* ── Node: Peer (bottom-right) ── */}
        <rect
          x="264"
          y="196"
          width="96"
          height="88"
          rx="14"
          fill="rgba(248,113,113,0.1)"
          stroke="rgba(248,113,113,0.35)"
          strokeWidth="1"
        />
        <circle cx="304" cy="224" r="9" fill="rgba(239,68,68,0.75)" />
        <path
          d="M288,252 Q288,238 304,238 Q320,238 320,252Z"
          fill="rgba(239,68,68,0.7)"
        />
        <circle cx="322" cy="222" r="7" fill="rgba(239,68,68,0.5)" />
        <path
          d="M310,252 Q312,240 322,240 Q332,240 332,252Z"
          fill="rgba(239,68,68,0.45)"
        />
        <text
          x="312"
          y="266"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="rgba(255,255,255,0.95)"
          fontFamily="sans-serif"
        >
          Peer
        </text>
        <text
          x="312"
          y="279"
          textAnchor="middle"
          fontSize="8"
          fill="rgba(255,255,255,0.45)"
          fontFamily="sans-serif"
        >
          Collaborates
        </text>

        {/* ── "2-way" labels ── */}
        <text
          x="150"
          y="128"
          textAnchor="middle"
          fontSize="7.5"
          fill="rgba(139,92,246,0.7)"
          fontFamily="sans-serif"
        >
          2-way
        </text>
        <text
          x="150"
          y="222"
          textAnchor="middle"
          fontSize="7.5"
          fill="rgba(16,185,129,0.7)"
          fontFamily="sans-serif"
        >
          2-way
        </text>
        <text
          x="270"
          y="128"
          textAnchor="middle"
          fontSize="7.5"
          fill="rgba(245,158,11,0.7)"
          fontFamily="sans-serif"
        >
          2-way
        </text>
        <text
          x="270"
          y="222"
          textAnchor="middle"
          fontSize="7.5"
          fill="rgba(248,113,113,0.7)"
          fontFamily="sans-serif"
        >
          2-way
        </text>
      </svg>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode; }) {
 
   const [tagIdx, setTagIdx] = useState(0);
    const [tagFade, setTagFade] = useState(true);

  useEffect(() => {
      const t = setInterval(() => {
        setTagFade(false);
        setTimeout(() => {
          setTagIdx((i) => (i + 1) % taglines.length);
          setTagFade(true);
        }, 350);
      }, 3000);
      return () => clearInterval(t);
    }, []);
  
  return (
    <div className="flex h-screen  ">
      <div className="relative hidden w-[52%] shrink-0 overflow-hidden bg-[#0a0918] lg:flex lg:flex-col">
          <div
            className="pointer-events-none absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle,rgba(99,102,241,0.32) 0%,transparent 70%)",
              animation: "snDrift1 14s ease-in-out infinite alternate",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-28 -right-20 h-[400px] w-[400px] rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle,rgba(6,182,212,0.18) 0%,transparent 70%)",
              animation: "snDrift2 18s ease-in-out infinite alternate",
            }}
          />
          <div
            className="pointer-events-none absolute left-[48%] top-[38%] h-[280px] w-[280px] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle,rgba(139,92,246,0.16) 0%,transparent 70%)",
              animation: "snDrift3 22s ease-in-out infinite alternate",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative z-10 flex h-full flex-col px-10 py-8">
            {/* Logo */}
            <div
              className="shrink-0"
              style={{ animation: "snFadeUp 0.5s ease both" }}
            >
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

            {/* Tagline */}
            <div
              className="mt-5 shrink-0"
              style={{ animation: "snFadeUp 0.5s 0.08s ease both" }}
            >
              <p
                className="text-[0.78rem] font-medium text-white/45 transition-opacity duration-300 min-h-[1.4rem]"
                style={{ opacity: tagFade ? 1 : 0 }}
              >
                ✦ &nbsp;{taglines[tagIdx]}
              </p>
            </div>

            {/* Heading */}
            <div
              className="mt-2 shrink-0"
              style={{ animation: "snFadeUp 0.5s 0.14s ease both" }}
            >
              <h1 className="text-[1.95rem] font-bold leading-[1.18] -tracking-[0.03em] text-white">
                Your Academic
                <br />
                <span className="sn-shimmer">Universe Awaits</span>
              </h1>
            </div>

            {/* ── Diagram ── */}
            <div
              className="relative mt-4 min-h-0 flex-1"
              style={{
                animation: "snFadeUp 0.5s 0.2s ease both",
                animationFillMode: "both",
              }}
            >
              <CommunicationDiagram />
            </div>

            {/* Trust badges */}
            <div
              className="mt-3 shrink-0 flex flex-col gap-1.5"
              style={{ animation: "snFadeUp 0.5s 0.28s ease both" }}
            >
              {trustItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-400">
                    <Icon size={11} strokeWidth={2} />
                  </div>
                  <span className="text-[0.72rem] text-white/40">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats strip */}
            <div
              className="mt-4 shrink-0 grid grid-cols-4 gap-2 border-t border-white/[0.07] pt-4"
              style={{ animation: "snFadeUp 0.5s 0.35s ease both" }}
            >
              {statPills.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-0.5 rounded-xl border border-white/[0.07] bg-white/[0.03] py-2 px-1"
                >
                  <Icon size={11} className="text-indigo-400" strokeWidth={2} />
                  <p className="text-[0.95rem] font-bold -tracking-wide text-white">
                    {value}
                  </p>
                  <p className="text-[0.58rem] uppercase tracking-[0.04em] text-white/25">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
    
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
      
  );
}
