export interface ICourse {
    _id: string;
    courseName: string;
    course_short_name: string;
}

export interface IUniversity {
    _id: string;
    name: string;
    short_name: string;
}

export interface ISemester {
    _id: string;
    name: string;
}

export interface IStudentProfile {
    _id: string;
    userId: string;
    skills: string[];
    projects: string[];
    hobby_badge: string;
    semesterId: ISemester | null;
}



export interface IStudent {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courseIds: ICourse[];
    followersCount: number;
    followingCount: number;
    status: string;
    universityId: IUniversity;
    studentProfile?: IStudentProfile | null;
    bio?: string;
    coverImage?: string;
    avatar?: string;
    endYear?: number;
    startYear?: number;
}

export interface IStudentResponse {
    success: boolean;
    message: string;
    data: IStudent[];
}

export interface ICurrentUser extends IStudent {
    bio?: string;
    startYear?: number;
    coverImage?: string;
    profileImage?: string;
    endYear?: number;
    studentProfile?: IStudentProfile | null;
}

export interface studentState {
    students: IStudent[];
    classmates: IStudent[];
    batchmates: IStudent[];
    singleStudent: IStudent | null;
    loading: boolean;
    error: string | null;
}