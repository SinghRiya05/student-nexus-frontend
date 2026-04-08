export interface ICourse {
    _id: string;
    courseName: string;
    course_short_name: string;
    durationYears: number;
    description?: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CourseCreateDto {
    courseName: string;
    course_short_name: string;
    durationYears: number;
    description?: string;
    status?: string;
}

export interface CourseUpdateDto {
    courseName?: string;
    course_short_name?: string;
    durationYears?: number;
    description?: string;
    status?: string;
}

export interface CourseResponse {
    success: boolean;
    message: string;
    data: ICourse[];
}

export interface CourseState {
    courses: ICourse[];
    singleCourse: ICourse | null;
    courseLoading: boolean;
    courseError: string | null;
}