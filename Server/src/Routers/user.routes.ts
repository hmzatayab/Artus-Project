import { Router } from "express";

import { locationMiddleware } from '../Middleware/locationMiddleware';
import { authMiddleware } from '../Middleware/authMiddleware';
import * as userController from "../Controllers/user.controllers";
import { upload } from "../config/multerConfig";

const router = Router();

router.post("/register", userController.userRegister);
router.post("/login", locationMiddleware, userController.userLogin);
router.post("/logout", authMiddleware, userController.userLogout);
router.put("/update", authMiddleware, upload.single("image"), userController.userUpdate);
router.get("/verify-email", userController.emailVerify);
router.post('/request-password-reset', authMiddleware, userController.requestPasswordResetController);
router.post('/reset-password', authMiddleware, userController.resetPasswordController);

router.post('/follow', authMiddleware, userController.followUser);
router.get('/:userId/followers', authMiddleware, userController.getUserFollowers);

router.get("/profile", authMiddleware, userController.userProfile);
router.get("/users", authMiddleware, userController.getAllUser);

export default router;
