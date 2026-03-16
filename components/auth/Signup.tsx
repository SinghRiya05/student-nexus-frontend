"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User, Mail, Phone, Lock, BookOpen,
  ArrowRight, ArrowLeft, GraduationCap,
  ShieldCheck, Users, Layers,
  CheckCircle2, Award, Globe, Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─── Zod Schemas ─────────────────────────────
// ─────────────────────────────────
const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName:  z.string().min(2, "Last name must be at least 2 characters."),
  email:     z.string().email("Enter a valid university email."),
  phone:     z.string().min(10, "Enter a valid 10-digit phone number.").max(13),
  password:  z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one symbol."),
});

const step2Schema = z.object({
  university: z.string().min(1, "Please select your university."),
  course:     z.string().min(1, "Please select your course."),
  semester:   z.string().min(1, "Please select your semester."),
  role:       z.string().min(1, "Please select your role."),
});

const fullSchema = step1Schema.merge(step2Schema);
type FullFormValues = z.infer<typeof fullSchema>;

// ─── Left panel info cards ────────────────────────────────────────────────────
const infoCards = [
  {
    icon: ShieldCheck,
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.28)",
    title: "100% Verified",
    desc: "Every account is authenticated via official university email — no fake profiles.",
  },
  {
    icon: Award,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.28)",
    title: "Build Your Profile",
    desc: "Showcase your skills, courses, and achievements to peers and alumni.",
  },
  
  {
    icon: Clock,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.28)",
    title: "Takes 2 Minutes",
    desc: "Quick two-step registration — fill your details and you're in.",
  },
];

const stepLabels = ["Personal Info", "Academic Details"];



