
import { ICourse } from "../semester/semesterModel";
import { IRole } from "../roles/roleModel";
import { IUniversity } from "../university/universityModel";


export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    coverImage?: string;
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
    createdAt: string;
    updatedAt: string;
    __v?: number;
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