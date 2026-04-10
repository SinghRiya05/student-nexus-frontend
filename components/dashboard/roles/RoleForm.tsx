"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createRole, updateRole } from "@/features/roles/roleThunk";
import toast from "react-hot-toast";

interface RoleFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function RoleForm({ initialData, isEditing }: RoleFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });

  // Sync props to state when initialData is available or changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateRole({ id: initialData._id, roleData: formData }))
      toast.success("Role updated successfully");
    } else {
      dispatch(createRole(formData))
      toast.success("Role created successfully");
    }
    router.push("/dashboard/roles");
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
            {isEditing ? "Edit Role" : "Create New Role"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Modify the role name and description."
              : "Define a new system role for organizing users."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Instructions/Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-indigo-900">Role Definition</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Roles are used to group users. Assign names that clearly indicate the user's primary function in the system.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">System Identity</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Each role must have a unique name. Descriptions help other administrators understand the intended audience.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-800">Role Details</h3>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-bold text-slate-700">
                    Role Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Administrator, Teacher, Student"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-slate-200 focus:ring-indigo-500 h-12 text-base"
                    required
                  />
                  <p className="text-[11px] text-slate-400 font-medium">This name will be displayed in user management views.</p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-bold text-slate-700">
                    Role Description
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Describe the responsibilities associated with this role..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-base bg-white transition-all hover:border-slate-300"

                  />
                  <p className="text-[11px] text-slate-400 font-medium">A clear description helps in accurate role assignment.</p>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="rounded-xl text-slate-500 hover:text-slate-900 px-8 h-12 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-12 h-12 font-semibold shadow-xl shadow-indigo-100/50"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
