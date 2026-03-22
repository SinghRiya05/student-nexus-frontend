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
  Globe, 
  MapPin, 
  Navigation2,
  Flag,
  Languages
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const countries = [
  {
    id: "1",
    name: "United States",
    code: "USA",
    capital: "Washington D.C.",
    region: "Americas",
    currency: "USD",
    states: "50",
  },
  {
    id: "2",
    name: "United Kingdom",
    code: "GBR",
    capital: "London",
    region: "Europe",
    currency: "GBP",
    states: "4",
  },
  {
    id: "3",
    name: "India",
    code: "IND",
    capital: "New Delhi",
    region: "Asia",
    currency: "INR",
    states: "28",
  },
  {
    id: "4",
    name: "Australia",
    code: "AUS",
    capital: "Canberra",
    region: "Oceania",
    currency: "AUD",
    states: "6",
  },
  {
    id: "5",
    name: "Singapore",
    code: "SGP",
    capital: "Singapore",
    region: "Asia",
    currency: "SGD",
    states: "1",
  },
];

export default function CountryList() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Globe size={18} className="font-semibold" />
              <span className="text-xs font-bold uppercase tracking-wider">Geographic Management</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Countries</CardTitle>
            <CardDescription className="text-slate-500">Manage supported countries, regional settings and currencies.</CardDescription>
          </div>
          <div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 h-12 rounded-xl transition-all hover:scale-[1.02]">
              <Plus className="mr-2 h-5 w-5" />
              Add Country
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Countries Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-xl font-semibold text-slate-800">Country Registry</CardTitle>
          <p className="text-sm text-slate-400 mt-1">Total: {countries.length} countries active</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[280px] font-bold text-slate-700 py-4">Country Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Code</TableHead>
                  <TableHead className="font-bold text-slate-700">Capital</TableHead>
                  <TableHead className="font-bold text-slate-700">Region</TableHead>
                  <TableHead className="font-bold text-slate-700">Currency</TableHead>
                  <TableHead className="font-bold text-slate-700 text-center">Sub-divisions</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {countries.map((country) => (
                  <TableRow key={country.id} className="group hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors capitalize font-bold text-xs ring-1 ring-indigo-100">
                          {country.code.substring(0, 2)}
                        </div>
                        <span className="text-slate-900 font-semibold">{country.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-xs font-bold">
                        {country.code}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                       {country.capital}
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-slate-500">
                          <Navigation2 size={12} />
                          {country.region}
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                          <Languages size={13} className="text-slate-400" />
                          {country.currency}
                       </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-700">
                       {country.states}
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
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer">
                            Remove Country
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
