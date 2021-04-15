import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import Contest from '../../models/Contest'
import Task from '../../models/Task'

const create = asyncHandler(async (req, res, next) => {
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
            console.log(1)
            return res.status(400).json(httpError(400, 'contest does not exist'))
        }
        if (!contest.creator._id.equals(user._id)) {
            console.log(2)
            return res.status(401).json(httpError(401, 'you must be a creator to start contest'))
        }
        if (contest.dates.start) {
            console.log(3)
            return res.status(401).json(httpError(401, 'contest is already started'))
        }
        const date = new Date()
        const timeout = contest.duration * 60 * 1000
        contest.type = 'live'
        contest.dates.start = date
        contest.dates.end = new Date(date.getTime() + timeout)
        contest.tasks = await Task.getRandom(contest.tasks.length)
        setTimeout(() => {
            contest.type = 'past'
            contest.save()
        }, timeout)
        await contest.save()
        return res.status(200).json({ _id: contest._id })
    } catch (error) {
        console.log(error)
        return res.status(500).json(httpError(500, error.message))
    }
})

export default create
