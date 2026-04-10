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
  Shield,
  Info,
  Layers
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { useAppDispatch } from "@/utils/hook";
import { createPermission, updatePermission } from "@/features/permissions/permissionThunk";
import toast from "react-hot-toast";

interface PermissionFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const modules = [
  "User",
  "Role",
  "Permission",
  "University",
  "Course",
  "Semester",
  "Country",
  "State",
  "Post",
  "Comment",
  "Professor",
  "Scholarship",
  "Application"
];

export default function PermissionForm({ initialData, isEditing }: PermissionFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = React.useState({
    name: "",
    module: "",
    description: "",
  });

  // Sync props to state when initialData is available or changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        module: initialData.module || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      dispatch(updatePermission({ id: initialData._id, permissionData: formData }));
      toast.success("Permission updated successfully");
    } else {
      dispatch(createPermission(formData));
      toast.success("Permission created successfully");
    }

    router.push("/dashboard/permissions");
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
            {isEditing ? "Edit Permission" : "Create New Permission"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update the details and module assignment for this permission."
              : "Define a new granular permission and assign it to a module."}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Permission Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Shield size={14} className="text-indigo-500" />
                  Permission Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. user.create, course.delete"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                  required
                />
                <p className="text-[10px] text-slate-400 font-medium italic">
                  Format typically follows module.action (e.g. student.view)
                </p>
              </div>

              {/* Module Selection */}
              <div className="space-y-2">
                <Label htmlFor="module" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Layers size={14} className="text-indigo-500" />
                  Associated Module
                </Label>
                <Select
                  value={formData.module}
                  onValueChange={(val) => setFormData({ ...formData, module: val })}
                  required
                >
                  <SelectTrigger className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500 bg-white">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {modules.map((mod) => (
                      <SelectItem key={mod} value={mod} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                        {mod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Info size={14} className="text-indigo-500" />
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Explain what this permission allows a user to do..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"

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
                {isEditing ? "Update Permission" : "Save Permission"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">Permission Context</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Permissions are the most granular access level. Once defined, they can be assigned to multiple roles.
            Changing a permission name might affect existing role assignments if not handled via ID.
          </p>
        </div>
      </div>
    </div>
  );
}
