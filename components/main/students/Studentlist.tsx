"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import UserCard from '../home/UserCard';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
    getAllStudents,
    getStudentsByMyUniversity,
    getStudentsByMatchedCourseAndSameUniversity,
    getStudentsByMatchedSemesterWithCourseAndSameUniversity
} from "@/features/student/studentThunk";
import { useEffect } from "react";

type FilterTab = 'All' | 'My University' | 'Batchmates' | 'Classmates';

export default function Studentlist() {
    const [activeTab, setActiveTab] = useState<FilterTab>('All');
    const [searchQuery, setSearchQuery] = useState("");

    // Applied states
    const [selectedCourse, setSelectedCourse] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");

    // Draft states for the Popover UI
    const [tempSelectedCourse, setTempSelectedCourse] = useState("All");
    const [tempSortBy, setTempSortBy] = useState("Newest");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsPopoverOpen(open);
        if (open) {
            // When opening, sync draft to currently applied state
            setTempSelectedCourse(selectedCourse);
            setTempSortBy(sortBy);
        }
    };

    const applyDraftFilters = () => {
        setSelectedCourse(tempSelectedCourse);
        setSortBy(tempSortBy);
        setIsPopoverOpen(false);
    };

    const resetDraftFilters = () => {
        setTempSelectedCourse("All");
        setTempSortBy("Newest");
    };

    const tabs: FilterTab[] = ['All', 'My University', 'Batchmates', 'Classmates'];

    const dispatch = useAppDispatch();
    const { students = [], batchmates = [], classmates = [], loading } = useAppSelector((state: any) => state.student);

    // Fetch data whenever tab changes
    useEffect(() => {
        if (activeTab === 'All') dispatch(getAllStudents());
        if (activeTab === 'My University') dispatch(getStudentsByMyUniversity());
        if (activeTab === 'Batchmates') dispatch(getStudentsByMatchedCourseAndSameUniversity());
        if (activeTab === 'Classmates') dispatch(getStudentsByMatchedSemesterWithCourseAndSameUniversity());
    }, [activeTab, dispatch]);

    // Computed base list depending on the active tab
    const baseList = useMemo(() => {
        if (activeTab === 'Classmates') return classmates;
        if (activeTab === 'Batchmates') return batchmates;
        return students;
    }, [activeTab, students, batchmates, classmates]);

    // Simulated filtering using live Redux data:
    const filteredStudents = useMemo(() => {
        if (!baseList) return [];
        let list = [...baseList];

        // Course Filtering
        if (selectedCourse !== "All") {
            list = list.filter(student =>
                student.courseIds?.some((course: any) => course.courseName.includes(selectedCourse))
            );
        }

        // Apply Search Filtering
        if (searchQuery.trim()) {
            list = list.filter(student => {
                const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase());
            });
        }

        // Sorting Logic
        if (sortBy === "Alphabetical (A-Z)") {
            list = list.sort((a, b) => (a.firstName || "").localeCompare(b.firstName || ""));
        } else if (sortBy === "Alphabetical (Z-A)") {
            list = list.sort((a, b) => (b.firstName || "").localeCompare(a.firstName || ""));
        }

        return list;
    }, [baseList, searchQuery, selectedCourse, sortBy]);

    return (
        <div className="flex flex-col w-full h-full">
            {/* Header Area */}
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm shadow-indigo-100/50 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#302e56] tracking-tight">Discover Students</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">Connect, collaborate, and grow with peers from everywhere.</p>
                    </div>

                    <div className="w-full md:w-auto flex items-center relative">
                        <Search size={16} className="absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or course..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Premium Segmented Filter Tabs */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap sm:flex-nowrap p-1.5 rounded-[1.25rem] w-full lg:w-auto border border-gray-200/60 ">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "relative flex-1 sm:flex-none px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 outline-none text-center",
                                    isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-200/40"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        );
                    })}
                </div>

                <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <button className="px-5 py-2.5 w-full md:w-auto bg-white border border-gray-200 rounded-xl text-gray-700 font-bold text-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group data-[state=open]:border-indigo-300 data-[state=open]:text-indigo-600 data-[state=open]:bg-indigo-50/30 outline-none">
                            <Filter size={15} className="group-data-[state=open]:text-indigo-500" />
                            <span>Advanced Filters</span>
                            <ChevronDown size={14} className="opacity-50 group-data-[state=open]:rotate-180 transition-transform hidden sm:block" />
                        </button>
                    </PopoverTrigger>
                    {/* Fixed responsiveness: dynamic width on small screens, fixed width on sm+ */}
                    <PopoverContent className="w-[calc(100vw-32px)] sm:w-[340px] rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-gray-100 bg-white/95 backdrop-blur-xl -mr-4 sm:mr-0 max-h-[85vh] overflow-y-auto" align="end" sideOffset={8}>
                        <div className="flex flex-col gap-5">

                            {/* Sort By Section */}
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-3">Sort Students</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Newest", "Alphabetical (A-Z)", "Alphabetical (Z-A)"].map((sortOption) => (
                                        <button
                                            key={sortOption}
                                            onClick={() => setTempSortBy(sortOption)}
                                            className={cn(
                                                "text-[11px] px-3 py-2 rounded-lg font-bold text-center transition-all border",
                                                tempSortBy === sortOption
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                                            )}
                                        >
                                            {sortOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Course / Program Filter */}
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-3">Filter by Course</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["All", "Computer Science", "Information Technology", "Data Science"].map((course) => (
                                        <button
                                            key={course}
                                            onClick={() => setTempSelectedCourse(course)}
                                            className={cn(
                                                "text-[11px] px-3 py-1.5 rounded-full font-bold transition-all border",
                                                tempSelectedCourse === course
                                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
                                            )}
                                        >
                                            {course}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={resetDraftFilters}
                                    className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applyDraftFilters}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Grid display using UserCard */}
            <div className="flex-1">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-2xl shadow-sm border border-[#b1addd]/10 flex flex-col items-center text-center animate-pulse"
                            >
                                {/* Avatar circle */}
                                <div className="w-16 h-16 rounded-full bg-gray-200 mt-2 mb-3" />
                                {/* Name line */}
                                <div className="h-4 w-28 bg-gray-200 rounded-full mb-2" />
                                {/* Role line */}
                                <div className="h-3 w-20 bg-gray-100 rounded-full mb-4" />
                                {/* Button */}
                                <div className="h-8 w-full bg-gray-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        <AnimatePresence>
                            {filteredStudents.map((student: any) => (
                                <motion.div
                                    key={student._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <UserCard
                                        userId={student._id}
                                        name={`${student.firstName} ${student.lastName}`}
                                        role={student.courseIds?.length > 0 ? student.courseIds.map((c: any) => c.course_short_name).join(", ") : "Student"}
                                        university={student.universityId?.short_name || student.universityId?.name}
                                        semester={student.studentProfile?.semesterId?.name || student.profile?.semesterId?.name}
                                        image={student.avatar || undefined}
                                        variant="primary"
                                        className="h-full w-full"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 h-64">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">No students found.</h3>
                        <p className="text-xs text-gray-500 max-w-sm">
                            We couldn't find anyone matching your current filters or search query. Try adjusting them!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
