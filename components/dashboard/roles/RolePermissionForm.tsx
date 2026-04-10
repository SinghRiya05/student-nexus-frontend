"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Save,
    Loader2,
    ChevronLeft,
    Shield,
    CheckCircle2,
    Circle,
    LayoutGrid,
    ShieldCheck,
    Info,
    Archive,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// --- Types ---
export interface Permission {
    _id: string;
    name: string;
    description?: string;
    module: string;
}

export interface PermissionGroup {
    module: string;
    permissions: Permission[];
}

export interface RolePermissionsProps {
    role?: {
        _id: string;
        name: string;
    } | null;
    allPermissions: PermissionGroup[];
    initialAssignedPermissionIds: string[];
    onSubmit: (data: { roleId: string; permissionIds: string[] }) => Promise<void>;
}

export function RolePermissionForm({
    role,
    allPermissions,
    initialAssignedPermissionIds,
    onSubmit,
}: RolePermissionsProps) {
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Initialize selection from props
    useEffect(() => {
        setSelectedPermissionIds(new Set(initialAssignedPermissionIds));
    }, [initialAssignedPermissionIds]);

    const totalPermissionsCount = allPermissions.reduce(
        (acc, group) => acc + group.permissions.length,
        0
    );

    const isAllSelected =
        totalPermissionsCount > 0 &&
        selectedPermissionIds.size === totalPermissionsCount;

    const getModuleSelectionState = (group: PermissionGroup) => {
        const groupIds = group.permissions.map((p) => p._id);
        const selectedCount = groupIds.filter((id) => selectedPermissionIds.has(id)).length;

        if (selectedCount === groupIds.length && groupIds.length > 0) return "checked";
        if (selectedCount > 0) return "indeterminate";
        return "unchecked";
    };

    const handleToggleModule = (group: PermissionGroup) => {
        const ids = group.permissions.map((p) => p._id);
        const selectedInModule = ids.filter((id) => selectedPermissionIds.has(id)).length;
        const allInModuleSelected = selectedInModule === ids.length;
        
        const newSelected = new Set(selectedPermissionIds);
        if (allInModuleSelected) {
            ids.forEach((id) => newSelected.delete(id));
        } else {
            ids.forEach((id) => newSelected.add(id));
        }
        setSelectedPermissionIds(newSelected);
    };

    const handleToggleAll = () => {
        if (isAllSelected) {
            setSelectedPermissionIds(new Set());
        } else {
            const allIds = allPermissions.flatMap((g) =>
                g.permissions.map((p) => p._id)
            );
            setSelectedPermissionIds(new Set(allIds));
        }
    };

    const handleTogglePermission = (permissionId: string) => {
        const newSelected = new Set(selectedPermissionIds);
        if (newSelected.has(permissionId)) {
            newSelected.delete(permissionId);
        } else {
            newSelected.add(permissionId);
        }
        setSelectedPermissionIds(newSelected);
    };

    const onFormSubmit = async () => {
        if (!role?._id) {
            console.error("Role ID missing");
            return;
        }
        setIsLoading(true);
        try {
            await onSubmit({
                roleId: role._id,
                permissionIds: Array.from(selectedPermissionIds),
            });
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!role) return null;

    return (
        <div className="w-full h-full space-y-4 pb-20">
            {/* Sticky Actions Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 -mx-6 px-6 pb-4 pt-4 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                            Manage Permissions
                        </h1>
                        <p className="text-sm text-slate-500 font-medium hidden sm:block">
                            Assign specific access levels to{" "}
                            <span className="text-indigo-600 font-bold">{role.name}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="hidden md:flex border-slate-200 text-slate-600 hover:bg-slate-50 h-10 px-4 rounded-xl"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onFormSubmit}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-100 px-6 h-10 transition-all font-bold uppercase tracking-widest text-[10px] rounded-xl"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Assignments
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left: Organized Permissions Grid */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                Global Controls
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium italic">
                                Apply actions across all available permissions
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 border-indigo-100 bg-white hover:bg-indigo-50 px-4 rounded-lg"
                            onClick={handleToggleAll}
                        >
                            {isAllSelected ? "Deselect Everything" : "Select Everything"}
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {allPermissions.map((group, index) => (
                            <motion.div
                                key={group.module}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                            >
                                <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
                                    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm">
                                                <LayoutGrid className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-slate-800 tracking-tight text-sm">
                                                {group.module} Management
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Label
                                                htmlFor={`module-${group.module}`}
                                                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer"
                                            >
                                                Select All {group.module}
                                            </Label>
                                            <Checkbox
                                                id={`module-${group.module}`}
                                                checked={getModuleSelectionState(group) === "checked"}
                                                onCheckedChange={() => handleToggleModule(group)}
                                                className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {group.permissions.map((permission) => {
                                                const id = permission._id;
                                                const isSelected = selectedPermissionIds.has(id);
                                                return (
                                                    <div
                                                        key={id}
                                                        onClick={() => handleTogglePermission(id)}
                                                        className={`group cursor-pointer flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                                                            isSelected
                                                                ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200"
                                                                : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`shrink-0 transition-all ${
                                                                isSelected
                                                                    ? "scale-110 text-indigo-600"
                                                                    : "text-slate-300"
                                                            }`}
                                                        >
                                                            {isSelected ? (
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            ) : (
                                                                <Circle className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <Label className="font-bold text-sm text-slate-800 block truncate group-hover:text-indigo-600 transition-colors pointer-events-none tracking-tight">
                                                                {permission.name}
                                                            </Label>
                                                            <p className="text-[10px] text-slate-500 font-medium truncate italic mt-0.5 leading-none opacity-70">
                                                                {permission.description || "System action"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 bg-slate-50 border border-slate-200 p-5 rounded-xl flex gap-3">
                        <Archive className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                                Audit Log
                            </h5>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                All permission modifications are recorded for security
                                compliance reporting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Summary Card */}
                <div className="space-y-6">
                    <div className="sticky top-28">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card className="bg-slate-900 border-none shadow-2xl rounded-2xl text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Shield className="w-24 h-24" />
                                </div>
                                <CardHeader className="border-b border-white/5 pb-4">
                                    <CardTitle className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                                        Selection Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-400/20 shadow-inner">
                                            <ShieldCheck className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-3xl font-black tracking-tighter text-white">
                                                {selectedPermissionIds.size}
                                            </h4>
                                            <p className="text-indigo-300/50 text-[10px] font-bold uppercase tracking-widest">
                                                Selected Permissions
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">
                                            <span>Breakdown By Module</span>
                                            <span>Active</span>
                                        </div>
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {allPermissions.map((group) => {
                                                const count = group.permissions.filter((p) =>
                                                    selectedPermissionIds.has(p._id)
                                                ).length;
                                                if (count === 0) return null;
                                                return (
                                                    <div
                                                        key={group.module}
                                                        className="flex items-center justify-between group"
                                                    >
                                                        <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300 transition-colors">
                                                            {group.module}
                                                        </span>
                                                        <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-black text-[10px] px-2 py-0">
                                                            {count}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                            {selectedPermissionIds.size === 0 && (
                                                <div className="py-8 text-center space-y-2 opacity-30">
                                                    <Archive className="w-8 h-8 mx-auto" />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">
                                                        No selections yet
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-3.5 h-3.5 text-indigo-400" />
                                                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Important</span>
                                            </div>
                                            <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
                                                Saving these assignments will immediately update access levels for all users belonging to <span className="text-white font-bold">{role.name}</span>.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
