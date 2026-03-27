"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Camera,
  Shield,
  BellRing
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function ProfileSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
        <p className="text-slate-500">Update your personal information and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white overflow-hidden text-center p-8">
            <div className="relative inline-block mx-auto group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 ring-4 ring-white">
                RS
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-indigo-600 hover:text-indigo-700 transition-all hover:scale-110">
                <Camera size={18} />
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold text-slate-900">Riya Singh</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Administrator</p>
            </div>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
               <Shield size={18} className="text-indigo-600" />
               <h4 className="font-bold text-sm">Security Level</h4>
            </div>
            <div className="flex items-center justify-between text-xs">
               <span className="text-slate-500 font-medium">Account Status</span>
               <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">Verified</span>
            </div>
            <div className="flex items-center justify-between text-xs">
               <span className="text-slate-500 font-medium">Last Login</span>
               <span className="text-slate-700 font-bold">Today, 2:45 PM</span>
            </div>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900">Personal Information</CardTitle>
              <CardDescription>Configure your primary identity details.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold uppercase text-slate-400 tracking-wider">First Name</Label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input id="firstName" defaultValue="Riya" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold uppercase text-slate-400 tracking-wider">Last Name</Label>
                  <Input id="lastName" defaultValue="Singh" className="h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email Address</Label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" defaultValue="riya@university.edu" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-400 tracking-wider">Phone Number</Label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input id="phone" defaultValue="+1 (555) 000-0000" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold uppercase text-slate-400 tracking-wider">Location</Label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input id="location" defaultValue="California, USA" className="pl-9 h-11 border-slate-200 focus:border-indigo-400 bg-slate-50/50" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
               <Button variant="ghost" className="h-11 px-6 font-bold text-slate-500 rounded-xl">Cancel</Button>
               <Button className="h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 font-bold tracking-tight transition-all active:scale-95">
                  <Save size={16} className="mr-2" />
                  Save Profile
               </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden p-6">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h4 className="font-bold text-slate-900 flex items-center gap-2">
                     <BellRing size={18} className="text-indigo-600" />
                     Email Notifications
                   </h4>
                   <p className="text-xs text-slate-400">Receive activity reports and security alerts.</p>
                </div>
                <div className="h-6 w-11 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                   <div className="h-4 w-4 bg-white rounded-full absolute right-1" />
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
