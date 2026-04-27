"use client";

import React, { useEffect } from "react";
import { ASSET_URL } from "@/services/apiEndpoints";
import {
    MapPin,
    Users,
    Briefcase,
    GraduationCap,
    UserPlus,
    Code,
    ShieldCheck,
    Activity,
    Target,
    Sparkles,
    Calendar,
    Clock,
    Mail,
    Building2,
    Award,
    CheckCircle,
    AlertCircle,
    Loader2,
    Send
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { fetchAlumniById } from "@/features/alumni/alumniThunk";
import { getFollowers, getFollowing, getSentRequests, sendFollowRequest, unfollow } from "@/features/follow/followThunk";
import { accessChat } from "@/features/chat/chatThunk";
import { setSelectedChatId } from "@/features/chat/chatSlice";
import { emitFollowUser, emitUnfollowUser } from "@/services/socket";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── Sub-Components ────────────────────────────────────────────────────────

const SectionTitle = ({ icon: Icon, title, colorClass }: { icon: any; title: string; colorClass: string }) => (
    <div className="flex items-center gap-3">
        <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center transition-transform hover:scale-110", colorClass)}>
            <Icon size={20} />
        </div>
        <h3 className="text-xl font-black text-[#1a1a3b]">{title}</h3>
    </div>
);

const ExperienceItem = ({ title, role, date, description }: any) => (
    <div className="flex gap-5 group cursor-default">
        <div className="shrink-0 h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-gray-100 group-hover:border-blue-100">
            <Briefcase size={24} />
        </div>
        <div>
            <h4 className="text-lg font-black text-[#1a1a3b] group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h4>
            <p className="text-sm font-black text-gray-500 mb-2">{role} {date && <span className="mx-2 text-gray-300">•</span>} {date}</p>
            <p className="text-[0.85rem] text-gray-400 font-bold leading-relaxed max-w-2xl">
                {description || "No project description provided."}
            </p>
        </div>
    </div>
);

const AlumniProfileSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Hero Skeleton */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
            <div className="h-24 md:h-36 bg-gray-100/50" />
            <div className="px-6 md:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-gray-100/80 -mt-12 md:-mt-20 border-[6px] border-white shadow-lg shrink-0" />
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <div className="h-8 w-48 md:w-64 bg-gray-100 rounded-xl" />
                            <div className="h-5 w-24 bg-emerald-50 rounded-lg" />
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="h-4 w-32 bg-gray-100/60 rounded-lg" />
                            <div className="h-4 w-40 bg-gray-100/60 rounded-lg" />
                            <div className="h-4 w-28 bg-gray-100/60 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-7 space-y-6">
                <Card className="h-40 bg-white border-gray-100 rounded-2xl" />
                <Card className="h-64 bg-white border-gray-100 rounded-2xl" />
                <Card className="h-64 bg-white border-gray-100 rounded-2xl" />
            </div>
            <div className="lg:col-span-3 space-y-6">
                <Card className="h-48 bg-white border-gray-100 rounded-2xl" />
                <Card className="h-56 bg-white border-gray-100 rounded-2xl" />
                <Card className="h-48 bg-primary/5 border-primary/10 rounded-[2rem]" />
            </div>
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

export default function AlumniProfileMain({ id }: { id: string }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { singleAlumni: alumni, loading, error } = useAppSelector((state) => state.alumni);
    const { following, followers, sentRequests, loading: followLoading } = useAppSelector(state => state.follow);
    const { user: authUser } = useAppSelector(state => state.auth);

    const [isHoveringFollow, setIsHoveringFollow] = useState(false);
    const [isUnfollowDialogOpen, setIsUnfollowDialogOpen] = useState(false);
    const [isUnfollowing, setIsUnfollowing] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchAlumniById(id));
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
        const userId = String(id);
        console.log("AlumniProfile: handleFollowAction called. id:", userId);
        if (!userId) return;
        if (isFollowing) {
            setIsUnfollowDialogOpen(true);
        } else if (!isRequested) {
            console.log("AlumniProfile: Calling emitFollowUser");
            emitFollowUser(userId);
        }
    };

    const handleUnfollow = async () => {
        setIsUnfollowing(true);
        try {
            emitUnfollowUser(id);
            setIsUnfollowDialogOpen(false);
        } catch (error) {
            console.error("Failed to unfollow:", error);
        } finally {
            setIsUnfollowing(false);
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

    if (loading) {
        return <AlumniProfileSkeleton />;
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 mb-6">
                    <ShieldCheck className="w-16 h-16 text-rose-500 mb-4 mx-auto" />
                    <h3 className="text-2xl font-black text-rose-900 mb-2">Alumni Not Found</h3>
                    <p className="text-rose-600 font-bold max-w-md">{error || "We couldn't find the alumni you're looking for."}</p>
                </div>
                <Button
                    onClick={() => router.push('/alumni')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-8"
                >
                    Back to Network
                </Button>
            </div>
        );
    }

    if (!alumni) return null;

    const profile = alumni.aluminiProfile;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero Header */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
                {/* Cover Photo */}
                <div className="h-24 md:h-36 relative overflow-hidden bg-slate-50 border-b border-gray-100">
                    {alumni.coverImage ? <img src={alumni.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-primary/20" />}

                </div>

                {/* Profile Info Section (Avatar on left, Info on right) */}
                <div className="px-6 md:px-8 py-6 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-20">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-[6px] border-white overflow-hidden bg-primary/5 ring-2 ring-primary/50 flex items-center justify-center font-black text-4xl md:text-5xl text-primary">
                                {alumni?.avatar ? (
                                    <img src={alumni?.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="uppercase">{alumni.firstName.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>

                        {/* Text Info + Action Buttons (Right Side) */}
                        <div className="flex-1 flex flex-col lg:flex-row items-center md:items-start lg:items-center justify-between gap-6 w-full">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h2 className="text-2xl md:text-3xl font-black text-[#1a1a3b] leading-tight">
                                        {alumni.firstName} {alumni.lastName}
                                    </h2>
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-xl uppercase tracking-wider">
                                        Verified Alumni
                                    </span>
                                </div>
                                <div className="flex flex-wrap justify-start md:justify-start items-center gap-4 text-gray-500 font-bold text-sm">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        {profile?.jobTitle || "Professional"} at {profile?.currentCompany || "Company"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        {alumni.universityId?.name || "University"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-primary" />
                                        {alumni.courseIds?.[0]?.courseName || "Course"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {authUser?._id !== id && (
                                    <>
                                        {isFollowing && (
                                            <Button
                                                variant="outline"
                                                className="h-11 px-5 rounded-2xl border-2 border-border font-black text-sm text-primary hover:bg-gray-50 flex gap-2"
                                                onClick={handleMessageAction}
                                            >
                                                <Send className="w-4 h-4 text-primary" />
                                                Message
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleFollowAction}
                                            disabled={followLoading || isUnfollowing}
                                            className={cn(
                                                "h-11 px-6 md:px-8 rounded-2xl font-black text-sm flex gap-2 transition-all shadow-sm",
                                                isFollowing
                                                    ? "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white"
                                                    : isRequested
                                                        ? "bg-background text-primary/20 cursor-not-allowed border border-border"
                                                        : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                                            )}
                                        >
                                            {isFollowing ? (
                                                <><AlertCircle className="w-4 h-4" /> Unfollow</>
                                            ) : isRequested ? (
                                                "Requested"
                                            ) : (
                                                <><UserPlus className="w-4 h-4" /> Follow</>
                                            )}
                                        </Button>
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
                    <Card className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <SectionTitle icon={Users} title="Professional Bio" colorClass="bg-blue-50 text-blue-600" />
                        <p className="text-gray-500 font-medium leading-[1.8] text-[15px] mt-4">
                            {alumni.firstName} is a highly accomplished professional graduated from {alumni.universityId?.name}.
                            Currently working as a {profile?.jobTitle} at {profile?.currentCompany}, bringing {profile?.experienceYears} years of industry experience.
                        </p>
                    </Card>

                    {/* Professional Status Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="bg-white overflow-hidden rounded-2xl border-primary shadow-sm group hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Award size={120} />
                            </div>
                            <CardContent className="p-5 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                                            <Target size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[#1a1a3b]">Professional Status</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employment Details</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="text-foreground animate-pulse" size={18} />
                                        <span className="text-[10px] font-black bg-primary/20 text-foreground px-2 py-1 rounded-lg uppercase">Working</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/item:text-blue-500 shadow-sm transition-colors">
                                                <Briefcase size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Title</p>
                                        </div>
                                        <p className="text-lg font-black px-10 text-[#1a1a3b] leading-tight group-hover/item:text-primary  transition-colors">
                                            {profile?.jobTitle || "Not specified"}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-indigo-100 hover:bg-cyan-50/30 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/item:text-indigo-500 shadow-sm transition-colors">
                                                <Building2 size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Company</p>
                                        </div>
                                        <p className="text-lg px-10 font-black text-[#1a1a3b] leading-tight group-hover/item:text-indigo-700 transition-colors">
                                            {profile?.currentCompany || "Corporate"}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-amber-100 hover:bg-amber-50/30 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/item:text-amber-500 shadow-sm transition-colors">
                                                <Calendar size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exp Years</p>
                                        </div>
                                        <p className="text-lg px-10 font-black text-[#1a1a3b] leading-tight group-hover/item:text-amber-700 transition-colors">
                                            {profile?.experienceYears || "0"} Years
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group/item">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/item:text-emerald-500 shadow-sm transition-colors">
                                                <Award size={16} />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campus alumni</p>
                                        </div>
                                        <p className="text-lg px-10 font-black text-[#1a1a3b] leading-tight group-hover/item:text-emerald-700 transition-colors">
                                            Verified
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>


                    {/* Projects & Achievements Section */}
                    <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <SectionTitle icon={Award} title="Professional Achievements" colorClass="bg-primary/20 text-primary" />
                        <div className="space-y-6 mt-6">
                            {profile?.projects?.length ? (
                                profile.projects.map((project: any, i) => (
                                    <React.Fragment key={i}>
                                        <ExperienceItem
                                            title={typeof project === 'string' ? project : project.title}
                                            role="Industry Project"
                                            description={typeof project === 'string' ? "" : project.description}
                                        />
                                        {i < (profile?.projects?.length || 0) - 1 && <div className="h-px bg-gray-100 w-full" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
                                    <Activity className="w-10 h-10 mb-4" />
                                    <p className="font-bold text-sm">Experience details being updated.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Social Stats */}
                    <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-black text-[#1a1a3b] text-base mb-6">Network Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-center animate-in fade-in zoom-in duration-500">
                                <p className="text-2xl font-black text-primary mb-1">{alumni.followersCount || 0}</p>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Followers</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center animate-in fade-in zoom-in duration-700">
                                <p className="text-2xl font-black text-primary mb-1">{alumni.followingCount || 0}</p>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Following</p>
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-primary/70 text-white flex items-center justify-between shadow-lg shadow-blue-200">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <ShieldCheck size={18} /> Mentor Score
                                </div>
                                <span className="font-black text-lg">95/100</span>
                            </div>
                        </div>
                    </Card>

                    {/* Skills */}
                    <Card className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <SectionTitle icon={Code} title="Skillset" colorClass="bg-emerald-50 text-emerald-600" />
                        <div className="flex flex-wrap gap-2 mt-6">
                            {profile?.skills?.length ? (
                                profile.skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-gray-50 text-gray-700 text-xs font-black rounded-xl border border-gray-100">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">Industry skills listed here.</p>
                            )}
                        </div>
                    </Card>

                    {/* Quick Connect */}
                    <Card className="bg-primary/20 p-6 rounded-3xl shadow-xl shadow-primary-50 text-black relative overflow-hidden border border-primary/20">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <h3 className="font-black text-lg mb-2 relative z-10">Nexus Network</h3>
                        <p className="text-black text-[11px] font-bold leading-relaxed mb-6 relative z-10">
                            Connect with {alumni.firstName} for mentorship, industry insights, and professional networking.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleFollowAction}
                            onMouseEnter={() => setIsHoveringFollow(true)}
                            onMouseLeave={() => setIsHoveringFollow(false)}
                            disabled={(isRequested && !isFollowing) || followLoading}
                            className={cn(
                                "w-full font-black rounded-xl h-11 transition-all",
                                isFollowing
                                    ? (isHoveringFollow ? "bg-rose-500 text-white" : "bg-primary text-white")
                                    : "bg-white text-primary hover:bg-primary/80 hover:text-white"
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
            {/* Unfollow Confirmation Dialog */}
            <Dialog open={isUnfollowDialogOpen} onOpenChange={setIsUnfollowDialogOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl p-8 border-none shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-center text-slate-900">
                            Unfollow {alumni.firstName}?
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500 font-bold leading-relaxed">
                            Are you sure you want to disconnect? You'll stop seeing their updates in your feed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsUnfollowDialogOpen(false)}
                            className="flex-1 rounded-2xl h-12 font-black border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUnfollow}
                            disabled={isUnfollowing}
                            variant="destructive"
                            className="flex-1 rounded-2xl h-12 font-black bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                        >
                            {isUnfollowing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Unfollow"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
