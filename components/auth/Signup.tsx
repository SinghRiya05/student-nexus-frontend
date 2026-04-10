"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Phone,
  Lock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Users,
  Layers,
  CheckCircle2,
  Award,
  Globe,
  Clock,
  Hash,
  RefreshCw,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
  registerUser,
  verifyEmail,
  completeRegistration,
  resendOtp,
} from "@/features/auth/authThunk";
import { getAllUniversities } from "@/features/university/universityThunk";
import { getAllCourses } from "@/features/course/courseThunk";
import { getRoles } from "@/features/roles/roleThunk";
import { getAllSemesters } from "@/features/semester/semesterThunk";
import toast from "react-hot-toast";

// ─── Zod Schemas ─────────────────────────────
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(10, "Enter a valid 10-digit phone number.").max(13),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one symbol."),
});

const personalInfoOptionalSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  password: z.string().optional(),
});

const signupSchema = personalInfoOptionalSchema.extend({
  otp: z.string().optional(),
  universityId: z.string().min(1, "Please select your university."),
  roleId: z.string().min(1, "Please select your role."),
  courseIds: z.array(z.string()).min(1, "Please select at least one course."),
  semesterId: z.string().optional(),
  // Profile specific fields
  currentCompany: z.string().optional(),
  jobTitle: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  experienceYears: z.string().optional(),
  skills: z.string().optional(),
  hobby_badge: z.string().optional(),
});

