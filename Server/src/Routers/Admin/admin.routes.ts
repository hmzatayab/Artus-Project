import { Router } from "express";

import { authMiddleware } from "../../Middleware/Admin/authMiddleware";
import { adminRegister, adminLogin, emailVerify, requestPasswordResetController, resetPasswordController, adminLogout } from "../../Controllers/Admin/admin.controllers";

const router = Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/logout", authMiddleware, adminLogout);
router.get("/verify-email", emailVerify);
router.post('/request-password-reset', authMiddleware, requestPasswordResetController);
router.post('/reset-password', authMiddleware, resetPasswordController);

export default router;
