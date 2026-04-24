
export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    avatar?: string;
    coverImage?: string;
    courseIds?: any[];
    universityId?: {
        _id: string;
        name: string;
        short_name?: string;
    };
    roleId: {
        _id: string;
        name: string; // "TEACHER" | "STUDENT" | "ALUMINI"
        status: "INACTIVE" | "ACTIVE";
        isDeleted: boolean;
    };
    verificationStatus: boolean;
    followersCount: number;
    followingCount: number;
    status: "INACTIVE" | "ACTIVE";
    isPrivate: boolean;
    isDeleted: boolean;
    trustScore: number;
    createdAt: string;
    bio?: string;
    startYear?: number;
    endYear?: number;
    studentProfile?: any;
    aluminiProfile?: any;
    teacherProfile?: any;
    Profile?: any;
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