import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import { createComment, getCommentsByPostId, addReply, likeComment, likeReplyComment } from "../Controllers/comment.controllers";

const router = Router();

router.post("/create", authMiddleware, createComment);
router.get("/:postId", getCommentsByPostId);
router.post("/:commentId/reply", authMiddleware, addReply);
router.post("/:commentId/like", authMiddleware, likeComment);
router.post("/reply/like/:replyId", authMiddleware, likeReplyComment);

export default router;
