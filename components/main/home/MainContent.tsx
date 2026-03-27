"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Plus, MoveRight, Star, Building2 } from "lucide-react"
import { motion } from "motion/react"
import { UserCard } from "./UserCard"

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-gray-800 tracking-tight">{title}</h3>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                See All <MoveRight className="w-4 h-4" />
            </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {children}
        </div>
    </div>
)

export default function MainContent() {
    const classmates = [
        { name: "Rishika", role: "Java Developer" },
        { name: "Rishabh", role: "UI Designer" },
        { name: "Riya", role: "React Dev" },
        { name: "Rishu", role: "Pythonist" },
        { name: "Aryan", role: "Data Scientist" },
    ]

    const batchmates = [
        { name: "Vikram", role: "3rd Semester", info: "Mechanical Engineering" },
        { name: "Priya", role: "3rd Semester", info: "Electrical" },
        { name: "Karan", role: "3rd Semester", info: "Civil" },
        { name: "Ishita", role: "3rd Semester", info: "CSE" },
    ]

    const professors = [
        { name: "Dr. Mohan Singh", role: "Data Structure", info: "Head of Department", isWide: true },
        { name: "Prof. Sarah", role: "Physics", info: "Senior Lecturer", isWide: true },
        { name: "Dr. Amit", role: "Algorithms", info: "Research Lead", isWide: true },
    ]

    const departments = [
        { name: "Computer Science", students: "120+" },
        { name: "Management", students: "80+" },
        { name: "Pharmacy", students: "60+" },
        { name: "Engineering", students: "200+" },
    ]

    const alumni = [
        { name: "Sumit Kumar", role: "BCA - 2023", info: "Software Engineer @Google" },
        { name: "Megha Raj", role: "BCA - 2022", info: "Product Manager @Meta" },
        { name: "Rohan Das", role: "BCA - 2024", info: "Frontend Dev @Amazon" },
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
            <Section title="BBD University - Departments">
                {departments.slice(0, 4).map((dept, idx) => (
                    <motion.div key={idx} whileHover={{ y: -5 }} className="snap-start shrink-0 w-64 glass-card p-6 border-none flex items-center justify-between hover:shadow-xl">
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
