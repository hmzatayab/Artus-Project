export type Post = {
  id: string;
  imageURL: string;
  isLive: boolean;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
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

export interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    isInitiallyLiked: boolean;
    color: string;
}

export interface PostCardProps {
  post: Post;
}