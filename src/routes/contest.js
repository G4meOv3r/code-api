import express from 'express'

import authMiddleware from '../middlewares/auth/auth'

import controller from '../controllers/contests'

const router = express.Router()
router.get('/', authMiddleware.user.through, controller.root.get)
router.get('/start', authMiddleware.user.catching, controller.start.get)
router.post('/create', authMiddleware.user.catching, controller.create.post)

export default router
