export interface ICourse {
    _id: string,
    courseName: string,
    durationYears: number,
}

export interface ISemester {
    _id: string,
    name: string,
    number: number,
    courseId: ICourse,
    status: string,
    createdAt: string,
    updatedAt: string,
}

export interface ISemesterCreate {
    name: string,
    number: number,
    courseId: string,
    status?: string,
}

export interface ISemesterUpdate {
    _id?: string,
    name?: string,
    number?: number,
    courseId?: string,
    status?: string,
}

export interface ISemesterResponse {
    success: boolean,
    message: string,
    data: ISemester,
}

export interface ISemesterGetAllResponse {
    success: boolean,
    message: string,
    data: ISemester[],
}

export interface SemesterState {
    semesters: ISemester[],
    singleSemester: ISemester | null,
    semestersByCourseId: ISemester[],
    isLoading: boolean,
    error: string | null,
}