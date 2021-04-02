import { asyncHandler } from '../../../helpers/async'
import validator from '../../../helpers/validator'
import httpError from '../../../helpers/error'

import User from '../../../models/User'

const remove = asyncHandler(async (req, res, next) => {
    const { _id } = req.body

    try {
        validator.set
            .value(_id)
            .is.exist().check('_id must exist')
            .is.string().check('_id must be a string')
            .is.length(24).check('_id must have length 24')
    } catch (error) {
        return res.status(400).json(httpError(400, error.message))
    }

    try {
        const user = await User.findOne({ _id }, { 'invites.friends': 1, friends: 1 })
        if (!user) {
            return res.status(400).json(httpError(400, 'invalid _id'))
        }

        let friendship = 1
        let wereFriends = false
        user.friends = user.friends.filter(friendId => {
            wereFriends = wereFriends || friendId.equals(req.user._id)
            return !friendId.equals(req.user._id)
        })

        if (!wereFriends) {
            user.invites.friends = user.invites.friends.filter(invite => {
                return !invite.from.equals(req.user._id)
            })
        } else {
            friendship = 3

            req.user.invites.friends.push({ from: user._id })
            req.user.markModified('invites.friends')
            req.user.friends = req.user.friends.filter(friendId => {
                return !friendId.equals(user._id)
            })
            await req.user.save()
        }

        await user.save()
        return res.status(200).json({ _id: user._id, friendship })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default remove
