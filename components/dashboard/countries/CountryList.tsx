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
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
  MoreHorizontal,
  Plus,
  Globe,
  MapPin,
  Navigation2,
  Flag,
  Languages,
  Search
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { fetchCountries, deleteCountry } from "@/features/location/countryThunk";
import toast from "react-hot-toast";

export default function CountryList() {
  const dispatch = useAppDispatch();
  const { countries, loading, error, success } = useAppSelector((state) => state.country);
  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCountry(id)).unwrap();
      toast.success("Country deleted successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to delete country.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <Globe size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Geographic Management
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Countries</h2>

          <p className="text-sm text-slate-500">
            Manage supported countries, regional settings and currencies.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-between md:justify-end">
          {/* Search Bar */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-72">
            <Search size={16} className="ml-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search countries..."
              className="flex-1 px-2 py-2 outline-none text-sm bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Create Button */}
          <Link href="/dashboard/countries/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 h-10 rounded-lg whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </Link>
        </div>
      </div>

      {/* Countries Table Section */}
      <Card className="border-none shadow-sm bg-white overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-[280px] font-bold text-white py-4">
                    Country Name
                  </TableHead>
                  <TableHead className="font-bold text-white">Code</TableHead>
                  <TableHead className="font-bold text-white">Active</TableHead>
                  <TableHead className="text-right font-bold text-white pr-8">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCountries.map((country) => (
                  <TableRow
                    key={country._id}
                    className="group hover:bg-slate-50/50 transition-colors border-slate-100"
                  >
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors capitalize font-bold text-xs ring-1 ring-indigo-100">
                          {country.code.substring(0, 2)}
                        </div>
                        <span className="text-slate-900 font-semibold">
                          {country.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-xs font-bold">
                        {country.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono text-xs font-bold">
                        {country.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-slate-200/50 rounded-full"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] rounded-xl shadow-xl border-slate-100 p-1"
                        >
                          <DropdownMenuLabel className="text-xs text-slate-400 px-3 py-2 uppercase font-bold tracking-tight">
                            Actions
                          </DropdownMenuLabel>
                          <Link href={`/dashboard/countries/edit/${country._id}`}>
                            <DropdownMenuItem className="rounded-lg px-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer">
                              Edit Details
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(country._id)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
                          >
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
          <div className="p-5">
            <p className="text-sm text-slate-400 ">
              Total: {filteredCountries.length} countries active
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

