import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type Post = {
    id: string;
    imageURL: string;
    isLive: boolean;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    user: {
        id: string;
        name: string;
        username: string;
        image: string;
        followers: number[];
        identityVerified: boolean;
    };
    likes: number[];
    comments: {}[];
};

interface LikeResponse {
    post: {
        isLikedByCurrentUser: boolean;
        likes: string[];
    };
}

export const getAllPosts = async () => {
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

export const getPost = async (postId: string): Promise<Post> => {
    try {
        const response = await axios.get<Post>(`${API_URL}/post/get/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
    }
};
