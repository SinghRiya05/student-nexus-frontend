"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  GraduationCap, ShieldCheck, Mail, RefreshCw, ArrowRight, ArrowLeft,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/utils/hook";
import { verifyEmail, verifyResetOtp, resendOtp, forgotPassword } from "@/features/auth/authThunk";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  onSuccess?: () => void;
  isStep?: boolean;
};

export default function OtpVerificationPage({ 
  type, 
  email: propEmail, 
  onSuccess, 
  isStep = false 
}: OtpVerificationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const email = propEmail || searchParams.get("email") || "your email";
  
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

    let result;
    if (type === "signup") {
      result = await dispatch(verifyEmail({ email, otp }));
    } else {
      result = await dispatch(verifyResetOtp({ email, otp }));
    }

    if (verifyEmail.fulfilled.match(result) || verifyResetOtp.fulfilled.match(result)) {
      setIsVerified(true);
      toast.success("Verification successful!");
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          if (type === "signup") router.push("/?mode=login");
          if (type === "reset-password") router.push(`/?mode=reset-password&email=${encodeURIComponent(email)}&otp=${otp}`);
        }
      }, 1400);
    } else {
      setShakeError(true);
      setErrorMsg(result.payload as string || "Invalid code.");
      toast.error(result.payload as string || "Invalid code.");
      setTimeout(() => setShakeError(false), 600);
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMsg("");
    
    let result;
    if (type === "signup") {
      result = await dispatch(resendOtp(email));
    } else {
      result = await dispatch(forgotPassword(email));
    }
    
    setIsResending(false);
    if (resendOtp.fulfilled.match(result) || forgotPassword.fulfilled.match(result)) {
      toast.success("New code sent!");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } else {
      toast.error(result.payload as string || "Failed to resend.");
    }
  };

  return (
    <>
      <style>{`
        @keyframes ovShake {
          0%,100%{ transform:translateX(0); }
          15%    { transform:translateX(-7px); }
          30%    { transform:translateX(7px); }
          45%    { transform:translateX(-4px); }
          60%    { transform:translateX(4px); }
          75%    { transform:translateX(-2px); }
          90%    { transform:translateX(2px); }
        }
        .hidden-spin-buttons::-webkit-inner-spin-button,
        .hidden-spin-buttons::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>
      <div className={`relative flex min-h-full flex-1 items-center justify-center overflow-hidden w-full ${!isStep ? "bg-slate-50/30 px-4 py-8" : ""}`}>
        {!isStep && (
          <>
            {/* Ambient Orbs */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />
          </>
        )}

        <div className={`relative z-10 w-full max-w-[440px] ${!isStep ? "animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500" : ""}`}>
          <Card className={`${!isStep ? "rounded-[24px] border-none ring-0 bg-transparent shadow-none" : "border-none shadow-none ring-0 p-0"}`}>
            {!isStep && (
              <CardHeader className="p-8 pb-6">
                {/* Logo */}
                <div className="mb-7 flex items-center justify-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

                {/* ── Heading ── */}
                {!isVerified && (
                  <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative mx-auto mb-4 h-16 w-16">
                      <div className="absolute inset-0 rounded-full border-2 border-indigo-200 animate-[pulse_1.8s_ease-out_infinite]" />
                      <div className="absolute inset-0 rounded-full border-2 border-indigo-100 animate-[pulse_1.8s_ease-out_infinite]" style={{ animationDelay: "0.7s" }} />
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
                    <CardTitle className="mt-2 text-[1.5rem] font-bold tracking-tight text-gray-900">
                      Check your inbox
                    </CardTitle>
                    <CardDescription className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                      We sent a 6-digit code to{" "}
                      <span className="font-semibold text-gray-800">{email}</span>
                    </CardDescription>
                  </div>
                )}
              </CardHeader>
            )}

            <CardContent className={`${isStep ? "p-0" : "px-8 pb-8"}`}>
            {isVerified ? (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 animate-in zoom-in-50 duration-500">
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
                {/* Progress bar */}
                {filledCount > 0 && (
                  <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
                    <div className="h-[3px] w-full rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300" style={{ width: `${progress}%` }} />
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
                              className={`flex justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both ${shakeError ? "animate-[ovShake_0.55s_cubic-bezier(.36,.07,.19,.97)_both]" : ""}`}
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
                                    "h-[60px] w-[52px] text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all focus:scale-105 focus:-translate-y-1 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.12)] hidden-spin-buttons",
                                    errorMsg ? "border-red-400 bg-red-50 text-red-700"
                                    : d ? "border-violet-500 bg-violet-50 text-violet-800 -translate-y-[1px]"
                                    : "border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500"
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
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
                      <Button
                        type="submit"
                        disabled={filledCount < 6 || isVerifying}
                        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-[0_4px_16px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_26px_rgba(99,102,241,0.38)] disabled:opacity-50 disabled:hover:translate-y-0"
                      >
                        {isVerifying
                          ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          : <><span>Verify & Continue</span><ArrowRight size={16} strokeWidth={2.5} /></>
                        }
                      </Button>
                    </div>
                  </form>
                </Form>

                {/* Resend */}
                <div className="mt-4 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
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
              </>
            )}
            </CardContent>

            {!isVerified && (
              <CardFooter className="flex-col pb-6 border-none bg-transparent">
                {/* Divider */}
                <div className="w-full my-5 h-px bg-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both" />

                {/* Trust strip */}
                <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                  <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
                  <span className="text-[0.65rem] text-gray-400">
                    Never share your OTP · Secured · Trusted by 500+ institutions
                  </span>
                </div>
              </CardFooter>
            )}
          </Card>

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