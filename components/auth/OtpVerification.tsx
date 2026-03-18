"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  GraduationCap, ShieldCheck, Mail, RefreshCw, ArrowRight, ArrowLeft,
} from "lucide-react";
import {
  Form, FormField, FormItem, FormControl,
} from "@/components/ui/form";

const otpSchema = z.object({
  otp: z.string().length(6, "Enter all 6 digits.").regex(/^\d{6}$/, "OTP must be 6 digits."),
});
type OtpFormValues = z.infer<typeof otpSchema>;

const RESEND_COOLDOWN = 30;

type OtpVerificationProps = {
  type: "signup" | "reset-password";
  email?: string;
};

export default function OtpVerificationPage({ type, email = "u**r@university.edu" }: OtpVerificationProps) {
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [digits, setDigits]           = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified]   = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown]       = useState(0);
  const [shakeError, setShakeError]   = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");

  const setInputRef = React.useCallback(
    (idx: number) => (el: HTMLInputElement | null) => { inputRefs.current[idx] = el; },
    []
  );

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // Sync digits → form
  useEffect(() => {
    form.setValue("otp", digits.join(""), { shouldValidate: digits.join("").length === 6 });
  }, [digits, form]);

  // Countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Focus first on mount
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const filledCount = digits.filter(Boolean).length;
  const progress = Math.round((filledCount / 6) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    if (val.length === 6 && idx === 0) {
      setDigits(val.split(""));
      inputRefs.current[5]?.focus();
      return;
    }
    const char = val.slice(-1);
    const next = [...digits]; next[idx] = char;
    setDigits(next);
    setErrorMsg("");
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits]; next[idx] = ""; setDigits(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent, idx: number) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const onSubmit = async () => {
    const otp = digits.join("");
    if (otp.length < 6) return;
    setIsVerifying(true);
    setErrorMsg("");
    await new Promise((r) => setTimeout(r, 1800));

    if (otp === "123456") {
      setIsVerified(true);
      setTimeout(() => {
        if (type === "signup") router.push("/?mode=login");
        if (type === "reset-password") router.push("/?mode=reset-password");
      }, 1400);
    } else {
      setShakeError(true);
      setErrorMsg("Incorrect OTP. Try again.");
      setDigits(Array(6).fill(""));
      setTimeout(() => {
        setShakeError(false);
        inputRefs.current[0]?.focus();
      }, 600);
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setDigits(Array(6).fill(""));
    setErrorMsg("");
    form.clearErrors();
    await new Promise((r) => setTimeout(r, 1000));
    setIsResending(false);
    setCooldown(RESEND_COOLDOWN);
    inputRefs.current[0]?.focus();
  };

  return (
    <>
      <style>{`
        @keyframes ovFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes ovSlideIn {
          from { opacity:0; transform:scale(0.93) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes ovShake {
          0%,100%{ transform:translateX(0); }
          15%    { transform:translateX(-7px); }
          30%    { transform:translateX(7px); }
          45%    { transform:translateX(-4px); }
          60%    { transform:translateX(4px); }
          75%    { transform:translateX(-2px); }
          90%    { transform:translateX(2px); }
        }
        @keyframes ovCheckBounce {
          0%   { transform:scale(0.4); opacity:0; }
          60%  { transform:scale(1.18); }
          80%  { transform:scale(0.95); }
          100% { transform:scale(1);   opacity:1; }
        }
        @keyframes ovPulseRing {
          0%   { transform:scale(1); opacity:0.55; }
          100% { transform:scale(1.65); opacity:0; }
        }
        .ov-card        { animation: ovSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .ov-row1        { animation: ovFadeUp 0.4s 0.05s ease both; }
        .ov-row2        { animation: ovFadeUp 0.4s 0.12s ease both; }
        .ov-row3        { animation: ovFadeUp 0.4s 0.18s ease both; }
        .ov-row4        { animation: ovFadeUp 0.4s 0.24s ease both; }
        .ov-row5        { animation: ovFadeUp 0.4s 0.3s  ease both; }
        .ov-shake       { animation: ovShake 0.55s cubic-bezier(.36,.07,.19,.97) both; }
        .ov-check       { animation: ovCheckBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
        .ov-pulse-ring  { animation: ovPulseRing 1.8s ease-out infinite; }

        .ov-otp-box {
          width: 52px; height: 60px;
          text-align: center;
          font-size: 1.5rem; font-weight: 700;
          border-radius: 13px;
          border: 2px solid #e5e7eb;
          background: #fafafa;
          color: #111827;
          outline: none;
          caret-color: transparent;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
          -webkit-appearance: none; -moz-appearance: textfield;
        }
        .ov-otp-box:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
          transform: translateY(-3px) scale(1.07);
        }
        .ov-otp-box.filled {
          border-color: #8b5cf6;
          background: #faf5ff;
          color: #5b21b6;
          transform: translateY(-1px);
        }
        .ov-otp-box.has-error {
          border-color: #f87171;
          background: #fff1f2;
          color: #b91c1c;
        }
        .ov-otp-box.success {
          border-color: #10b981;
          background: #ecfdf5;
          color: #065f46;
        }
        .ov-otp-box::-webkit-inner-spin-button,
        .ov-otp-box::-webkit-outer-spin-button { -webkit-appearance: none; }

        .ov-verify-btn {
          height: 48px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 13px;
          box-shadow: 0 4px 16px rgba(99,102,241,0.28);
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          color: white; font-size: 0.9rem; font-weight: 600;
          transition: all 0.2s ease;
          border: none; cursor: pointer;
        }
        .ov-verify-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(99,102,241,0.38);
        }
        .ov-verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ov-progress-bar {
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 99px;
          transition: width 0.25s ease;
        }
      `}</style>

      <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8 w-full">
        {/* Ambient Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

        <div className="ov-card relative z-10 w-full max-w-[440px]">
          {/* Card */}
          <div className="rounded-[24px] border border-white bg-white/70 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl">

            {/* Logo */}
            <div className="ov-row1 mb-7 flex items-center justify-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.35)]">
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

            {/* ── Success State ── */}
            {isVerified ? (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="ov-check mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200">
                  <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
                    <circle cx="24" cy="24" r="22" fill="rgba(52,211,153,0.15)" />
                    <path d="M14 25l8 8 13-14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-[1.35rem] font-bold text-gray-900">Verified!</h3>
                <p className="mt-2 text-[0.84rem] text-gray-500">
                  {type === "signup" ? "Account verified. Taking you to login…" : "OTP confirmed. Redirecting…"}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="ov-row1 mb-6 text-center">
                  <div className="relative mx-auto mb-4 h-16 w-16">
                    <div className="ov-pulse-ring absolute inset-0 rounded-full border-2 border-indigo-200" />
                    <div className="ov-pulse-ring absolute inset-0 rounded-full border-2 border-indigo-100" style={{ animationDelay: "0.7s" }} />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-100">
                      <Mail size={26} className="text-indigo-500" strokeWidth={1.7} />
                    </div>
                  </div>

                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                      {type === "signup" ? "Email Verification" : "Password Reset"}
                    </span>
                  </div>
                  <h2 className="mt-2 text-[1.5rem] font-bold tracking-tight text-gray-900">
                    Check your inbox
                  </h2>
                  <p className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-gray-800">{email}</span>
                  </p>
                </div>

                {/* Progress bar */}
                {filledCount > 0 && (
                  <div className="ov-row2 mb-4">
                    <div className="h-[3px] w-full rounded-full bg-gray-100">
                      <div className="ov-progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="mt-1 text-right text-[0.66rem] text-gray-400">{filledCount}/6 digits</p>
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
                    <FormField
                      control={form.control}
                      name="otp"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <div
                              className={`ov-row2 flex justify-center gap-2 ${shakeError ? "ov-shake" : ""}`}
                            >
                              {digits.map((d, idx) => (
                                <input
                                  key={idx}
                                  ref={setInputRef(idx)}
                                  type="number"
                                  inputMode="numeric"
                                  maxLength={1}
                                  value={d}
                                  onChange={(e) => handleChange(e, idx)}
                                  onKeyDown={(e) => handleKeyDown(e, idx)}
                                  onPaste={(e) => handlePaste(e, idx)}
                                  onFocus={(e) => e.target.select()}
                                  disabled={isVerifying}
                                  aria-label={`OTP digit ${idx + 1}`}
                                  className={[
                                    "ov-otp-box",
                                    errorMsg      ? "has-error"
                                    : d           ? "filled"
                                    : "",
                                  ].join(" ")}
                                />
                              ))}
                            </div>
                          </FormControl>
                          {errorMsg && (
                            <p className="mt-2.5 text-center text-[0.75rem] font-medium text-red-500">
                              ⚠ {errorMsg}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Verify button */}
                    <div className="ov-row3">
                      <button
                        type="submit"
                        disabled={filledCount < 6 || isVerifying}
                        className="ov-verify-btn"
                      >
                        {isVerifying
                          ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          : <><span>Verify & Continue</span><ArrowRight size={16} strokeWidth={2.5} /></>
                        }
                      </button>
                    </div>
                  </form>
                </Form>

                {/* Resend */}
                <div className="ov-row4 mt-4 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isResending}
                    className="flex items-center gap-1.5 text-[0.79rem] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RefreshCw size={13} className={isResending ? "animate-spin" : ""} strokeWidth={2.5} />
                    {isResending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-[0.79rem] font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft size={13} strokeWidth={2.5} /> Change email
                  </button>
                </div>

                {/* Divider */}
                <div className="ov-row4 my-5 h-px bg-gray-100" />

                {/* Trust strip */}
                <div className="ov-row5 flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5">
                  <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
                  <span className="text-[0.65rem] text-gray-400">
                    Never share your OTP · Secured · Trusted by 500+ institutions
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Dev hint */}
          {!isVerified && (
            <p className="mt-4 text-center text-[0.7rem] text-gray-400">
              Testing? Use{" "}
              <kbd className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[0.65rem] text-gray-600 border border-gray-200">
                123456
              </kbd>
            </p>
          )}
        </div>
      </div>
    </>
  );
}