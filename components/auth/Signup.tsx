"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User, Mail, Phone, Lock, BookOpen,
  ArrowRight, ArrowLeft, GraduationCap,
  ShieldCheck, Users, Layers,
  CheckCircle2, Award, Globe, Clock, Hash,
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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { registerUser, verifyEmail, completeRegistration } from "@/features/auth/authThunk";
import { getAllUniversities } from "@/features/university/universityThunk";
import { getAllCourses } from "@/features/course/courseThunk";
import { getRoles } from "@/features/roles/roleThunk";
import { getAllSemesters } from "@/features/semester/semesterThunk";
import toast from "react-hot-toast";
import OtpVerificationPage from "./OtpVerification";

// ─── Zod Schemas ─────────────────────────────
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(10, "Enter a valid 10-digit phone number.").max(13),
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one symbol."),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});

const academicSchema = z.object({
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
});

const signupSchema = personalInfoSchema.extend({
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
  ACADEMIC = 3
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user, loading, error, success } = useAppSelector((state) => state.auth);
  const { universities } = useAppSelector((state) => state.university);
  const { courses } = useAppSelector((state) => state.course);
  const { roles } = useAppSelector((state) => state.role);
  const { semesters } = useAppSelector((state) => state.semester);

  const [step, setStep] = useState<SignupStep>(SignupStep.REGISTER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "", password: "",
      otp: "", universityId: "", roleId: "", courseIds: [],
    },
  });

  const { watch, setValue, trigger } = form;
  const selectedRoleId = watch("roleId");
  const selectedRoleName = roles.find(r => r._id === selectedRoleId)?.name;
  const selectedCourseIds = watch("courseIds") || [];

  // ─── Effects ───
  useEffect(() => {
    dispatch(getAllUniversities());
    dispatch(getAllCourses());
    dispatch(getRoles());
    dispatch(getAllSemesters());
  }, [dispatch]);

  // ─── Handlers ───
  const handleRegister = async () => {
    const isValid = await trigger(["firstName", "lastName", "email", "phone", "password"]);
    if (!isValid) return;

    const values = form.getValues();
    setIsSubmitting(true);
    const result = await dispatch(registerUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password
    }));
    setIsSubmitting(false);

    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful! Please check your email for OTP.");
      setStep(SignupStep.VERIFY);
    } else {
      toast.error(result.payload as string || "Failed to register.");
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    if (!user?._id) {
      toast.error("User ID missing. Please restart registration.");
      return;
    }

    const result = await dispatch(completeRegistration({
      userId: user._id,
      userData: {
        universityId: values.universityId,
        roleId: values.roleId,
        courseIds: values.courseIds,
        semesterId: values.semesterId,
        currentCompany: values.currentCompany,
        jobTitle: values.jobTitle,
        designation: values.designation,
        department: values.department,
        experienceYears: values.experienceYears,
        skills: values.skills,
      }
    }));

    if (completeRegistration.fulfilled.match(result)) {
      toast.success("Welcome aboard! Registration complete.");
      router.push("/");
    } else {
      toast.error(result.payload as string || "Final step failed.");
    }
  };

  const toggleCourse = (courseId: string) => {
    if (selectedRoleName === "STUDENT") {
      setValue("courseIds", [courseId]);
    } else {
      const current = [...selectedCourseIds];
      const index = current.indexOf(courseId);
      if (index > -1) {
        current.splice(index, 1);
      } else {
        current.push(courseId);
      }
      setValue("courseIds", current);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-slate-50/30 px-4 py-8">

        {/* Background blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-violet-100/50 blur-[80px]" />

        <Card className="relative z-10 mx-auto w-full max-w-[440px] rounded-[24px] border-none ring-0 bg-transparent shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="pb-6">
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <GraduationCap size={17} />
              </div>
              <span className="text-lg font-bold text-gray-900">Student<span className="text-indigo-600">Nexus</span></span>
            </div>

            <CardTitle className="text-[1.7rem] font-bold leading-[1.15] -tracking-[0.03em] text-gray-900">
              {step === SignupStep.REGISTER && "Create Account"}
              {step === SignupStep.VERIFY && "Verify Email"}
              {step === SignupStep.ACADEMIC && "Academic Details"}
            </CardTitle>
            <CardDescription className="text-[0.84rem] leading-relaxed text-gray-500 mt-1.5 mb-4">
              {step === SignupStep.REGISTER && "Fill in your personal information to get started."}
              {step === SignupStep.VERIFY && `We've sent a 6-digit code to ${watch("email")}`}
              {step === SignupStep.ACADEMIC && "Tell us about your university, role and courses."}
            </CardDescription>

            {/* Progress bar */}
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                  style={{ background: step >= i ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#e5e7eb" }} />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>

                {/* ── STEP 1: REGISTER ── */}
                {step === SignupStep.REGISTER && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={form.control} name="firstName"
                        render={({ field }) => (
                          <FormItem className="gap-1">
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
                          <FormItem className="gap-1">
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

                    <FormField control={form.control} name="email"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input type="email" placeholder="name@university.edu" className={inputCls} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField control={form.control} name="phone"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Phone</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input placeholder="+91 98765 43210" className={inputCls} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField control={form.control} name="password"
                      render={({ field }) => (
                        <FormItem className="gap-1">
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input type="password" placeholder="••••••••" className={inputCls} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button type="button" onClick={handleRegister} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-[10px]" disabled={loading}>
                      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Continue"}
                    </Button>
                  </div>
                )}

                {/* ── STEP 2: VERIFICATION ── */}
                {step === SignupStep.VERIFY && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <OtpVerificationPage 
                      type="signup" 
                      email={watch("email")} 
                      isStep={true} 
                      onSuccess={() => setStep(SignupStep.ACADEMIC)} 
                    />
                  </div>
                )}

                {/* ── STEP 3: ACADEMIC ── */}
                {step === SignupStep.ACADEMIC && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[400px] overflow-y-auto pr-2 custom-scrollbar">

                    {/* Role Selection */}
                    <FormField control={form.control} name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Role</FormLabel>
                          <Select onValueChange={(val) => {
                            field.onChange(val);
                            setValue("courseIds", []); // Clear selection on role change
                          }} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <SelectTrigger className={inputCls + " pl-10"}><SelectValue placeholder="Identify as..." /></SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {roles.filter(r => r.name !== "ADMIN").map(r => (
                                <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* University Selection */}
                    <FormField control={form.control} name="universityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.74rem] font-semibold text-gray-700">University</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <div className="relative">
                                <GraduationCap size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                <SelectTrigger className={inputCls + " pl-10"}><SelectValue placeholder="Select University" /></SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {universities.map(u => (
                                <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[0.68rem] text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Course Selection (Role Based) */}
                    <div className="space-y-2">
                      <label className="text-[0.74rem] font-semibold text-gray-700">
                        {selectedRoleName === "STUDENT" ? "Main Course" : "Associate Courses (Multiple)"}
                      </label>

                      <div className="grid grid-cols-1 gap-2 border rounded-xl p-3 bg-gray-50/50 max-h-[160px] overflow-y-auto">
                        {courses.map((course) => (
                          <div key={course._id} className="flex items-center space-x-2">
                            <Checkbox
                              id={course._id}
                              checked={selectedCourseIds.includes(course._id)}
                              onCheckedChange={() => toggleCourse(course._id)}
                            />
                            <label htmlFor={course._id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {course.courseName}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage className="text-[0.68rem] text-red-500" />
                    </div>

                    {/* Conditional Profile Fields */}
                    {selectedRoleName === "STUDENT" && (
                      <FormField control={form.control} name="semesterId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[0.74rem] font-semibold text-gray-700">Current Semester</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <div className="relative">
                                  <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                                  <SelectTrigger className={inputCls + " pl-10"}><SelectValue placeholder="Select Semester" /></SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {semesters.map(s => (
                                  <SelectItem key={s._id} value={s._id}>Semester {s.number}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[0.68rem] text-red-500" />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedRoleName === "TEACHER" && (
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="designation" render={({ field }) => (<FormItem> <FormLabel>Designation</FormLabel> <Input placeholder="Professor" className={inputCls + " pl-4"} {...field} /> </FormItem>)} />
                        <FormField control={form.control} name="department" render={({ field }) => (<FormItem> <FormLabel>Department</FormLabel> <Input placeholder="CSE" className={inputCls + " pl-4"} {...field} /> </FormItem>)} />
                      </div>
                    )}

                    {selectedRoleName === "ALUMINI" && (
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="currentCompany" render={({ field }) => (<FormItem> <FormLabel>Company</FormLabel> <Input placeholder="Google" className={inputCls + " pl-4"} {...field} /> </FormItem>)} />
                        <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem> <FormLabel>Job Title</FormLabel> <Input placeholder="Software Engineer" className={inputCls + " pl-4"} {...field} /> </FormItem>)} />
                      </div>
                    )}

                    <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 rounded-[10px]" disabled={loading}>
                      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "Complete Registration"}
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
                <Link href="/?mode=login" className="font-bold text-indigo-600 hover:opacity-75">LogIn instead →</Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}