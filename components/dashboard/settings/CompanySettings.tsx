"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Save, 
  Landmark,
  ShieldCheck,
  Calendar,
  Layers,
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function CompanySettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Company Settings</h1>
        <p className="text-slate-500">Manage your organization's identity, branding and details.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 bg-indigo-50/30">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm ring-1 ring-slate-100">
                  <Landmark size={32} className="text-indigo-600" />
               </div>
               <div className="space-y-1">
                  <CardTitle className="text-2xl font-black text-slate-900">Student Nexus Corp</CardTitle>
                  <CardDescription className="text-slate-500 font-medium">Educational Management Platform</CardDescription>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Organization Name</Label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="Student Nexus" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50 font-bold" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Official Website</Label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="studentnexus.edu" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50 text-indigo-600 font-semibold" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Registration Number</Label>
                  <div className="relative">
                    <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="EDU-2025-X092" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50 font-mono" />
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Headquarters Address</Label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="Silicon Valley, San Francisco" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Incorporation Date</Label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="January 12, 2025" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sector</Label>
                  <div className="relative">
                    <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input defaultValue="EdTech / Higher Education" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                  </div>
               </div>
            </div>
          </CardContent>
          
          <CardHeader className="px-8 py-4 border-t border-slate-50 bg-slate-50/20">
             <CardTitle className="text-sm font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                Legal Documents
             </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border-2 border-dashed border-indigo-100 flex items-center justify-between group hover:border-indigo-300 transition-all cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-800">Business_License.pdf</span>
                   </div>
                   <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">View</Button>
                </div>
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-between group hover:border-indigo-300 transition-all cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-500">Tax_Compliance_2025.pdf</span>
                   </div>
                   <Button variant="ghost" size="sm" className="text-slate-400 font-bold">View</Button>
                </div>
             </div>
          </CardContent>

          <CardFooter className="p-8 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
             <Button variant="ghost" className="h-12 px-6 font-black uppercase text-[0.7rem] tracking-widest text-slate-500 rounded-xl">Discard Changes</Button>
             <Button className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-black uppercase text-[0.7rem] tracking-widest transition-all active:scale-95">
                <Save size={16} className="mr-2" />
                Update Information
             </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
