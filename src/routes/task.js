import express from 'express'

import authMiddleware from '../middlewares/auth/user'

import controller from '../controllers/task'

const router = express.Router()
router.get('/', authMiddleware.through, controller.root.get)

export default router
