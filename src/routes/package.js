import express from 'express'

import authMiddleware from '../middlewares/auth/user'

import controller from '../controllers/package'

const router = express.Router()
router.get('/', authMiddleware.catching, controller.root.get)
router.post('/', authMiddleware.catching, controller.root.post)

export default router
