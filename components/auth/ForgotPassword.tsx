"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Mail, ArrowLeft, SendHorizonal, GraduationCap } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/utils/hook";
import { forgotPassword } from "@/features/auth/authThunk";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const email = form.watch("email");

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const result = await dispatch(forgotPassword(values.email));
    setIsSubmitting(false);

    if (forgotPassword.fulfilled.match(result)) {
      toast.success("Reset code sent successfully!");
      setSent(true);
      setTimeout(() => {
        router.push(`/?mode=verify-otp&type=reset-password&email=${encodeURIComponent(values.email)}`);
      }, 1200);
    } else {
      toast.error(result.payload as string || "Failed to send reset code.");
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
              <div className="mb-8 flex items-center justify-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

              {!sent && (
                <div className="mb-5 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-[0_4px_14px_rgba(99,102,241,0.12)]">
                    <Mail size={28} className="text-indigo-500" strokeWidth={1.7} />
                  </div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                    <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                      Password Recovery
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-[1.5rem] font-bold tracking-tight text-gray-900">
                    Forgot your password?
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-[0.84rem] leading-relaxed text-gray-500">
                    No worries! Enter your registered email and we'll send you a verification code.
                  </CardDescription>
                </div>
              )}
            </CardHeader>

            <CardContent className="px-8 pb-8">
            {!sent ? (
              <>
                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
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
                              <Input
                                type="email"
                                placeholder="you@university.edu"
                                className={`h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 text-sm transition-all focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/10 ${fieldState.error ? "!border-red-400 !bg-red-50 focus-visible:!ring-red-500/10" : ""}`}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.74rem]" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
                      <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.38)] disabled:opacity-55 disabled:hover:translate-y-0">
                        {isSubmitting ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <>
                            <SendHorizonal size={16} strokeWidth={2.2} className="mr-1.5" />
                            Send Verification Code
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[0.7rem] text-gray-400">or</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                {/* Back to login */}
                <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
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
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 animate-in zoom-in-50 duration-500 delay-100">
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
            </CardContent>
          </Card>

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