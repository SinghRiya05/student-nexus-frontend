"use client";

import React, { useEffect, useState } from "react";
import { ASSET_URL } from "@/services/apiEndpoints";
import {
    MapPin,
    Users,
    Briefcase,
    GraduationCap,
    MoreHorizontal,
    ChevronRight,
    UserPlus,
    LayoutGrid,
    MessageSquare,
    Code,
    CheckCircle,
    ShieldCheck,
    Activity,
    Target,
    Sparkles,
    Calendar,
    Clock,
    Camera,
    Link as LinkIcon,
    Mail,
    Send,
    SchoolIcon
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getStudentById } from "@/features/student/studentThunk";
import { getFollowers, getFollowing, getSentRequests, sendFollowRequest, unfollow } from "@/features/follow/followThunk";
import { accessChat } from "@/features/chat/chatThunk";
import { setSelectedChatId } from "@/features/chat/chatSlice";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

// ─── Sub-Components ────────────────────────────────────────────────────────

const SectionTitle = ({ icon: Icon, title, colorClass }: { icon: any; title: string; colorClass: string }) => (
    <div className="flex items-center gap-3">
        <div className={cn("h-9 w-9 rounded-2xl flex items-center justify-center transition-transform hover:scale-110", colorClass)}>
            <Icon size={18} />
        </div>
        <h3 className="text-lg font-black text-black">{title}</h3>
    </div>
);

const ExperienceItem = ({ title, role, date, description }: any) => (
    <div className="flex gap-5 group cursor-default">
        <div className="shrink-0 h-14 w-14  rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary/40 group-hover:bg-secondary/10 group-hover:text-secondary transition-all border border-border group-hover:border-secondary/20">
            <Briefcase size={24} />
        </div>
        <div>
            <h4 className="text-lg font-black text-black group-hover:text-secondary transition-colors uppercase tracking-tight">{title}</h4>
            <p className="text-sm font-black text-primary/50 mb-2">{role} {date && <span className="mx-2 text-primary/20">•</span>} {date}</p>
            <p className="text-[0.85rem] text-primary/40 font-bold leading-relaxed max-w-2xl">
                {description || "No project description provided."}
            </p>
        </div>
    </div>
);

const StudentProfileSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* 1. Hero Header Skeleton */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="h-32 md:h-48 bg-gray-100" />
            <div className="px-6 md:px-8 py-6 relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-gray-200 border-[6px] border-white shrink-0 -mt-16 md:-mt-20 relative z-20 shadow-sm" />
                    <div className="flex-1 space-y-4 w-full mt-4 md:mt-0">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <div className="h-8 w-48 bg-gray-200 rounded-xl" />
                            <div className="h-5 w-24 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="h-4 w-32 bg-gray-100 rounded-md" />
                            <div className="h-4 w-32 bg-gray-100 rounded-md" />
                            <div className="h-4 w-12 bg-gray-100 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-7 space-y-6">
                <div className="h-40 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                    <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 rounded" />
                        <div className="h-4 w-5/6 bg-gray-100 rounded" />
                    </div>
                </div>
                <div className="h-64 bg-white rounded-2xl border border-gray-100 p-6" />
                <div className="h-48 bg-white rounded-2xl border border-gray-100 p-6" />
            </div>
            <div className="lg:col-span-3 space-y-6">
                <div className="h-32 bg-white rounded-2xl border border-gray-100 p-6" />
                <div className="h-48 bg-white rounded-2xl border border-gray-100 p-6" />
                <div className="h-40 bg-white rounded-2xl border border-gray-100 p-6" />
            </div>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

