import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import { createPost, getAllPosts, getPostsByUserId, updatePost, deletePost, likePost } from "../Controllers/post.controllers";

const router = Router();

router.post("/create", authMiddleware, createPost);
router.get("/:userId", getPostsByUserId);
router.get("/", getAllPosts);
router.patch('/:postId/like', authMiddleware, likePost);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);

export default router;