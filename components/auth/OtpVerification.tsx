"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  GraduationCap, ShieldCheck, Mail, RefreshCw,
  ArrowRight, ArrowLeft, 
} from "lucide-react";
import {
  Form, FormField, FormItem, FormControl, FormMessage,
} from "@/components/ui/form";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Enter all 6 digits.")
    .regex(/^\d{6}$/, "OTP must be 6 digits."),
});
type OtpFormValues = z.infer<typeof otpSchema>;

const RESEND_COOLDOWN = 30;

type OtpVerificationProps = {
  type: "signup" | "reset-password";
}

export default function OtpVerificationPage({type}:OtpVerificationProps) {

  const setInputRef = React.useCallback(
  (idx: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[idx] = el;
  },
  []
);

const router=useRouter();
  const [digits, setDigits]           = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified]   = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown]       = useState(0);
  const [shakeError, setShakeError]   = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const hasError = !!form.formState.errors.otp;

  // Sync digits → form field
  useEffect(() => {
    form.setValue("otp", digits.join(""), {
      shouldValidate: digits.join("").length === 6,
    });
  }, [digits, form]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Focus first box on mount
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

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

  await new Promise(r => setTimeout(r, 1800));

  if (otp === "123456") {

    if (type === "signup") {
      console.log("Signup OTP verified");
      // yaha user ko login ya dashboard bhej sakte ho
       router.push("/?mode=login");
    }

    if (type === "reset-password") {
      console.log("Reset password OTP verified");
      // yaha reset password page open karna hoga
       router.push("/?mode=reset-password");
    }

    setIsVerified(true);

  } else {
    setShakeError(true);
    form.setError("otp", { message: "Incorrect OTP. Please try again." });
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
    form.clearErrors();
    await new Promise(r => setTimeout(r, 1000));
    setIsResending(false);
    setCooldown(RESEND_COOLDOWN);
    inputRefs.current[0]?.focus();
  };

  const filledCount = digits.filter(Boolean).length;

  return (
    <>
      <style>{`
        @keyframes snFadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes snShake {
          0%,100%{ transform:translateX(0); }
          15%    { transform:translateX(-7px); }
          30%    { transform:translateX(7px); }
          45%    { transform:translateX(-4px); }
          60%    { transform:translateX(4px); }
          75%    { transform:translateX(-2px); }
          90%    { transform:translateX(2px); }
        }
        @keyframes snSuccessBounce {
          0%   { transform:scale(0.55); opacity:0; }
          55%  { transform:scale(1.15); }
          80%  { transform:scale(0.96); }
          100% { transform:scale(1);   opacity:1; }
        }
        @keyframes snOrb1 {
          from { transform:translate(0,0) scale(1); }
          to   { transform:translate(40px,24px) scale(1.15); }
        }
        @keyframes snOrb2 {
          from { transform:translate(0,0) scale(1); }
          to   { transform:translate(-30px,-20px) scale(1.1); }
        }
        @keyframes snPulseRing {
          0%   { transform:scale(1);   opacity:0.6; }
          100% { transform:scale(1.7); opacity:0; }
        }
        .sn-fade  { animation: snFadeUp 0.5s ease both; }
        .sn-shake { animation: snShake 0.55s cubic-bezier(.36,.07,.19,.97) both; }
        .sn-success-anim { animation: snSuccessBounce 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }

        .sn-otp-box {
          width: 56px; height: 64px;
          text-align: center;
          font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em;
          border-radius: 14px;
          border: 2px solid #e5e7eb;
          background: #f9fafb;
          color: #111827;
          outline: none;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
          caret-color: transparent;
        }
        .sn-otp-box:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.13);
          transform: translateY(-2px) scale(1.06);
        }
        .sn-otp-box.filled {
          border-color: #8b5cf6;
          background: #faf5ff;
          color: #5b21b6;
          transform: translateY(-1px);
        }
        .sn-otp-box.has-error {
          border-color: #f87171;
          background: #fff1f2;
          color: #b91c1c;
        }
        .sn-otp-box.success {
          border-color: #10b981;
          background: #ecfdf5;
          color: #065f46;
        }
        .sn-otp-box::-webkit-inner-spin-button,
        .sn-otp-box::-webkit-outer-spin-button { -webkit-appearance: none; }

        .sn-verify-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 4px 20px rgba(99,102,241,0.32);
          transition: all 0.2s ease;
        }
        .sn-verify-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.44);
          opacity: 0.93;
        }
        .sn-verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .sn-pulse-ring {
          animation: snPulseRing 1.8s ease-out infinite;
        }
      `}</style>

      {/* Full page centered layout */}
      <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden px-4 py-10">
        {/* Card */}
        <div className="relative z-10 w-full max-w-[440px]">
           
            <div className="sn-fade rounded-[28px] border border-gray-100 bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">

              {/* Logo */}
              <div className="mb-7 flex items-center justify-center gap-2.5"
                style={{ animation: "snFadeUp 0.4s 0s ease both" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.4)]">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p className="text-[1.1rem] font-bold leading-none text-gray-900">
                    Student<span className="text-indigo-500">Nexus</span>
                  </p>
                  <p className="text-[0.55rem] uppercase tracking-[0.14em] text-gray-400 mt-0.5">
                    Verified Academic Network
                  </p>
                </div>
              </div>

              {/* Email icon + heading */}
              <div className="mb-6 text-center" style={{ animation: "snFadeUp 0.4s 0.07s ease both" }}>
                {/* Icon with pulse rings */}
                <div className="relative mx-auto mb-4 h-16 w-16 flex items-center justify-center">
                  <div className="sn-pulse-ring absolute inset-0 rounded-full border-2 border-indigo-300" />
                  <div className="sn-pulse-ring absolute inset-0 rounded-full border-2 border-indigo-200" style={{ animationDelay: "0.6s" }} />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-100">
                    <Mail size={26} className="text-indigo-500" strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                  Email Verification
                </div>
                <h2 className="mt-2 text-[1.6rem] font-bold -tracking-[0.03em] text-gray-900 leading-tight">
                  Check your inbox
                </h2>
                <p className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-800">r**ul@university.edu</span>
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">

                  {/* OTP boxes */}
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div
                            className={`flex justify-center gap-2.5 ${shakeError ? "sn-shake" : ""}`}
                            style={{ animation: "snFadeUp 0.4s 0.14s ease both" }}
                          >
                            {digits.map((d, idx) => (
                              <input
                                key={idx}
                               ref={setInputRef(idx)}
                                type="number"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                onChange={e => handleChange(e, idx)}
                                onKeyDown={e => handleKeyDown(e, idx)}
                                onPaste={e => handlePaste(e, idx)}
                                onFocus={e => e.target.select()}
                                disabled={isVerifying}
                                aria-label={`OTP digit ${idx + 1}`}
                                className={[
                                  "sn-otp-box",
                                  isVerified              ? "success"
                                  : fieldState.error      ? "has-error"
                                  : d                     ? "filled"
                                  : "",
                                ].join(" ")}
                              />
                            ))}
                          </div>
                        </FormControl>
                        {fieldState.error && (
                          <p className="mt-2 text-center text-[0.74rem] font-medium text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Verify button */}
                  <div style={{ animation: "snFadeUp 0.4s 0.2s ease both" }}>
                    <button
                      type="submit"
                      disabled={filledCount < 6 || isVerifying}
                      className="sn-verify-btn flex h-12 w-full items-center justify-center gap-2 rounded-[12px] text-[0.9rem] font-semibold text-white"
                    >
                      {isVerifying
                        ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        : <><span>Verify & Continue</span><ArrowRight size={16} strokeWidth={2.5} /></>
                      }
                    </button>
                  </div>

                </form>
              </Form>

            
              <div className="mt-4 flex items-center justify-center"
                style={{ animation: "snFadeUp 0.4s 0.26s ease both" }}>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isResending}
                  className="flex items-center gap-1.5 text-[0.78rem] font-semibold text-indigo-600 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RefreshCw size={13} className={isResending ? "animate-spin" : ""} strokeWidth={2.5} />
                  {isResending ? "Sending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gray-100" style={{ animation: "snFadeUp 0.4s 0.3s ease both" }} />

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5"
                style={{ animation: "snFadeUp 0.4s 0.34s ease both" }}>
                <ShieldCheck size={12} className="shrink-0 text-emerald-500" />
                <span className="text-[0.65rem] text-gray-400">
                  Never share your OTP · Secured · Trusted by 500+ institutions
                </span>
              </div>

            </div>

        

          {/* Bottom hint */}
          {!isVerified && (
            <p className="mt-4 text-center text-[0.72rem] text-gray-400"
              style={{ animation: "snFadeUp 0.4s 0.4s ease both" }}>
              Tip: use <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-mono text-gray-500">123456</kbd> to test verification
            </p>
          )}
        </div>

      </div>
    </>
  );
}