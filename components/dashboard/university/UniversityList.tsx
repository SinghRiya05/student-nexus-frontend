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
  GraduationCap,
  MapPin,
  Globe,
  Link as LinkIcon,
  Search,
  LayoutGrid
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { deleteUniversity, getAllUniversities } from "@/features/university/universityThunk";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/loading";


export default function UniversityList() {

  const dispatch = useAppDispatch();
  const { universities, universityLoading } = useAppSelector((state) => state.university);

  useEffect(() => {
    dispatch(getAllUniversities());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this university?")) {
      dispatch(deleteUniversity(id)).unwrap();
      toast.success("University deleted successfully");
    }
  }

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <GraduationCap size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Institution Management
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Universities
          </h2>

          <p className="text-sm text-slate-500">
            Manage global universities, their rankings and institutional details.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">

          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72">
            <Search size={16} className="ml-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search universities..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Link href="/dashboard/university/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </Link>
        </div>
      </div>
      {/* University Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">

        <CardContent className="p-0">
          {universityLoading ? (
            <LoadingSpinner label="Fetching Universities..." />
          ) : filteredUniversities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Search size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900">No Universities Found</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                  Could not find any university matching your search query. Try a different term or create a new one.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table >
                  <TableHeader className="bg-primary ">
                    <TableRow className="hover:bg-transparent border-slate-100 ">
                      <TableHead className="w-[350px] font-bold text-white py-4">University Name</TableHead>
                      <TableHead className="font-bold text-white">Country</TableHead>
                      <TableHead className="font-bold text-white">State</TableHead>
                      <TableHead className="font-bold text-white">Domain</TableHead>

                      <TableHead className="text-right font-bold text-white pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUniversities.map((uni) => (
                      <TableRow key={uni._id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                        <TableCell className="font-medium py-5">
                          <div className="flex items-center gap-3">
                            {uni.logo ? (
                              <img
                                src={uni.logo}
                                alt={uni.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100 shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shrink-0 select-none group-hover:bg-indigo-700 transition-colors">
                                {uni.name.slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <span className="text-slate-900 font-semibold block">{uni.name}</span>
                              {uni.short_name && (
                                <span className="text-xs text-slate-400 font-medium">{uni.short_name}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={14} className="text-slate-400" />
                            {uni.country.name}
                          </div>
                        </TableCell>


                        <TableCell>
                          <span className="text-slate-600 font-medium">{uni.state.name}</span>
                        </TableCell>

                        <TableCell>
                          <a href={`http://${uni.domain}`} target="_blank" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
                            <LinkIcon size={14} />
                            {uni.domain}
                          </a>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200/50 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 text-slate-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-xl border-slate-100 p-1">
                              <DropdownMenuLabel className="text-xs text-slate-400 px-3 py-2 uppercase font-bold tracking-tight">Actions</DropdownMenuLabel>
                              <Link href={`/dashboard/university/edit/${uni._id}`}>
                                <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                                  Edit University
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/dashboard/university/edit/${uni._id}/assign-courses`}>
                                <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                                  Assign Courses
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator className="bg-slate-100" />
                              <DropdownMenuItem onClick={() => handleDelete(uni._id)} className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                                Delete University
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-5"><p className="text-sm text-slate-400 ">Total: {filteredUniversities.length} institutions listed</p></div>
            </>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
