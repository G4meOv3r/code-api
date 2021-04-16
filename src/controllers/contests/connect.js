import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import Contest from '../../models/Contest'

const connect = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { _id } = req.query

    try {
        validator.set
            .value(_id)
            .is.ObjectId().check('_id must be valid')
    } catch (error) {
        return res.status(400).json(httpError(400, error.message))
    }

    try {
        const contest = await Contest.findOne({ _id })
        if (!contest) {
            return res.status(400).json(httpError(400, 'contest does not exist'))
        }
        if (contest.teams[1].members.length !== 0) {
            return res.status(401).json(httpError(401, 'contest is full'))
        }
        if (contest.privacy.access !== 0) {
            if (!user.invites.contests.reduce((accumulator, invite) => {
                return accumulator || (invite._id === contest._id)
            }, false)) {
                return res.status(401).json(httpError(401, 'you must be invited'))
            }
        }
        contest.teams[1].members.push({ _id: user._id, nickname: user.personal.nickname })
        contest.markModified('teams')
        await contest.save()
        return res.status(200).json({ _id: contest._id })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default connect
