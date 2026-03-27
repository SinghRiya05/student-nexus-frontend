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
  ShieldCheck,
  Search,
  CheckCircle2,
  Edit2,
  Trash2
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

const roles = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all modules and settings.",
    userCount: 5,
    status: "Active",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Teacher",
    description: "Access to courses, students, and semester management.",
    userCount: 12,
    status: "Active",
    permissions: ["courses_view", "courses_edit", "students_view", "semester_view"],
  },
  {
    id: "3",
    name: "Student",
    description: "Limited access to own courses and profile.",
    userCount: 120,
    status: "Active",
    permissions: ["courses_view", "profile_view"],
  },
  {
    id: "4",
    name: "Support",
    description: "Access to user management and troubleshooting tools.",
    userCount: 3,
    status: "Active",
    permissions: ["users_view", "users_edit", "support_tools"],
  },
];

export default function RoleList() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <ShieldCheck size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Access Management
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Roles & Permissions</h2>

          <p className="text-sm text-slate-500">
            Define system roles and assign specific module permissions.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72">
            <Search size={16} className="ml-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Link href="/dashboard/roles/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </Link>
        </div>
      </div>

      {/* Roles Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary ">
                <TableRow className="hover:bg-transparent border-slate-100 ">
                  <TableHead className="font-bold text-white py-4 min-w-[200px]">Role Name</TableHead>
                  <TableHead className="font-bold text-white">Description</TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow
                    key={role.id}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">
                          {role.name[0]}
                        </div>
                        <span className="text-slate-900 font-bold block">
                          {role.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm max-w-md">
                      {role.description}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[180px] rounded-xl shadow-xl border-slate-100 p-1"
                        >
                          <DropdownMenuLabel className="text-[0.65rem] text-slate-400 px-3 py-2 uppercase font-black tracking-widest">
                            Role Actions
                          </DropdownMenuLabel>
                          <Link href={`/dashboard/roles/edit/${role.id}`}>
                            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                              <Edit2 size={14} className="mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                            <Trash2 size={14} className="mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-5">
            <p className="text-sm text-slate-400 ">
              Total: {filteredRoles.length} roles defined
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
