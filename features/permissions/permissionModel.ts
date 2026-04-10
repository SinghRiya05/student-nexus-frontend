
// Permission Interface
export interface IPermission {
    _id: string;
    name: string;
    description: string;
    module: string;
    createdAt: string;
    updatedAt: string;
}

// Create Permission DTO
export interface ICreatePermission {
    name: string;
    module: string;
    description?: string;
}

// Update Permission DTO
export interface IUpdatePermission {
    name?: string;
    module?: string;
    description?: string;
}

// API Response Types
export interface PermissionApiResponse {
    success: boolean;
    message: string;
    data: IPermission;
}

// Module-wise Permissions
export interface IModulePermissions {
    module: string;
    permissions: IPermission[];
}

export interface PermissionsListApiResponse {
    success: boolean;
    message: string;
    data: IPermission[];
}


// Redux State
export interface PermissionState {
    permissions: IPermission[];
    singlePermission: IPermission | null;
    permissionLoading: boolean;
    permissionSuccess: boolean;
    permissionMessage: string | null;
    permissionError: string | null;
}
