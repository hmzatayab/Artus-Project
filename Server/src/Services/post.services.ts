import prisma from "../config/DB";

export const createPost = async (postData: {
  userId: string;
  title: string;
  description: string;
  tags: string[];
  imageURL: string;
}) => {
  const { userId, title, description, tags, imageURL } = postData;

  const newPost = await prisma.post.create({
    data: {
      userId,
      title,
      description,
      tags,
      imageURL,
    },
  });

  return newPost;
};

export const getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getPostsByUserId = async (userId: string) => {
  return await prisma.post.findMany({
    where: { userId },
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });
};

export const likePost = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  const alreadyLiked = post.likes.includes(userId);

  const updatedLikes = alreadyLiked
    ? post.likes.filter((id) => id !== userId)
    : [...post.likes, userId];

  return await prisma.post.update({
    where: { id: postId },
    data: { likes: updatedLikes },
  });
};

export const updatePost = async (
  postId: string,
  updates: Partial<{
    title: string;
    description: string;
    tags: string[];
    imageURL: string;
    isLive: boolean;
  }>
) => {
  return await prisma.post.update({
    where: { id: postId },
    data: updates,
  });
};

export const deletePost = async (postId: string) => {
  return await prisma.post.delete({
    where: { id: postId },
  });
};
