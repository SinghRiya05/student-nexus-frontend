export interface ApiResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  coverImage?: string;
  courseIds: Course[];
  roleId: Role;
  verificationStatus: boolean;
  followersCount: number;
  followingCount: number;
  status: string;
  bio?: string;
  startYear?: string;
  endYear?: string;
  isPrivate: boolean;
  isDeleted: boolean;
  trustScore: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  universityId: University;
  studentProfile: StudentProfile;
  aluminiProfile: AluminiProfile;
  teacherProfile: TeacherProfile;
  Profile?: any; // Generic profile for UI mapped from the specific profiles above
  id: string;
}

export interface Course {
  _id: string;
  courseName: string;
  course_short_name: string;
  durationYears: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Role {
  _id: string;
  name: string; // "TEACHER" | "STUDENT" | "ALUMINI"
  description: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface University {
  _id: string;
  name: string;
  short_name: string;
  domain: string;
  description: string;
  country: string;
  state: string;
  city: string;
  isVerified: boolean;
  isDeleted: boolean;
  isActive: boolean;
  courses: any[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  __v: number;
  createdAt: string;
  hobby_badge: string;
  projects: any[];
  semesterId: Semester;
  skills: string[];
  updatedAt: string;
}


export interface TeacherProfile {
  userId: string;
  designation?: string;
  department?: string;
  experienceYears?: number;
  bio?: string;
}


export interface AluminiProfile {
  userId: string;
  currentCompany?: string;
  jobTitle?: string;
  experienceYears?: number;
  skills?: string[];
  projects?: string[];
}


export interface Semester {
  _id: string;
  name: string;
  number: number;
  courseId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MutualFollower {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}


export interface UserInitialSliceState {
  users: User[];
  singleUser: User | null;
  me: User | null;
  mutualFollowers: MutualFollower[];
  userLoading: boolean;
  userSuccess: boolean;
  userMessage: string | null;
  userError: string | null;
}