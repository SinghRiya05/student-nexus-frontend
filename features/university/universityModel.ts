import { ICourse } from "../course/courseModel";

export interface ILocation {
    _id: string;
    name: string;
}

export interface IUniversity {
    _id: string;
    name: string;
    short_name?: string;
    country: ILocation;
    state: ILocation;
    city: ILocation;
    domain?: string;
    logo?: string;
    image?: string;
    isDeleted: boolean;
    isActive: boolean;
    status: string;
    description?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IUniversityCreate {
    name: string;
    country: string;
    state: string;
    city: string;
    domain?: string;
    description?: string;
    short_name?: string;
    logo?: string;
    image?: string;
}

export interface IUniversityUpdate {
    _id: string;
    name?: string;
    short_name?: string;
    country?: string;
    state?: string;
    city?: string;
    domain?: string;
    description?: string;
    logo?: string;
    image?: string;
}



export interface IUniversityCourse {
    _id: string;
    universityId: string;
    courseId: ICourse;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUniversityResponse {
    success: boolean;
    message: string;
    data: IUniversity;
}

export interface IUniversityListResponse {
    success: boolean;
    message: string;
    data: IUniversity[];
}



export interface UniversityInitialState {
    singleUniversity: IUniversity | null;
    universities: IUniversity[];
    universityLoading: boolean;
    universityError: string | null;
    universityCourses: IUniversityCourse[];
    assignedCoursesIds: string[];
}