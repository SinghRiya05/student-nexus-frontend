"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Plus, 
  Users, 
  Mail, 
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const users = [
  {
    id: "1",
    name: "Aarav Sharma",
    email: "aarav@university.edu",
    role: "Admin",
    status: "Active",
    joinedDate: "2026-01-10",
  },
  {
    id: "2",
    name: "Ishani Gupta",
    email: "ishani@university.edu",
    role: "Teacher",
    status: "Active",
    joinedDate: "2026-02-15",
  },
  {
    id: "3",
    name: "Vihaan Reddy",
    email: "vihaan@student.edu",
    role: "Student",
    status: "Pending",
    joinedDate: "2026-03-01",
  },
  {
    id: "4",
    name: "Ananya Iyer",
    email: "ananya@university.edu",
    role: "Support",
    status: "Disabled",
    joinedDate: "2025-12-20",
  },
  {
    id: "5",
    name: "Kabir Verma",
    email: "kabir@student.edu",
    role: "Student",
    status: "Active",
    joinedDate: "2026-03-05",
  },
];

export default function UserList() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Users size={18} className="font-semibold" />
              <span className="text-xs font-bold uppercase tracking-wider">Access Control</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">User Directory</CardTitle>
            <CardDescription className="text-slate-500">Manage system users, assigned roles and account permissions.</CardDescription>
          </div>
          <div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 h-12 rounded-xl transition-all hover:scale-[1.02]">
              <Plus className="mr-2 h-5 w-5" />
              Invite New User
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Users Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">System Users</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Total: {users.length} users registered</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  className="bg-slate-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 transition-all w-64"
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[300px] font-bold text-slate-700 py-4">Full Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Role</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="font-bold text-slate-700">Joined Date</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="text-slate-900 font-bold block">{user.name}</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <Mail size={10} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className={
                            user.role === 'Admin' ? 'text-amber-500' : 
                            user.role === 'Teacher' ? 'text-emerald-500' :
                            'text-slate-400'
                          } />
                          <span className="text-sm font-semibold text-slate-700">{user.role}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest border ${
                        user.status === "Active" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : user.status === "Pending"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        {user.status === "Active" && <CheckCircle2 size={10} />}
                        {user.status === "Pending" && <Clock size={10} />}
                        {user.status === "Disabled" && <XCircle size={10} />}
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium italic text-sm">
                       {user.joinedDate}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full">
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-xl border-slate-100 p-1">
                          <DropdownMenuLabel className="text-[0.65rem] text-slate-400 px-3 py-2 uppercase font-black tracking-widest">User Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                            Edit Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
