"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { profileSchema, ProfileValues } from "./profileSchema";
import Image from "next/image";
import {
    Camera,
    GraduationCap,
    Briefcase,
    MapPin,
    BookOpen,
    Users,
    Tag,
    FileText,
    Upload,
    Github,
    Linkedin,
    Globe,
    X,
    Check,
    ChevronRight,
} from "lucide-react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";



// ─── Helpers ──────────────────────────────────────────────────────────────
function SectionCard({
    title,
    description,
    icon: Icon,
    accent = "indigo",
    children,
}: {
    title: string;
    description?: string;
    icon: React.ElementType;
    accent?: string;
    children: React.ReactNode;
}) {
    const accents: Record<string, string> = {
        indigo: "from-indigo-500 to-violet-600",
        rose: "from-rose-500 to-pink-600",
        emerald: "from-emerald-500 to-teal-600",
        amber: "from-amber-500 to-orange-500",
    };

    return (
        <Card className="group relative overflow-hidden rounded-[1.25rem] border-gray-100 bg-white/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/90 hover:shadow-md">
            {/* Subtle top border highlight */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[accent]} opacity-50`} />

            <CardHeader className="pb-2 pt-7 px-7 flex flex-row items-start gap-4 space-y-0">
                <div
                    className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accents[accent]} text-white shadow-sm ring-4 ring-white transition-transform duration-300 group-hover:scale-110`}
                >
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-[1.05rem] font-bold text-gray-900">{title}</CardTitle>
                    {description && (
                        <p className="mt-1 text-[0.8rem] text-gray-500">{description}</p>
                    )}
                </div>
            </CardHeader>

            <CardContent className="px-7 pb-7 pt-2">
                <div className="rounded-2xl bg-gray-50/50 p-5 ring-1 ring-inset ring-gray-100/50">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {children}
        </div>
    );
}

function StyledField({
    control,
    name,
    label,
    placeholder,
    disabled,
    type = "text",
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    name: keyof ProfileValues;
    label: string;
    placeholder: string;
    disabled?: boolean;
    type?: string;
}) {
    return (
        <FormField
            control={control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <FormLabel className="text-[0.78rem] font-semibold text-gray-700">
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            className="h-11 rounded-xl border-gray-200 bg-white text-[0.85rem] shadow-sm transition-all placeholder:text-gray-400 focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-400/10"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className="text-[0.72rem] text-red-500" />
                </FormItem>
            )}
        />
    );
}

