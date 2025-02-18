import { Router } from "express";

import { locationMiddleware } from '../Middleware/locationMiddleware';
import { authMiddleware } from '../Middleware/authMiddleware';
import { userRegister, userLogin, userLogout, userProfile, emailVerify, requestPasswordResetController, resetPasswordController } from "../Controllers/user.controllers";

const router = Router();

router.post("/register", userRegister);
router.post("/login", locationMiddleware, userLogin);
router.post("/logout", authMiddleware, userLogout);
router.get("/verify-email", emailVerify);
router.post('/request-password-reset', authMiddleware, requestPasswordResetController);
router.post('/reset-password', authMiddleware, resetPasswordController);

router.get("/profile", authMiddleware, userProfile);

export default router;
