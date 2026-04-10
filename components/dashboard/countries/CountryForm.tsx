"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { createCountry, updateCountry } from "@/features/location/countryThunk";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Save,
  Globe,
  Flag,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const countrySchema = z.object({
  name: z.string().min(2, { message: "Country name must be at least 2 characters." }),
  code: z.string().length(3, { message: "ISO code must be exactly 3 characters." }),
  isActive: z.boolean(),
});

type CountryFormValues = z.infer<typeof countrySchema>;

interface CountryFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function CountryForm({ initialData, isEditing }: CountryFormProps) {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.country);

  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      isActive: initialData?.isActive ?? true,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: CountryFormValues) => {
    try {
      if (isEditing) {
        await dispatch(updateCountry({ id: initialData._id, data: values })).unwrap();
        toast.success("Country updated successfully!");
      } else {
        await dispatch(createCountry(values)).unwrap();
        toast.success("Country created successfully!");
      }
      router.push("/dashboard/countries");
    } catch (err: any) {
      toast.error(err || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? "Edit Country" : "Add New Country"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update country identity and status settings."
              : "Register a new country in the system to enable geographical features."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm overflow-hidden rounded-3xl border border-slate-100">
        <CardContent className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* Country Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                          <Globe size={14} />
                        </div>
                        Country Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. United Kingdom"
                          {...field}
                          className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-12 px-4 transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                {/* ISO Code */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                          <Flag size={14} />
                        </div>
                        ISO Code (3 letters)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. GBR"
                          maxLength={3}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          className="rounded-2xl border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-12 px-4 font-mono uppercase tracking-widest transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-3xl border border-slate-100 p-6 bg-slate-50/50 transition-all hover:bg-slate-50">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-bold text-slate-800 flex items-center gap-2">
                        {field.value ? (
                          <CheckCircle2 className="text-emerald-500 h-5 w-5" />
                        ) : (
                          <XCircle className="text-slate-400 h-5 w-5" />
                        )}
                        Active Status
                      </FormLabel>
                      <FormDescription className="text-sm text-slate-500">
                        {field.value
                          ? "This country will be visible and selectable across the platform."
                          : "This country will be hidden from new selections."}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex items-center scale-125">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded-lg border-2 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all duration-300"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 px-8 h-12 font-bold transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 h-12 font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Country" : "Add Country"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Informational Note */}
      <div className="bg-linear-to-br from-indigo-50 to-white rounded-3xl p-8 border border-indigo-100 flex gap-6 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-500 shadow-md transform -rotate-12 transition-transform hover:rotate-0">
          <Info size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-bold text-indigo-950">Geographical Precision</h4>
          <p className="text-sm text-indigo-700/80 leading-relaxed max-w-2xl">
            Accurate country data is the foundation of our global directory. ISO codes are synchronized with
            international standards to ensure seamless integration with currency exchange and localization services.
          </p>
        </div>
      </div>
    </div>
  );
}
