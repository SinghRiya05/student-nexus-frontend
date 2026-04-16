
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

export interface ITeacher {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
}

export interface IResource {
    _id: string;
    title: string;
    description: string;
    fileUrl: File;
    isPaid: boolean;
    price: number;
    course: ICourse;
    university: IUniversity;
    teacherId: ITeacher;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateResource {
    title: string;
    description: string;
    fileUrl: File;
    isPaid?: boolean;
    price?: number;
    courseId: string;
    semesterId?: string;
}

export interface IUpdateResource {
    title?: string;
    description?: string;
    fileUrl?: File;
    isPaid?: boolean;
    price?: number;
    courseId?: string;
    semesterId?: string;
}

export interface ResourcesState {
    resources: IResource[];
    singleResource: IResource | null;
    loading: boolean;
    error: string | null;
}