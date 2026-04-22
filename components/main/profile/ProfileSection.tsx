"use client";

import React, { useEffect, useState } from "react";
import { ASSET_URL } from "@/services/apiEndpoints";
import Image from "next/image";
import {
    Camera,
    MapPin,
    Users,
    Briefcase,
    GraduationCap,
    Plus,
    Edit3,
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
    Upload,
    Trash2,
    ExternalLink,
    FileText,
    Lock,
    Unlock,
    Edit2,
    Building
} from "lucide-react";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getMyProfile } from "@/features/student/studentThunk";
import { getMe, getUserById } from "@/features/users/userThunk";
import UploadResourceModal from "./UploadResourceModal";
import NetworkPopup from "./NetworkPopup";
import { deleteResource, getAllResourcesByTeacherId } from "@/features/teacher/resources/resourceThunk";
import { IResource } from "@/features/teacher/resources/resourceModel";
import { getFollowers, getFollowing, getSentRequests, sendFollowRequest, unfollow } from "@/features/follow/followThunk";

// ─── Sections ─────────────────────────────────────────────────────────────

const AboutMe = ({ bio }: { bio?: string }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
                <Users size={20} />
            </div>
            <h3 className="text-xl font-black text-[#1a1a3b]">About Me</h3>
        </div>
        <p className="text-gray-500 font-medium leading-[1.8] text-[15px]">
            {bio || "Tell us about yourself, your goals, and interests. Click 'Edit Profile' to share your story with the community."}
        </p>
    </div>
);


