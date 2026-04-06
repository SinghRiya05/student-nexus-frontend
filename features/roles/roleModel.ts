
// Role Interface
export interface IRole {
    _id: string;
    name: string;
    description: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// Create Role DTO
export interface ICreateRole {
    name: string;
    description?: string;
    status?: string;
    isDeleted?: boolean;
}


// Update Role DTO
export interface IUpdateRole {
    name?: string;
    description?: string;
    status?: string;
    isDeleted?: boolean;
}

// API Response Types
export interface RoleApiResponse {
    success: boolean;
    message: string;
    data: IRole;
}

export interface RolesListApiResponse {
    success: boolean;
    message: string;
    data: IRole[];
}

// Redux State
export interface RoleState {
    roles: IRole[];
    singleRole: IRole | null;
    roleLoading: boolean;
    roleSuccess: boolean;
    roleMessage: string | null;
    roleError: string | null;
}
