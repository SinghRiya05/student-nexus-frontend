"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Eye, EyeOff, Lock, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#f87171", "#f59e0b", "#60a5fa", "#10b981"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      <p className="mt-1 text-[0.7rem] font-medium" style={{ color: colors[score] || "#9ca3af" }}>
        {score > 0 ? labels[score] : ""}
      </p>
    </div>
  );
}

function PasswordRule({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-[0.7rem] transition-colors ${met ? "text-emerald-600" : "text-gray-400"}`}>
      <CheckCircle2 size={11} strokeWidth={2.5} className={met ? "text-emerald-500" : "text-gray-300"} />
      {text}
    </div>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess]           = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = form.watch("password");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Reset password:", values);
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => router.push("/?mode=login"), 1800);
  };

  return (
    <>
      <style>{`
        @keyframes rpFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rpSlideIn {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes rpCheckBounce {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.18); }
          80%  { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rpPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.28); }
          50%       { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
        }
        .rp-card  { animation: rpSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .rp-row1  { animation: rpFadeUp 0.4s 0.05s ease both; }
        .rp-row2  { animation: rpFadeUp 0.4s 0.12s ease both; }
        .rp-row3  { animation: rpFadeUp 0.4s 0.18s ease both; }
        .rp-row4  { animation: rpFadeUp 0.4s 0.24s ease both; }
        .rp-row5  { animation: rpFadeUp 0.4s 0.30s ease both; }
        .rp-check { animation: rpCheckBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
        .rp-icon-pulse { animation: rpPulse 2s ease-in-out infinite; }

        .rp-input {
          height: 46px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          font-size: 0.9rem;
          padding-left: 2.75rem;
          padding-right: 2.75rem;
          width: 100%;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .rp-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
          outline: none;
        }
        .rp-input.error {
          border-color: #f87171;
          background: #fff1f2;
        }
        .rp-input.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239,68,68,0.1);
        }
        .rp-input::placeholder { color: #9ca3af; }

        .rp-btn {
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 13px;
          box-shadow: 0 4px 16px rgba(99,102,241,0.28);
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          color: white; font-size: 0.9rem; font-weight: 600;
          transition: all 0.2s ease; border: none; cursor: pointer;
        }
        .rp-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(99,102,241,0.38);
        }
        .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8 w-full">
        {/* Ambient Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

        <div className="rp-card relative z-10 w-full max-w-[420px]">
          {/* Card */}
          <div className="rounded-[24px] border border-white bg-white/70 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl">

            {/* Logo */}
            <div className="rp-row1 mb-7 flex items-center justify-center gap-2.5">
              <div className="rp-icon-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-[1.08rem] font-bold leading-none text-gray-900">
                  Student<span className="text-indigo-500">Nexus</span>
                </p>
                <p className="mt-0.5 text-[0.55rem] uppercase tracking-[0.14em] text-gray-400">
                  Verified Academic Network
                </p>
              </div>
            </div>

            {success ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center py-4 text-center">
                <div className="rp-check mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200">
                  <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
                    <circle cx="24" cy="24" r="22" fill="rgba(52,211,153,0.15)" />
                    <path d="M14 25l8 8 13-14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-[1.35rem] font-bold text-gray-900">Password updated!</h3>
                <p className="mt-2 text-[0.84rem] text-gray-500 leading-relaxed">
                  Your password has been reset successfully.<br />
                  Redirecting you to sign in…
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="rp-row1 mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-[0_4px_14px_rgba(99,102,241,0.1)]">
                    <Lock size={26} className="text-indigo-500" strokeWidth={1.7} />
                  </div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                      Set New Password
                    </span>
                  </div>
                  <h2 className="mt-2 text-[1.5rem] font-bold tracking-tight text-gray-900">
                    Create new password
                  </h2>
                  <p className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                    Make it strong and unique — your account security matters.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* New password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem className="rp-row2">
                          <Label className="text-[0.8rem] font-semibold text-gray-700">
                            New Password
                          </Label>
                          <FormControl>
                            <div className="relative mt-1.5">
                              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className={`rp-input ${fieldState.error ? "error" : ""}`}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </FormControl>
                          {/* Strength bar */}
                          {password && <StrengthBar password={password} />}
                          <FormMessage className="text-[0.74rem]" />
                        </FormItem>
                      )}
                    />

                    {/* Password rules */}
                    {password && (
                      <div className="rp-row2 grid grid-cols-2 gap-1 rounded-xl bg-gray-50 border border-gray-100 p-3">
                        <PasswordRule met={password.length >= 8} text="8+ characters" />
                        <PasswordRule met={/[A-Z]/.test(password)} text="Uppercase letter" />
                        <PasswordRule met={/[0-9]/.test(password)} text="One number" />
                        <PasswordRule met={/[^A-Za-z0-9]/.test(password)} text="Special character" />
                      </div>
                    )}

                    {/* Confirm password */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field, fieldState }) => (
                        <FormItem className="rp-row3">
                          <Label className="text-[0.8rem] font-semibold text-gray-700">
                            Confirm Password
                          </Label>
                          <FormControl>
                            <div className="relative mt-1.5">
                              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                              <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm your password"
                                className={`rp-input ${fieldState.error ? "error" : ""}`}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.74rem]" />
                        </FormItem>
                      )}
                    />

                    {/* Submit */}
                    <div className="rp-row4 pt-1">
                      <button type="submit" disabled={isSubmitting} className="rp-btn">
                        {isSubmitting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <><span>Reset Password</span><ArrowRight size={16} strokeWidth={2.5} /></>
                        )}
                      </button>
                    </div>
                  </form>
                </Form>

                {/* Trust strip */}
                <div className="rp-row5 mt-5 flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5">
                  <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
                  <span className="text-[0.65rem] text-gray-400">
                    Your password is encrypted and stored securely
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}