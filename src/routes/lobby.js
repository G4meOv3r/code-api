import express from 'express';

import authMiddleware from "../middlewares/auth/auth.js";
import lobbyMiddleware from "../middlewares/lobby/lobby.js";

import controller from "../controllers/lobby/lobby";

const router = express.Router();
router.get('', authMiddleware.user.through, lobbyMiddleware.exist.through, controller.lobby.get);

export default router;