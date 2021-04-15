import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'

import validator from '../../helpers/validator'

import Contest from '../../models/Contest'
import Task from '../../models/Task'
import Package from '../../models/Package'

const root = asyncHandler(async (req, res, next) => {
    const { _id } = req.query
    const { user } = req
    try {
        if (_id) {
            try {
                validator.set
                    .value(_id)
                    .is.ObjectId().check('_id must be valid')
            } catch (error) {
                return res.status(400).json(httpError(400, error.message))
            }
            const contest = (await Contest.find({ _id }))[0]
            if (contest) {
                const { _id, type, name, description, duration, privacy, tasks, teams, dates, creator } = contest

                const filledTasks = await Promise.all(tasks.map(async taskId => {
                    if (taskId) {
                        const { _id, name, task } = await Task.findOne({ _id: taskId })
                        if (!user) {
                            return { _id, name, task }
                        }
                        const packages = await Package.find({ creator: user._id, task: taskId }).sort([['date', -1]])
                        return { _id, name, task, packages }
                    } else {
                        return null
                    }
                }))

                let isMember = false
                let isCreator = false
                if (user) {
                    isCreator = user._id.equals(contest.creator._id)
                    for (const { members } of contest.get('teams')) {
                        for (const member of members) {
                            if (user._id.equals(member._id)) {
                                isMember = true
                                break
                            }
                        }
                        if (isMember) {
                            break
                        }
                    }
                }

                return res.status(200).json({
                    _id,
                    type,
                    name,
                    description,
                    duration,
                    privacy,
                    tasks: filledTasks,
                    teams,
                    dates,
                    creator,
                    isMember,
                    isCreator
                })
            } else {
                return res.status(400).json(httpError(400, 'contest must exist'))
            }
        } else {
            const contests = await Contest.find({ 'privacy.access': { $eq: 0 } })
            return res.status(200).json(contests)
        }
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default root
