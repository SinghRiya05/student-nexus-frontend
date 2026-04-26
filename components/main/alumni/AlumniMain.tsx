"use client"
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/utils/hook'
import {
    fetchAlumniByMyUniversity,
    fetchAlumniByMyCourse,
    fetchAlumniByCompany,
    fetchAlumniByJobTitle
} from '@/features/alumni/alumniThunk'
import AlumniCard from './AlumniCard'
import AlumniGroup from './AlumniGroup'
import { Search, GraduationCap, Building2, Briefcase, Users, Loader2, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFollowers, getFollowing, getSentRequests } from '@/features/follow/followThunk'

export default function AlumniMain() {
    const dispatch = useAppDispatch()
    const { alumni, universityAlumni, courseAlumni, alumniByCompany, alumniByJobTitle, loading } = useAppSelector(state => state.alumni)

    const [activeTab, setActiveTab] = useState<'university' | 'course' | 'company' | 'jobTitle'>('university')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const loadData = async () => {
            try {
                // Initial load: University and Course only if empty
                if (universityAlumni.length === 0 && courseAlumni.length === 0) {
                    await Promise.all([
                        dispatch(fetchAlumniByMyUniversity()).unwrap(),
                        dispatch(fetchAlumniByMyCourse()).unwrap(),
                        dispatch(getFollowers()),
                        dispatch(getFollowing()),
                        dispatch(getSentRequests())
                    ])
                } else {
                    // Always refresh follow state to ensure real-time accuracy
                    dispatch(getFollowers());
                    dispatch(getFollowing());
                    dispatch(getSentRequests());
                }

                // Background load for grouping tabs only if empty
                if (alumniByCompany.length === 0) {
                    dispatch(fetchAlumniByCompany())
                }
                if (alumniByJobTitle.length === 0) {
                    dispatch(fetchAlumniByJobTitle())
                }
            } catch (err) {
                console.error("Failed to fetch alumni data:", err)
            }
        }
        loadData()
    }, [dispatch, universityAlumni.length, courseAlumni.length, alumniByCompany.length, alumniByJobTitle.length])

    const currentAlumniList = activeTab === 'course' ? courseAlumni : (activeTab === 'university' ? universityAlumni : alumni);

    const filteredAlumni = currentAlumniList.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.aluminiProfile?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.aluminiProfile?.currentCompany?.toLowerCase().includes(searchQuery.toLowerCase())
    )


    const tabs = [
        { id: 'university', label: 'My University', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
        { id: 'course', label: 'My Course', icon: Users, color: 'text-[#ad3407]', bg: 'bg-[#ffa184]/20' },
        { id: 'company', label: 'By Company', icon: Building2, color: 'text-[#006c5c]', bg: 'bg-[#6bfde0]/20' },
        { id: 'jobTitle', label: 'By Role', icon: Briefcase, color: 'text-[#5d5a86]', bg: 'bg-[#dad6ff]/40' },
    ]

    return (
        <div className="space-y-2 pb-10">
            {/* Hero Section */}
            <div className="relative overflow-hidden px-6 py-3 md:px-10 ">
                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-black text-[#302e56] mb-4 leading-tight"
                    >
                        Success Stories, Start with Networking
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-base font-medium text-[#5d5a86] mb-8"
                    >
                        Connect with BBD University alumni working at top global companies.
                        Get mentorship, career guidance, and job referrals.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name, company or job title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-[#b1addd]/20 rounded-2xl text-[#302e56] placeholder:text-[#5d5a86]/40 focus:outline-none focus:ring-2 focus:ring-[#2949ef]/15 transition-all font-bold text-sm"
                            />
                        </div>
                        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a36d1] transition-all shadow-lg shadow-[#2949ef]/10 text-sm">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f0ebff] rounded-full blur-[120px]" />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-3  overflow-x-auto pb-2 scrollbar-hide px-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center text-sm gap-3 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${activeTab === tab.id
                            ? `${tab.bg} ${tab.color} border-transparent shadow-[#000000]/5`
                            : 'bg-white text-[#5d5a86] border-[#b1addd]/10 hover:border-[#b1addd]/30'
                            }`}
                    >
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-[#b1addd]'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px] px-6 mt-10">
                {loading && (
                    <div className="space-y-8 animate-pulse pt-2">
                        <div className="flex items-center gap-3 px-2 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200"></div>
                            <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center gap-4 shadow-sm h-[340px]">
                                    <div className="w-full flex justify-end">
                                        <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-slate-200 shrink-0"></div>
                                    <div className="space-y-3 w-full flex flex-col items-center mt-2">
                                        <div className="h-5 w-3/4 bg-slate-200 rounded-md"></div>
                                        <div className="h-3 w-1/2 bg-slate-100 rounded-md"></div>
                                    </div>
                                    <div className="w-full pt-4 border-t border-slate-50 mt-auto flex justify-between items-center">
                                        <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
                                        <div className="h-4 w-1/4 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="w-full space-y-2 mt-4">
                                        <div className="w-full h-10 bg-slate-100 rounded-2xl"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'university' && (
                                <AlumniGroup
                                    title="From Your University"
                                    alumni={filteredAlumni}
                                    icon={<GraduationCap className="w-5 h-5 text-primary" />}
                                />
                            )}

                            {activeTab === 'course' && (
                                <AlumniGroup
                                    title="From Your Course"
                                    alumni={filteredAlumni}
                                    icon={<Users className="w-5 h-5 text-[#ad3407]" />}
                                />
                            )}

                            {activeTab === 'company' && (
                                <div className="space-y-12">
                                    {alumniByCompany.filter(g =>
                                        g.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        g.alumni.some(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
                                    ).length === 0 && (
                                            <div className="py-20 text-center border-4 border-dashed border-[#b1addd]/10 rounded-[3rem]">
                                                <p className="text-[#5d5a86] font-bold italic">No companies matched your search.</p>
                                            </div>
                                        )}
                                    {alumniByCompany.filter(g =>
                                        g.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        g.alumni.some(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
                                    ).map((group) => (
                                        <AlumniGroup
                                            key={group.company}
                                            title={group.company}
                                            alumni={group.alumni.filter(a =>
                                                group.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
                                            )}
                                            icon={<Building2 className="w-5 h-5 text-[#006c5c]" />}
                                        />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'jobTitle' && (
                                <div className="space-y-12">
                                    {alumniByJobTitle.filter(g =>
                                        g.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        g.alumni.some(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
                                    ).length === 0 && (
                                            <div className="py-20 text-center border-4 border-dashed border-[#b1addd]/10 rounded-[3rem]">
                                                <p className="text-[#5d5a86] font-bold italic">No roles matched your search.</p>
                                            </div>
                                        )}
                                    {alumniByJobTitle.filter(g =>
                                        g.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        g.alumni.some(a => `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
                                    ).map((group) => (
                                        <AlumniGroup
                                            key={group.jobTitle}
                                            title={group.jobTitle}
                                            alumni={group.alumni.filter(a =>
                                                group.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
                                            )}
                                            icon={<Briefcase className="w-5 h-5 text-[#5d5a86]" />}
                                        />
                                    ))}
                                </div>
                            )}

                            {!loading && filteredAlumni.length === 0 && activeTab !== 'company' && activeTab !== 'jobTitle' && (
                                <div className="py-20 text-center border-4 border-dashed border-[#b1addd]/10 rounded-[3rem]">
                                    <p className="text-[#5d5a86] font-bold italic">No alumni matched your current search.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
