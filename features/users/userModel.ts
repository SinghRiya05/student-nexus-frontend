
import { ICourse } from "../semester/semesterModel";
import { IRole } from "../roles/roleModel";
export interface IUniversity {
    _id: string;
    name: string;
    short_name?: string;
    domain?: string;
}


export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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
    loading: boolean;
    success: boolean;
    message: string | null;
    error: string | null;
}