export interface IUniversity {
    _id: string;
    name: string;
    short_name: string;
}

export interface ICourse {
    _id: string;
    courseName: string;
    course_short_name: string;
}

export interface ITeacherProfile {
    _id: string;
    userId: string;
    designation: string;
    department: string;
    experienceYears: number;
    bio: string;
    createdAt: string;
    updatedAt: string;
}

export interface ITeacher {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    universityId: IUniversity;   // populated object
    courseIds: ICourse[];        // array of courses
    roleId: string;
    verificationStatus: boolean;
    followersCount: number;
    followingCount: number;
    status: "ACTIVE" | "INACTIVE";
    isPrivate: boolean;
    isDeleted: boolean;
    trustScore: number;
    createdAt: string;
    updatedAt: string;
    teacherProfile: ITeacherProfile;
    id: string; // duplicate _id
}

export interface IGetTeachersResponse {
    success: boolean;
    message: string;
    data: ITeacher[];
}

export interface TeacherState {
    teachers: ITeacher[];
    sameUniversityTeachers: ITeacher[];
    otherUniversityTeachers: ITeacher[];
    singleTeacher: ITeacher | null;
    loading: boolean;
    error: string | null;
}