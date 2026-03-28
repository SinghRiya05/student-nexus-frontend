"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Plus, MoveRight, Building2, Terminal, Globe, Landmark, Home, Send } from "lucide-react"
import { motion } from "motion/react"
import { UserCard } from "./UserCard"
import { cn } from "@/lib/utils"

export default function MainContent() {
    const classmates = [
        { name: "Shobhit", role: "Java Developer", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-xWp_jUAdB4nlMD3ACLos0oKwPrv5CKW6GxKwg_SXcQVlp9vsAlHVT13cUFM5bwQR8V3ZIU2-qMm4p2vN-V0q9lfb-LpSBBHueVozh1kpLn0f11w_dTEcaYJjgTg_5iQiZVncbV6yRMdN9jTMbxgOlI6x2XksvKeYHcnmLDnTsrDbtnATnKwtHKxqFhQTAKF8e-H4KqFHS7b01J-a8Ygynu2_Qdwxb8i_-25Z8Wk624zVrs39sdmX7hkSCkhc3WHSt_y6uW5JMnk" },
        { name: "Anjali", role: "UI Designer", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAu-1r081rfOmY4mlKk47AgS4s2WiI3pqt0FNs4NjG9S_bItlsepQFhjYBI8J29orHDyB2Mb2kU0nhuvDYbbzfzHoFG8iV4fqh8HhgiC3F8OFKHPzJBZ7cpAP92pqfpDhUcDh8S6OoEYQZ16Dbqhlm3WXw1-HB8wfcCfx4QwSieev01yXzCIyt1HXQZ7UVe2ozh9gYHPGTYVzKU7Kd2tLagJ8Ifj0VdyhldN_OORD56e7WAcn7f3TrsVHDBFJq9FUzxRk8nGFxLe2Y" },
        { name: "Rahul", role: "Data Analyst", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbpVrwhNkIKqg4IFSnFs-ce5bBE46dUq3ebV-UfEvxtRoHaJucSBKQO4efQcPuVYr61Be8LpD9C6HwntoV06qYlOghWIWWstp9OoWcjth61ngq4umBFNt80oU9z-yxJQWq0DM7uFAVSQi7BxIj8MVIKtxHrX7eS4YjvDHEuTjdLDN5e_R5LaSKvulptNdcwyB8kj8mY0_JzbAtlPb0woZvvJO3UJhf_nDwkPlDnC29QOmTJMkQ7V-IZCJSMcsTMK5YUaGuDzFtMEc" },
        { name: "Rahul", role: "Data Analyst", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbpVrwhNkIKqg4IFSnFs-ce5bBE46dUq3ebV-UfEvxtRoHaJucSBKQO4efQcPuVYr61Be8LpD9C6HwntoV06qYlOghWIWWstp9OoWcjth61ngq4umBFNt80oU9z-yxJQWq0DM7uFAVSQi7BxIj8MVIKtxHrX7eS4YjvDHEuTjdLDN5e_R5LaSKvulptNdcwyB8kj8mY0_JzbAtlPb0woZvvJO3UJhf_nDwkPlDnC29QOmTJMkQ7V-IZCJSMcsTMK5YUaGuDzFtMEc" },
    ]

    const batchmates = [
        { name: "Komal", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOmiF1g4f65T1qJLFrQlUaMAH2S3Mksa_uDX_i9fE_sA1Ca2Jl7l2Cb3dIeku8-jLDUXcqLyPfomCve_vuWyPuSn83CQutFQ9msjxUA5fJWO-5qxHZDLPqGj3G6CtXHDi-FLiSDrDIcxJe9c6KQEqM1NrQ16HRB0o_Cg8yEQ-5HJGFdJ-4i8IviP0cRuc60xxNnEox22mr_8iEZI0p63D_hWhdyLAAEj9aJYyk1iL3_Lc2H2U4i98UDL8ZOGnlwmjHY61418ilzfY" },
        { name: "Rishika", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2z1kfF2stL0lYXDiC-CV0PohSBvuKy2DSJHKHgJbcTBNGKp_OSxzDgzQrp9R4US9F0pFpq96tPwChkpyacl7mZ0-e_wsn6_LhHubV9A5qQTLoUTwTCd9qnfZSFNkGoijkV3MVnUbohOQOtFrnM48zpoGoztShCjHlW8Xb_GT2s9Ccesn2UccoVd9UU9b-rUqtwsDy0BwryUkRHnS8GUvo213Sd3A8o8tzapAA3ghtadxNMXu-NpgwBR3y7gvbydavrpaTCwubCG8" },
        { name: "Kamal", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAi79QZ_sml_vzAk3Gy51XEyyvpy3mIlkfjrxEir-9z3mAycMDqHOYxFLrAJCJPtjct2vMRtTjUa3FzSFCSn14Mh-eoGlh08B-ZB-RqMo9eFQUlQPul52jfnmAB_uy9AbZaU-4d8pO4zGMjQ2CbKQhvpyGPPImtfOBc1_FDxztiBxnW9WUmd8ILo73lc4QpTl4NsmeHz0FokM-udnMAudBwnzlEmb32CpNwrVwhY9XCjc_Q9cTB6tTih38QLShN3LbloJzcbevgOGI" },
        { name: "Rohit", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBD6BOaBnoE0lKm26FU05rhz9A_ahFI5KHwNKYRPDmRBDAKHFC7Dp2dNY5HCqwlIYx6GiMd7nIyDspS596hNt1A4egkuHREUh0OoeGG5jyIN7EvWiw-0pxWxpOJNc3Pp9O5fnR-hwAdt9jyJco6uLB9Twm4qqsWVARAOFXj8Y7FCCSE21T57urWbZtzsEtQzjDlPtVrgM6SEzfXWhk-thYaoh1NGYbreA3wxeen4O22FYp3NKth2oGoh0j2-oeP5_-QgPDY1IbFjF4" },
    ]

    const professors = [
        { name: "Dr. Mohan Singh", role: "Senior Faculty, IT Dept", skills: ["Data Structure", "Web Dev"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv08_-IeN1hdXit3rvg8uyJiS0y_sq9PggyLZx17F_ElgCfuMa68sfq6pDWr2EEqUGfRpf1QToJiPqiUxsJJwGdN7oEzyy_pVXdGJbzficSTlKz8xtA-AVni6WTCxM8Y0f21_Nj_UQ8bFEAM4vGBJZqjfyvrlIVw0LsAg7Xr61jtVitcqH_cfsOgS0IP_4TaBQPLdjxnFNismEi8NF0hFGWAmT_cTWM-mKfwSh1V3WGVJ83ErtKCm4StdA3vn_TdIXQLHf4FOhjTw" },
        { name: "Prof. Sarah Khan", role: "Dept. of Mathematics", skills: ["Algorithms", "Graph Theory"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJOjupv2fGCs6bKklcrHhVt7SOVq2F0feK0LQyaaTp8PigNQfzQeWJHysd9OSCV2eavCKUxu9IJsSAnWBJcoGBCtG79JZ6M-qVo5MNpJGet2_GHYjnQtw2VlyX93p0XmjlO2ZrFqVV6U6Juv5DjKE87vR7MvfoRlP0--mw1ybiQkAsnm23uAO_gr6QMEmogN3WA9eAuTXlgLR-G_l0ELcIRonr2KLeP-SjjVorhecII3eQrvTpP4IrIzZgr9I7Rhl57m_F3bQJ7fg" },
    ]

    const departments = [
        { name: "IT Department", category: "Academic", students: "1.2k Students", icon: Terminal, bg: "bg-[#6bfde0]/20", text: "text-[#006c5c]" },
        { name: "Social Science", category: "Social", students: "800 Students", icon: Globe, bg: "bg-[#ffa184]/20", text: "text-[#ad3407]" },
        { name: "Political Dept", category: "Political", students: "450 Students", icon: Landmark, bg: "bg-[#b4bdff]/20", text: "text-[#2949ef]" },
        { name: "Home Science", category: "Applied", students: "320 Students", icon: Home, bg: "bg-[#dad6ff]/40", text: "text-[#5d5a86]" },
    ]

    const alumni = [
        { name: "Rishika", info: "Class of 2021 • Microsoft", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJHmUdFSYOmCKgZ0nqfW_OCCZ88r6Ttnnn3WbqJHkekCZ_Py9Yyxvl16FHuPDqp0wr2a50onOBqs30XpQYRN_9s4Xqr-UIY49ZLpMisR4AtaMRPh7RQyRG9e8ZdkQwI57OLTDRGvBIQNia-uoyGH9hgn-y8ptTT0FuB2osQgEJ6Ss-gwd_7WgClsmkmLsp87b3UtpCcOIZMVDLhdYX_0YGifWo97uHePJJqDTinVtzUuXe_lEu2YLlLk6zQ8IfR6j4d7Ql1IwDQYE" },
        { name: "Kamal", info: "Class of 2020 • Google", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdsihJqAJ7IgVTCxGW2-M_OMiQGSI3T64G7PmmFQY8fLRKlsuvzxb8hUf1gRHgyZTA0JhxJMdkuRdUQK2L61WrtRbIjm_40m5aFfO1kfrtgotn1juTDkovjnKbHFi48PMKRXDJs4lgHV5I3PugL1AQUTqGcj1rf_v-9SKc9jkQxxOtBbz8M0pn7t8_GykGm3GSF6OteXT5i2fDD0CH_yWBa-AIeEBjp38c205EIRWh3YmCIClOG54tEspNwpTEvygZ7mD4j_6DVhE" },
    ]

    return (
        <div className="flex-1 space-y-10">
            {/* Welcome Hero */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#302e56] mb-2"> Welcome to Student Nexus</h1>
                <p className="text-[#5d5a86]">  Connect, collaborate, and grow with students from your university.</p>
            </div>

            {/* Class Mates */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Class Mates</h2>
                    <button className="text-[#2949ef] text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {classmates.map((user, idx) => (
                        <UserCard key={idx} name={user.name} role={user.role} image={user.image} variant="primary" />
                    ))}
                </div>
            </section>

            {/* Batch Mates */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Batch Mates</h2>
                    <button className="text-[#2949ef] text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {batchmates.map((user, idx) => (
                        <UserCard key={idx} name={user.name} role="" image={user.image} variant="secondary" />
                    ))}
                </div>
            </section>

            {/* Professors */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Professors</h2>
                    <button className="text-[#2949ef] text-sm font-semibold hover:underline">Directory</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {professors.map((prof, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-[#b1addd]/10 flex gap-4">
                            <img className="w-20 h-20 rounded-xl object-cover" src={prof.image} alt={prof.name} />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-base text-[#302e56]">{prof.name}</h4>
                                        <p className="text-xs text-[#5d5a86]">{prof.role}</p>
                                    </div>
                                    <button className="h-8 w-8 rounded-full bg-[#6bfde0] text-[#005f51] flex items-center justify-center hover:scale-105 transition-transform">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {prof.skills.map((skill, sIdx) => (
                                        <span key={sIdx} className="px-2 py-1 bg-[#f0ebff] rounded-md text-[10px] text-[#302e56] font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Departments */}
            <section>
                <div className="mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Departments</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {departments.map((dept, idx) => (
                        <div key={idx} className={cn("p-4 rounded-3xl border border-black/5 flex flex-col justify-between h-36 relative overflow-hidden", dept.bg)}>
                            <div className="z-10">
                                <p className={cn("text-[10px] uppercase tracking-wider font-bold mb-1", dept.text)}>{dept.category}</p>
                                <h4 className="font-bold text-[#302e56] text-sm">{dept.name}</h4>
                            </div>
                            <div className="flex items-center justify-between z-10">
                                <span className="text-xs font-medium text-[#5d5a86]">{dept.students}</span>
                                <button className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <Plus className="w-4 h-4 text-[#302e56]" />
                                </button>
                            </div>
                            <dept.icon className={cn("absolute -right-4 -top-4 w-20 h-20 opacity-10 pointer-events-none", dept.text)} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Alumni */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="text-xl font-bold">BBD University - Alumni</h2>
                    <button className="text-[#2949ef] text-sm font-semibold hover:underline">Career Network</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {alumni.map((member, idx) => (
                        <div key={idx} className="min-w-[280px] bg-white border border-[#b1addd]/10 p-5 rounded-3xl flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <img className="w-12 h-12 rounded-full object-cover" src={member.image} alt={member.name} />
                                <div>
                                    <h4 className="font-bold text-sm text-[#302e56]">{member.name}</h4>
                                    <p className="text-[10px] text-[#5d5a86]">{member.info}</p>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-[#f0ebff] text-[#2949ef] rounded-xl text-xs font-bold hover:bg-[#e3dfff] transition-colors flex items-center justify-center gap-2">
                                <Send className="w-3 h-3" />
                                Send Request
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
