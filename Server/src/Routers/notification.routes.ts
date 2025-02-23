import { Router } from "express";

import { authMiddleware } from "../Middleware/authMiddleware";
import * as notificationController from "../Controllers/notification.controllers";

const router = Router();

router.get("/", authMiddleware, notificationController.getUserNotifications);

export default router;
