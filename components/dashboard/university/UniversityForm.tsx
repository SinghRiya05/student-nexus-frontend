"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Save, 
  Building2, 
  Globe, 
  MapPin, 
  Search,
  Link as LinkIcon,
  Info 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UniversityFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const mockCountries = [
  { id: "1", name: "United States" },
  { id: "2", name: "India" },
  { id: "3", name: "United Kingdom" },
];

const mockStates = [
  { id: "1", name: "California", countryId: "1" },
  { id: "2", name: "Maharashtra", countryId: "2" },
  { id: "3", name: "London", countryId: "3" },
];

export default function UniversityForm({ initialData, isEditing }: UniversityFormProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    countryId: initialData?.countryId || "",
    stateId: initialData?.stateId || "",
    website: initialData?.website || "",
    logo: initialData?.logo || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API CALL PLACE: Create/Update university
    console.log("Submitting university:", formData);
    router.push("/dashboard/university");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group -ml-3 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to List
          </Button>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit University" : "Add New University"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update university profile, location, and institutional links."
              : "Register a new higher education institution to the platform directory."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* University Name */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building2 size={14} className="text-indigo-500" />
                  University Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Stanford University"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={14} className="text-indigo-500" />
                  Country
                </Label>
                <Select
                  value={formData.countryId}
                  onValueChange={(val) => setFormData({ ...formData, countryId: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {mockCountries.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State Selection */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-500" />
                  State / Province
                </Label>
                <Select
                  value={formData.stateId}
                  onValueChange={(val) => setFormData({ ...formData, stateId: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {mockStates
                      .filter(s => s.countryId === formData.countryId)
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                          {s.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <LinkIcon size={14} className="text-indigo-500" />
                  Official Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.university.edu"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                />
              </div>

              {/* Logo URL */}
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Search size={14} className="text-indigo-500" />
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  placeholder="https://image-url.com/logo.png"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-8 h-12 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-indigo-100"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update University" : "Add University"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Help Note */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-900">University Profile</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Registering a university allows students to associate their academic records and enables campus-specific features.
            Ensure the website URL is valid for automated verification.
          </p>
        </div>
      </div>
    </div>
  );
}
