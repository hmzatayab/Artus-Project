import { Router } from "express";

import { locationMiddleware } from '../Middleware/locationMiddleware';
import { authMiddleware } from '../Middleware/authMiddleware';
import * as userController from "../Controllers/user.controllers";

const router = Router();

router.post("/register", userController.userRegister);
router.post("/login", locationMiddleware, userController.userLogin);
router.post("/logout", authMiddleware, userController.userLogout);
router.get("/verify-email", userController.emailVerify);
router.post('/request-password-reset', authMiddleware, userController.requestPasswordResetController);
router.post('/reset-password', authMiddleware, userController.resetPasswordController);

router.get("/profile", authMiddleware, userController.userProfile);

export default router;
