// @/types/Comment.ts
export type Comment = {
    id: string;
    postId: string;
    userId: string;
    content: string;
    likes: string[];
    isLikedByCurrentUser: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        image: string;
        identityVerified?: boolean;
    };
    replies?: ReplyType[]; // Use ReplyType[] instead of Comment[]
};

export type ReplyType = {
    id: string;
    commentId: string;
    userId: string;
    content: string;
    likes: string[];
    isLikedByCurrentUser: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        name: string;
        image: string;
        identityVerified?: boolean;
    };
};

export type CommentCardProps = {
    postId: string;
    postUserImage: string;
    postUserName: string;
};