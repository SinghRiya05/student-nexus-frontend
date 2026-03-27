"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

interface RolePermissionDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role?: any;
}

const modules = [
  { id: "users", name: "User Management" },
  { id: "roles", name: "Roles & Permissions" },
  { id: "university", name: "University Management" },
  { id: "courses", name: "Course Management" },
  { id: "semester", name: "Semester Management" },
  { id: "countries", name: "Country Management" },
  { id: "state", name: "State Management" },
];

const permissionTypes = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

export default function RolePermissionDialog({
  isOpen,
  setIsOpen,
  role,
}: RolePermissionDialogProps) {
  const [roleName, setRoleName] = React.useState(role?.name || "");
  const [roleDescription, setRoleDescription] = React.useState(role?.description || "");
  const [permissions, setPermissions] = React.useState<Record<string, string[]>>(
    role?.permissions_map || {}
  );

  React.useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setRoleDescription(role.description);
      // Mocking a more structured permission map if it doesn't exist
      setPermissions(role.permissions_map || {});
    } else {
      setRoleName("");
      setRoleDescription("");
      setPermissions({});
    }
  }, [role]);

  const togglePermission = (moduleId: string, permissionId: string) => {
    setPermissions((prev) => {
      const modulePerms = prev[moduleId] || [];
      if (modulePerms.includes(permissionId)) {
        return {
          ...prev,
          [moduleId]: modulePerms.filter((p) => p !== permissionId),
        };
      } else {
        return {
          ...prev,
          [moduleId]: [...modulePerms, permissionId],
        };
      }
    });
  };

  const handleSave = () => {
    // API CALL PLACE: Save role and permissions
    console.log("Saving role:", { roleName, roleDescription, permissions });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ShieldCheck size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {role ? "Edit Role Permissions" : "Create New Role"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Define access levels for each module in the system.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6 pb-6">
            {/* Basic Info */}
            <div className="grid gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="roleName" className="text-sm font-bold text-slate-700">
                  Role Name
                </Label>
                <Input
                  id="roleName"
                  placeholder="e.g. Senior Manager, Course Coordinator"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700">
                  Role Description
                </Label>
                <Input
                  id="description"
                  placeholder="What is this role responsible for?"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            {/* Permissions Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  Module Permissions
                </h3>
                <div className="flex gap-4 pr-2">
                  {permissionTypes.map((type) => (
                    <span key={type.id} className="text-[10px] font-bold text-slate-400 w-12 text-center uppercase tracking-tighter">
                      {type.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        <Shield size={14} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {module.name}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      {permissionTypes.map((type) => (
                        <div key={type.id} className="w-12 flex justify-center">
                          <Checkbox
                            id={`${module.id}-${type.id}`}
                            checked={(permissions[module.id] || []).includes(type.id)}
                            onCheckedChange={() => togglePermission(module.id, type.id)}
                            className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex sm:justify-between items-center gap-4">
          <p className="text-xs text-slate-400 hidden sm:block">
            Existing users with this role will be updated instantly.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-white px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 shadow-lg shadow-indigo-100"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
