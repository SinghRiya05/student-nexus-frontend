import { IPermission } from "../permissions/permissionModel";
import { IRole } from "../roles/roleModel";

// Mapping
export interface IRolePermission {
    _id: string;
    createdAt: string;
    updatedAt: string;
    role: IRole;
    permission: IPermission;
}

// API Response
export interface RolePermissionResponse {
    success: boolean;
    code: number;
    message: string;
    data: IRolePermission[];
}

// Requests
export interface RolePermissionRequest {
    roleId: string;
    permissionIds: string[];
}

export interface AssignRolePermissionRequest {
    roleId: string;
    permissionId: string;
}


export interface RolePermissionState {
    rolePermissions: IRolePermission[];
    assignedPermissionIds: string[];

    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
}