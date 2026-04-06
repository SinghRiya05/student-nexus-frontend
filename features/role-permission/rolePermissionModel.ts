import { IPermission } from "../Permissions/permissionModel";
import { IRole } from "../Roles/RolesModel";

// Mapping
export interface IRolePermission {
    id: number;
    created_at: string;
    modified_at: string;
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
    roleId: number;
    permissionIds: number[];
}

export interface AssignRolePermissionRequest {
    roleId: number;
    permissionId: number;
}


export interface RolePermissionState {
    rolePermissions: IRolePermission[];
    assignedPermissionIds: string[];

    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
}