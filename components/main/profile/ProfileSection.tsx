"use client";

import React, { useState } from "react";
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
    Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// ─── Sections ─────────────────────────────────────────────────────────────

const AboutMe = ({ bio }: { bio?: string }) => (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-6">
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

const StatCard = ({ label, value, subtext, color }: { label: string; value: string; subtext: string; color: string }) => (
    <div className={`p-8 rounded-2xl border-2 border-transparent transition-all hover:translate-y-[-4px] cursor-pointer ${color}`}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">{label}</p>
        <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl font-black">{value}</span>
            <span className="text-sm font-bold opacity-60">{subtext}</span>
        </div>
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

export default function ProfileSection() {
    const router = useRouter();
    const [stats] = useState([
        { label: "Cumulative GPA", value: "8.9", subtext: "/ 10", color: "bg-blue-50/50 text-blue-600 border-blue-100 hover:border-blue-300 shadow-sm shadow-blue-50" },
        { label: "Credits Earned", value: "124", subtext: "Units", color: "bg-emerald-50/50 text-emerald-600 border-emerald-100 hover:border-emerald-300 shadow-sm shadow-emerald-50" },
        { label: "Current Term", value: "6th", subtext: "Sem", color: "bg-rose-50/50 text-rose-600 border-rose-100 hover:border-rose-300 shadow-sm shadow-rose-50" }
    ]);

    // Profile state
    const [profile, setProfile] = useState<any>({
        firstName: "Riya",
        lastName: "Singh",
        courseName: "BCA Student",
        universityName: "BBD University",
        completionYear: "2025 - 2026",
        bio: "",
        skills: [],
        experience: []
    });

    React.useEffect(() => {
        const profileData = localStorage.getItem("profileData");
        if (profileData) {
            try {
                const data = JSON.parse(profileData);
                const skillsData = data.skills;
                const skillsArray = Array.isArray(skillsData)
                    ? skillsData.map((s: any) => typeof s === 'object' ? s.name : s)
                    : (typeof skillsData === 'string' ? skillsData.split(",").map((s: string) => s.trim()).filter(Boolean) : []);

                setProfile({
                    firstName: data.firstName || "Riya",
                    lastName: data.lastName || "Singh",
                    courseName: data.courseName || "BCA Student",
                    universityName: data.universityName || "BBD University",
                    completionYear: data.completionYear || "2025 - 2026",
                    bio: data.bio || "",
                    skills: skillsArray,
                    experience: data.projects || [] // projects maps to experience in view
                });
            } catch (err) {
                console.error("Failed to parse profile data:", err);
            }
        }
    }, []);

    const classmates = [
        { name: "John", img: "https://i.pravatar.cc/150?u=1" },
        { name: "Sara", img: "https://i.pravatar.cc/150?u=2" },
        { name: "Mike", img: "https://i.pravatar.cc/150?u=3" },
    ];

    const groups = [
        { name: "Dev Society BBD", members: "840 Members", icon: LayoutGrid, color: "text-indigo-600 bg-indigo-50" },
        { name: "Design Collective", members: "2.1k Members", icon: Edit3, color: "text-emerald-600 bg-emerald-50" }
    ];

    const activities = [
        { text: "Shared a new project 'Nexus UI Framework' to the Dev Society.", date: "2 hours ago", color: "bg-blue-500" },
        { text: "Earned 'Top Contributor' badge in Hackathon Prep group.", date: "Yesterday", color: "bg-emerald-500" },
        { text: "Followed 3 new professors in the Computer Science department.", date: "3 days ago", color: "bg-indigo-500" }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero Header */}
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40">
                {/* Cover Photo */}
                <div className="h-64 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20 mix-blend-multiply" />
                    <img
                        src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1600&q=80"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt="Cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Profile Info Overlay Row */}
                <div className="px-10 pb-10 flex flex-col md:flex-row items-end justify-between -mt-16 relative z-10 gap-8">
                    <div className="flex flex-col md:flex-row items-end gap-8 flex-1">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="h-44 w-44 rounded-[2.5rem] border-10 border-white overflow-hidden shadow-2xl bg-white">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2ouios_lhgXqc2jp7Mq-OcL_Utm9--mcX154rRS0412JQKRZkcX78lXb4rJyYrGQ89EUiBnSKbmjTbTizXd_rLbMDgx_iDfMYqxsAVJCpaaZzIiL2pGubDVFUoOU2IzFNEjdPJ8efhIjopDqX67xS-pGZjdgdBM2kTpG-VYO65j3PRjfdmusUe5V7nY4F83Uxir3MKiO0uXimenU1ScyWKf34s19hoLZ3y6hB5JwAz1_l_YIJxaxr5rKBQR7ExC31lw6gsgcSg2w" className="w-full h-full object-cover" alt="Profile" />
                            </div>
                            <button className="absolute bottom-4 right-4 h-10 w-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl hover:bg-blue-700 transition-all hover:scale-110">
                                <Camera size={18} />
                            </button>
                        </div>

                        {/* Text Info */}
                        <div className="pb-3 space-y-3">
                            <h2 className="text-[40px] font-black text-[#1a1a3b] leading-tight flex items-center gap-3">
                                {profile.firstName} {profile.lastName}
                                <div className="h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                            </h2>
                            <div className="flex flex-wrap items-center gap-6 text-gray-500 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                                    {profile.courseName}
                                </div>
                                <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                                    <MapPin className="w-5 h-5 text-rose-500" />
                                    {profile.universityName}
                                </div>
                                <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                                    <Users className="w-5 h-5 text-emerald-500" />
                                    {profile.completionYear}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pb-4">
                        <Button
                            onClick={() => router.push("/profile/edit")}
                            variant="outline"
                            className="h-14 px-8 rounded-2xl border-2 border-gray-100 font-black text-sm text-[#1a1a3b] hover:bg-gray-50 flex gap-3 shadow-sm"
                        >
                            <Edit3 className="w-5 h-5 text-blue-600" />
                            Edit Profile
                        </Button>
                        <Button className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm flex gap-3 shadow-xl shadow-blue-500/30">
                            <UserPlus className="w-5 h-5" />
                            Connect
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-7 space-y-8">
                    <AboutMe bio={profile.bio} />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <StatCard key={i} {...stat} />
                        ))}
                    </div>

                    {/* Experience & Projects */}
                    <Card className="bg-white p-8 rounded-2xl border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Briefcase size={20} />
                                </div>
                                <h3 className="text-xl font-black text-[#1a1a3b]">Experience & Projects</h3>
                            </div>
                            <Button variant="ghost" onClick={() => router.push("/profile/edit")} className="font-black text-blue-600 text-sm flex gap-2 hover:bg-blue-50 py-0 h-10 px-4 rounded-xl">
                                Add New
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {profile.experience.length > 0 ? (
                                profile.experience.map((exp: any, i: number) => (
                                    <React.Fragment key={i}>
                                        <ExperienceItem
                                            title={exp.title}
                                            role={exp.role}
                                            date={exp.date}
                                            description={exp.description}
                                            icon={Briefcase}
                                        />
                                        {i < profile.experience.length - 1 && <div className="h-px bg-gray-100 w-full" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                                    <Briefcase className="w-12 h-12 mb-4" />
                                    <p className="font-bold">No projects or experience added yet.</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Skills */}
                    <Card className="bg-white p-8 rounded-2xl border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Users size={20} />
                            </div>
                            <h3 className="text-xl font-black text-[#1a1a3b]">Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.length > 0 ? (
                                profile.skills.map((skill: string, i: number) => (
                                    <span key={i} className={`px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-default shadow-sm
                                        ${i % 3 === 0 ? 'bg-indigo-50 text-indigo-600' : i % 3 === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                                        hover:scale-105
                                    `}>
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <div className="w-full flex flex-col items-center justify-center py-10 text-center opacity-40">
                                    <Code className="w-12 h-12 mb-4" />
                                    <p className="font-bold">No skills added yet.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Classmates & Friends */}
                    <Card className="bg-white p-8 rounded-2xl border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-[#1a1a3b] text-base">Classmates & Friends</h3>
                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-lg">142</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-4">
                                {classmates.map((c, i) => (
                                    <div key={i} className="h-12 w-12 rounded-2xl border-4 border-white overflow-hidden shadow-sm">
                                        <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center border-4 border-white shadow-sm">
                                +138
                            </div>
                        </div>
                    </Card>

                    {/* My Groups */}
                    <Card className="bg-white p-8 rounded-2xl border-gray-100 shadow-sm">
                        <h3 className="font-black text-[#1a1a3b] text-base mb-8">My Groups</h3>
                        <div className="space-y-6">
                            {groups.map((group, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${group.color}`}>
                                            <group.icon size={22} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1a1a3b] text-[14px] leading-tight truncate max-w-[140px] group-hover:text-blue-600 transition-colors">{group.name}</h4>
                                            <p className="text-[10px] font-black text-gray-400 opacity-60 uppercase">{group.members}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="bg-white p-8 rounded-2xl border-gray-100 shadow-sm">
                        <h3 className="font-black text-[#1a1a3b] text-base mb-8">Recent Activity</h3>
                        <div className="space-y-8 relative">
                            {/* Line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100/50" />

                            {activities.map((act, i) => (
                                <div key={i} className="relative pl-8 space-y-1">
                                    <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-white shadow-sm ${act.color}`} />
                                    <p className="text-xs font-bold text-gray-400">{act.date}</p>
                                    <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                                        {act.text.split("'").map((t, j) => j % 2 === 1 ? <span key={j} className="text-blue-600 font-bold">{t}</span> : t)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}