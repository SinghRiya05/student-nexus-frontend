import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Globe, 
  CalendarCheck, 
  TrendingUp, 
  Plus,
  Compass,
  Building2,
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Universities",
      value: "156",
      icon: GraduationCap,
      description: "+4 from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Courses",
      value: "1,240",
      icon: BookOpen,
      description: "+12% increase",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Total Students",
      value: "45,231",
      icon: Users,
      description: "+2.5k new signups",
      color: "text-violet-600",
      bgColor: "bg-violet-50"
    },
    {
      title: "Supported Countries",
      value: "42",
      icon: Globe,
      description: "Across 6 continents",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            <Plus size={16} />
            Quick Action
          </Button>
          <Button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Compass size={16} />
            Explore Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon size={18} className={stat.color} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity or Chart Placeholder */}
        <Card className="col-span-full lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>
              A summary of the platform's key performance indicators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
              <div className="text-center space-y-2">
                <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mx-auto mb-2">
                  <TrendingUp className="text-indigo-500" size={24} />
                </div>
                <p className="text-sm font-medium text-slate-600">Activity Chart Placeholder</p>
                <p className="text-xs text-slate-400">Data visualization will appear here.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Management */}
        <Card className="col-span-full lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Quick Management</CardTitle>
            <CardDescription>
              Access key administrative tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Manage Universities", icon: Building2, desc: "Update list of partnered institutions" },
              { label: "Course Catalog", icon: BookOpen, desc: "Review and edit available courses" },
              { label: "Regional Settings", icon: MapPin, desc: "Configure countries and states" },
              { label: "User Access", icon: Users, desc: "Manage permissions and roles" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                  <item.icon size={18} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
