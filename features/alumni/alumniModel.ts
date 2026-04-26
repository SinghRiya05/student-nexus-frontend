export interface IUniversity {
    _id: string;
    name: string;
    short_name: string;
    domain: string;
}

export interface ICourse {
    _id: string;
    courseName: string;
    course_short_name: string;
    durationYears: number;
}

export interface IAlumniProfile {
    _id: string;
    userId: string;
    currentCompany: string;
    jobTitle: string;
    experienceYears: number;
    skills: string[];
    projects: any[];
}

export interface IAlumni {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    universityId: IUniversity;
    courseIds: ICourse[];
    roleId: string;
    verificationStatus: boolean;
    followersCount: number;
    followingCount: number;
    avatar?: string;
    coverImage?: string;
    aluminiProfile?: IAlumniProfile;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: IAlumni[];
}

export interface singleApiResponse {
    success: boolean;
    message: string;
    data: IAlumni;
}

export interface IJobTitleGroup {
    jobTitle: string;
    alumni: IAlumni[];
}

export interface IAlumniByJobTitleResponse {
    success: boolean;
    message: string;
    data: IJobTitleGroup[];
}

export interface ICompanyGroup {
    company: string;
    alumni: IAlumni[];
}

export interface IAlumniByCompanyResponse {
    success: boolean;
    message: string;
    data: ICompanyGroup[];
}

export interface AlumniState {
    universityAlumni: IAlumni[];
    courseAlumni: IAlumni[];
    singleAlumni: IAlumni | null;
    alumni: IAlumni[]; // For general or ID-based fetching
    alumniByJobTitle: IJobTitleGroup[];
    alumniByCompany: ICompanyGroup[];
    loading: boolean;
    error: string | null;
}
