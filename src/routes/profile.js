import express from 'express';

import authMiddleware from "../middlewares/auth/auth.js";

import controller from "../controllers/profile/profile";

const router = express.Router();
router.get('', authMiddleware.user.through, controller.profile.get);

export default router;