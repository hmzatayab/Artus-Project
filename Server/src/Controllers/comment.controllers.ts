import { Request, Response } from "express";
import * as commentService from "../Services/comment.services";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const newComment = await commentService.createComment({
      postId,
      userId,
      content,
    });
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment" });
  }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getCommentsByPostId(postId);
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const addReply = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const newReply = await commentService.addReply(commentId, userId, content);
    res.status(201).json({ success: true, reply: newReply });
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply" });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }

    const updatedComment = await commentService.likeComment(commentId, userId);
    res.status(200).json({ success: true, comment: updatedComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to like/unlike comment" });
  }
};

export const likeReplyComment = async (req: Request, res: Response) => {
  const { replyId } = req.params;
  const userId = (req as any).user?.userId;

  try {
    const updatedReply = await commentService.likeReply(replyId, userId);
    res.status(200).json({ success: true, reply: updatedReply });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
