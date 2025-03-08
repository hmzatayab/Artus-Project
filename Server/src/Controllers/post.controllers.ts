import { Request, Response } from "express";
import * as postService from "../Services/post.services";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, description, tags } = req.body;
    const userId = (req as any).user?.userId;
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/Images/${req.file.filename}`
      : "";
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    if (!userId) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }

    const newPost = await postService.createPost({
      userId,
      title,
      description,
      tags: parsedTags,
      imageURL,
    });

    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post", error: error });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { posts, hasMore } = await postService.getAllPosts(page, limit);

    res.status(200).json({ posts, hasMore });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts" });
  }
};

export const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const posts = await postService.getPostsByUserId(userId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await postService.getPostById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve post details" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;
    const updatedPost = await postService.updatePost(postId, updateData);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    await postService.deletePost(postId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedPost = await postService.likePost(postId, userId);
    res.status(200).json({ success: true, post: updatedPost });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Failed to like/unlike post" });
  }
};