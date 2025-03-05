import prisma from "../config/DB";

export const createPost = async (postData: {
  userId: string;
  title: string;
  description: string;
  tags: string[];
  imageURL: string;
}) => {
  const { userId, title, description, tags, imageURL } = postData;

  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        title,
        description,
        tags,
        imageURL,
        Status: "pending",
      },
    });
    return newPost;
  } catch (error) {
    throw new Error("Error creating post: " + error);
  }
};

export const getAllPosts = async (page: number, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const posts = await prisma.post.findMany({
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          image: true,
          followers: true,
          identityVerified: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalPosts = await prisma.post.count();
  const hasMore = page * limit < totalPosts; // Check if more posts are available

  return { posts, hasMore };
};

export const getPostsByUserId = async (userId: string) => {
  return await prisma.post.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          image: true,
          followers: true,
          identityVerified: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

export const getPostById = async (postId: string) => {
  return await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      likes: true,
      isLikedByCurrentUser: true,
      imageURL: true,
      Status: true,
      isLive: true,
      isAuctioned: true,
      auctionId: true,
      OwnerId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          image: true,
          followers: true,
          identityVerified: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              followers: true,
              identityVerified: true,
            },
          },
        },
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

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { likes: updatedLikes },
  });

  await prisma.notification.create({
    data: {
      receiverId: post.userId,
      senderId: userId,
      type: "like",
      message: `Your post has been liked by.`,
      link: `/post/${postId}`,
      isRead: false,
    },
  });

  return updatedPost;
};

export const updatePost = async (
  postId: string,
  updates: Partial<{ title: string; description: string; tags: string[] }>
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
