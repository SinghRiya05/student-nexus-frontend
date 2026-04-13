"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { profileSchema, ProfileValues } from "./profileSchema";
import Image from "next/image";
import {
    Camera,
    GraduationCap,
    Briefcase,
    MapPin,
    Check,
    ChevronRight,
    X,
    Trash2,
    Plus,
    Users,
    LayoutGrid,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";

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
        <Card className="group relative overflow-hidden rounded-2xl border-gray-100 bg-white shadow-sm transition-all duration-300">
            <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accents[accent]} opacity-50`} />
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start gap-4 space-y-0">
                <div className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${accents[accent]} text-white shadow-sm ring-4 ring-white`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-[1.05rem] font-bold text-gray-900">{title}</CardTitle>
                    {description && <p className="mt-1 text-[0.8rem] text-gray-500">{description}</p>}
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 ">
                <div className="rounded-2xl bg-gray-50/50 p-5 ring-1 ring-inset ring-gray-100/50">
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>;
}

function StyledField({
    control,
    name,
    label,
    placeholder,
    disabled,
    type = "text",
}: {
    control: any;
    name: any;
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
                    <FormLabel className="text-[0.78rem] font-semibold text-gray-700">{label}</FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            className="h-11 rounded-xl border-gray-200 bg-white text-[0.85rem] shadow-sm transition-all focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-400/10"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className="text-[0.72rem] text-red-500" />
                </FormItem>
            )}
        />
    );
}

