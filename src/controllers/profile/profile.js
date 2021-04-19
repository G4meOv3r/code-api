import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import User from '../../models/User'
import Contest from '../../models/Contest'

const profile = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { _id } = req.query

    if (_id) {
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
            const profile = await User.findOne({ _id })
            if (!profile) {
                return res.status(400).json(httpError(400, 'invalid _id'))
            }
            const { personal, friends } = profile
            const { name, lastName, nickname, status } = personal
            const filledFriends = []
            for (const friendId of friends) {
                const friend = await User.findOne({ _id: friendId }, { _id: 1, personal: 1 })
                const { name, lastName, nickname, status } = friend.personal
                filledFriends.push({ _id: friend._id, name, lastName, nickname, status })
            }

            let friendship = 0
            if (user && !user._id.equals(_id)) {
                if (profile.friends.reduce((accumulator, friendId) => {
                    return accumulator || friendId.equals(user._id)
                }, false)) {
                    friendship = 4
                }
                if (!friendship) {
                    if (user.invites.friends.reduce((accumulator, inviterId) => {
                        return accumulator || inviterId.equals(profile._id)
                    }, false)) {
                        friendship = 3
                    }
                }
                if (!friendship) {
                    if (profile.invites.friends.reduce((accumulator, inviterId) => {
                        return accumulator || inviterId.equals(user._id)
                    }, false)) {
                        friendship = 3
                    }
                }
                if (!friendship) {
                    friendship = 1
                }
            }

            const contests = await Contest.find({ 'teams.members._id': _id }, { _id: 1, name: 1 })

            return res.status(200).json({
                _id,
                personal: {
                    name,
                    lastName,
                    nickname,
                    status,
                    friendship,
                    me: user ? user._id.equals(_id) : false
                },
                friends: filledFriends,
                contests
            })
        } catch (error) {
            return res.status(500).json(httpError(500, error.message))
        }
    } else {
        try {
            const users = await User.find({}, { _id: 1, personal: 1 }).sort([['personal.status', 1]])
            return res.status(200).json(users.map((user) => {
                const { _id, personal } = user
                const { nickname, name, lastName, status } = personal
                return { _id, nickname, name, lastName, status }
            }))
        } catch (error) {
            return res.status(500).json(httpError(500, error.message))
        }
    }
})

export default profile
