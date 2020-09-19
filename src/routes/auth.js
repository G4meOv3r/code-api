import express from "express";

import authMiddleware from "../middlewares/auth/auth.js";

import controller from "../controllers/auth/auth";

const router = express.Router();
router.post("/signup", controller.signup.post);
router.post("/signin", controller.signin.post);
router.post("/signout", authMiddleware.user.catching, controller.signout.post);

export default router;
