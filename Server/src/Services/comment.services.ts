import prisma from "../config/DB";

export const createComment = async (commentData: {
  postId: string;
  userId: string;
  content: string;
}) => {
  const { postId, userId, content } = commentData;
  const newComment = await prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
  });

  await prisma.post.update({
    where: { id: postId },
    data: { comments: { push: newComment.id } },
  });
  return newComment;
};

export const getCommentsByPostId = async (postId: string) => {
  return await prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: { name: true, image: true },
      },
      replies: {
        include: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const addReply = async (commentId: string, userId: string, content: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");

  const newReply = await prisma.reply.create({
    data: {
      commentId,
      userId,
      content,
      likes: [],
    },
  });

  await prisma.comment.update({
    where: { id: commentId },
    data: {
      replies: {
        connect: { id: newReply.id },
      },
    },
  });

  return newReply;
};

export const likeComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { likes: true },
  });

  if (!comment) throw new Error("Comment not found");

  const alreadyLiked = comment.likes.includes(userId);
  const updatedLikes = alreadyLiked
    ? comment.likes.filter((id) => id !== userId)
    : [...comment.likes, userId];

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      likes: updatedLikes,
      isLikedByCurrentUser: !alreadyLiked,
    },
  });

  return updatedComment;
};

export const likeReply = async (replyId: string, userId: string) => {
  const reply = await prisma.reply.findUnique({ where: { id: replyId } });
  if (!reply) throw new Error("Reply not found");

  const hasLiked = reply.likes.includes(userId);

  const updatedReply = await prisma.reply.update({
    where: { id: replyId },
    data: {
      likes: hasLiked
        ? reply.likes.filter((id) => id !== userId)
        : [...reply.likes, userId],
      isLikedByCurrentUser: !hasLiked,
    },
  });

  return updatedReply;
};
