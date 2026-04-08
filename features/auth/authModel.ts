export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    courseIds: string[];
    roleId: string;
    verificationStatus: boolean;
    followersCount: number;
    followingCount: number;
    status: "INACTIVE" | "ACTIVE";
    isPrivate: boolean;
    isDeleted: boolean;
    trustScore: number;
    createdAt: string;
    updatedAt: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface IRegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export interface IVerifyRequest {
    email: string;
    otp: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthState {
    user: IUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
}