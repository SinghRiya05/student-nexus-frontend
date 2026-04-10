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
    number: number;
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
    semesterId: ISemester;
}

export interface IStudentResponse {
    success: boolean;
    message: string;
    data: IStudent[];
}

export interface studentState {
    students: IStudent[];
    singleStudent: IStudent | null;
    loading: boolean;
    error: string | null;
}