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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ShieldCheck, User } from "lucide-react";

interface AssignRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user?: any;
}

const roles = [
  { id: "admin", name: "Admin" },
  { id: "teacher", name: "Teacher" },
  { id: "student", name: "Student" },
  { id: "support", name: "Support" },
];

export default function AssignRoleDialog({
  isOpen,
  setIsOpen,
  user,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = React.useState(user?.role?.toLowerCase() || "");

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role?.toLowerCase());
    }
  }, [user]);

  const handleSave = () => {
    // DUMMY ACTION: Currently only logging for simulation. 
    // We will decide later if this needs a separate page or a real API integration.
    console.log(`[DUMMY] Assigning role ${selectedRole} to user ${user?.firstName} ${user?.lastName}`);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Assign User Role
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Change the system role for this user.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-sm border border-slate-200">
              {user?.name?.[0] || <User size={20} />}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">{user?.name}</span>
              <span className="text-xs text-slate-500">{user?.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="role-select" className="text-sm font-bold text-slate-700">
              Select Role
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role-select" className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600">
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100"
            >
              Update Role
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
