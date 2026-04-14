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
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { updateProfile } from "@/features/users/userThunk";
import { getCoursesByUniversityId } from "@/features/university/universityThunk";
import { getSemestersByCourseId } from "@/features/semester/semesterThunk";
import { ICourse, ISemester } from "@/features/semester/semesterModel";
import { BASE_URL } from "@/services/apiEndpoints";

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
    const dispatch = useAppDispatch();
    const singleStudent = useAppSelector((state) => state.user.me);

    const [saved, setSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const [courses, setCourses] = useState<ICourse[]>([]);
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

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
            startYear: "",
            endYear: "",
            hobby_badge: "",
            skills: [],
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

    const selectedCourseId = form.watch("courseId");

    // Hydrate form and fetch initial courses
    useEffect(() => {
        if (singleStudent && !isHydrated) {
            const firstCourseRelation = singleStudent.courseIds?.[0];
            const initialCourseId = (firstCourseRelation as any)?.courseId?._id || (firstCourseRelation as any)?._id || "";

            const semEntry = singleStudent.Profile?.semesterId;
            const initialSemesterId = (semEntry as any)?._id || (typeof semEntry === "string" ? semEntry : "");
            
            console.log("DEBUG: Hydrating academic IDs", { initialCourseId, initialSemesterId });

            if (initialCourseId || initialSemesterId || singleStudent.firstName) {
                const startYear = singleStudent.startYear || (singleStudent as any).studentProfile?.startYear || (singleStudent.Profile as any)?.startYear;
                const endYear = singleStudent.endYear || (singleStudent as any).studentProfile?.endYear || (singleStudent.Profile as any)?.endYear;

                form.reset({
                    firstName: singleStudent.firstName || "",
                    lastName: singleStudent.lastName || "",
                    email: singleStudent.email || "",
                    phone: singleStudent.phone || "",
                    bio: singleStudent.bio || "",
                    universityId: singleStudent.universityId?._id || "",
                    courseId: initialCourseId,
                    semesterId: initialSemesterId,
                    startYear: startYear?.toString() || "",
                    endYear: endYear?.toString() || "",
                    hobby_badge: (singleStudent.Profile as any)?.hobby_badge || "",
                    skills: (singleStudent.Profile as any)?.skills?.length > 0
                        ? (singleStudent.Profile as any).skills.map((s: string) => ({ name: s }))
                        : [],
                    projects: (singleStudent.Profile as any)?.projects?.length > 0
                        ? (singleStudent.Profile as any).projects.map((p: string) => ({ title: p }))
                        : [],
                });
                
                if (singleStudent.avatar) setAvatarUrl(`http://localhost:5000${singleStudent.avatar}`);
                if (singleStudent.coverImage) setCoverUrl(`http://localhost:5000${singleStudent.coverImage}`);

                if (singleStudent.universityId?._id) {
                    dispatch(getCoursesByUniversityId(singleStudent.universityId._id)).then((res) => {
                        if (getCoursesByUniversityId.fulfilled.match(res)) {
                            const courseData = res.payload.map((item: any) => item.courseId || item);
                            setCourses(courseData);
                        }
                    });
                }
                
                setIsHydrated(true);
            }
        }
    }, [singleStudent, form, dispatch, isHydrated]);

    // Fetch semesters when course changes
    useEffect(() => {
        if (selectedCourseId) {
            dispatch(getSemestersByCourseId(selectedCourseId)).then((res) => {
                if (getSemestersByCourseId.fulfilled.match(res)) {
                    setSemesters(res.payload);
                    // If we have a semesterId in the form but it's not in the new semesters list, 
                    // we might need to handle it, but usually, if it's the initial load, 
                    // the value is already there and Select should pick it up.
                }
            });
        } else {
            setSemesters([]);
        }
    }, [selectedCourseId, dispatch]);

    const onSubmit: SubmitHandler<ProfileValues> = async (values) => {
        console.log("Submitting values:", values);
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("phone", values.phone);
        if (values.bio) formData.append("bio", values.bio);
        if (values.startYear) formData.append("startYear", values.startYear);
        if (values.endYear) formData.append("endYear", values.endYear);
        if (values.hobby_badge) formData.append("hobby_badge", values.hobby_badge);

        // Use field names without brackets as backend preprocessors handle multiple appends
        formData.append("courseIds", values.courseId);
        formData.append("semesterId", values.semesterId);

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
                    <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
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
                                            <span className="text-4xl font-black text-indigo-200 uppercase">{singleStudent?.firstName?.[0] || "?"}</span>
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
                            <StyledField control={form.control} name="firstName" label="First Name" placeholder="Riya" />
                            <StyledField control={form.control} name="lastName" label="Last Name" placeholder="Singh" />
                            <StyledField control={form.control} name="email" label="Email Address (Locked)" placeholder="riya@university.edu" disabled type="email" />
                            <StyledField control={form.control} name="phone" label="Phone Number" placeholder="+91 9876543210" type="tel" />
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
                            <FormField
                                control={form.control}
                                name="hobby_badge"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Hobby Badge</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm font-bold text-sm">
                                                    <SelectValue placeholder="Choose a badge" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                                                <SelectItem value="coding" className="font-bold">Coding Ninja</SelectItem>
                                                <SelectItem value="design" className="font-bold">Design Enthusiast</SelectItem>
                                                <SelectItem value="sports" className="font-bold">Athlete</SelectItem>
                                                <SelectItem value="music" className="font-bold">Musician</SelectItem>
                                                <SelectItem value="art" className="font-bold">Artist</SelectItem>
                                                <SelectItem value="gaming" className="font-bold">Gamer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </SectionCard>

                    <SectionCard title="Academic Career" icon={GraduationCap} accent="emerald">
                        <FieldGrid>
                            <FormItem className="space-y-1.5">
                                <FormLabel className="text-[0.78rem] font-semibold text-gray-700">University</FormLabel>
                                <Input
                                    value={singleStudent?.universityId?.name || "Loading..."}
                                    disabled
                                    className="h-11 rounded-xl border-gray-200 bg-gray-50 font-bold text-sm"
                                />
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="courseId"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Select Course</FormLabel>
                                        <Select 
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                form.setValue("semesterId", ""); // Reset semester when course changes
                                            }} 
                                            value={field.value} 
                                            key={courses.length > 0 ? "loaded" : "loading"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm font-bold text-sm">
                                                    <SelectValue placeholder={(singleStudent?.courseIds?.[0] as any)?.courseId?.courseName || "Choose your course"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                                                {courses.map((c) => (
                                                    <SelectItem key={c._id} value={c._id} className="font-bold">{c.courseName}</SelectItem>
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
                                        <FormLabel className="text-[0.78rem] font-semibold text-gray-700">Current Semester</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCourseId} key={semesters.length > 0 ? "loaded-sem" : "loading-sem"}>
                                            <FormControl>
                                                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white shadow-sm font-bold text-sm">
                                                    <SelectValue placeholder={(singleStudent?.Profile?.semesterId as any)?.name || "Select semester"} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                                                {semesters.map((s) => (
                                                    <SelectItem key={s._id} value={s._id} className="font-bold">{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <StyledField control={form.control} name="startYear" label="Start Year" placeholder="2022" type="number" />
                            <StyledField control={form.control} name="endYear" label="Estimated End Year" placeholder="2026" type="number" />
                        </FieldGrid>
                    </SectionCard>

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
