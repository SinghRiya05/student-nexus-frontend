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
    Send,
    Building2,
    Award
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { fetchAlumniById } from "@/features/alumni/alumniThunk";
import { sendFollowRequest, unfollow } from "@/features/follow/followThunk";
import { cn } from "@/lib/utils";

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

// ─── Main Component ───────────────────────────────────────────────────────

export default function AlumniProfileMain({ id }: { id: string }) {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { singleAlumni: alumni, loading, error } = useAppSelector((state) => state.alumni);
    const { following, sentRequests, loading: followLoading } = useAppSelector(state => state.follow);
    const { user: authUser } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(fetchAlumniById(id));
        }
    }, [dispatch, id]);

    const isFollowingObj = following.find((f: any) => f.following?._id === id || f.following === id);
    const isFollowing = !!isFollowingObj;
    const isRequestedObj = sentRequests.find((r: any) => r.following?._id === id || r.following === id);
    const isRequested = !!isRequestedObj;

    const handleFollowAction = () => {
        if (!id) return;
        if (isFollowing) {
            dispatch(unfollow(isFollowingObj._id));
        } else if (!isRequested) {
            dispatch(sendFollowRequest(id));
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-black text-blue-600 animate-pulse uppercase tracking-widest text-xs">Loading Alumni Profile...</p>
            </div>
        );
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
                <div className="h-32 md:h-48 relative overflow-hidden bg-slate-50 border-b border-gray-100">
                    {alumni.coverImage ? <img src={alumni.coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-blue-700" />}

                </div>

                {/* Profile Info Section (Avatar on left, Info on right) */}
                <div className="px-6 md:px-8 py-6 relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-20">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] border-[6px] border-white overflow-hidden bg-blue-50 ring-2 ring-blue-100 flex items-center justify-center font-black text-4xl md:text-5xl text-blue-500">
                                {alumni.firstName.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute bottom-2 right-2 h-6 w-6 bg-blue-500 border-4 border-white rounded-full"></div>
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
                                        <Briefcase className="w-4 h-4 text-blue-500" />
                                        {profile?.jobTitle || "Professional"} at {profile?.currentCompany || "Company"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        {alumni.universityId?.name || "University"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                                        {alumni.courseIds?.[0]?.courseName || "Course"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {authUser?._id !== id && (
                                    <>
                                        <Button
                                            onClick={handleFollowAction}
                                            disabled={isRequested || followLoading}
                                            className={cn(
                                                "h-11 px-6 md:px-8 rounded-2xl font-black text-sm flex gap-2 transition-all",
                                                isFollowing ? "bg-rose-50 text-rose-600 hover:bg-rose-100 "
                                                    : isRequested ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-700 text-white "
                                            )}
                                        >
                                            {isFollowing ? "Unfollow" : isRequested ? "Requested" : <><UserPlus className="w-4 h-4" /> Follow</>}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-11 px-5 rounded-2xl border-2 border-gray-100 font-black text-sm text-[#1a1a3b] hover:bg-gray-50 flex gap-2"
                                        >
                                            <Send className="w-4 h-4 text-blue-600" />
                                            Message
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
                        <Card className="bg-white overflow-hidden rounded-2xl border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Award size={120} />
                            </div>
                            <CardContent className="p-5 relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                                            <Target size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-[#1a1a3b]">Professional Status</h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employment Details</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="text-emerald-400 animate-pulse" size={18} />
                                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg uppercase">Working</span>
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
                                        <p className="text-lg font-black px-10 text-[#1a1a3b] leading-tight group-hover/item:text-blue-700  transition-colors">
                                            {profile?.jobTitle || "Not specified"}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group/item">
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
                        <SectionTitle icon={Award} title="Professional Achievements" colorClass="bg-blue-50 text-blue-600" />
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
                                <p className="text-2xl font-black text-blue-600 mb-1">{alumni.followersCount || 0}</p>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Followers</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center animate-in fade-in zoom-in duration-700">
                                <p className="text-2xl font-black text-emerald-600 mb-1">{alumni.followingCount || 0}</p>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Following</p>
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-blue-600 text-white flex items-center justify-between shadow-lg shadow-blue-200">
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
                    <Card className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-100 text-white relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                        <h3 className="font-black text-lg mb-2 relative z-10">Nexus Network</h3>
                        <p className="text-blue-100 text-[11px] font-bold leading-relaxed mb-6 relative z-10">
                            Connect with {alumni.firstName} for mentorship, industry insights, and professional networking.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={handleFollowAction}
                            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl h-11"
                        >
                            {isFollowing ? "Connected" : isRequested ? "Request Sent" : "Request Connection"}
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
