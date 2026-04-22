export interface IFeed {
    _id: string;
    authorId: Author;
    content: string;
    media: string;
    hashtags: string[];
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    isLiked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Author {
    _id: string;
    firstName: string;
    lastName: string;
    roleId: {
        _id: string;
        name: string;
    }
    universityId: {
        _id: string;
        name: string;
    }
    avatar: string;
}

export interface CreateFeedRequest {
    content: string;
    media: string;
    hashtags: string[];
}

export interface UpdateFeedRequest {
    content?: string;
    media?: string;
    hashtags?: string[];
}

export interface IComment {
    _id: string;
    feedId: string;
    authorId: Author;
    content: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCommentRequest {
    content: string;
}

export interface IFeedResponse {
    success: boolean;
    message: string;
    data: IFeed[];
}

export interface IFeedState {
    feeds: IFeed[];
    topPosts: IFeed[];
    singleFeed: IFeed | null;
    comments: IComment[];
    trendingHashtags: string[];
    loading: boolean;
    error: string | null;
}

export interface IToggleLikeResponse {
    liked: boolean;
    likesCount: number;
}