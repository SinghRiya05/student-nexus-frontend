'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  GraduationCap,
  BookOpen,
  Users,
  Globe,
  TrendingUp,
  Plus,
  Compass,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  PieChart,
  Activity,
  Zap,
  ShieldCheck,
  BarChart3,
  Map,
  Search,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import apiClient from '@/services/apiClient'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { format } from 'date-fns'

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalUniversities: number;
  totalCourses: number;
  totalCountries: number;
  totalFeeds: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
        if (response.data.success) {
          setStats(response.data.data.stats);
          setRecentUsers(response.data.data.recentUsers);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Universities",
      value: stats?.totalUniversities || "0",
      icon: GraduationCap,
      description: "+12% Growth",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Active Courses",
      value: stats?.totalCourses || "0",
      icon: BookOpen,
      description: "85% Completion",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Total Students",
      value: stats?.totalStudents || "0",
      icon: Users,
      description: "2.4k Active Now",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Total Faculty",
      value: stats?.totalTeachers || "0",
      icon: BarChart3,
      description: "94% Verified",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Total Feeds",
      value: stats?.totalFeeds || "0",
      icon: Activity,
      description: "High Interaction",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ]

  return (
    <div className="space-y-6 pb-10  min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            System <span className="text-teal-600">Analytics</span>
          </h1>
          <p className="text-slate-500 font-medium">Platform overview and real-time administrative insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-100 rounded-full px-4 py-2 text-xs font-semibold text-slate-600 gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
            Server: Healthy (99.9%)
          </div>
          <Button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all">
            <Plus size={16} />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-xl`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {loading ? "..." : stat.value}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={10} className="text-teal-500" />
                <span className="text-[10px] font-bold text-teal-600">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 px-2">

        {/* Main Analytics Chart Section */}
        <Card className="lg:col-span-8 border-none shadow-sm bg-white overflow-hidden ring-1 ring-slate-100">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Engagement Metrics</CardTitle>
                <CardDescription>Daily active users and post interactions over 30 days.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-teal-100 text-teal-700 bg-teal-50/30">WEEKLY</Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-slate-400">MONTHLY</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px] relative">
              {/* Complex Multi-series Dummy Chart using SVG */}
              <svg viewBox="0 0 1000 300" className="w-full h-full">
                {/* Grid Lines */}
                <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#f1f5f9" strokeWidth="1" />

                {/* Series 1: Students (Teal Area) */}
                <path
                  d="M0,300 L0,150 Q100,100 200,180 T400,120 T600,200 T800,100 T1000,140 L1000,300 Z"
                  fill="url(#tealGradient)"
                  fillOpacity="0.1"
                />
                <path
                  d="M0,150 Q100,100 200,180 T400,120 T600,200 T800,100 T1000,140"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-[dash_3s_ease-in-out_infinite]"
                />

                {/* Series 2: Activity (Cyan Line) */}
                <path
                  d="M0,200 Q150,220 300,150 T500,180 T750,100 T1000,120"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#fff" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Legend */}
              <div className="absolute top-0 right-0 flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-teal-600"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Student Growth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-teal-300"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Faculty Login</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar: Regional Insights */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Regional Distribution</CardTitle>
            <CardDescription>University spread across territories.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="relative h-48 w-48 mx-auto">
              {/* Circular Analytics Visualization */}
              <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0d9488" strokeWidth="12" strokeDasharray="180 251.2" strokeLinecap="round" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2dd4bf" strokeWidth="12" strokeDasharray="60 251.2" strokeDashoffset="-180" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-black text-slate-900">{stats?.totalCountries || "0"}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Countries</p>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {[
                { label: "India", value: "72%", color: "bg-teal-600" },
                { label: "USA", value: "18%", color: "bg-teal-400" },
                { label: "UK", value: "10%", color: "bg-teal-200" },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Left: Activity Feed */}
        <Card className="lg:col-span-5 border-none shadow-sm ring-1 ring-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>Real-time platform events logs.</CardDescription>
            </div>
            <Activity className="text-teal-500" size={18} />
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {[
                { event: "New University Added", details: "LPU Jalandhar joined Student Nexus", time: "2 min ago", type: "success" },
                { event: "High Traffic Alert", details: "Feeds reaching 5k interactions/min", time: "15 min ago", type: "warning" },
                { event: "Course Updated", details: "MCA Syllabus updated for BBDU", time: "1 hour ago", type: "info" },
                { event: "Database Backup", details: "Weekly automated backup completed", time: "3 hours ago", type: "success" },
                { event: "New System Admin", details: "Role assigned to Riya Singh", time: "5 hours ago", type: "info" },
              ].map((item, i) => (
                <div key={i} className="relative pl-8 group">
                  <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110
                      ${item.type === 'success' ? 'bg-teal-500' : item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}>
                  </div>
                  <div className="p-3 bg-slate-50/50 rounded-2xl group-hover:bg-teal-50/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900">{item.event}</p>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Right: Recent Registrations */}
        <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Onboarding</CardTitle>
                <CardDescription>Latest registered members.</CardDescription>
              </div>
              <Link href="/dashboard/users">
                <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                  View List
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:rotate-6 transition-transform">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-black text-teal-600 uppercase">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 truncate uppercase tracking-tighter">{user.email}</p>
                </div>
                <Badge className="bg-white text-teal-600 border border-teal-100 font-bold text-[9px] shadow-sm">VERIFIED</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom Right: Performance/System Health */}
        <Card className="lg:col-span-3 border-none shadow-sm ring-1 ring-slate-100 bg-teal-900 text-white">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Integrity</CardTitle>
            <CardDescription className="text-teal-300">Live platform health status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-800 flex items-center justify-center text-teal-400">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-2xl font-black">99.9%</p>
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Uptime</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-teal-400" />
                  <span className="text-xs font-medium">SSL Encryption</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-teal-400" />
                  <span className="text-xs font-medium">Auto Backups</span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>
              </div>
              <Button className="w-full bg-teal-800 hover:bg-teal-700 border-none text-[10px] font-black tracking-widest uppercase py-6">
                Run Diagnostics
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Access Grid - Floating style */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 px-2">
        {[
          { label: "Universities", icon: Building2, href: "/dashboard/university" },
          { label: "Programs", icon: BookOpen, href: "/dashboard/courses" },
          { label: "Students", icon: Users, href: "/dashboard/users" },
          { label: "Analytics", icon: BarChart3, href: "#" },
          { label: "Locations", icon: MapPin, href: "/dashboard/cities" },
          { label: "Settings", icon: Compass, href: "/dashboard/settings" },
        ].map((item, i) => (
          <Link href={item.href} key={i}>
            <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl ring-1 ring-slate-100 hover:ring-teal-200 hover:shadow-xl hover:shadow-teal-100/20 transition-all duration-300">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-teal-600 hover:text-white transition-colors duration-500">
                <item.icon size={22} />
              </div>
              <p className="text-[11px] font-extrabold text-slate-700 uppercase tracking-tighter">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
