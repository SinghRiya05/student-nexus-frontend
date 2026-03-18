"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Mail, ArrowLeft, SendHorizonal, GraduationCap } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const email = form.watch("email");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Send OTP to:", values.email);
    setIsSubmitting(false);
    setSent(true);
    setTimeout(() => {
      router.push("/?mode=verify-otp&type=reset-password");
    }, 1200);
  };

  return (
    <>
      <style>{`
        @keyframes fpFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fpSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fpCheckBounce {
          0%   { transform: scale(0.4); opacity: 0; }
          60%  { transform: scale(1.2); }
          80%  { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fpPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.3); }
          50%       { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
        }
        .fp-card  { animation: fpSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .fp-row1  { animation: fpFadeUp 0.4s 0.05s ease both; }
        .fp-row2  { animation: fpFadeUp 0.4s 0.12s ease both; }
        .fp-row3  { animation: fpFadeUp 0.4s 0.18s ease both; }
        .fp-row4  { animation: fpFadeUp 0.4s 0.24s ease both; }
        .fp-row5  { animation: fpFadeUp 0.4s 0.30s ease both; }
        .fp-check { animation: fpCheckBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fp-icon-pulse { animation: fpPulse 2s ease-in-out infinite; }

        .fp-input {
          height: 46px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          font-size: 0.9rem;
          padding-left: 2.75rem;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .fp-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
          outline: none;
        }
        .fp-input::placeholder { color: #9ca3af; }

        .fp-btn {
          height: 48px;
          border-radius: 13px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
          transition: all 0.2s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .fp-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.38);
        }
        .fp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8 w-full">
        {/* Ambient Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

        <div className="fp-card relative z-10 w-full max-w-[420px]">
          {/* Card */}
          <div className="rounded-[24px] border border-white bg-white/70 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-2xl">

            {/* Logo */}
            <div className="fp-row1 mb-8 flex items-center justify-center gap-2.5">
              <div className="fp-icon-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
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

            {!sent ? (
              <>
                {/* Icon */}
                <div className="fp-row1 mb-5 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-[0_4px_14px_rgba(99,102,241,0.12)]">
                    <Mail size={28} className="text-indigo-500" strokeWidth={1.7} />
                  </div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                      Password Recovery
                    </span>
                  </div>
                  <h2 className="mt-2 text-[1.5rem] font-bold tracking-tight text-gray-900">
                    Forgot your password?
                  </h2>
                  <p className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                    No worries! Enter your registered email and we'll send you a verification code.
                  </p>
                </div>

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem className="fp-row2">
                          <Label className="text-[0.8rem] font-semibold text-gray-700">
                            Email address
                          </Label>
                          <FormControl>
                            <div className="relative mt-1.5">
                              <Mail
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                strokeWidth={1.8}
                              />
                              <input
                                type="email"
                                placeholder="you@university.edu"
                                className={`fp-input w-full ${fieldState.error ? "!border-red-400 !bg-red-50 focus:!border-red-500 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" : ""}`}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.74rem]" />
                        </FormItem>
                      )}
                    />

                    <div className="fp-row3 pt-1">
                      <button type="submit" disabled={isSubmitting} className="fp-btn">
                        {isSubmitting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <>
                            <SendHorizonal size={16} strokeWidth={2.2} />
                            Send Verification Code
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </Form>

                {/* Divider */}
                <div className="fp-row4 my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[0.7rem] text-gray-400">or</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                {/* Back to login */}
                <div className="fp-row5 text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/?mode=login")}
                    className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <ArrowLeft size={14} strokeWidth={2.5} />
                    Back to Sign In
                  </button>
                </div>
              </>
            ) : (
              /* ── Success state ── */
              <div className="flex flex-col items-center py-4 text-center">
                <div className="fp-check mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200">
                  <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
                    <circle cx="24" cy="24" r="22" fill="rgba(52,211,153,0.15)" />
                    <path d="M14 25l8 8 13-14" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-[1.3rem] font-bold text-gray-900">Code sent!</h3>
                <p className="mt-2 text-[0.84rem] text-gray-500 leading-relaxed">
                  Check your inbox at<br />
                  <span className="font-semibold text-gray-800">{email}</span>
                </p>
                <p className="mt-3 text-[0.74rem] text-gray-400">Redirecting to verification…</p>
              </div>
            )}
          </div>

          {/* Help text */}
          <p className="mt-5 text-center text-[0.72rem] text-gray-400">
            Having trouble?{" "}
            <span className="font-semibold text-indigo-600 cursor-pointer hover:underline">
              Contact support
            </span>
          </p>
        </div>
      </div>
    </>
  );
}