import express from 'express'

import authMiddleware from '../middlewares/auth/auth'

import controller from '../controllers/profile'

const router = express.Router()
router.get('/', authMiddleware.user.through, controller.profile.get)
router.get('/personal', authMiddleware.user.through, controller.personal.get)
router.get('/friends', controller.friends.get)
router.post('/', authMiddleware.user.catching, controller.profile.post)
router.post('/friends/invite', authMiddleware.user.catching, controller.friends.invite.post)
router.post('/friends/remove', authMiddleware.user.catching, controller.friends.remove.post)

export default router
