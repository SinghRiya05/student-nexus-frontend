import { IUser } from "../auth/authModel";

export interface ISearchUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    courses?: { courseName: string; course_short_name: string }[];
    university?: { name: string; short_name: string };
    semester?: { name: string };
    aluminiProfile?: { currentCompany: string; jobTitle: string };
    teacherProfile?: { designation: string; department: string };
}

export interface SearchState {
    results: ISearchUser[];
    loading: boolean;
    error: string | null;
}
