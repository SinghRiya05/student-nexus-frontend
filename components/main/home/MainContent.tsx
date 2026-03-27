"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Plus, MoveRight, Star, Building2 } from "lucide-react"
import { motion } from "motion/react"
import { UserCard } from "./UserCard"
import { cn } from "@/lib/utils"

interface SectionProps {
    title: string;
    children: React.ReactNode;
    gridCols?: number;
}

const Section = ({ title, children, gridCols = 4 }: SectionProps) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800 tracking-tight">{title}</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                See All <MoveRight className="w-4 h-4" />
            </button>
        </div>
        <div className={cn(
            "grid gap-4 pb-4",
            gridCols === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}>
            {children}
        </div>
    </div>
)

export default function MainContent() {
    const classmates = [
        { name: "Rishika", role: "Java Developer", image: "/user.jpg" },
        { name: "Rishabh", role: "UI Designer", image: "/user.jpg" },
        { name: "Riya", role: "React Dev", image: "/user.jpg" },
        { name: "Rishu", role: "Pythonist", image: "/user.jpg" },
        { name: "Aryan", role: "Data Scientist", image: "/user.jpg" },
    ]

    const batchmates = [
        { name: "Vikram", role: "3rd Semester", info: "Mechanical Engineering", image: "/user.jpg" },
        { name: "Priya", role: "3rd Semester", info: "Electrical", image: "/user.jpg" },
        { name: "Karan", role: "3rd Semester", info: "Civil", image: "/user.jpg" },
        { name: "Ishita", role: "3rd Semester", info: "CSE", image: "/user.jpg" },
    ]

    const professors = [
        { name: "Dr. Mohan Singh", role: "Data Structure", info: "Head of Department", isWide: true, image: "/user.jpg" },
        { name: "Prof. Sarah", role: "Physics", info: "Senior Lecturer", isWide: true, image: "/user.jpg" },
        { name: "Dr. Amit", role: "Algorithms", info: "Research Lead", isWide: true, image: "/user.jpg" },
    ]

    const departments = [
        { name: "Computer Science", students: "120+" },
        { name: "Management", students: "80+" },
        { name: "Pharmacy", students: "60+" },
        { name: "Engineering", students: "200+" },
    ]

    const alumni = [
        { name: "Sumit Kumar", role: "BCA - 2023", info: "Software Engineer @Google", image: "/user.jpg" },
        { name: "Megha Raj", role: "BCA - 2022", info: "Product Manager @Meta", image: "/user.jpg" },
        { name: "Rohan Das", role: "BCA - 2024", info: "Frontend Dev @Amazon", image: "/user.jpg" },
    ]

    return (
        <div className="flex-1 space-y-10 pb-20">
            {/* Class Mates */}
            <Section title="BBD University - Class Mates">
                {classmates.slice(0, 4).map((user, idx) => (
                    <UserCard key={idx} {...user} />
                ))}
            </Section>

            {/* Batch Mates */}
            <Section title="BBD University - Batch Mates">
                {batchmates.slice(0, 4).map((user, idx) => (
                    <UserCard key={idx} {...user} />
                ))}
            </Section>

            {/* Teachers */}
            <Section title="BBD University - Teachers/Professors">
                {professors.slice(0, 4).map((user, idx) => (
                    <UserCard key={idx} {...user} />
                ))}
            </Section>

            {/* Departments */}
            <Section title="BBD University - Departments" gridCols={3}>
                {departments.slice(0, 3).map((dept, idx) => (
                    <motion.div key={idx} whileHover={{ y: -5 }} className="w-full glass-card p-6 border-none flex items-center justify-between hover:shadow-xl rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{dept.name}</h4>
                                <p className="text-xs text-gray-400">{dept.students} Students</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                            <Plus className="w-5 h-5" />
                        </button>
                    </motion.div>
                ))}
            </Section>

            {/* Alumni */}
            <Section title="BBD University - Alumni">
                {alumni.slice(0, 4).map((user, idx) => (
                    <UserCard key={idx} {...user} />
                ))}
            </Section>
        </div>
    )
}
