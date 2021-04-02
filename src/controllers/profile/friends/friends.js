import { asyncHandler } from '../../../helpers/async'
import validator from '../../../helpers/validator'
import httpError from '../../../helpers/error'

import User from '../../../models/User'

const friends = asyncHandler(async (req, res, next) => {
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
        const user = await User.findOne({ _id }, { friends: 1 })
        if (!user) {
            return res.status(400).json(httpError(400, 'invalid _id'))
        }

        let friends = await User.find({ _id: { $in: user.friends } }, { personal: 1 }, { sort: { 'personal.status': 1, 'personal.nickname': 1 } })
        friends = friends.map(friend => {
            return { _id: friend._id, ...friend.personal }
        })

        return res.status(200).json({ _id: user._id, friends })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default friends
