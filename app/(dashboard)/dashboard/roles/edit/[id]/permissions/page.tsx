"use client";

import React from "react";
import { RolePermissionForm, PermissionGroup } from "@/components/dashboard/roles/RolePermissionForm";
import { toast } from "react-hot-toast";

const mockRole = {
    _id: "role_123",
    name: "Administrator",
};

const mockPermissions: PermissionGroup[] = [
    {
        module: "User",
        permissions: [
            { _id: "p1", name: "view_users", description: "Can view user list", module: "User" },
            { _id: "p2", name: "create_user", description: "Can create new users", module: "User" },
            { _id: "p3", name: "edit_user", description: "Can edit existing users", module: "User" },
            { _id: "p4", name: "delete_user", description: "Can remove users from system", module: "User" },
        ],
    },
    {
        module: "Post",
        permissions: [
            { _id: "p5", name: "view_posts", description: "Can browse all posts", module: "Post" },
            { _id: "p6", name: "create_post", description: "Can create new feed posts", module: "Post" },
            { _id: "p7", name: "moderate_post", description: "Can hide or pin posts", module: "Post" },
        ],
    },
    {
        module: "Scholarship",
        permissions: [
            { _id: "p8", name: "view_scholarships", description: "Can view scholarship listings", module: "Scholarship" },
            { _id: "p9", name: "apply_scholarship", description: "Can submit applications", module: "Scholarship" },
            { _id: "p10", name: "manage_scholarships", description: "Can create/edit scholarships", module: "Scholarship" },
        ],
    },
    {
        module: "Settings",
        permissions: [
            { _id: "p11", name: "view_settings", description: "Can access system settings", module: "Settings" },
            { _id: "p12", name: "update_settings", description: "Can modify global configuration", module: "Settings" },
        ],
    },
];

const mockInitialIds = ["p1", "p5", "p6", "p11"];

export default function RolePermissionPage({ params }: { params: { id: string } }) {
    const handleSubmit = async (data: { roleId: string; permissionIds: string[] }) => {
        // This is a UI template as requested. 
        // Backend integration will be added later.
        console.log("Mock Save Data:", data);
        
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                toast.success("Permissions updated successfully (Simulated)");
                resolve();
            }, 1000);
        });
    };

    return (
        <div className="container mx-auto py-6 max-w-7xl">
            <RolePermissionForm
                role={mockRole}
                allPermissions={mockPermissions}
                initialAssignedPermissionIds={mockInitialIds}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
