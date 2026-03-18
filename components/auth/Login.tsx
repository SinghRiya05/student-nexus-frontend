"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  ShieldCheck,

  Loader2,
} from "lucide-react";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid university email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof loginSchema>;



// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    // TODO: Make API call here for Login
    await new Promise((r) => setTimeout(r, 1800));
    console.log(values);
    setIsLoading(false);
  }

  return (
    <>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8">
          {/* Ambient Orbs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

          {/* Card */}
          <Card className="relative z-10 mx-auto w-full max-w-[430px] rounded-[24px] border-none ring-0 bg-transparent shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-6">
              <div className="mb-2 flex items-center gap-2 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <GraduationCap size={17} />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Student<span className="text-indigo-600">Nexus</span>
                </span>
              </div>

              <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-indigo-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
                Verified Student Access
              </div>
              <CardTitle className="text-[1.85rem] font-bold leading-[1.15] -tracking-[0.03em] text-gray-900">
                Welcome back
              </CardTitle>
              <CardDescription className="text-[0.84rem] leading-relaxed text-gray-500">
                Sign in with your university email to access your academic network.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1.5">
                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">
                          University Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@university.edu"
                            autoComplete="email"
                            className="h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[0.72rem] text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1.5">
                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              type={showPw ? "text" : "password"}
                              placeholder="••••••••••"
                              autoComplete="current-password"
                              className="h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-3.5 pr-11 text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              onClick={() => setShowPw((p) => !p)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
                            >
                              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[0.72rem] text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <label className="flex cursor-pointer select-none items-center gap-2 text-[0.79rem] text-gray-500">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-4 w-4 rounded-[4px] border-gray-300 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600"
                            />
                            Remember me
                          </label>
                          <Button
                            type="button"
                            variant={"link"}
                            onClick={() => router.push("?mode=forgot-password")}
                            className="text-[0.79rem] font-semibold text-indigo-600 transition-opacity hover:opacity-70"
                          >
                            Forgot password?
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 bg-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Enter Your Network
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 pt-2 pb-6 border-none bg-transparent">
              <p className="text-center text-[0.8rem] text-gray-500">
                New to StudentNexus?{" "}
                <Link
                  href="?mode=signup"
                  className="font-bold text-indigo-600 transition-opacity hover:opacity-75"
                >
                  Create your verified account →
                </Link>
              </p>

              <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <ShieldCheck size={12} className="shrink-0 text-emerald-500" />
                <span className="text-[0.67rem] text-gray-400">
                  Verified via official university email · Trusted by 500+
                  institutions
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