const signupSchema = personalInfoOptionalSchema.extend({
  otp: z.string().optional(),
  universityId: z.string().optional(),
  roleId: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
  semesterId: z.string().optional(),
  currentCompany: z.string().optional(),
  jobTitle: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  experienceYears: z.string().optional(),
  skills: z.string().optional(),
  hobby_badge: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

// ─── Shared UI Logic ────────────────────────────
const inputCls =
  "h-11 w-full rounded-[10px] border border-gray-200 bg-gray-50 pl-10 pr-4 " +
  "text-[0.875rem] text-gray-900 shadow-none placeholder:text-gray-400 " +
  "focus-visible:border-indigo-500 focus-visible:bg-white " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500/15 focus-visible:ring-offset-0";

enum SignupStep {
  REGISTER = 1,
  VERIFY = 2,
  ACADEMIC = 3,
}

// ─── Static constants (outside component to prevent re-creation on render) ───
const AVAILABLE_SKILLS = [
  "React", "Node.js", "Python", "AWS", "UI/UX", "Java", "C++",
  "JavaScript", "HTML/CSS", "Machine Learning", "Data Science",
  "Marketing", "Management", "Communication",
];
const AVAILABLE_HOBBY_BADGES = [
  "Avid Reader", "Coding Ninja", "Sports Star", "Music Lover",
  "Artist", "Gamer", "Traveler", "Photographer",
];

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth || {});
  const { universities = [] } = useAppSelector(
    (state) => state.university || {},
  );
  const { courses = [] } = useAppSelector((state) => state.course || {});
  const { roles = [] } = useAppSelector((state) => state.role || {});
  const { semesters = [] } = useAppSelector((state) => state.semester || {});

  const [step, setStep] = useState<SignupStep>(SignupStep.REGISTER);

  // ─── Sync step to URL query param (?step=N) ───
  // extraParams: additional key-value pairs to persist in the URL (e.g. email for refresh recovery)
  const goToStep = useCallback((s: SignupStep, extraParams?: Record<string, string>) => {
    setStep(s);
    const params = new URLSearchParams(window.location.search);
    params.set("step", String(s));
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) => params.set(k, v));
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // OTP specific state
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      otp: "",
      universityId: "",
      roleId: "",
      courseIds: [],
    },
  });

  const { watch, setValue, trigger } = form;
  const selectedRoleId = watch("roleId");
  const selectedRoleName = roles?.find((r) => r._id === selectedRoleId)?.name;
  const selectedCourseIds = watch("courseIds") || [];
  // Subscribe to skills once; split into array for both display and checked-state logic
  const selectedSkillsStr = watch("skills") || "";
  const selectedSkillsArr = selectedSkillsStr ? selectedSkillsStr.split(", ").filter(Boolean) : [];

  // ─── Read search params once (stable string values, not the object) ───
  const queryEmail = searchParams.get("email");
  const queryStep = searchParams.get("step");
  const autoSend = searchParams.get("autoSend");
  const queryUserId = searchParams.get("userId"); // fallback when Redux resets after refresh

  // ─── Effects ───
  useEffect(() => {
    // One-time fetch of reference data
    dispatch(getAllUniversities());
    dispatch(getAllCourses());
    dispatch(getRoles());
    dispatch(getAllSemesters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    // Handle resume flow from URL params (runs only when values actually change)
    if (queryEmail) {
      setValue("email", queryEmail);
    }
    if (queryStep) {
      const s = parseInt(queryStep);
      if (Object.values(SignupStep).includes(s)) {
        setStep(s as SignupStep); // internal state only; URL already has this value
        if (s === SignupStep.VERIFY && autoSend === "true" && queryEmail) {
          setTimeout(() => {
            resendSignupOtp(queryEmail);
          }, 500);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryEmail, queryStep, autoSend]);

  // Handle OTP Cooldown
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setTimeout(() => setOtpCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  // Focus first OTP input when step changes to VERIFY
  useEffect(() => {
    if (step === SignupStep.VERIFY) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // ─── Handlers ───
  const handleRegister = async () => {
    const isValid = await trigger([
      "firstName",
      "lastName",
      "email",
      "phone",
      "password",
    ]);
    if (!isValid) return;

    const values = form.getValues();
    setIsSubmitting(true);
    const result = await dispatch(
      registerUser({
        firstName: values.firstName ?? "",
        lastName: values.lastName ?? "",
        email: values.email ?? "",
        phone: values.phone ?? "",
        password: values.password ?? "",
      }),
    );
    setIsSubmitting(false);

    if (registerUser.fulfilled.match(result)) {
      toast.success(
        "Registration successful! Please check your email for OTP.",
      );
      setOtpError("");
      setOtpDigits(Array(6).fill(""));
      // Persist email in the URL so refresh on the OTP step restores it
      const email = values.email ?? "";
      goToStep(SignupStep.VERIFY, { email });
    } else {
      toast.error((result.payload as string) || "Failed to register.");
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    if (!digit && val !== "") return;

    const nextDigits = [...otpDigits];
    nextDigits[idx] = digit;
    setOtpDigits(nextDigits);
    setOtpError("");

    if (digit && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otpDigits[idx] && idx > 0) {
        otpInputRefs.current[idx - 1]?.focus();
      } else {
        const nextDigits = [...otpDigits];
        nextDigits[idx] = "";
        setOtpDigits(nextDigits);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      otpInputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      otpInputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData
      .getData("Text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const nextDigits = [...otpDigits];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) nextDigits[i] = char;
    });
    setOtpDigits(nextDigits);
    otpInputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const verifyOtp = async () => {
    const otpString = otpDigits.join("");
    if (otpString.length < 6) return;

    setIsVerifyingOtp(true);
    setOtpError("");
    const result = await dispatch(
      verifyEmail({ email: user?.email || watch("email"), otp: otpString }),
    );
    setIsVerifyingOtp(false);

    if (verifyEmail.fulfilled.match(result)) {
      const verifiedUser = (result.payload as any)?.data;
      const userId = verifiedUser?._id || user?._id || "";
      setIsOtpVerified(true);
      toast.success("Email verified successfully!");
      setTimeout(() => {
        // Persist userId + email so step 3 works even after a page refresh
        goToStep(SignupStep.ACADEMIC, {
          email: form.getValues("email"),
          userId,
        });
      }, 1500);
    } else {
      setOtpError((result.payload as string) || "Invalid OTP code.");
      toast.error((result.payload as string) || "Invalid OTP code.");
    }
  };

  const resendSignupOtp = async (overrideEmail?: string) => {
    if (otpCooldown > 0 || isResending) return;

    const email = overrideEmail || user?.email || form.getValues("email");
    if (!email) {
      toast.error(
        "Email address is missing. Please enter your email in Step 1.",
      );
      return;
    }

    setIsResending(true);
    const result = await dispatch(resendOtp(email));
    setIsResending(false);

    if (resendOtp.fulfilled.match(result)) {
      toast.success("New OTP sent to your email!");
      setOtpCooldown(30);
      setOtpDigits(Array(6).fill(""));
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } else {
      const errorMessage =
        (result.payload as any)?.message ||
        (result.payload as string) ||
        "Failed to resend OTP.";
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    // Resolve userId: prefer Redux state, fall back to URL param (after page refresh)
    const resolvedUserId = user?._id || queryUserId;
    if (!resolvedUserId) {
      toast.error("Session expired. Please restart registration.");
      return;
    }

    // ─── Normalise types to match backend validation schema ───
    // skills: backend expects string[] — we store as comma-separated string in the form
    const skillsArray = values.skills
      ? values.skills.split(", ").map((s) => s.trim()).filter(Boolean)
      : [];

    // hobby_badge: backend stores as plain string (Mongoose schema: type: String)
    const hobby_badge_value = values.hobby_badge || undefined;

    // experienceYears: backend expects number
    const expYears = values.experienceYears
      ? Number(values.experienceYears)
      : undefined;

    const result = await dispatch(
      completeRegistration({
        userId: resolvedUserId,
        userData: {
          universityId: values.universityId,
          roleId: values.roleId,
          courseIds: values.courseIds,
          semesterId: values.semesterId || undefined,
          currentCompany: values.currentCompany || undefined,
          jobTitle: values.jobTitle || undefined,
          designation: values.designation || undefined,
          department: values.department || undefined,
          experienceYears: expYears,
          skills: skillsArray.length > 0 ? skillsArray : undefined,
          hobby_badge: hobby_badge_value,
        },
      }),
    );

    if (completeRegistration.fulfilled.match(result)) {
      toast.success("Welcome aboard! Registration complete.");
      router.push("/");
    } else {
      toast.error((result.payload as string) || "Final step failed.");
    }
  };

  // Use getValues (not watch) inside toggles to avoid stale-closure re-render chains
  const toggleCourse = useCallback((courseId: string) => {
    const current = form.getValues("courseIds") || [];
    const roleName = roles?.find((r) => r._id === form.getValues("roleId"))?.name;
    if (roleName === "STUDENT") {
      form.setValue("courseIds", [courseId], { shouldValidate: false });
    } else {
      const idx = current.indexOf(courseId);
      const next = idx > -1
        ? current.filter((_, i) => i !== idx)
        : [...current, courseId];
      form.setValue("courseIds", next, { shouldValidate: false });
    }
  }, [form, roles]);

  const toggleSkill = useCallback((skill: string) => {
    const current = form.getValues("skills") || "";
    const arr = current ? current.split(", ").filter(Boolean) : [];
    const next = arr.includes(skill)
      ? arr.filter((s) => s !== skill)
      : [...arr, skill];
    form.setValue("skills", next.join(", "), { shouldValidate: false });
  }, [form]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

        <Card className="relative z-10 mx-auto w-full max-w-[440px] rounded-[24px] border-none ring-0 bg-transparent shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="pb-6">
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <GraduationCap size={17} />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Student<span className="text-indigo-600">Nexus</span>
              </span>
            </div>

            <CardTitle className="text-2xl font-bold -tracking-[0.03em] text-gray-900">
              {step === SignupStep.REGISTER && "Create Account"}
              {step === SignupStep.VERIFY && "Verify Email"}
              {step === SignupStep.ACADEMIC && "Academic Details"}
            </CardTitle>
            <CardDescription className="text-[0.84rem] leading-relaxed text-gray-500 mt-1.5 mb-4">
              {step === SignupStep.REGISTER &&
                "Fill in your personal information to get started."}
              {step === SignupStep.VERIFY &&
                (searchParams.get("email")
                  ? "Welcome back! Please verify your email to continue."
                  : `We've sent a 6-digit code to ${watch("email")}`)}
              {step === SignupStep.ACADEMIC &&
                "Tell us about your university, role and courses."}
            </CardDescription>

            {/* Progress bar */}
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-500"
                  style={{
                    background:
                      step >= i
                        ? "linear-gradient(90deg,#6366f1,#8b5cf6)"
                        : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* ── STEP 1: REGISTER ── */}
                {step === SignupStep.REGISTER && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User
                                  size={14}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <Input
                                  placeholder="Riya"
                                  className={inputCls}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="gap-1">
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User
                                  size={14}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <Input
                                  placeholder="Singh"
                                  className={inputCls}
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                            Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <Input
                                type="email"
                                placeholder="name@university.edu"
                                className={inputCls}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <Input
                                placeholder="+91 98765 43210"
                                className={inputCls}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className={inputCls}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      onClick={handleRegister}
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-[10px]"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </div>
                )}

                {/* ── STEP 2: VERIFICATION ── */}
                {step === SignupStep.VERIFY && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {isOtpVerified ? (
                      <div className="flex flex-col items-center py-6 text-center scale-up-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-100 animate-bounce">
                          <CheckCircle2
                            size={40}
                            className="text-emerald-500"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Verified!
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Your email has been successfully verified.
                          <br />
                          Moving to academic details...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center gap-2">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                otpInputRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) =>
                                handleOtpChange(e.target.value, idx)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                              onPaste={handleOtpPaste}
                              className={`h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/20 outline-none
                                ${otpError ? "border-red-500 bg-red-50 text-red-600" : digit ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-900"}`}
                            />
                          ))}
                        </div>

                        {otpError && (
                          <div className="text-center space-y-1">
                            <p className="text-xs font-medium text-red-500">
                              ⚠ {otpError}
                            </p>
                            {otpError.toLowerCase().includes("expired") && (
                              <button
                                type="button"
                                onClick={() => resendSignupOtp()}
                                disabled={isResending}
                                className="text-[0.7rem] text-indigo-600 font-bold hover:underline disabled:opacity-50"
                              >
                                {isResending
                                  ? "Resending..."
                                  : "Click here to get a new code"}
                              </button>
                            )}
                          </div>
                        )}

                        <div className="space-y-4">
                          <Button
                            type="button"
                            onClick={verifyOtp}
                            disabled={
                              otpDigits.join("").length < 6 || isVerifyingOtp
                            }
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95"
                          >
                            {isVerifyingOtp ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              "Verify & Continue"
                            )}
                          </Button>

                          <div className="flex items-center justify-between px-1">
                            <button
                              type="button"
                              onClick={() => resendSignupOtp()}
                              disabled={otpCooldown > 0 || isResending}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                              <RefreshCw
                                size={12}
                                className={
                                  otpCooldown > 0 || isResending
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                              {isResending
                                ? "Resending..."
                                : otpCooldown > 0
                                  ? `Resend in ${otpCooldown}s`
                                  : "Resend Code"}
                            </button>
                            <button
                              type="button"
                              onClick={() => goToStep(SignupStep.REGISTER)}
                              className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            >
                              <ArrowLeft size={12} /> Change Email
                            </button>
                          </div>
                        </div>

                        {/* Trust strip */}
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          <span className="text-[0.65rem] font-medium text-gray-500">
                            Never share your OTP · Secured · Trusted Community
                          </span>
                        </div>

                        {/* Testing hint */}
                        <div className="text-center mt-2 animate-in fade-in duration-700">
                          <p className="text-[0.65rem] text-gray-400">
                            Testing? Try{" "}
                            <kbd className="bg-gray-100 px-1 py-0.5 rounded border border-gray-200 font-mono text-[0.6rem] text-gray-600">
                              123456
                            </kbd>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── STEP 3: ACADEMIC ── */}
                {step === SignupStep.ACADEMIC && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[500px] sm:h-[450px] overflow-y-auto pr-2 pb-6 custom-scrollbar">
                    {/* Role Selection */}
                    <FormField
                      control={form.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                            Role
                          </FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setValue("courseIds", []); // Clear selection on role change
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <div className="relative">
                                <Users
                                  size={14}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                                />
                                <SelectTrigger className={inputCls + " pl-10"}>
                                  <SelectValue placeholder="Identify as..." />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {(roles || [])
                                .filter((r) => r.name !== "ADMIN")
                                .map((r) => (
                                  <SelectItem key={r._id} value={r._id}>
                                    {r.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* University Selection */}
                    <FormField
                      control={form.control}
                      name="universityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                            University
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <div className="relative">
                                <GraduationCap
                                  size={14}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                                />
                                <SelectTrigger className={inputCls + " pl-10"}>
                                  <SelectValue placeholder="Select University" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {universities?.map((u) => (
                                <SelectItem key={u._id} value={u._id}>
                                  {u.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Course Selection (Role Based) */}
                    <div className="space-y-2 relative">
                      <label className="text-[0.74rem] font-semibold text-gray-700">
                        {selectedRoleName === "STUDENT"
                          ? "Main Course"
                          : "Associate Courses (Multiple)"}
                      </label>

                      {selectedRoleName === "STUDENT" ? (
                        <FormField
                          control={form.control}
                          name="courseIds"
                          render={({ field }) => (
                            <FormItem className="w-full relative">
                              <Select
                                onValueChange={(val) => field.onChange([val])}
                                value={field.value?.[0] || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className={inputCls + " pl-4"}>
                                    <SelectValue placeholder="Select Course" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {courses?.map((course) => (
                                    <SelectItem key={course._id} value={course._id}>
                                      {course.courseName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="relative">
                          <div
                            className={`${inputCls} min-h-11 h-auto flex flex-wrap gap-1 items-center py-2 cursor-pointer transition-colors hover:border-indigo-500 pl-4`}
                            onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                          >
                            {selectedCourseIds.length > 0 ? (
                              courses
                                .filter((c) => selectedCourseIds.includes(c._id))
                                .map((c) => (
                                  <span key={c._id} className="bg-indigo-100 text-indigo-700 text-[0.7rem] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    {c.courseName}
                                  </span>
                                ))
                            ) : (
                              <span className="text-gray-400">Select Courses</span>
                            )}
                          </div>

                          {isCourseDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsCourseDropdownOpen(false)}></div>
                              <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-[160px] overflow-y-auto py-1 custom-scrollbar">
                                {courses?.map((course) => {
                                  const isChecked = selectedCourseIds.includes(course._id);
                                  return (
                                    <div
                                      key={course._id}
                                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer select-none"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => toggleCourse(course._id)}
                                    >
                                      {/* Plain CSS checkmark — no Radix state management */}
                                      <span className={`flex-shrink-0 mr-2 h-4 w-4 rounded-[4px] border transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'} flex items-center justify-center`}>
                                        {isChecked && (
                                          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth="1.8">
                                            <polyline points="1,4 3.5,6.5 9,1" />
                                          </svg>
                                        )}
                                      </span>
                                      <span className="text-sm font-medium">{course.courseName}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      <FormMessage className="text-[0.68rem] text-red-500" />
                    </div>

                    {/* Conditional Profile Fields */}
                    {selectedRoleName === "STUDENT" && (
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="semesterId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">
                                Current Semester
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <div className="relative">
                                    <Layers
                                      size={14}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                                    />
                                    <SelectTrigger
                                      className={inputCls + " pl-10"}
                                    >
                                      <SelectValue placeholder="Select Semester" />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent>
                                  {semesters?.map((s) => (
                                    <SelectItem key={s._id} value={s._id}>
                                      Semester {s.number}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[0.68rem] text-red-500" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="hobby_badge"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Hobby Badge</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className={inputCls + " pl-4"}>
                                      <SelectValue placeholder="Select Badge" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {AVAILABLE_HOBBY_BADGES.map((badge) => (
                                      <SelectItem key={badge} value={badge}>
                                        {badge}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          <div className="space-y-2 relative">
                            <label className="text-[0.74rem] font-semibold text-gray-700">Skills</label>
                            <div className="relative">
                              <div
                                className={`${inputCls} min-h-11 h-auto flex flex-wrap gap-1 items-center py-2 cursor-pointer transition-colors hover:border-indigo-500 pl-4`}
                                onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                              >
                                {selectedSkillsArr.length > 0 ? (
                                  selectedSkillsArr.filter(Boolean).map((skill) => (
                                    <span key={skill} className="bg-indigo-100 text-indigo-700 text-[0.7rem] px-2 py-0.5 rounded-full">
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-gray-400">Select Skills</span>
                                )}
                              </div>
                              {isSkillDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setIsSkillDropdownOpen(false)}></div>
                                  <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-[160px] overflow-y-auto py-1 custom-scrollbar">
                                    {AVAILABLE_SKILLS.map((skill) => {
                                      const isChecked = selectedSkillsArr.includes(skill);
                                      return (
                                        <div
                                          key={skill}
                                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer select-none"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={() => toggleSkill(skill)}
                                        >
                                          <span className={`flex-shrink-0 mr-2 h-4 w-4 rounded-[4px] border transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'} flex items-center justify-center`}>
                                            {isChecked && (
                                              <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth="1.8">
                                                <polyline points="1,4 3.5,6.5 9,1" />
                                              </svg>
                                            )}
                                          </span>
                                          <span className="text-sm font-medium">{skill}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRoleName === "TEACHER" && (
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Designation</FormLabel>
                              <Input
                                placeholder="Professor"
                                className={inputCls + " pl-4"}
                                {...field}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Department</FormLabel>
                              <Input
                                placeholder="CSE"
                                className={inputCls + " pl-4"}
                                {...field}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="experienceYears"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Years of Experience</FormLabel>
                              <Input
                                type="number"
                                placeholder="E.g. 5"
                                className={inputCls + " pl-4"}
                                {...field}
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {selectedRoleName === "ALUMINI" && (
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="currentCompany"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Company</FormLabel>
                              <Input
                                placeholder="Google"
                                className={inputCls + " pl-4"}
                                {...field}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Job Title</FormLabel>
                              <Input
                                placeholder="Software Engineer"
                                className={inputCls + " pl-4"}
                                {...field}
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="experienceYears"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Experience (Years)</FormLabel>
                              <Input
                                type="number"
                                placeholder="E.g. 2"
                                className={inputCls + " pl-4"}
                                {...field}
                              />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2 relative col-span-2 sm:col-span-1">
                          <label className="text-[0.74rem] font-semibold text-gray-700">Skills</label>
                          <div className="relative">
                            <div
                              className={`${inputCls} min-h-11 h-auto flex flex-wrap gap-1 items-center py-2 cursor-pointer transition-colors hover:border-indigo-500 pl-4`}
                              onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                            >
                              {selectedSkillsArr.length > 0 ? (
                                selectedSkillsArr.filter(Boolean).map((skill) => (
                                  <span key={skill} className="bg-indigo-100 text-indigo-700 text-[0.7rem] px-2 py-0.5 rounded-full">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400">Select Skills</span>
                              )}
                            </div>
                            {isSkillDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsSkillDropdownOpen(false)}></div>
                                <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-[160px] overflow-y-auto py-1 custom-scrollbar">
                                  {AVAILABLE_SKILLS.map((skill) => {
                                    const isChecked = selectedSkillsArr.includes(skill);
                                    return (
                                      <div
                                        key={skill}
                                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer select-none"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => toggleSkill(skill)}
                                      >
                                        <span className={`flex-shrink-0 mr-2 h-4 w-4 rounded-[4px] border transition-colors ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'} flex items-center justify-center`}>
                                          {isChecked && (
                                            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth="1.8">
                                              <polyline points="1,4 3.5,6.5 9,1" />
                                            </svg>
                                          )}
                                        </span>
                                        <span className="text-sm font-medium">{skill}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-[10px]"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex-col gap-5 pt-2 pb-6 border-none bg-transparent">
            {step === SignupStep.REGISTER && (
              <p className="text-center text-[0.8rem] text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/?mode=login"
                  className="font-bold text-indigo-600 hover:opacity-75"
                >
                  LogIn instead →
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
