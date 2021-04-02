import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import User from '../../models/User'

const personal = asyncHandler(async (req, res, next) => {
    const { _id } = req.query

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
        const user = await User.findOne({ _id })
        if (!user) {
            return res.status(400).json(httpError(400, 'invalid _id'))
        }

        let friendship = 0
        if (req.user) {
            user.friends.map(friend => {
                if (friend.equals(req.user._id)) {
                    friendship = 4
                }
                return friend
            })
            if (!friendship) {
                req.user.invites.friends.map(invite => {
                    if (invite.from.equals(user._id)) {
                        friendship = 3
                    }
                    return invite
                })
            }
            if (!friendship) {
                user.invites.friends.map(invite => {
                    if (invite.from.equals(req.user._id)) {
                        friendship = 2
                    }
                    return invite
                })
            }
            if (!friendship) {
                friendship = 1
            }
        }

        const { $init, ...personal } = user.personal

        return res.status(200).json({ _id: user._id, personal, friendship })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default personal
