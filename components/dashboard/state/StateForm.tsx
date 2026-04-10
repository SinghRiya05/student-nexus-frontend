"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
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
  MapPin,
  Globe,
  Info,
  Layers
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCountries } from "@/features/location/countryThunk";
import { createState, updateState } from "@/features/location/StateThunk";
import toast from "react-hot-toast";

interface StateFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function StateForm({ initialData, isEditing }: StateFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { countries } = useAppSelector((state) => state.country);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    countryId: typeof initialData?.countryId === 'object' 
      ? initialData.countryId._id 
      : initialData?.countryId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        await dispatch(updateState({ 
          id: initialData._id, 
          stateData: formData 
        })).unwrap();
        toast.success("State updated successfully");
      } else {
        await dispatch(createState(formData)).unwrap();
        toast.success("State created successfully");
      }
      router.push("/dashboard/state");
    } catch (error: any) {
      toast.error(error || "Failed to save state");
    } finally {
      setIsSubmitting(false);
    }
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
            {isEditing ? "Edit State/Province" : "Add New State/Province"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update state details and its country association."
              : "Register a new administrative division under a specific country."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* State Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={14} className="text-indigo-500" />
                  State Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. California"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
              </div>

              {/* Country Selection */}
              <div className="space-y-4">
                <Label htmlFor="country" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={14} className="text-indigo-500" />
                  Associated Country
                </Label>
                <Select
                  value={formData.countryId}
                  onValueChange={(val) => setFormData({ ...formData, countryId: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {countries.map((country) => (
                      <SelectItem key={country._id} value={country._id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-indigo-100 min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update State" : "Add State"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Note */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">Regional Hierarchy</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            States are linked to countries. This hierarchy is used to filter universities and campus locations correctly for students.
          </p>
        </div>
      </div>
    </div>
  );
}

