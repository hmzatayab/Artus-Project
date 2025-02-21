import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import * as commentController from "../Controllers/comment.controllers";

const router = Router();

router.post("/create", authMiddleware, commentController.createComment);
router.get("/:postId", commentController.getCommentsByPostId);
router.post("/:commentId/reply", authMiddleware, commentController.addReply);
router.post("/:commentId/like", authMiddleware, commentController.likeComment);
router.post("/reply/like/:replyId", authMiddleware, commentController.likeReplyComment);

export default router;