export default function EditProfileSection() {
    const router = useRouter();
    const [saved, setSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "Riya",
            lastName: "Singh",
            email: "riya.singh@university.edu",
            phone: "+91 9876543210",
            universityName: "Delhi University",
            courseName: "B.Tech Computer Science",
            currentSemester: "6",
            interestBadge: "",
            profession: "Student",
            batchName: "",
            completionYear: "2025 - 2026",
            admissionDate: "",
            country: "India",
            state: "Delhi",
            city: "New Delhi",
            pinCode: "110001",
            bio: "",
            skills: [{ name: "" }],
            projects: [],
        },
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control: form.control,
        name: "projects",
    });

    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control: form.control,
        name: "skills",
    });

    useEffect(() => {
        if (singleStudent) {
            form.reset({
                firstName: singleStudent.firstName || "",
                lastName: singleStudent.lastName || "",
                email: singleStudent.email || "",
                phone: singleStudent.phone || "",
                universityName: singleStudent.universityId?.name || "",
                courseName: singleStudent.courseIds?.[0]?.courseName || "",
                currentSemester: singleStudent.semesterId?.name || "1",
                completionYear: singleStudent.endYear?.toString() || "",
                bio: singleStudent.bio || "",
                skills: (singleStudent.studentProfile?.skills?.length > 0)
                    ? singleStudent.studentProfile.skills.map((s: string) => ({ name: s }))
                    : [{ name: "" }],
                projects: (singleStudent.studentProfile?.projects?.length > 0)
                    ? singleStudent.studentProfile.projects.map((p: string) => ({ title: p, role: "Project", date: "", description: "" }))
                    : [],
            });
            if (singleStudent.avatar) setAvatarUrl(singleStudent.avatar);
        }
    }, [singleStudent, form]);

    const onSubmit: SubmitHandler<ProfileValues> = async (values) => {
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("phone", values.phone);
        if (values.bio) formData.append("bio", values.bio);
        if (values.completionYear) formData.append("endYear", values.completionYear);

        values.skills.forEach((s: any) => {
            if (s.name) formData.append("skills[]", s.name);
        });

        values.projects.forEach((p: any) => {
            if (p.title) formData.append("projects[]", p.title);
        });

        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }

        const res = await dispatch(updateMyProfile(formData));

        if (updateMyProfile.fulfilled.match(res)) {
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                router.push("/profile");
            }, 1500);
        } else {
            console.error("Update failed", res.payload);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-2 px-5">
            <div className="mb-7 flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-lg font-semibold text-[#1a1a3b]">Edit Profile</h1>
                    <p className="text-gray-500 text-sm font-medium">Update your personal and academic information</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/profile")} className="rounded-xl h-10 px-5 font-semibold">
                    <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Avatar Upload */}
                    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden p-5 bg-white">
                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl transition-transform group-hover:scale-105">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-indigo-600">R</span>
                                    )}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white cursor-pointer hover:bg-indigo-700 shadow-lg transition-all hover:scale-110">
                                    <Camera size={18} />
                                </label>
                                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#1a1a3b]">Profile Picture</h3>
                                <p className="text-sm font-medium text-gray-400">Upload a professional photo for your profile</p>
                            </div>
                        </div>
                    </Card>

                    <SectionCard title="General Information" icon={Briefcase}>
                        <FieldGrid>
                            <StyledField control={form.control} name="firstName" label="First Name" placeholder="Riya" />
                            <StyledField control={form.control} name="lastName" label="Last Name" placeholder="Singh" />
                            <StyledField control={form.control} name="email" label="Email Address" placeholder="riya@university.edu" type="email" />
                            <StyledField control={form.control} name="phone" label="Phone Number" placeholder="+91 9876543210" type="tel" />
                        </FieldGrid>
                    </SectionCard>

                    <SectionCard title="About Me" icon={Users} accent="amber" description="Tell us about yourself, your goals, and interests">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write a short bio..."
                                            className="min-h-[150px] rounded-2xl border-gray-100 bg-white placeholder:text-gray-400 focus-visible:ring-indigo-500/10 font-medium"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </SectionCard>

                    <SectionCard title="Academic Details" icon={GraduationCap} accent="emerald">
                        <FieldGrid>
                            <StyledField control={form.control} name="universityName" label="University Name" placeholder="Delhi University" />
                            <StyledField control={form.control} name="courseName" label="Course Name" placeholder="B.Tech Computer Science" />
                            <FormField
                                control={form.control}
                                name="currentSemester"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Current Semester</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm">
                                                    <SelectValue placeholder="Select semester" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                                    <SelectItem key={s} value={`${s}`}>Semester {s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <StyledField control={form.control} name="completionYear" label="Completion Year" placeholder="2026" type="number" />
                        </FieldGrid>
                    </SectionCard>

                    <SectionCard title="Projects & Experience" icon={Briefcase} accent="indigo" description="Add your work experience or projects">
                        <div className="space-y-6">
                            {projectFields.map((field, index) => (
                                <Card key={field.id} className="p-6 rounded-2xl border-gray-100 relative group bg-white shadow-sm">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                        onClick={() => removeProject(index)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <StyledField control={form.control} name={`projects.${index}.title`} label="Project/Company Name" placeholder="e.g. Nexus UI Framework" />
                                        <StyledField control={form.control} name={`projects.${index}.role`} label="Role" placeholder="e.g. Lead Developer" />
                                        <StyledField control={form.control} name={`projects.${index}.date`} label="Date / Duration" placeholder="e.g. 2023 - Present" />
                                        <div className="md:col-span-2">
                                            <StyledField control={form.control} name={`projects.${index}.description`} label="Summary" placeholder="Briefly describe what you did..." />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-dashed border-2 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-bold flex gap-2"
                                onClick={() => appendProject({ title: "", role: "", date: "", description: "" })}
                            >
                                <Plus size={18} /> Add Project or Experience
                            </Button>
                        </div>
                    </SectionCard>

                    <SectionCard title="Skills" icon={LayoutGrid} accent="indigo" description="Add your technical and soft skills one by one">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-3 mb-2">
                                {skillFields.map((field, index) => (
                                    <div key={field.id} className="relative flex items-center gap-2 group">
                                        <FormField
                                            control={form.control}
                                            name={`skills.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="e.g. React"
                                                                className="h-11 pr-10 rounded-xl border-gray-200 bg-white text-[0.85rem] shadow-sm transition-all focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-400/10 min-w-[140px]"
                                                                {...field}
                                                            />
                                                            {skillFields.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSkill(index)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="absolute -bottom-5 left-0 text-[0.65rem]" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-10 rounded-xl border-dashed border-2 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-bold flex gap-2"
                                onClick={() => appendSkill({ name: "" })}
                            >
                                <Plus size={16} /> Add More Skills
                            </Button>
                        </div>
                    </SectionCard>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="rounded-2xl h-14 px-10 font-bold text-gray-500">Reset</Button>
                        <Button type="submit" className="rounded-2xl h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/30 flex gap-3">
                            {saved ? <><Check className="w-5 h-5 shadow-sm" /> Saved Profile!</> : <><ChevronRight className="w-5 h-5" /> Save Changes</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
