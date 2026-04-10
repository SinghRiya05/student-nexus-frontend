"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Eye, EyeOff, Lock, CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/utils/hook";
import { resetPassword } from "@/features/auth/authThunk";
import toast from "react-hot-toast";

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
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

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
    if (!email || !otp) {
      toast.error("Session expired. Please restart the forgot password flow.");
      return;
    }

    setIsSubmitting(true);
    const result = await dispatch(resetPassword({
      email,
      otp,
      newPassword: values.password
    }));
    
    setIsSubmitting(false);
    
    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset successful!");
      setSuccess(true);
      setTimeout(() => router.push("/?mode=login"), 1800);
    } else {
      toast.error(result.payload as string || "Failed to reset password.");
    }
  };

  return (
    <>
      <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8 w-full">
        {/* Ambient Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

        <div className="relative z-10 w-full max-w-[420px] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500">
          <Card className="rounded-[24px] border-none ring-0 bg-transparent shadow-none">
            <CardHeader className="p-8 pb-6">
              {/* Logo */}
              <div className="mb-7 flex items-center justify-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_0_0_0_rgba(99,102,241,0.3)] animate-[pulse_2s_ease-in-out_infinite]">
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

              {!success && (
                <div className="mb-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-[0_4px_14px_rgba(99,102,241,0.1)]">
                    <Lock size={26} className="text-indigo-500" strokeWidth={1.7} />
                  </div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                      Set New Password
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-[1.5rem] font-bold tracking-tight text-gray-900">
                    Create new password
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                    Make it strong and unique — your account security matters.
                  </CardDescription>
                </div>
              )}
            </CardHeader>

            <CardContent className="px-8 pb-8">
            {success ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 animate-in zoom-in-50 duration-500">
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* New password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
                          <Label className="text-[0.8rem] font-semibold text-gray-700">
                            New Password
                          </Label>
                          <FormControl>
                            <div className="relative mt-1.5">
                              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className={`h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm transition-all focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/10 ${fieldState.error ? "!border-red-400 !bg-red-50 focus-visible:!ring-red-500/10" : ""}`}
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
                      <div className="grid grid-cols-2 gap-1 rounded-xl bg-gray-50 border border-gray-100 p-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
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
                        <FormItem className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
                          <Label className="text-[0.8rem] font-semibold text-gray-700">
                            Confirm Password
                          </Label>
                          <FormControl>
                            <div className="relative mt-1.5">
                              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2} />
                              <Input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm your password"
                                className={`h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm transition-all focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/10 ${fieldState.error ? "!border-red-400 !bg-red-50 focus-visible:!ring-red-500/10" : ""}`}
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
                    <div className="pt-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
                      <button type="submit" disabled={isSubmitting} className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-[0_4px_16px_rgba(99,102,241,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_26px_rgba(99,102,241,0.38)] disabled:opacity-50 disabled:hover:translate-y-0">
                        {isSubmitting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <><span>Reset Password</span><ArrowRight size={16} strokeWidth={2.5} /></>
                        )}
                      </button>
                    </div>
                  </form>
                </Form>
              </>
            )}
            </CardContent>

            {!success && (
              <CardFooter className="pb-6 border-none bg-transparent">
                {/* Trust strip */}
                <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                  <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
                  <span className="text-[0.65rem] text-gray-400">
                    Your password is encrypted and stored securely
                  </span>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}