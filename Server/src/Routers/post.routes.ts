import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import * as postController from "../Controllers/post.controllers";

const router = Router();

router.get("/", postController.getAllPosts);
router.post("/create", authMiddleware, postController.createPost);
router.get("/:userId", postController.getPostsByUserId);
router.patch('/:postId/like', authMiddleware, postController.likePost);
router.put("/:postId", authMiddleware, postController.updatePost);
router.delete("/:postId", authMiddleware, postController.deletePost);

export default router;