import express from "express";

import authMiddleware from "../middlewares/auth.js";

import authController from "../controllers/auth/auth";

const auth = express.Router();
auth.post("/signup", authController.signup.post);
auth.post("/signin", authController.signin.post);
auth.post("/signout", authMiddleware, authController.signout.post);

export default auth;
