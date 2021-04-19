import express from 'express'

import authMiddleware from '../middlewares/auth/user'

import controller from '../controllers/search'

const router = express.Router()
router.get('/', authMiddleware.catching, controller.root.get)
router.get('/start', authMiddleware.catching, controller.start.get)
router.get('/stop', authMiddleware.catching, controller.stop.get)

export default router
