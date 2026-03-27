"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Info, 
  Search,
  CheckCircle2,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RoleFormProps {
  initialData?: any;
  isEditing?: boolean;
}

// Mock permissions for assignment
const availablePermissions = [
  { id: "1", name: "user.view", module: "User" },
  { id: "2", name: "user.create", module: "User" },
  { id: "3", name: "user.edit", module: "User" },
  { id: "4", name: "user.delete", module: "User" },
  { id: "5", name: "role.view", module: "Role" },
  { id: "6", name: "role.manage", module: "Role" },
  { id: "7", name: "course.view", module: "Course" },
  { id: "8", name: "course.create", module: "Course" },
  { id: "9", name: "course.edit", module: "Course" },
  { id: "10", name: "semester.manage", module: "Semester" },
];

export default function RoleForm({ initialData, isEditing }: RoleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    permissions: initialData?.permissions || [],
  });
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPermissions = availablePermissions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePermission = (permissionId: string) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id: string) => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: perms };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API CALL PLACE: Create/Update role and assign permissions
    console.log("Submitting role:", formData);
    router.push("/dashboard/roles");
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
            {isEditing ? "Edit Role" : "Create New Role"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Modify role identity and update granular permissions."
              : "Define a new system role and assign specific access permissions."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Role Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Role Identity</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Administrator, Teacher"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-slate-200 focus:ring-indigo-500 h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Short Description
                  </Label>
                  <textarea
                    id="description"
                    placeholder="Briefly describe what this role is for..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-indigo-900">Permissions Logic</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Permissions are additive. Users assigned to this role will gain access to all checked modules.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Permission Assignment */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col h-full min-h-[500px]">
              <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <h3 className="font-bold text-slate-900">Assign Permissions</h3>
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <Input 
                    placeholder="Search permissions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 rounded-lg border-slate-200 text-xs"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 p-0">
                <div className="divide-y divide-slate-50">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((permission) => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between p-4 px-8 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                            className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                          <div className="space-y-0.5">
                            <label 
                              htmlFor={permission.id}
                              className="text-sm font-bold text-slate-800 cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                {permission.module}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Shield size={14} className="text-slate-300" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-sm text-slate-400 italic">No permissions found matching "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-8">
                <span>Selected: {formData.permissions.length}</span>
                <span>Total Available: {availablePermissions.length}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl border-slate-200 text-slate-600 hover:bg-white px-8 h-12 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-12 h-12 font-semibold shadow-lg shadow-indigo-100"
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
