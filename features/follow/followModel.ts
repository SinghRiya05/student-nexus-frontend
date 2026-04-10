export type FollowStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface IUserMini {
    _id: string;
    firstName: string;
    lastName?: string;
}

export interface IFollow {
    _id: string;
    follower: string | IUserMini;
    following: string | IUserMini;
    status: FollowStatus;
    createdAt: string;
    updatedAt: string;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export type IFollowResponse = IApiResponse<IFollow>;

export type IFollowListResponse = IApiResponse<IFollow[]>;

export interface FollowState {
    followers: IFollow[];
    following: IFollow[];
    pendingRequests: IFollow[];
    sentRequests: IFollow[];
    loading: boolean;
    error: string | null;
}