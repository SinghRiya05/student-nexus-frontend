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
  GraduationCap, 
  MapPin, 
  Globe, 
  Link as LinkIcon,
  Search,
  LayoutGrid
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const universities = [
  {
    id: "1",
    name: "Stanford University",
    location: "California, USA",
    website: "stanford.edu",
    type: "Private",
    rank: "#1",
    established: "1885",
  },
  {
    id: "2",
    name: "Harvard University",
    location: "Massachusetts, USA",
    website: "harvard.edu",
    type: "Private",
    rank: "#2",
    established: "1636",
  },
  {
    id: "3",
    name: "University of Oxford",
    location: "Oxford, UK",
    website: "ox.ac.uk",
    type: "Public",
    rank: "#3",
    established: "1096",
  },
  {
    id: "4",
    name: "MIT",
    location: "Massachusetts, USA",
    website: "web.mit.edu",
    type: "Private",
    rank: "#4",
    established: "1861",
  },
  {
    id: "5",
    name: "University of Cambridge",
    location: "Cambridge, UK",
    website: "cam.ac.uk",
    type: "Public",
    rank: "#5",
    established: "1209",
  },
];

export default function UniversityList() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <GraduationCap size={18} className="font-semibold" />
              <span className="text-xs font-bold uppercase tracking-wider">Institution Management</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Universities</CardTitle>
            <CardDescription className="text-slate-500">Manage global universities, their rankings and institutional details.</CardDescription>
          </div>
          <div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 h-12 rounded-xl transition-all hover:scale-[1.02]">
              <Plus className="mr-2 h-5 w-5" />
              Add University
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* University Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800">Global Institutions</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Total: {universities.length} institutions listed</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search university..." 
                  className="bg-slate-50 border-none rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-indigo-500 transition-all w-64"
                />
             </div>
            <Button variant="outline" size="sm" className="rounded-lg h-9">
              <LayoutGrid size={14} className="mr-2" />
              Grid View
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[350px] font-bold text-slate-700 py-4">University Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Location</TableHead>
                  <TableHead className="font-bold text-slate-700">Website</TableHead>
                  <TableHead className="font-bold text-slate-700">Type</TableHead>
                  <TableHead className="font-bold text-slate-700">Established</TableHead>
                  <TableHead className="font-bold text-slate-700 text-center">World Rank</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((uni) => (
                  <TableRow key={uni.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                           <span className="text-slate-900 font-semibold block">{uni.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        {uni.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a href={`https://${uni.website}`} target="_blank" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
                        <LinkIcon size={14} />
                        {uni.website}
                      </a>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        uni.type === "Private" 
                        ? "bg-amber-50 text-amber-700 border border-amber-100" 
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {uni.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600 font-medium">{uni.established}</span>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold">
                          {uni.rank}
                       </span>
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
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                            Edit University
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                            Delete Entry
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
