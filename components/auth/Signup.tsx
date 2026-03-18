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
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Enter a valid university email."),
  phone: z.string().min(10, "Enter a valid 10-digit phone number.").max(13),
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one symbol."),
});

const step2Schema = z.object({
  university: z.string().min(1, "Please select your university."),
  course: z.string().min(1, "Please select your course."),
  semester: z.string().optional(),
  role: z.string().min(1, "Please select your role."),
}).superRefine((data, ctx) => {
  if (data.role === "Student" && !data.semester) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select your semester.",
      path: ["semester"],
    });
  }
});

const fullSchema = step1Schema.merge(step2Schema);
type FullFormValues = z.infer<typeof fullSchema>;

// ─── Shared input class (mirrors Login page style) ────────────────────────────
const inputCls =
  "h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-10 pr-4 " +
  "text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 " +
  "focus-visible:border-indigo-500 focus-visible:bg-white " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SignupPage() {

  const router = useRouter();
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

  const { trigger, watch } = form;
  const selectedRole = watch("role");

  // Step 1 → Step 2: validate only step-1 fields before advancing
  const handleNext = async () => {
    const valid = await trigger(["firstName", "lastName", "email", "phone", "password"]);
    if (valid) setStep(2);
  };

  const handleBack = () => setStep(1);

  const onSubmit = async (values: FullFormValues) => {
    setIsSubmitting(true);
    // TODO: Make API call here for Signup
    await new Promise(r => setTimeout(r, 1800));
    console.log("Signup payload:", values);

    // Save signup data so the Profile page can pre-fill known fields
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        universityName: values.university,
        courseName: values.course,
        currentSemester: values.semester ?? "",
        profession: values.role,
      })
    );

    setIsSubmitting(false);
    router.push("/?mode=verify-otp&type=signup")
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8">

          <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

          {/* Card */}
          <Card className="relative z-10 mx-auto w-full max-w-[440px] rounded-[24px] border-none ring-0 bg-transparent shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-6">
              {/* Mobile logo */}
              <div className="mb-4 flex items-center gap-2 lg:hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <GraduationCap size={17} />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  Student<span className="text-indigo-600">Nexus</span>
                </span>
              </div>

              {/* Header */}
              <CardTitle className="text-[1.7rem] font-bold leading-[1.15] -tracking-[0.03em] text-gray-900">
                {step === 1 ? "Create your account" : "Academic details"}
              </CardTitle>
              <CardDescription className="text-[0.84rem] leading-relaxed text-gray-500 mt-1.5 mb-4">
                {step === 1
                  ? "Fill in your personal information to get started."
                  : "Tell us about your university and course."}
              </CardDescription>

              {/* Progress bar */}
              <div className="flex gap-1.5 mt-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{ background: step >= i ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#e5e7eb" }} />
                ))}
              </div>
            </CardHeader>

            <CardContent>
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
                                {["University of Delhi", "IIT Delhi", "IIT Bombay", "Mumbai University", "BITS Pilani", "NIT Trichy", "Anna University", "Pune University", "Other"].map(u => (
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
                            <Select onValueChange={(val) => {
                              field.onChange(val);
                              if (val !== "Student") {
                                form.setValue("semester", "");
                              }
                            }} value={field.value}>
                              <FormControl>
                                <div className="relative">
                                  <Users size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                  <SelectTrigger className={inputCls + " pl-10"}>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {["Student", "Alumni", "Teacher", "Peer Mentor"].map(r => (
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
                                {["B.Tech Computer Science", "B.Tech Electronics", "BCA", "MCA", "M.Tech AI / ML", "MBA", "B.Sc Physics / Maths", "Other"].map(c => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />

                      {selectedRole === "Student" && (
                        <FormField control={form.control} name="semester"
                          render={({ field }) => (
                            <FormItem className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
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
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <SelectItem key={s} value={`${s}`}>Semester {s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[0.68rem] text-red-500" />
                            </FormItem>
                          )}
                        />
                      )}


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
                        type="button"
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
            </CardContent>

            <CardFooter className="flex-col gap-5 pt-2 pb-6 border-none bg-transparent">
              {/* Sign in link */}
              <p className="text-center text-[0.8rem] text-gray-500">
                Already have an account?{" "}
                <Link href="?mode=login" className="font-bold text-indigo-600 transition-opacity hover:opacity-75">
                  LogIn instead →
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>

      </div>
    </>
  );
}