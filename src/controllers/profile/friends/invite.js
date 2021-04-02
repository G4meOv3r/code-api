import { asyncHandler } from '../../../helpers/async'
import validator from '../../../helpers/validator'
import httpError from '../../../helpers/error'

import User from '../../../models/User'

const invite = asyncHandler(async (req, res, next) => {
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

        let friendship = 2
        let confirm = false
        req.user.invites.friends = req.user.invites.friends
            .filter(invite => {
                confirm = invite.from.equals(_id)
                return !(invite.from.equals(_id))
            })

        if (confirm) {
            friendship = 4
            user.friends.push(req.user._id)
            req.user.friends.push(_id)
            await req.user.save()
        } else {
            user.invites.friends = user.invites.friends.filter(invite => {
                return !(invite.from.equals(req.user._id))
            })
            user.invites.friends.push({ from: req.user._id })
            user.markModified('invites.friends')
        }

        await user.save()
        return res.status(200).json({ _id: user._id, friendship })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default invite
