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
  Lock,
  Search,
  Edit2,
  Trash2,
  Shield
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

const permissions = [
  {
    id: "1",
    name: "user.create",
    description: "Allows creating new users in the system.",
    module: "User",
  },
  {
    id: "2",
    name: "user.edit",
    description: "Allows editing existing user details.",
    module: "User",
  },
  {
    id: "3",
    name: "course.create",
    description: "Allows creating new courses.",
    module: "Course",
  },
  {
    id: "4",
    name: "course.delete",
    description: "Allows deleting courses from the system.",
    module: "Course",
  },
  {
    id: "5",
    name: "role.manage",
    description: "Allows managing system roles and permissions.",
    module: "Role",
  },
];

export default function PermissionList() {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <Lock size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Access Control
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Permissions Directory</h2>

          <p className="text-sm text-slate-500">
            Manage granular system permissions and their associated modules.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72">
            <Search size={16} className="ml-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search permissions..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Link href="/dashboard/permissions/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Create Permission
            </Button>
          </Link>
        </div>
      </div>

      {/* Permissions Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary ">
                <TableRow className="hover:bg-transparent border-slate-100 ">
                  <TableHead className="font-bold text-white py-4 min-w-[200px]">Permission Name</TableHead>
                  <TableHead className="font-bold text-white">Description</TableHead>
                  <TableHead className="font-bold text-white">Module</TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow
                    key={permission.id}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-indigo-100">
                          <Shield size={14} />
                        </div>
                        <span className="text-slate-900 font-bold block">
                          {permission.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm max-w-md">
                      {permission.description}
                    </TableCell>
                    <TableCell>
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded text-xs font-black uppercase tracking-widest border border-indigo-100">
                        {permission.module}
                      </span>
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
                            Permission Actions
                          </DropdownMenuLabel>
                          <Link href={`/dashboard/permissions/edit/${permission.id}`}>
                            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                              <Edit2 size={14} className="mr-2" />
                              Edit Permission
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                            <Trash2 size={14} className="mr-2" />
                            Delete Permission
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
              Total: {filteredPermissions.length} permissions defined
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
