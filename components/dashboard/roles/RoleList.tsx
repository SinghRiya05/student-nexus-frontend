"use client";

import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
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
import { deleteRole, getRoles } from "@/features/roles/roleThunk";
import toast from "react-hot-toast";

export default function RoleList() {
  const dispatch = useAppDispatch();
  const { roles, roleLoading, roleError } = useAppSelector((state) => state.role);

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteRole(id));
    toast.success("Role deleted successfully");
  }
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
                  <TableHead className="font-bold text-white">Created At</TableHead>
                  <TableHead className="font-bold text-white">Status</TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow
                    key={role._id}
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
                    <TableCell className="text-slate-600 text-sm max-w-md">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm max-w-md">
                      {role.status}
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
                          <Link href={`/dashboard/roles/edit/${role._id}`}>
                            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                              <Edit2 size={14} className="mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/dashboard/roles/edit/${role._id}/permissions`}>
                            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-semibold focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                              <Edit2 size={14} className="mr-2" />
                              Manage Permissions
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem onClick={() => handleDelete(role._id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
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