// ─── Shared input class (mirrors Login page style) ────────────────────────────
const inputCls =
  "h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-10 pr-4 " +
  "text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 " +
  "focus-visible:border-indigo-500 focus-visible:bg-white " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SignupPage() {

  const router=useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single form instance for the entire multi-step flow
  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "", lastName: "", email: "",
      phone: "", password: "",
      university: "", course: "", semester: "", role: "",
    },
  });

  const { trigger } = form;

  // Step 1 → Step 2: validate only step-1 fields before advancing
  const handleNext = async () => {
    const valid = await trigger(["firstName", "lastName", "email", "phone", "password"]);
    if (valid) setStep(2);
  };

  const handleBack = () => setStep(1);

  const onSubmit = async (values: FullFormValues) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    console.log("Signup payload:", values);
    setIsSubmitting(false);
    router.push("/?mode=verify-otp&type=signup")
  };

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden">

        {/* ══════════════ LEFT PANEL ══════════════ */}
        <div className="relative hidden w-[52%] shrink-0 overflow-hidden bg-[#0a0918] lg:flex lg:flex-col">

          {/* Ambient orbs */}
          <div className="pointer-events-none absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle,rgba(99,102,241,0.32) 0%,transparent 70%)", animation: "snDrift1 14s ease-in-out infinite alternate" }} />
          <div className="pointer-events-none absolute -bottom-28 -right-20 h-[400px] w-[400px] rounded-full blur-[90px]"
            style={{ background: "radial-gradient(circle,rgba(6,182,212,0.18) 0%,transparent 70%)", animation: "snDrift2 18s ease-in-out infinite alternate" }} />
          <div className="pointer-events-none absolute left-[48%] top-[38%] h-[280px] w-[280px] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle,rgba(139,92,246,0.16) 0%,transparent 70%)", animation: "snDrift3 22s ease-in-out infinite alternate" }} />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)", backgroundSize: "36px 36px" }} />

          {/* Content column */}
          <div className="relative z-10 flex h-full flex-col px-10 py-8">

            {/* Logo */}
            <div className="shrink-0" style={{ animation: "snFadeUp 0.5s ease both" }}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[1.15rem] font-bold leading-none text-white -tracking-wide">
                    Student<span className="text-indigo-400">Nexus</span>
                  </p>
                  <p className="text-[0.58rem] uppercase tracking-[0.14em] text-white/30 mt-0.5">
                    Verified Academic Network
                  </p>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="mt-6 shrink-0" style={{ animation: "snFadeUp 0.5s 0.1s ease both" }}>
              <p className="text-[0.75rem] font-medium text-white/40 mb-2">
                ✦ &nbsp;Join 50,000+ verified students across India
              </p>
              <h1 className="text-[2rem] font-bold leading-[1.16] -tracking-[0.03em] text-white">
                Your Academic<br />
                <span className="sn-shimmer">Journey Starts Here</span>
              </h1>
            </div>

            {/* Info cards */}
            <div className="mt-8 min-h-0 flex-1 flex flex-col gap-3" style={{ animation: "snFadeUp 0.5s 0.18s ease both" }}>
              {infoCards.map(({ icon: Icon, color, bg, border, title, desc }) => (
                <div key={title}
                  className="flex items-start gap-3 rounded-2xl px-4 py-3.5"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${color}22` }}>
                    <Icon size={15} style={{ color }} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[0.78rem] font-bold text-white/90 leading-none mb-1">{title}</p>
                    <p className="text-[0.68rem] text-white/40 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Step tracker */}
            <div className="mt-5 shrink-0" style={{ animation: "snFadeUp 0.5s 0.26s ease both" }}>
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                {stepLabels.map((label, i) => {
                  const idx = (i + 1) as 1 | 2;
                  const active = step === idx;
                  const done = step > idx;
                  return (
                    <React.Fragment key={label}>
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold transition-all duration-300"
                          style={{
                            background: done ? "#10b981" : active ? "#6366f1" : "rgba(255,255,255,0.08)",
                            color: done || active ? "#fff" : "rgba(255,255,255,0.3)",
                          }}>
                          {done ? <CheckCircle2 size={12} /> : idx}
                        </div>
                        <span className="text-[0.65rem] font-semibold transition-colors duration-300"
                          style={{ color: active ? "rgba(255,255,255,0.9)" : done ? "#10b981" : "rgba(255,255,255,0.3)" }}>
                          {label}
                        </span>
                      </div>
                      {i < stepLabels.length - 1 && (
                        <div className="flex-1 h-px transition-all duration-500"
                          style={{ background: step > 1 ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)" }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <div className="relative flex flex-1 items-center justify-center bg-white px-5 py-6 ">

          <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-indigo-100/60 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-violet-100/40 blur-[70px]" />

          <div className="relative z-10 mx-auto w-full max-w-[420px] py-4"
            style={{ animation: "snFadeUp 0.65s 0.15s ease both" }}>

            {/* Mobile logo */}
            <div className="mb-7 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <GraduationCap size={17} />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Student<span className="text-indigo-600">Nexus</span>
              </span>
            </div>

            {/* Header */}
            <div className="mb-5">
              <h2 className="mb-1.5 text-[1.7rem] font-bold leading-[1.15] -tracking-[0.03em] text-gray-900">
                {step === 1 ? "Create your account" : "Academic details"}
              </h2>
              <p className="text-[0.84rem] leading-relaxed text-gray-500">
                {step === 1
                  ? "Fill in your personal information to get started."
                  : "Tell us about your university and course."}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-6 flex gap-1.5">
              {[1, 2].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                  style={{ background: step >= i ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#e5e7eb" }} />
              ))}
            </div>

            {/* ──── FORM ──── */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >

                {/* ── STEP 1 ── */}
                {step === 1 && (
                  <div className="sn-step space-y-4">

                    {/* First + Last name */}
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name="firstName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">First Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input placeholder="Riya" className={inputCls} {...field} />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="lastName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Last Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input placeholder="Singh" className={inputCls} {...field} />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Email */}
                    <FormField control={form.control} name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input type="email" placeholder="name@university.edu" autoComplete="email" className={inputCls} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField control={form.control} name="phone"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input type="tel" placeholder="+91 98765 43210" className={inputCls} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField control={form.control} name="password"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input type="password" placeholder="••••••••••" autoComplete="new-password" className={inputCls} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* ── STEP 2 ── */}
                {step === 2 && (
                  <div className="sn-step space-y-4">

                    {/* University */}
                    <FormField control={form.control} name="university"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">University / Institution</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <GraduationCap size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <SelectTrigger className={inputCls + " pl-10"}>
                                  <SelectValue placeholder="Select your university" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {["University of Delhi","IIT Delhi","IIT Bombay","Mumbai University","BITS Pilani","NIT Trichy","Anna University","Pune University","Other"].map(u => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                     <FormField control={form.control} name="role"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Your Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <div className="relative">
                                  <Users size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                  <SelectTrigger className={inputCls + " pl-10"}>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {["Student","Alumni","Teacher","Peer Mentor"].map(r => (
                                  <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />

                    {/* Course */}
                    <FormField control={form.control} name="course"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Course / Programme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <BookOpen size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <SelectTrigger className={inputCls + " pl-10"}>
                                  <SelectValue placeholder="Select your course" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {["B.Tech Computer Science","B.Tech Electronics","BCA","MCA","M.Tech AI / ML","MBA","B.Sc Physics / Maths","Other"].map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                      <FormField control={form.control} name="semester"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Semester</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <div className="relative">
                                  <Layers size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                  <SelectTrigger className={inputCls + " pl-10"}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {[1,2,3,4,5,6,7,8].map(s => (
                                  <SelectItem key={s} value={`${s}`}>Semester {s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />
                     
                  
                  </div>
                )}

                {/* ── Actions ── */}
                <div className="flex flex-col gap-3 pt-2">
                  {step === 1 ? (
                    <Button
                      onClick={handleNext}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-blue-800"
                    >
                      Continue to Academic Details
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex h-11 w-full items-center justify-center bg-blue-800 rounded-[10px] "
                    >
                      {isSubmitting
                        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        : <><span>Create My Account</span><ArrowRight size={15} strokeWidth={2.5} /></>
                      }
                    </Button>
                  )}

                  {step === 2 && (
                    <Button
                      variant={"outline"}
                      onClick={handleBack}
                      className=""
                    >
                      <ArrowLeft size={13} strokeWidth={2} />
                      Back to Personal Info
                    </Button>
                  )}
                </div>

              </form>
            </Form>

            {/* Sign in link */}
            <p className="mt-6 text-center text-[0.8rem] text-gray-500">
              Already have an account?{" "}
              <Link href="?mode=login" className="font-bold text-indigo-600 transition-opacity hover:opacity-75">
                LogIn instead →
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}