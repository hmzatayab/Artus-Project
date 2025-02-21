import { Router } from "express";

import { authMiddleware } from "../../Middleware/Admin/authMiddleware";
import * as adminControllers from "../../Controllers/Admin/admin.controllers";

const router = Router();

router.post("/register", adminControllers.adminRegister);
router.post("/login", adminControllers.adminLogin);
router.post("/logout", authMiddleware, adminControllers.adminLogout);
router.get("/verify-email", adminControllers.emailVerify);
router.post('/request-password-reset', authMiddleware, adminControllers.requestPasswordResetController);
router.post('/reset-password', authMiddleware, adminControllers.resetPasswordController);

export default router;