// ─── Describe Yourself Modal ───────────────────────────────────────────────
function DescribeModal({
    open,
    onClose,
    value,
    onChange,
}: {
    open: boolean;
    onClose: () => void;
    value: string;
    onChange: (v: string) => void;
}) {
    const [draft, setDraft] = useState(value);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[0.98rem] font-bold text-gray-900">
                        Describe Yourself
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 transition-colors hover:text-gray-700"
                    >
                        <X size={17} />
                    </button>
                </div>
                <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={6}
                    placeholder="Write a short bio about yourself, your goals, and what makes you stand out..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/15"
                />
                <div className="mt-1 text-right text-[0.68rem] text-gray-400">
                    {draft.length}/500 characters
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onChange(draft);
                            onClose();
                        }}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                    >
                        <Check size={14} /> Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function ProfileSection() {
    const [bio, setBio] = useState("");
    const [bioOpen, setBioOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "Riya",
            lastName: "Singh",
            email: "riya.singh@university.edu",
            phone: "+91 9876543210",
            interestBadge: "", // To be filled manually
            profession: "Student", // From Signup role
            universityName: "Delhi University", // From Signup university
            courseName: "B.Tech Computer Science", // From Signup course
            currentSemester: "6", // From Signup semester
            batchName: "", // To be filled manually
            completionYear: "", // To be filled manually
            admissionDate: "", // To be filled manually
            country: "", // To be filled manually
            state: "", // To be filled manually
            city: "", // To be filled manually
            pinCode: "", // To be filled manually
        },
    });

    // Automatically pre-fill the form with data saved during signup
    useEffect(() => {
        const signupData = localStorage.getItem("signupData");
        if (signupData) {
            try {
                const data = JSON.parse(signupData);
                form.reset({
                    ...form.getValues(),
                    ...data,
                });
            } catch (err) {
                console.error("Failed to parse signup data:", err);
            }
        }
    }, [form]);

    const { watch } = form;
    const firstName = watch("firstName");
    const lastName = watch("lastName");
    const profession = watch("profession");
    const interestBadge = watch("interestBadge");
    const universityName = watch("universityName");
    const courseName = watch("courseName");
    const batchName = watch("batchName");

    const onSubmit = async (values: ProfileValues) => {
        // TODO: Make API call here to save profile data
        console.log("Profile data:", values, { bio });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    const skills = ["React", "Next.js", "TypeScript", "Node.js", "Tailwind"];

    return (
        <div className="relative">
            <DescribeModal
                open={bioOpen}
                onClose={() => setBioOpen(false)}
                value={bio}
                onChange={setBio}
            />

            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-[90px]" />
                <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-100/40 blur-[90px]" />
            </div>

            <div className="flex min-h-screen flex-col gap-6 bg-transparent max-w-7xl mx-auto lg:flex-row">
                {/* ══════════ LEFT SIDEBAR ══════════ */}
                <aside className="flex w-full px-5 lg:px-0 shrink-0 flex-col gap-4 self-start lg:sticky lg:top-20 lg:w-[300px]">
                    {/* Profile Card */}
                    <Card className="overflow-hidden rounded-2xl border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-gray-200 hover:bg-white/95 hover:shadow-md">
                        {/* Top gradient banner */}
                        <div className="h-20 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />

                        <CardContent className="px-5 pb-5 pt-0">
                            {/* Avatar */}
                            <div className="relative -mt-10 mb-3 flex justify-center">
                                <div className="relative">
                                    {avatarUrl ? (
                                        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-4 border-white shadow-md">
                                            <Image
                                                src={avatarUrl}
                                                alt="Profile"
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-400 to-violet-600 text-3xl font-bold text-white shadow-md">
                                            {firstName ? firstName[0]?.toUpperCase() : "?"}
                                        </div>
                                    )}
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700"
                                    >
                                        <Camera size={12} />
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                            </div>

                            {/* Name & Role */}
                            <div className="mb-3 text-center">
                                <h2 className="text-[1.05rem] font-bold text-gray-900">
                                    {firstName || lastName
                                        ? `${firstName} ${lastName}`.trim()
                                        : "Your Name"}
                                </h2>
                                <p className="mt-0.5 text-[0.78rem] text-gray-500">
                                    {profession || "Your Role"}
                                </p>
                            </div>

                            {/* Interest Badge */}
                            {interestBadge && (
                                <div className="mb-3 flex justify-center">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[0.72rem] font-semibold text-indigo-700">
                                        <Tag size={10} />
                                        {interestBadge}
                                    </span>
                                </div>
                            )}

                            {/* Describe Yourself Button */}
                            <button
                                onClick={() => setBioOpen(true)}
                                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[0.79rem] font-semibold text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                <FileText size={14} />
                                {bio ? "Edit Bio" : "Describe Yourself"}
                            </button>

                            {bio && (
                                <p className="mb-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-[0.73rem] leading-relaxed text-gray-600 line-clamp-3">
                                    {bio}
                                </p>
                            )}

                            {/* Quick Info Boxes */}
                            <div className="space-y-2">
                                {[
                                    { icon: Briefcase, label: "Role", value: profession || "—" },
                                    {
                                        icon: GraduationCap,
                                        label: "University",
                                        value: universityName || "—",
                                    },
                                    { icon: BookOpen, label: "Course", value: courseName || "—" },
                                    { icon: Users, label: "Batch", value: batchName || "—" },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                                    >
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                                            <Icon size={13} className="text-indigo-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[0.62rem] font-semibold uppercase tracking-wide text-gray-400">
                                                {label}
                                            </p>
                                            <p className="truncate text-[0.77rem] font-medium text-gray-800">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills Card */}
                    <Card className="rounded-2xl border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-gray-200 hover:bg-white/95 hover:shadow-md">
                        <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[0.82rem] font-bold text-gray-900">Skills</CardTitle>
                            <button className="text-[0.72rem] font-semibold text-indigo-600 transition hover:opacity-70">
                                + Add
                            </button>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[0.68rem] font-semibold text-indigo-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links Card */}
                    <Card className="rounded-2xl border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-gray-200 hover:bg-white/95 hover:shadow-md">
                        <CardHeader className="p-5 pb-3">
                            <CardTitle className="text-[0.82rem] font-bold text-gray-900">
                                Social Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <div className="space-y-2">
                                {[
                                    { icon: Github, label: "GitHub", placeholder: "github.com/..." },
                                    {
                                        icon: Linkedin,
                                        label: "LinkedIn",
                                        placeholder: "linkedin.com/in/...",
                                    },
                                    { icon: Globe, label: "Portfolio", placeholder: "yoursite.com" },
                                ].map(({ icon: Icon, label, placeholder }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                                    >
                                        <Icon size={13} className="shrink-0 text-gray-400" />
                                        <input
                                            type="url"
                                            placeholder={placeholder}
                                            className="w-full bg-transparent text-[0.73rem] text-gray-700 placeholder:text-gray-300 focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* ══════════ RIGHT FORM AREA ══════════ */}
                <div className="min-w-0 flex-1 px-5 lg:px-0 pb-6 lg:py-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-5"
                        >
                            {/* ─── Section 1: General ─── */}
                            <SectionCard
                                title="General Information"
                                description="Your basic profile details and contact information."
                                icon={Briefcase}
                                accent="indigo"
                            >
                                <FieldGrid>
                                    <StyledField
                                        control={form.control}
                                        name="firstName"
                                        label="First Name"
                                        placeholder="Riya"
                                        disabled={true}
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Singh"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="email"
                                        label="Email Address"
                                        placeholder="riya@university.edu"
                                        type="email"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="phone"
                                        label="Phone Number"
                                        placeholder="+91 9876543210"
                                        type="tel"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="interestBadge"
                                        label="Interest Badge"
                                        placeholder="e.g. Open Source Enthusiast"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="profession"
                                        label="Profession"
                                        placeholder="e.g. Fullstack Developer"
                                    />
                                </FieldGrid>
                            </SectionCard>

                            {/* ─── Section 2: Educational ─── */}
                            <SectionCard
                                title="Academic Details"
                                description="Information about your university, course, and batch."
                                icon={GraduationCap}
                                accent="emerald"
                            >
                                <FieldGrid>
                                    <StyledField
                                        control={form.control}
                                        name="universityName"
                                        label="University Name"
                                        placeholder="MIT, IIT Delhi…"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="courseName"
                                        label="Course Name"
                                        placeholder="B.Tech CSE"
                                    />
                                    <FormField
                                        control={form.control}
                                        name="currentSemester"
                                        render={({ field }) => (
                                            <FormItem className="space-y-1.5">
                                                <FormLabel className="text-[0.78rem] font-semibold text-gray-700">
                                                    Current Semester
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white text-[0.85rem] shadow-sm transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10">
                                                            <SelectValue placeholder="Select semester" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                                                <SelectItem key={s} value={`${s}`}>
                                                                    Semester {s}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage className="text-[0.72rem] text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="batchName"
                                        label="Batch Name"
                                        placeholder="2022–2026"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="completionYear"
                                        label="Course Completion Year"
                                        placeholder="2026"
                                        type="number"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="admissionDate"
                                        label="Admission Date"
                                        placeholder=""
                                        type="date"
                                    />
                                </FieldGrid>
                            </SectionCard>

                            {/* ─── Section 3: Other ─── */}
                            <SectionCard
                                title="Location Details"
                                description="Your current address and location information."
                                icon={MapPin}
                                accent="rose"
                            >
                                <FieldGrid>
                                    <StyledField
                                        control={form.control}
                                        name="country"
                                        label="Country"
                                        placeholder="India"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="state"
                                        label="State"
                                        placeholder="Maharashtra"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="city"
                                        label="City"
                                        placeholder="Mumbai"
                                    />
                                    <StyledField
                                        control={form.control}
                                        name="pinCode"
                                        label="Pin Code"
                                        placeholder="400001"
                                    />
                                </FieldGrid>
                            </SectionCard>

                            {/* ─── Save Button ─── */}
                            <div className="flex items-center justify-end gap-3 pb-8">
                                <button
                                    type="button"
                                    onClick={() => form.reset()}
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                                >
                                    Reset
                                </button>
                                <Button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(99,102,241,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)]"
                                >
                                    {saved ? (
                                        <>
                                            <Check size={15} /> Saved!
                                        </>
                                    ) : (
                                        <>
                                            Save Profile <ChevronRight size={15} />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}