function ExperienceItem({ icon: Icon, title, role, date, description }: any) {
    return (
        <div className="flex gap-5 group cursor-default">
            <div className="shrink-0 h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-gray-100 group-hover:border-blue-100">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-lg font-black text-[#1a1a3b] group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h4>
                <p className="text-sm font-black text-gray-500 mb-2">{role} <span className="mx-2 text-gray-300">•</span> {date}</p>
                <p className="text-[0.85rem] text-gray-400 font-bold leading-relaxed max-w-2xl">
                    {description || `A brief overview of your role and achievements at ${title}. Complete your profile to share your journey.`}
                </p>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────

const ProfileSkeleton = () => (
    <div className="space-y-8 animate-pulse duration-1000">
        {/* Cover & Top Bar */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="h-32 bg-indigo-50 w-full" />
            <div className="px-10 py-8 flex md:flex-row items-center md:items-start gap-5">
                <div className="relative group shrink-0">
                    <div className="h-32 w-32 rounded-[2rem] border-4 border-white bg-indigo-50 shadow-sm" />
                </div>
                <div className="flex flex-col lg:flex-row items-start md:items-center justify-between gap-5 w-full">
                    <div className="space-y-3 w-full max-w-sm">
                        <div className="h-7 w-3/4 bg-gray-200 rounded-lg" />
                        <div className="flex gap-4">
                            <div className="h-4 w-20 bg-gray-100 rounded-full" />
                            <div className="h-4 w-32 bg-gray-100 rounded-full" />
                        </div>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <div className="h-10 w-32 bg-gray-100 rounded-2xl" />
                        <div className="h-10 w-32 bg-gray-200 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            <div className="lg:col-span-7 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 flex flex-col justify-between">
                    <div className="h-6 w-48 bg-gray-200 rounded-lg" />
                    <div className="space-y-3">
                        <div className="h-12 w-full bg-gray-50 rounded-xl" />
                        <div className="h-12 w-full bg-gray-50 rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="h-5 w-32 bg-gray-200 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-gray-50 rounded-2xl" />
                        <div className="h-24 bg-gray-50 rounded-2xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-64">
                    <div className="h-5 w-32 bg-gray-200 rounded-lg mb-6" />
                    <div className="space-y-4">
                        <div className="flex gap-4"><div className="h-4 w-4 bg-gray-200 rounded-full shrink-0" /><div className="h-4 w-full bg-gray-100 rounded" /></div>
                        <div className="flex gap-4"><div className="h-4 w-4 bg-gray-200 rounded-full shrink-0" /><div className="h-4 w-full bg-gray-100 rounded" /></div>
                        <div className="flex gap-4"><div className="h-4 w-4 bg-gray-200 rounded-full shrink-0" /><div className="h-4 w-3/4 bg-gray-100 rounded" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function ProfileSection() {

    const dispatch = useAppDispatch()

    const { singleUser: user, userLoading: userLoading } = useAppSelector((state) => state.user);
    const { user: authUser } = useAppSelector((state) => state.auth);
    const { resources, loading: resourceLoading } = useAppSelector((state) => state.resource);
    const { followers, following, sentRequests } = useAppSelector((state) => state.follow);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedResourceForEdit, setSelectedResourceForEdit] = useState<IResource | null>(null);
    const [activePopup, setActivePopup] = useState<'Followers' | 'Following' | null>(null);

    useEffect(() => {
        if (authUser?._id) {
            dispatch(getUserById(authUser._id));
        }
    }, [dispatch, authUser?._id])


    useEffect(() => {
        if (user?._id && user?.roleId?.name === "TEACHER") {
            dispatch(getAllResourcesByTeacherId(user._id));
        }
    }, [dispatch, user?._id, user?.roleId?.name]);

    useEffect(() => {
        dispatch(getFollowers());
        dispatch(getFollowing());
        dispatch(getSentRequests());
    }, [dispatch]);

    const handleEditResource = (resource: IResource) => {
        setSelectedResourceForEdit(resource);
        setIsUploadModalOpen(true);
    };

    const handleDeleteResource = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            try {
                await dispatch(deleteResource(id)).unwrap();
                toast.success("Resource deleted successfully");
            } catch (error: any) {
                toast.error(String(error || "Failed to delete resource"));
            }
        }
    };

    const router = useRouter();

    const classmates = [
        { name: "John", img: "https://i.pravatar.cc/150?u=1" },
        { name: "Sara", img: "https://i.pravatar.cc/150?u=2" },
        { name: "Mike", img: "https://i.pravatar.cc/150?u=3" },
    ];

    const activities = [
        { text: "Shared a new project 'Nexus UI Framework' to the Dev Society.", date: "2 hours ago", color: "bg-blue-500" },
        { text: "Earned 'Top Contributor' badge in Hackathon Prep group.", date: "Yesterday", color: "bg-emerald-500" },
        { text: "Followed 3 new professors in the Computer Science department.", date: "3 days ago", color: "bg-indigo-500" }
    ];

    const handleNetworkAction = async (id: string, isCurrentlyFollowing: boolean) => {
        try {
            if (isCurrentlyFollowing) {
                // If following, trigger unfollow
                await dispatch(unfollow(id)).unwrap();
                toast.success("Unfollowed successfully");
            } else {
                // If not following, trigger follow request
                await dispatch(sendFollowRequest(id)).unwrap();
                toast.success("Follow request sent");
            }
        } catch (error: any) {
            toast.error(String(error || "Action failed"));
        }
    };

    const mappedFollowers = followers.map((f: any) => {
        const u = f.follower;
        if (!u || typeof u === 'string') return null;

        const isFollowing = following.some((fwing: any) =>
            fwing.status === 'ACCEPTED' &&
            (fwing.following?._id === u._id || fwing.following === u._id)
        );

        const isRequested = sentRequests.some((req: any) =>
            req.status === 'PENDING' &&
            (req.following?._id === u._id || req.following === u._id)
        );

        return {
            id: u._id,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
            role: "Member",
            avatar: u.avatar ? `${ASSET_URL}${u.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName || 'user'}`,
            isFollowing,
            isRequested
        }
    }).filter(Boolean);

    const mappedFollowing = following
        .filter((f: any) => f.status === 'ACCEPTED') // Filter only accepted following
        .map((f: any) => {
            const u = f.following;
            if (!u || typeof u === 'string') return null;
            return {
                id: u._id,
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
                role: "Member",
                avatar: u.avatar ? `${ASSET_URL}${u.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.firstName || 'user'}`,
                isFollowing: true
            }
        }).filter(Boolean);

    if (userLoading || !user) return <ProfileSkeleton />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero Header */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
                {/* Cover Photo */}
                <div className="h-32 relative overflow-hidden group bg-indigo-50/50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 mix-blend-multiply " />
                    {user?.coverImage ? (
                        <img
                            src={`${ASSET_URL}${user.coverImage}`}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            alt="Cover"
                        />
                    ) : (
                        <Camera className="w-8 h-8 text-indigo-200 absolute z-0 opacity-50" />
                    )}
                </div>

                {/* Profile Info — Below Cover, No Overlay */}
                <div className="px-10 py-8 flex  md:flex-row items-center md:items-start gap-5">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="h-32 w-32 rounded-[2rem] border-4 border-white overflow-hidden shadow-2xl bg-indigo-50 ring-2 ring-indigo-100 flex items-center justify-center font-black text-4xl text-indigo-500">
                            {user?.avatar ? (
                                <img
                                    src={`${ASSET_URL}${user.avatar}`}
                                    className="w-full h-full object-cover"
                                    alt="Profile"
                                />
                            ) : (
                                user?.firstName?.charAt(0).toUpperCase() || "?"
                            )}
                        </div>
                    </div>

                    {/* Text Info + Action Buttons */}
                    <div className=" flex flex-col lg:flex-row items-start md:items-center justify-between gap-5 w-full">
                        {/* Name & Meta */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl md:text-2xl font-black text-[#1a1a3b] leading-tight">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${user?.roleId?.name === "STUDENT" ? 'bg-emerald-100 text-emerald-700' :
                                    user?.roleId?.name === "TEACHER" ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {user?.roleId?.name || "Member"}
                                </span>
                                {user?.verificationStatus && (
                                    <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                        Verified <CheckCircle size={10} />
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-5 text-gray-500 font-bold text-sm">
                                {user?.startYear && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-400" />
                                        {user.startYear} {user.endYear ? `- ${user.endYear}` : ""}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-rose-500" />
                                    {user?.universityId ? `${user.universityId.name}` : "University not added"}
                                </div>
                                {user?.roleId?.name === "STUDENT" && user?.courseIds?.[0]?.courseName && (
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                                        {user.courseIds[0].courseName}
                                    </div>
                                )}
                                {user?.Profile?.hobby_badge && (
                                    <div className="flex items-center gap-2 border-gray-200">
                                        <Activity className="w-4 h-4 text-purple-500" />
                                        <span className="capitalize">{user.Profile.hobby_badge}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-500 font-bold text-sm">
                                {user?.roleId?.name === "TEACHER" && authUser?._id === user?._id && (
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-start gap-2"><Building className="w-4 h-4 text-gray-400" /> <span className="text-gray-500 font-bold text-sm">{user.teacherProfile.department}</span></div>
                                        <div className="flex items-start gap-2"><Briefcase className="w-4 h-4 text-gray-400" /> <span className="text-gray-500 font-bold text-sm">{user.teacherProfile.designation}</span></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Button
                                onClick={() => router.push(`/profile/edit/${user?._id}`)}
                                variant="outline"
                                className="h-10 px-5 rounded-2xl border-2 border-gray-100 font-black text-sm text-[#1a1a3b] hover:bg-gray-50 flex gap-2 shadow-sm"
                            >
                                <Edit3 className="w-4 h-4 text-blue-600" />
                                Edit Profile
                            </Button>


                        </div>

                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-7 space-y-8">
                    <AboutMe bio={user?.bio || user?.Profile?.bio} />

                    {/* Role Specific Career/Academic Details */}
                    {user?.roleId?.name === "TEACHER" && (
                        <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 ">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <GraduationCap size={20} />
                                </div>
                                <h3 className="text-xl font-black text-[#1a1a3b]">Educational Background</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Designation</p>
                                    <p className="text-lg font-bold text-indigo-600">{user?.teacherProfile?.designation || user?.Profile?.designation || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Department</p>
                                    <p className="text-lg font-bold text-gray-700">{user?.teacherProfile?.department || user?.Profile?.department || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Experience</p>
                                    <p className="text-lg font-bold text-gray-700">{user?.teacherProfile?.experienceYears || user?.Profile?.experienceYears || 0} Years</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {user?.roleId?.name === "ALUMINI" && (
                        <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 ">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Briefcase size={20} />
                                </div>
                                <h3 className="text-xl font-black text-[#1a1a3b]">Career Summary</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Current Company</p>
                                    <p className="text-lg font-bold text-blue-600">{user?.aluminiProfile?.currentCompany || user?.Profile?.currentCompany || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Job Title</p>
                                    <p className="text-lg font-bold text-gray-700">{user?.aluminiProfile?.jobTitle || user?.Profile?.jobTitle || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Experience</p>
                                    <p className="text-lg font-bold text-gray-700">{user?.aluminiProfile?.experienceYears || user?.Profile?.experienceYears || 0} Years</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {user?.roleId?.name === "STUDENT" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card className="bg-white overflow-hidden rounded-2xl border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <GraduationCap size={120} />
                                </div>
                                <CardContent className="p-5 relative">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                                                <Target size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-[#1a1a3b]">Academic Status</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Progress</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="text-amber-400 animate-pulse" size={18} />
                                            <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-1 rounded-lg uppercase">On Track</span>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group/item">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/item:text-emerald-500 shadow-sm transition-colors">
                                                        <Briefcase size={16} />
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrolled Course</p>
                                                </div>
                                                <p className="text-lg font-black text-[#1a1a3b] leading-tight group-hover/item:text-emerald-700 transition-colors">
                                                    {user?.courseIds?.[0]?.courseName || "Not assigned"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group/item">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/item:text-blue-500 shadow-sm transition-colors">
                                                        <Clock size={16} />
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Period</p>
                                                </div>
                                                <p className="text-lg font-black text-[#1a1a3b] leading-tight group-hover/item:text-blue-700 transition-colors">
                                                    {user?.studentProfile?.semesterId?.name || user?.Profile?.semesterId?.name || "Not set"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/50">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Next Milestone</p>
                                                <p className="text-sm font-bold text-indigo-900">Final Exams Preparation</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="ml-auto text-indigo-600 hover:bg-indigo-100 font-bold rounded-xl h-8 px-3">
                                                View Goals
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}


                    {/* Experience & Projects */}
                    <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between ">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Briefcase size={20} />
                                </div>
                                <h3 className="text-xl font-black text-[#1a1a3b]">Experience & Projects</h3>
                            </div>
                            <Button variant="ghost" onClick={() => setIsUploadModalOpen(true)} className="font-black text-blue-600 text-sm flex gap-2 hover:bg-blue-50 py-0 h-10 px-4 rounded-xl">
                                Add New
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {(user?.Profile?.projects?.length ?? 0) > 0 ? (
                                user?.Profile?.projects?.map((exp: string, i: number) => (
                                    <React.Fragment key={i}>
                                        <ExperienceItem
                                            title={exp}
                                            role="Personal Project"
                                            date=""
                                            description=""
                                            icon={Briefcase}
                                        />
                                        {i < (user?.Profile?.projects?.length ?? 0) - 1 && <div className="h-px bg-gray-100 w-full" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center opacity-40">
                                    <Briefcase className="w-12 h-12" />
                                    <p className="font-bold">No projects or experience added yet.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Teacher Resources Section */}
                    {user?.roleId?.name === "TEACHER" && (
                        <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm overflow-hidden relative">
                            <div className="flex items-center justify-between ">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-[#1a1a3b]">Educational Resources</h3>
                                </div>
                                {authUser?._id === user?._id && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setSelectedResourceForEdit(null);
                                            setIsUploadModalOpen(true);
                                        }}
                                        className="font-black text-blue-600 text-sm flex gap-2 hover:bg-blue-50 py-0 h-10 px-4 rounded-xl"
                                    >
                                        <Plus className="w-4 h-4" /> Add New
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {resources && resources.length > 0 ? (
                                    resources.map((resource) => (
                                        <div
                                            key={resource._id}
                                            onClick={() => window.open(`${ASSET_URL}${resource.fileUrl}`, '_blank')}
                                            className="group/card relative bg-slate-100 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-500 transition-colors group-hover/card:bg-blue-50">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h4 className="font-black text-[#1a1a3b] text-sm line-clamp-1 group-hover/card:text-blue-600 transition-colors">{resource.title}</h4>
                                                        <p className="text-[11px] font-bold text-gray-400 line-clamp-1 opacity-70">
                                                            {resource.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                                    {resource.isPaid ? (
                                                        <span className="flex items-center gap-1 text-[10px] font-black bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-lg uppercase">
                                                            <Lock size={10} /> ₹{resource.price}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-lg uppercase">
                                                            <Unlock size={10} /> Free
                                                        </span>
                                                    )}

                                                    {authUser?._id === user?._id && (
                                                        <div className="flex items-center gap-1 ml-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditResource(resource);
                                                                }}
                                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteResource(resource._id);
                                                                }}
                                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md uppercase">
                                                    {resource.courseId?.courseName || "Course"}
                                                </span>
                                                {resource.semesterId && (
                                                    <span className="text-[10px] font-black bg-white text-slate-500 px-2.5 py-1 rounded-md uppercase border border-slate-200">
                                                        {resource.semesterId.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-40">
                                        <Upload className="w-12 h-12 mb-4" />
                                        <p className="font-bold">No resources uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Skills */}
                    <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Users size={20} />
                            </div>
                            <h3 className="text-xl font-black text-[#1a1a3b]">Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {(user?.Profile?.skills?.length ?? 0) > 0 ? (
                                user?.Profile?.skills?.map((skill: string, i: number) => (
                                    <span key={i} className={`px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-default shadow-sm
                                        ${i % 3 === 0 ? 'bg-indigo-50 text-indigo-600' : i % 3 === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                                        hover:scale-105
                                    `}>
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <div className="w-full flex flex-col items-center justify-center text-center opacity-40">
                                    <Code className="w-12 h-12" />
                                    <p className="font-bold">No skills added yet.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Trust & Network Stats */}
                    <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm">
                        <h3 className="font-black text-[#1a1a3b] text-base mb-4">Network Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => setActivePopup('Followers')}
                                className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                            >
                                <p className="text-2xl font-black text-indigo-600 mb-1 group-hover:scale-110 transition-transform">{user?.followersCount || 0}</p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Followers</p>
                            </div>
                            <div
                                onClick={() => setActivePopup('Following')}
                                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                            >
                                <p className="text-2xl font-black text-emerald-600 mb-1 group-hover:scale-110 transition-transform">{user?.followingCount || 0}</p>
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Following</p>
                            </div>
                            <div className="col-span-2 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                                    <ShieldCheck size={18} /> Trust Score
                                </div>
                                <span className="font-black text-lg text-amber-600">{user?.trustScore || 0}/100</span>
                            </div>
                        </div>
                    </Card>

                    {/* Classmates & Friends */}
                    {user?.roleId?.name === "STUDENT" || user?.roleId?.name === "ALUMNI" && (
                        <Card className="bg-white p-5 rounded-2xl border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black text-[#1a1a3b] text-base">Classmates & Friends</h3>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg">142</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-4">
                                    {classmates.map((c, i) => (
                                        <div key={i} className="h-12 w-12 rounded-2xl border-4 border-white overflow-hidden shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer">
                                            <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center border-4 border-white shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors">
                                    +138
                                </div>
                            </div>
                        </Card>
                    )}



                    {/* Recent Activity */}
                    <Card className="bg-white p-8 rounded-2xl border-gray-100 shadow-sm">
                        <h3 className="font-black text-[#1a1a3b] text-base mb-8">Recent Activity</h3>
                        <div className="space-y-8 relative">
                            {/* Line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100/50" />

                            {activities.map((act, i) => (
                                <div key={i} className="relative pl-8 space-y-1 group">
                                    <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-white shadow-sm group-hover:scale-125 transition-transform ${act.color}`} />
                                    <p className="text-xs font-bold text-gray-400">{act.date}</p>
                                    <p className="text-[13px] font-medium text-gray-600 leading-relaxed group-hover:text-[#1a1a3b] transition-colors">
                                        {act.text.split("'").map((t, j) => j % 2 === 1 ? <span key={j} className="text-blue-600 font-bold">{t}</span> : t)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <UploadResourceModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false);
                    setSelectedResourceForEdit(null);
                }}
                editResource={selectedResourceForEdit}
            />

            <NetworkPopup
                isOpen={activePopup !== null}
                onClose={() => setActivePopup(null)}
                title={activePopup || "Network"}
                users={activePopup === 'Followers' ? mappedFollowers : mappedFollowing}
                onAction={handleNetworkAction}
            />
        </div>
    );
}