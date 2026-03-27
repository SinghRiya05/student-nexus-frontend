"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Flag, 
  Navigation2,
  Languages,
  Info 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CountryFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function CountryForm({ initialData, isEditing }: CountryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    capital: initialData?.capital || "",
    region: initialData?.region || "",
    currency: initialData?.currency || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API CALL PLACE: Create/Update country
    console.log("Submitting country:", formData);
    router.push("/dashboard/countries");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
            {isEditing ? "Edit Country" : "Add New Country"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update country identity, capital, and regional settings."
              : "Register a new country in the system to enable geographical features."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Country Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={14} className="text-indigo-500" />
                  Country Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. United Kingdom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* ISO Code */}
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Flag size={14} className="text-indigo-500" />
                  ISO Code (3 letters)
                </Label>
                <Input
                  id="code"
                  placeholder="e.g. GBR"
                  maxLength={3}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11 font-mono uppercase"
                  required
                />
              </div>

              {/* Capital City */}
              <div className="space-y-2">
                <Label htmlFor="capital" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Navigation2 size={14} className="text-indigo-500" />
                  Capital City
                </Label>
                <Input
                  id="capital"
                  placeholder="e.g. London"
                  value={formData.capital}
                  onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label htmlFor="region" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={14} className="text-indigo-500" />
                  Region
                </Label>
                <Input
                  id="region"
                  placeholder="e.g. Europe, Asia"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Languages size={14} className="text-indigo-500" />
                  Currency Code
                </Label>
                <Input
                  id="currency"
                  placeholder="e.g. GBP, USD"
                  maxLength={3}
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11 font-mono uppercase"
                  required
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
                {isEditing ? "Update Country" : "Add Country"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Informational Note */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-900">Geographical Data</h4>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Country settings affect localizations, state assignments, and university distributions across the platform.
            Ensure ISO codes are accurate for third-party API integrations.
          </p>
        </div>
      </div>
    </div>
  );
}
