import axios from "axios";
import { Comment, ReplyType } from "@/Types/Comment";
import { Post } from "@/Types/Post";

const API_URL = import.meta.env.VITE_API_URL;

interface LikeResponse {
    post: {
        isLikedByCurrentUser: boolean;
        likes: string[];
    };
}

export const getAllPosts = async (page: number) => {
    const res = await fetch(`${API_URL}/post?page=${page}&limit=10`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    return await res.json();
};

export const getAllPost = async () => {
    const res = await fetch(`${API_URL}/post`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    return await res.json();
};

export const getUserPosts = async (UserId: String) => {
    const res = await fetch(`${API_URL}/post/${UserId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");

    return await res.json();
};

export const likePost = async (postId: string, token: string): Promise<LikeResponse> => {
    try {
        const response = await axios.patch<LikeResponse>(
            `${API_URL}/post/${postId}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error liking post:", error);
        throw error;
    }
};


export const updatePost = async (postId: string, updateData: object, token: string) => {
    try {
        const response = await axios.put(
            `${API_URL}/post/update/${postId}`, 
            updateData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, 
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
};



export const getPost = async (postId: string): Promise<Post> => {
    try {
        const response = await axios.get<Post>(`${API_URL}/post/get/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
    try {
        const response = await axios.get<{ success: boolean; comments: Comment[] }>(
            `${API_URL}/comment/${postId}`
        );
        return response.data.comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

export const createComment = async (postId: string, content: string, token: string): Promise<{ comment: Comment }> => {
    try {
        const response = await axios.post(
            `${API_URL}/comment/create`,
            { postId, content },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data as { comment: Comment };
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};

export const createReply = async (commentId: string, content: string, token: string): Promise<{ reply: ReplyType }> => {
    try {
        const response = await axios.post(
            `${API_URL}/comment/${commentId}/reply`,
            { content },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data as { reply: ReplyType };
    } catch (error) {
        console.error("Error creating reply:", error);
        throw error;
    }
};

export const likeComment = async (commentId: string, token: string): Promise<{ success: boolean }> => {
    try {
        const response = await axios.post(
            `${API_URL}/comment/${commentId}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data as { success: boolean; comment: Comment };
    } catch (error) {
        console.error("Error liking comment:", error);
        throw error;
    }
};

export const likeCommentReply = async (replyId: string, token: string): Promise<{ success: boolean }> => {
    try {
        const response = await axios.post(
            `${API_URL}/comment/reply/like/${replyId}`,
            {}, // Empty body for POST request
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data as { success: boolean; comment: Comment };
    } catch (error) {
        console.error("Error liking comment:", error);
        throw error;
    }
};


// Working on this
export const deleteReply = async (replyId: string, token: string): Promise<{ success: boolean }> => {
    try {
        const response = await axios.delete(
            `${API_URL}/comment/reply/${replyId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data as { success: boolean };
    } catch (error) {
        console.error("Error deleting reply:", error);
        throw error;
    }
}

export const deleteComment = async (commentId: string, token: string): Promise<{ success: boolean }> => {
    try {
        const response = await axios.delete(
            `${API_URL}/comment/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data as { success: boolean };
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}