export default function StudentProfileMain({ id }: { id: string }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { singleStudent: student, loading, error } = useAppSelector((state) => state.student);
    const { following, followers, sentRequests, loading: followLoading } = useAppSelector(state => state.follow);
    const { user: authUser } = useAppSelector(state => state.auth);

    const [isHoveringFollow, setIsHoveringFollow] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getStudentById(id));
            dispatch(getFollowers());
            dispatch(getFollowing());
            dispatch(getSentRequests());
        }
    }, [dispatch, id]);

    const isFollowingObj = following.find((f: any) => (f.following?._id || f.following) === id);
    const isFollowing = !!isFollowingObj;
    const isRequestedObj = sentRequests.find((r: any) => (r.following?._id || r.following) === id);
    const isRequested = !!isRequestedObj;
    const isFollowerObj = followers.find((f: any) => (f.follower?._id || f.follower) === id);
    const isFollower = !!isFollowerObj;

    const isMutual = isFollowing && isFollower;

    const handleFollowAction = async () => {
        if (!id) return;
        try {
            if (isFollowing) {
                await dispatch(unfollow(id)).unwrap();
                toast.success("Unfollowed successfully");
            } else if (!isRequested) {
                await dispatch(sendFollowRequest(id)).unwrap();
                toast.success("Follow request sent");
            }
        } catch (error: any) {
            toast.error(error || "Action failed");
        }
    };

    const handleMessageAction = async () => {
        if (!id) return;
        try {
            const result = await dispatch(accessChat({ userId: id })).unwrap();
            if (result.data?._id) {
                dispatch(setSelectedChatId(result.data._id));
                router.push("/chat");
            }
        } catch (error: any) {
            toast.error(error?.message || "Failed to start conversation");
        }
    };

    if (loading) return <StudentProfileSkeleton />;

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-accent/5 p-6 rounded-3xl border border-accent/10 mb-6">
                    <ShieldCheck className="w-16 h-16 text-accent mb-4 mx-auto" />
                    <h3 className="text-2xl font-black text-primary mb-2">Profile Not Found</h3>
                    <p className="text-primary/70 font-bold max-w-md">{error || "We couldn't find the student you're looking for."}</p>
                </div>
                <Button
                    onClick={() => router.push('/students')}
                    className="bg-secondary hover:bg-secondary/90 text-white font-black rounded-2xl px-8"
                >
                    Back to Directory
                </Button>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero Header */}
            <div className=" rounded-2xl overflow-hidden border border-border shadow-xl shadow-secondary/10">
                {/* Cover Photo */}
                <div className="h-24 md:h-36 relative overflow-hidden bg-background border-b border-border">
                    {student.coverImage ? (
                        <img
                            src={`${student.coverImage}`}
                            className="w-full h-full object-cover"
                            alt="Cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary/20" />
                    )}
                </div>

                {/* Profile Info Section (Avatar on left, Info on right) */}
                <div className="px-6 md:px-8 py-6 relative bg-white ">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-20">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-[6px] border-background overflow-hidden bg-primary/5 ring-2 ring-primary/50 flex items-center justify-center font-black text-4xl md:text-5xl text-primary">
                                {student.avatar ? (
                                    <img
                                        src={`${student.avatar}`}
                                        className="w-full h-full object-cover"
                                        alt="Profile"
                                    />
                                ) : (
                                    student.firstName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="absolute bottom-2 right-2 h-6 w-6 bg-primary border-4 border-background rounded-full"></div>
                        </div>

                        {/* Text Info + Action Buttons (Right Side) */}
                        <div className="flex-1  flex flex-col lg:flex-row items-center md:items-start lg:items-center justify-between gap-6 w-full">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h2 className="text-2xl md:text-3xl font-black text-black leading-tight">
                                        {student.firstName} {student.lastName}
                                    </h2>
                                    <span className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider">
                                        Verified Student
                                    </span>
                                </div>
                                <div className="flex flex-col justify-start md:justify-start  gap-4 text-black/50 font-bold text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {student.universityId?.name || "University"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-primary" />
                                        {student.courseIds?.[0]?.courseName || "Course"}
                                    </div>
                                    <div className="flex items-center text-black/50 gap-2 shrink-0">
                                        <SchoolIcon className="w-4 h-4 text-primary" />
                                        {student.studentProfile?.semesterId?.name || ""}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {authUser?._id !== id && (
                                    <>
                                        {isMutual ? (
                                            <Button
                                                variant="outline"
                                                onClick={handleMessageAction}
                                                className="h-11 px-6 rounded-2xl border-2 border-primary/20 font-black text-sm text-primary hover:bg-primary/5 flex gap-2 transition-all"
                                            >
                                                <Send className="w-4 h-4" />
                                                Message
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleFollowAction}
                                                onMouseEnter={() => setIsHoveringFollow(true)}
                                                onMouseLeave={() => setIsHoveringFollow(false)}
                                                disabled={(isRequested && !isFollowing) || followLoading}
                                                className={cn(
                                                    "h-11 px-6 md:px-8 rounded-2xl font-black text-sm flex gap-2 transition-all",
                                                    isFollowing
                                                        ? (isHoveringFollow ? "bg-rose-500 text-white" : "bg-primary text-white")
                                                        : isRequested
                                                            ? "bg-background text-primary/20 cursor-not-allowed border border-border"
                                                            : "bg-white text-primary hover:bg-primary/10 border border-primary/20 shadow-sm"
                                                )}
                                            >
                                                {isFollowing ? (
                                                    isHoveringFollow ? "Unfollow" : <><CheckCircle className="w-4 h-4" /> Connected</>
                                                ) : isRequested ? (
                                                    "Requested"
                                                ) : (
                                                    <><UserPlus className="w-4 h-4" /> Follow</>
                                                )}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* About Section */}
                    <Card className=" p-5 rounded-2xl border bg-white border-border shadow-sm relative overflow-hidden group">
                        <SectionTitle icon={Users} title="About Student" colorClass="bg-primary/20 text-primary" />
                        <p className="text-primary/70 font-medium leading-[1.8] text-[15px]">
                            {student.bio || `${student.firstName} is a dedicated student at ${student.universityId?.name}. They are currently pursuing ${student.courseIds?.[0]?.courseName} and are an active member of the student community.`}
                        </p>
                    </Card>

                    {/* Academic Status Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className=" overflow-hidden rounded-2xl border-border shadow-sm group hover:shadow-md transition-all duration-300 bg-white">
                            <CardContent className="p-5 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                                            <Target size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-black">Academic Status</h3>
                                            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Course Details</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="text-foreground animate-pulse" size={18} />
                                        <span className="text-[10px] font-black bg-primary/20 text-foreground px-2 py-1 rounded-lg uppercase">Active</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-accent/20 hover:bg-accent/5 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl  flex items-center justify-center text-primary/20 group-hover/item:text-accent shadow-sm transition-colors">
                                                <Briefcase size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Enrolled Course</p>
                                        </div>
                                        <p className="text-lg font-black px-10 text-primary leading-tight group-hover/item:text-accent  transition-colors">
                                            {student.courseIds?.[0]?.courseName || "Not assigned"}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-secondary/20 hover:bg-secondary/5 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl  flex items-center justify-center text-primary/20 group-hover/item:text-secondary shadow-sm transition-colors">
                                                <Clock size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Current Semester</p>
                                        </div>
                                        <p className="text-lg px-10 font-black text-primary leading-tight group-hover/item:text-secondary transition-colors">
                                            {student.studentProfile?.semesterId?.name || "Not set"}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-amber-100 hover:bg-amber-50/30 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl  flex items-center justify-center text-primary/20 group-hover/item:text-amber-500 shadow-sm transition-colors">
                                                <Calendar size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Start Year</p>
                                        </div>
                                        <p className="text-lg px-10 font-black text-primary leading-tight group-hover/item:text-amber-700 transition-colors">
                                            {student.startYear || "N/A"}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-secondary/20 hover:bg-secondary/5 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl  flex items-center justify-center text-primary/20 group-hover/item:text-secondary shadow-sm transition-colors">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">End Year</p>
                                        </div>
                                        <p className="text-lg px-10 font-black text-primary leading-tight group-hover/item:text-secondary transition-colors">
                                            {student.endYear || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>


                    {/* Projects Section */}
                    <Card className=" p-6 rounded-2xl border border-border shadow-sm  bg-white">
                        <SectionTitle icon={Briefcase} title="Experience & Projects" colorClass="text-secondary" />
                        <div className="space-y-6">
                            {student.studentProfile?.projects?.length ? (
                                student.studentProfile.projects.map((project: any, i) => (
                                    <React.Fragment key={i}>
                                        <ExperienceItem
                                            title={typeof project === 'string' ? project : project.title}
                                            role="Personal Project"
                                            description={typeof project === 'string' ? "" : project.description}
                                        />
                                        {i < (student.studentProfile?.projects?.length || 0) - 1 && <div className="h-px bg-border/50 w-full" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
                                    <Briefcase className="w-10 h-10 mb-4" />
                                    <p className="font-bold text-sm">No projects added yet.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Network Stats */}
                    <Card className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="font-black text-primary text-base mb-6">Network Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center animate-in fade-in zoom-in duration-500">
                                <p className="text-2xl font-black text-primary mb-1">{student.followersCount || 0}</p>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Followers</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center animate-in fade-in zoom-in duration-700">
                                <p className="text-2xl font-black text-primary mb-1">{student.followingCount || 0}</p>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Following</p>
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-primary/70 text-white flex items-center justify-between shadow-lg shadow-blue-200">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <ShieldCheck size={18} /> Trust Score
                                </div>
                                <span className="font-black text-lg">88/100</span>
                            </div>
                        </div>
                    </Card>

                    {/* Skills & Experience */}
                    <div className="grid grid-cols-1  gap-6">
                        <Card className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                            <SectionTitle icon={Code} title="Technical Skills" colorClass="bg-primary/20 text-primary" />
                            <div className="flex flex-wrap gap-2">
                                {student.studentProfile?.skills?.length ? (
                                    student.studentProfile.skills.map((skill, i) => (
                                        <span key={i} className="px-4 py-2 bg-background  text-primary/70 text-xs font-black rounded-xl border border-border">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-primary/40 italic">No skills listed yet.</p>
                                )}
                            </div>
                        </Card>

                        <Card className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                            <SectionTitle icon={Activity} title="Interests" colorClass="bg-primary/10 text-primary" />
                            <div className="flex flex-wrap gap-2">
                                {student.studentProfile?.hobby_badge ? (
                                    <span className="px-4 py-2 bg-primary/20 text-primary text-xs font-black rounded-xl border border-rose-100 uppercase tracking-widest">
                                        {student.studentProfile.hobby_badge}
                                    </span>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No interests listed yet.</p>
                                )}
                            </div>
                        </Card>
                    </div>




                    {/* Quick Connect */}
                    <Card className="bg-primary/20 p-6 rounded-3xl shadow-xl shadow-primary/10 text-black relative overflow-hidden border border-primary/20">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <h3 className="font-black text-lg mb-2 relative z-10">Nexus Network</h3>
                        <p className="text-black text-[11px] font-bold leading-relaxed mb-6 relative z-10">
                            Connect with {student.firstName} to share notes, collaborate on projects, and grow your network.
                        </p>
                        <Button
                            variant="primary"
                            onClick={handleFollowAction}
                            onMouseEnter={() => setIsHoveringFollow(true)}
                            onMouseLeave={() => setIsHoveringFollow(false)}
                            disabled={(isRequested && !isFollowing) || followLoading}
                            className={cn(
                                "w-full font-black rounded-xl h-11 transition-all",
                                isFollowing
                                    ? (isHoveringFollow ? "bg-rose-500 text-white" : "bg-primary text-white")
                                    : "bg-white text-primary hover:bg-primary/10"
                            )}
                        >
                            {isFollowing ? (
                                isHoveringFollow ? "Unfollow" : "Connected"
                            ) : isRequested ? (
                                "Request Sent"
                            ) : (
                                "Request Connection"
                            )}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
