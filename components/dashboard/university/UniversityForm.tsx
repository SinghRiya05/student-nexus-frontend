"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  GraduationCap,
  Globe,
  MapPin,
  Building2,
  Link as LinkIcon,
  Upload,
  X,
  Image as ImageIcon,
  Info,
  BadgeCheck,
} from "lucide-react";
import { fetchCountries } from "@/features/location/countryThunk";
import { getAllStates } from "@/features/location/StateThunk";
import { fetchCities } from "@/features/location/cityThunk";
import { createUniversity, updateUniversity } from "@/features/university/universityThunk";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
  short_name: string;
  domain: string;
  description: string;
  country: string;
  state: string;
  city: string;
  status: "ACTIVE" | "INACTIVE";
}

interface UniversityFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function UniversityForm({ initialData, isEditing }: UniversityFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  console.log(initialData)

  const { countries } = useAppSelector((s) => s.country);
  const { states } = useAppSelector((s) => s.state);
  const { cities } = useAppSelector((s) => s.city);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
      short_name: initialData?.short_name || "",
      domain: initialData?.domain || "",
      description: initialData?.description || "",
      country: typeof initialData?.country === "object" ? initialData.country._id : initialData?.country || "",
      state: typeof initialData?.state === "object" ? initialData.state._id : initialData?.state || "",
      city: typeof initialData?.city === "object" ? initialData.city._id : initialData?.city || "",
      status: (initialData?.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    },
  });

  const watchedCountry = watch("country");
  const watchedState = watch("state");

  // Fetch all location data on mount
  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(getAllStates());
    dispatch(fetchCities());
  }, [dispatch]);

  // Sync form + previews whenever initialData changes (e.g. after a successful update)
  useEffect(() => {
    if (!initialData) return;
    reset({
      name: initialData.name || "",
      short_name: initialData.short_name || "",
      domain: initialData.domain || "",
      description: initialData.description || "",
      country: typeof initialData.country === "object" ? initialData.country._id : initialData.country || "",
      state: typeof initialData.state === "object" ? initialData.state._id : initialData.state || "",
      city: typeof initialData.city === "object" ? initialData.city._id : initialData.city || "",
      status: (initialData.status as "ACTIVE" | "INACTIVE") || "ACTIVE",
    });
    // Sync image/logo previews
    setImagePreview(initialData.image || null);
    setLogoPreview(initialData.logo || null);
    setImageFile(null);
    setLogoFile(null);
  }, [initialData, reset]);

  // Reset state/city when country changes
  useEffect(() => {
    if (!isEditing) {
      setValue("state", "");
      setValue("city", "");
    }
  }, [watchedCountry]);

  // Reset city when state changes
  useEffect(() => {
    if (!isEditing) {
      setValue("city", "");
    }
  }, [watchedState]);

  const filteredStates = states.filter((s: any) => {
    if (!watchedCountry) return true;
    const stateCountryId = typeof s.countryId === "object" ? s.countryId._id : s.countryId;
    return stateCountryId === watchedCountry;
  });

  const filteredCities = cities.filter((c: any) => {
    if (!watchedState) return true;
    const cityStateId = typeof c.stateId === "object" ? c.stateId._id : c.stateId;
    return cityStateId === watchedState;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "logo") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "image") setImageFile(file);
    else setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image") setImagePreview(reader.result as string);
      else setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("short_name", data.short_name || "");
      fd.append("domain", data.domain || "");
      fd.append("description", data.description || "");
      fd.append("country", data.country);
      fd.append("state", data.state);
      fd.append("city", data.city);
      fd.append("status", data.status);

      if (imageFile) fd.append("image", imageFile);
      if (logoFile) fd.append("logo", logoFile);

      if (isEditing && initialData?._id) {
        await dispatch(updateUniversity({ id: initialData._id, formData: fd })).unwrap();
        toast.success("University updated successfully!");
      } else {
        await dispatch(createUniversity(fd)).unwrap();
        toast.success("University created successfully!");
      }
      router.push("/dashboard/university");
    } catch (err: any) {
      toast.error(err || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          type="button"
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
            ? "Update university details and associations."
            : "Register a new institution with full location and media details."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Basic Information ── */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <GraduationCap size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Basic Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                  University Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. University of Oxford"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("name", { required: "University name is required" })}
                />
                {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
              </div>

              {/* Short Name */}
              <div className="space-y-2">
                <Label htmlFor="short_name" className="text-sm font-semibold text-slate-700">
                  Short Name / Abbreviation
                </Label>
                <Input
                  id="short_name"
                  placeholder="e.g. Oxford, MIT, IIT"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("short_name")}
                />
              </div>

              {/* Domain / Website */}
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <LinkIcon size={13} className="text-indigo-400" /> Website / Domain
                </Label>
                <Input
                  id="domain"
                  placeholder="e.g. ox.ac.uk"
                  className="h-11 rounded-xl border-slate-200"
                  {...register("domain")}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <BadgeCheck size={13} className="text-indigo-400" /> Status
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="ACTIVE" className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            Active
                          </span>
                        </SelectItem>
                        <SelectItem value="INACTIVE" className="rounded-lg focus:bg-rose-50 focus:text-rose-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                            Inactive
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a brief overview of the university..."
                rows={3}
                className="rounded-xl border-slate-200 resize-none"
                {...register("description")}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Location ── */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <MapPin size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Location</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Country */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Globe size={13} className="text-indigo-400" /> Country <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60 overflow-y-auto">
                        {countries.map((c) => (
                          <SelectItem key={c._id} value={c._id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && <p className="text-xs text-rose-500">{errors.country.message}</p>}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin size={13} className="text-indigo-400" /> State <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="state"
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={!watchedCountry}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white disabled:opacity-50">
                        <SelectValue placeholder={watchedCountry ? "Select state" : "Select country first"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60 overflow-y-auto">
                        {filteredStates.map((s) => (
                          <SelectItem key={s._id} value={s._id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && <p className="text-xs text-rose-500">{errors.state.message}</p>}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Building2 size={13} className="text-indigo-400" /> City <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={!watchedState}>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white disabled:opacity-50">
                        <SelectValue placeholder={watchedState ? "Select city" : "Select state first"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60 overflow-y-auto">
                        {filteredCities.map((c: any) => (
                          <SelectItem key={c._id} value={c._id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.city && <p className="text-xs text-rose-500">{errors.city.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Media Uploads ── */}
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <ImageIcon size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Media</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Banner Image */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">Banner Image</Label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors group h-44 flex items-center justify-center bg-slate-50"
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Banner preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); if (imageInputRef.current) imageInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto group-hover:bg-indigo-100 transition-colors">
                        <Upload size={20} className="text-indigo-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">Click to upload banner</p>
                      <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "image")}
                />
              </div>

              {/* Logo */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">University Logo</Label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors group h-44 flex items-center justify-center bg-slate-50"
                >
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Logo preview" className="w-32 h-32 object-contain" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLogoPreview(null); setLogoFile(null); if (logoInputRef.current) logoInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center space-y-2 p-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto group-hover:bg-indigo-100 transition-colors">
                        <Upload size={20} className="text-indigo-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">Click to upload logo</p>
                      <p className="text-xs text-slate-400">PNG, SVG, WEBP — transparent preferred</p>
                    </div>
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "logo")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Help note ── */}
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <Info size={18} />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-amber-900">Location Cascade</h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              Selecting a country filters available states. Selecting a state filters available cities. Make sure your location data is set up correctly under Geographic Management.
            </p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-4 pt-2">
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 h-12 font-semibold shadow-lg shadow-indigo-100 min-w-[160px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update University" : "Create University"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
