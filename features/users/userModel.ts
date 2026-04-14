
import { ICourse } from "../semester/semesterModel";
import { IRole } from "../roles/roleModel";
import { IUniversity } from "../university/universityModel";
import { ISemester } from "../semester/semesterModel";

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    coverImage?: string;
    bio?: string;
    startYear?: string;
    endYear?: string;
    courseIds: ICourse[];
    universityId?: IUniversity;
    roleId: IRole;
    verificationStatus: boolean;
    followersCount: number;
    followingCount: number;
    status: "ACTIVE" | "INACTIVE";
    isPrivate: boolean;
    isDeleted: boolean;
    trustScore: number;
    Profile?: {
        hobby_badge: string;
        skills: string[];
        projects: string[];
        semesterId: ISemester;
    };
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface IUpdateProfile {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    startYear?: string;
    endYear?: string;
    hobby_badge?: string;
    skills?: string[];
    projects?: string[];
    universityId?: string;
    courseIds?: string[];
    semesterId?: string;
    avatar?: string;
    coverImage?: string;
}


export interface UserResponse {
    success: boolean,
    message: string,
    data: IUser
}

export interface UserState {
    users: IUser[];
    me: IUser | null;
    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
}