import express from "express";
import { userRegister, userLogin } from "../Controllers/user.controllers";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);

export default router;
