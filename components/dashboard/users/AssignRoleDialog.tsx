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
import { ShieldCheck, User, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/utils/hook";
import { getRoles } from "@/features/roles/roleThunk";
import { assignRole } from "@/features/roles/roleThunk";
import { getAllUsers } from "@/features/users/userThunk";
import { toast } from "react-hot-toast";

interface AssignRoleDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user?: any;
}

export default function AssignRoleDialog({
  isOpen,
  setIsOpen,
  user,
}: AssignRoleDialogProps) {
  const dispatch = useAppDispatch();
  const { roles, roleLoading } = useAppSelector((state) => state.role);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);

  // Fetch roles on mount if not loaded
  React.useEffect(() => {
    if (roles.length === 0) {
      dispatch(getRoles());
    }
  }, [dispatch, roles.length]);

  // Pre-select the user's current role when dialog opens
  React.useEffect(() => {
    if (user?.roleId?._id) {
      setSelectedRoleId(user.roleId._id);
    } else {
      setSelectedRoleId("");
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedRoleId || !user?._id) return;
    setSaving(true);
    try {
      await dispatch(assignRole({ id: user._id, roleData: { roleId: selectedRoleId } })).unwrap();
      toast.success(`Role updated for ${user.firstName} ${user.lastName}`);
      dispatch(getAllUsers()); // Refresh user list to reflect the new role
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  };

  const currentRoleName = roles.find((r) => r._id === selectedRoleId)?.name;

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
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-sm border border-slate-200 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold uppercase">{user?.firstName?.[0] || <User size={20} />}</span>
              )}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-slate-500">{user?.email}</span>
              {user?.roleId?.name && (
                <span className="text-[0.65rem] font-black uppercase tracking-widest text-indigo-500 mt-0.5 block">
                  Current: {user.roleId.name}
                </span>
              )}
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-3">
            <Label htmlFor="role-select" className="text-sm font-bold text-slate-700">
              Select New Role
            </Label>
            {roleLoading ? (
              <div className="flex items-center gap-2 h-11 px-3 border border-slate-200 rounded-xl text-slate-400 text-sm">
                <Loader2 size={14} className="animate-spin" />
                Loading roles...
              </div>
            ) : (
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger id="role-select" className="rounded-xl border-slate-200 h-11 focus:ring-indigo-500">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  {roles.map((role) => (
                    <SelectItem
                      key={role._id}
                      value={role._id}
                      className="rounded-lg focus:bg-indigo-50 focus:text-indigo-600"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Preview */}
          {currentRoleName && (
            <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <ShieldCheck size={14} className="text-indigo-500" />
              <span className="text-xs font-bold text-indigo-700">
                Will be assigned as: <span className="uppercase">{currentRoleName}</span>
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={saving}
              className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !selectedRoleId || roleLoading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
