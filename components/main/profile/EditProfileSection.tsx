"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileValues } from "./profileSchema";
import {
    Camera,
    GraduationCap,
    Briefcase,
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
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { updateProfile, getUserById } from "@/features/users/userThunk";
import { getAllUniversities, getCoursesByUniversityId } from "@/features/university/universityThunk";
import { getSemestersByCourseId } from "@/features/semester/semesterThunk";
import { BASE_URL, ASSET_URL } from "@/services/apiEndpoints";

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
                            disabled={disabled}
                            className="h-11 rounded-xl border-gray-200 bg-white text-[0.85rem] shadow-sm transition-all focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-400/10 disabled:opacity-50 disabled:bg-gray-50 cursor-not-allowed disabled:cursor-not-allowed"
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
    const params = useParams();
    const id = params?.id as string;
    const dispatch = useAppDispatch();
    const { singleUser } = useAppSelector((state) => state.user);
    const { user } = useAppSelector((state) => state.auth);

    const [saved, setSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const [isHydrated, setIsHydrated] = useState(false);
    
    // Master Data States
    const [universities, setUniversities] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [semesters, setSemesters] = useState<any[]>([]);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            bio: "",
            universityId: "",
            courseId: "",
            semesterId: "",
            hobby_badge: "",
            skills: [],
            projects: [],
            designation: "",
            department: "",
            currentCompany: "",
            jobTitle: "",
            experienceYears: "",
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
    
    const watchedUniversityId = form.watch("universityId");
    const watchedCourseId = form.watch("courseId");

    const selectedCourseId = form.watch("courseId");

    // Fetch user data if not already present or if ID changed
    useEffect(() => {
        if (id) {
            dispatch(getUserById(id));
        }
    }, [id, dispatch]);

    // Initial Master Data Fetch
    useEffect(() => {
        dispatch(getAllUniversities()).unwrap().then((data) => setUniversities(data));
    }, [dispatch]);

    // Dependent Fetch: Courses by University
    useEffect(() => {
        if (watchedUniversityId) {
            dispatch(getCoursesByUniversityId(watchedUniversityId))
                .unwrap()
                .then((data) => {
                    setCourses(data);
                    // Only reset dependent fields if it's a user-initiated change (after hydration)
                    if (isHydrated && singleUser?.universityId?._id !== watchedUniversityId) {
                        form.setValue("courseId", "");
                        form.setValue("semesterId", "");
                    }
                });
        } else {
            setCourses([]);
        }
    }, [watchedUniversityId, dispatch, isHydrated, singleUser?.universityId?._id, form]);

    // Dependent Fetch: Semesters by Course
    useEffect(() => {
        if (watchedCourseId) {
            dispatch(getSemestersByCourseId(watchedCourseId))
                .unwrap()
                .then((data) => {
                    setSemesters(data);
                    // Only reset dependent fields if it's a user-initiated change
                    const currentCourseId = singleUser?.courseIds?.[0]?._id || "";
                    if (isHydrated && currentCourseId !== watchedCourseId) {
                        form.setValue("semesterId", "");
                    }
                });
        } else {
            setSemesters([]);
        }
    }, [watchedCourseId, dispatch, isHydrated, singleUser?.courseIds, form]);

    // Hydrate form with user data
    useEffect(() => {
        if (singleUser && !isHydrated) {
            const profile = singleUser.Profile;

            // Simple IDs for display
            const initialCourseId = singleUser.courseIds?.[0]?._id || "";
            const initialSemesterId = (profile?.semesterId as any)?._id || profile?.semesterId || "";

            form.reset({
                firstName: singleUser.firstName || "",
                lastName: singleUser.lastName || "",
                email: singleUser.email || "",
                phone: singleUser.phone || "",
                bio: singleUser.bio || (singleUser.teacherProfile as any)?.bio || "",
                universityId: singleUser.universityId?._id || "",
                courseId: initialCourseId,
                semesterId: initialSemesterId,
                hobby_badge: (profile as any)?.hobby_badge || "",
                startYear: singleUser.startYear?.toString() || "",
                endYear: singleUser.endYear?.toString() || "",
                skills: (profile as any)?.skills?.length > 0
                    ? (profile as any).skills.map((s: string) => ({ name: s }))
                    : [],
                projects: (profile as any)?.projects?.length > 0
                    ? (profile as any).projects.map((p: any) => ({ title: p.title || p }))
                    : [],
                designation: (singleUser.teacherProfile as any)?.designation || (profile as any)?.designation || "",
                department: (singleUser.teacherProfile as any)?.department || (profile as any)?.department || "",
                currentCompany: (singleUser.aluminiProfile as any)?.currentCompany || (profile as any)?.currentCompany || "",
                jobTitle: (singleUser.aluminiProfile as any)?.jobTitle || (profile as any)?.jobTitle || "",
                experienceYears: (singleUser.teacherProfile as any)?.experienceYears?.toString() || 
                                 (singleUser.aluminiProfile as any)?.experienceYears?.toString() || 
                                 (profile as any)?.experienceYears?.toString() || "",
            });

            if (singleUser.avatar) setAvatarUrl(`${ASSET_URL}${singleUser.avatar}`);
            if (singleUser.coverImage) setCoverUrl(`${ASSET_URL}${singleUser.coverImage}`);

            setIsHydrated(true);
        }
    }, [singleUser, form, isHydrated]);

    const onSubmit: SubmitHandler<ProfileValues> = async (values) => {
        console.log("Submitting values:", values);
        const formData = new FormData();
        
        // General top-level user fields
        formData.append("firstName", values.firstName || "");
        formData.append("lastName", values.lastName || "");
        formData.append("phone", values.phone || "");
        if (values.bio) formData.append("bio", values.bio);
        
        // Role-specific fields
        if (values.hobby_badge) formData.append("hobby_badge", values.hobby_badge);
        if (values.designation) formData.append("designation", values.designation);
        if (values.department) formData.append("department", values.department);
        if (values.currentCompany) formData.append("currentCompany", values.currentCompany);
        if (values.jobTitle) formData.append("jobTitle", values.jobTitle);
        if (values.experienceYears) formData.append("experienceYears", values.experienceYears);

        // Academic & Career
        if (values.universityId) formData.append("universityId", values.universityId);
        if (values.courseId) formData.append("courseIds", values.courseId);
        if (values.semesterId) formData.append("semesterId", values.semesterId);
        if (values.startYear) formData.append("startYear", values.startYear);
        if (values.endYear) formData.append("endYear", values.endYear);

        values.skills.forEach((s: any) => {
            if (s.name.trim()) formData.append("skills", s.name.trim());
        });

        values.projects.forEach((p: any) => {
            if (p.title.trim()) formData.append("projects", p.title.trim());
        });

        if (avatarFile) formData.append("avatar", avatarFile);
        if (coverFile) formData.append("coverImage", coverFile);

        try {
            const res = await dispatch(updateProfile(formData as any));
            if (updateProfile.fulfilled.match(res)) {
                setSaved(true);
                setTimeout(() => {
                    setSaved(false);
                    router.push("/profile");
                }, 1500);
            } else {
                console.error("Update failed:", res.payload);
            }
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    const onFormError = (errors: any) => {
        console.error("Form Validation Errors:", errors);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarUrl(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-2 px-5">
            <div className="mb-7 flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-xl font-black text-[#1a1a3b]">Edit Profile</h1>
                    <p className="text-gray-500 text-sm font-bold">Manage your identities, academic progress, and media</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/profile")} className="rounded-2xl h-10 px-6 font-black border-2 border-gray-100 hover:bg-gray-50">
                    <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-8 pb-10">
                    {/* Media Assets */}
                    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white p-0">
                        <div className="h-48 relative bg-gray-50 overflow-hidden group">
                            {coverUrl ? (
                                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                                    <Camera size={48} className="opacity-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <label className="absolute bottom-4 right-4 h-11 px-4 bg-white/90 backdrop-blur rounded-xl border border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-white transition-all shadow-xl text-xs font-black uppercase tracking-wider">
                                <Camera size={16} /> Update Cover
                                <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
                            </label>
                        </div>

                        <div className="px-10 pb-10 relative">
                            <div className="relative -mt-14 inline-block group">
                                <div className="h-28 w-28 rounded-3xl bg-white p-1.5 shadow-2xl ring-1 ring-black/5">
                                    <div className="h-full w-full rounded-[1.2rem] overflow-hidden bg-indigo-50 border-2 border-white flex items-center justify-center">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-black text-indigo-200 uppercase">{singleUser?.firstName?.[0] || "?"}</span>
                                        )}
                                    </div>
                                </div>
                                <label className="absolute -bottom-2 -right-2 h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-white cursor-pointer hover:bg-indigo-700 shadow-lg transition-all hover:scale-110">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-black text-[#1a1a3b]">Profile Identity</h3>
                                <p className="text-xs font-bold text-gray-400">High quality avatars stand out more in groups</p>
                            </div>
                        </div>
                    </Card>
                    <SectionCard title="Personal Information" icon={Briefcase}>
                        <FieldGrid>
                            <StyledField control={form.control} name="firstName" label="First Name" placeholder="First Name" />
                            <StyledField control={form.control} name="lastName" label="Last Name" placeholder="Last Name" />
                            <StyledField control={form.control} name="email" label="Email Address (Locked)" placeholder="Locked" disabled type="email" />
                            <StyledField control={form.control} name="phone" label="Phone Number" placeholder="Phone" type="tel" />
                        </FieldGrid>
                    </SectionCard>

                    <SectionCard title="About & Identity" icon={Users} accent="amber" description="Your story and unique hobby badge">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Biography</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell something about yourself..."
                                                className="min-h-[120px] rounded-2xl border-gray-100 bg-white placeholder:text-gray-400 focus-visible:ring-indigo-500/10 font-bold text-sm leading-relaxed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </SectionCard>
                    {user?.roleId?.name === "STUDENT" && (
                        <SectionCard title="Academic Career" icon={GraduationCap} accent="emerald">
                            <FieldGrid>
                                <FormField
                                    control={form.control}
                                    name="universityId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[0.78rem] font-semibold text-gray-700">University</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10">
                                                        <SelectValue placeholder="Select University" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {universities.map((uni) => (
                                                        <SelectItem key={uni._id} value={uni._id} className="text-sm font-medium">
                                                            {uni.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="courseId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Course</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedUniversityId}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10">
                                                        <SelectValue placeholder={watchedUniversityId ? "Select Course" : "Select University first"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {courses.map((course) => (
                                                        <SelectItem key={course._id} value={course._id} className="text-sm font-medium">
                                                            {course.courseName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="semesterId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Semester</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCourseId}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10">
                                                        <SelectValue placeholder={watchedCourseId ? "Select Semester" : "Select Course first"} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {semesters.map((sem) => (
                                                        <SelectItem key={sem._id} value={sem._id} className="text-sm font-medium">
                                                            {sem.name || `Semester ${sem.semesterNumber}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <StyledField control={form.control} name="startYear" label="Start Year" placeholder="2022" />
                                <StyledField control={form.control} name="endYear" label="End Year" placeholder="2026" />
                            </FieldGrid>
                        </SectionCard>
                    )}

                    {user?.roleId?.name === "TEACHER" && (
                        <SectionCard title="Professional Teaching Details" icon={GraduationCap} accent="emerald">
                            <FieldGrid>
                                <FormField
                                    control={form.control}
                                    name="universityId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[0.78rem] font-semibold text-gray-700">University</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10">
                                                        <SelectValue placeholder="Select University" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {universities.map((uni) => (
                                                        <SelectItem key={uni._id} value={uni._id} className="text-sm font-medium">
                                                            {uni.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <StyledField control={form.control} name="designation" label="Designation" placeholder="e.g. Senior Professor" />
                                <StyledField control={form.control} name="department" label="Department" placeholder="e.g. Computer Science" />
                                <StyledField control={form.control} name="experienceYears" label="Total Experience (Years)" placeholder="e.g. 5" type="number" />
                                <StyledField control={form.control} name="startYear" label="Joined Year" placeholder="2020" />
                            </FieldGrid>
                        </SectionCard>
                    )}

                    {user?.roleId?.name === "ALUMINI" && (
                        <SectionCard title="Professional Career Details" icon={Briefcase} accent="rose">
                            <FieldGrid>
                                <FormField
                                    control={form.control}
                                    name="universityId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Alma Mater (University)</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10">
                                                        <SelectValue placeholder="Select University" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                    {universities.map((uni) => (
                                                        <SelectItem key={uni._id} value={uni._id} className="text-sm font-medium">
                                                            {uni.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <StyledField control={form.control} name="currentCompany" label="Current Company" placeholder="e.g. Google" />
                                <StyledField control={form.control} name="jobTitle" label="Job Title" placeholder="e.g. Software Engineer" />
                                <StyledField control={form.control} name="experienceYears" label="Total Experience (Years)" placeholder="e.g. 3" type="number" />
                                <StyledField control={form.control} name="startYear" label="Work Start Year" placeholder="2023" />
                            </FieldGrid>
                        </SectionCard>
                    )}


                    <SectionCard title="Portfolio & Skills" icon={LayoutGrid} accent="indigo">
                        <div className="space-y-10">
                            <div>
                                <FormLabel className="text-[0.78rem] font-black uppercase tracking-widest text-indigo-400 mb-4 block">Core Skills</FormLabel>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {skillFields.map((field, index) => (
                                        <div key={field.id} className="relative group">
                                            <FormField
                                                control={form.control}
                                                name={`skills.${index}.name`}
                                                render={({ field }) => (
                                                    <div className="flex items-center gap-1 bg-white ring-1 ring-gray-100 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-200 transition-all">
                                                        <Input {...field} className="border-none bg-transparent shadow-none h-auto py-0 px-0 w-24 text-sm font-bold focus-visible:ring-0" placeholder="Skill name" />
                                                        <button type="button" onClick={() => removeSkill(index)} className="text-gray-300 hover:text-red-500"><X size={14} /></button>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => appendSkill({ name: "" })} className="rounded-xl border-dashed h-[38px] px-4 font-black text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                        <Plus size={14} className="mr-1" /> Add Skill
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <FormLabel className="text-[0.78rem] font-black uppercase tracking-widest text-indigo-400 mb-4 block">Major Projects</FormLabel>
                                <div className="space-y-4">
                                    {projectFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative group">
                                            <StyledField control={form.control} name={`projects.${index}.title`} label="Project Title" placeholder="e.g. Nexus AI" />
                                            <button type="button" onClick={() => removeProject(index)} className="mt-6 p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={() => appendProject({ title: "" })} className="w-full h-14 rounded-2xl border-dashed border-2 font-black text-indigo-600 hover:bg-indigo-50 border-indigo-100">
                                        <Plus size={18} className="mr-2" /> Append New Project
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <div className="flex justify-end gap-5 pt-4">
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="rounded-2xl h-14 px-10 font-black text-gray-400 border-2 border-gray-100 hover:bg-gray-50">Discard Changes</Button>
                        <Button type="submit" className="rounded-2xl h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/30 flex gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            {saved ? <><Check className="w-5 h-5" /> All Saved!</> : <><ChevronRight className="w-5 h-5" /> Update My Profile</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
