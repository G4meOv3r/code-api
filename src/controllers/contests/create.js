import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import User from '../../models/User'
import Contest from '../../models/Contest'
import Task from '../../models/Task'

const create = asyncHandler(async (req, res, next) => {
    const { name, description, duration, tasksCount, teams, privacy, creator } = req.body

    try {
        validator.set
            .value(name)
            .is.string().check('name must be string')

        validator.set
            .value(description)
            .is.string().check('description must be string')

        validator.set
            .value(duration)
            .is.int().check('duration must be integer')
            .is.in.ranges({ ge: 10, le: 600 }).check('duration must be from 10 to 600')

        validator.set
            .value(tasksCount)
            .is.int().check('task count must be integer')
            .is.in.ranges({ ge: 1, le: 5 }).check('task count must be from 1 to 5')

        validator.set
            .value(teams)
            .is.array().check('team must be array')
        for (const team of teams) {
            validator.set
                .value(team)
                .is.int().check('elements of teams must be integer')
                .is.in.ranges({ ge: 1, le: 5 }).check('elements of teams must be from 1 to 5')
        }

        validator.set
            .value(privacy)
            .is.object().check('privacy must be object')
        const { access, invited } = privacy

        validator.set
            .value(access)
            .is.int().check('privacy access must be integer')
            .is.in.array([0, 1, 2]).check('privacy access must be 0/1/2')

        validator.set
            .value(invited)
            .is.array().check('privacy invited must be array')
        for (const invite of invited) {
            validator.set
                .value(invite)
                .is.ObjectId().check('privacy invited invite must be valid')
        }

        validator.set
            .value(creator)
            .is.ObjectId().check('creator must be valid')
    } catch (error) {
        return res.status(400).json(httpError(400, error.message))
    }

    try {
        const creatorDocument = await User.find({ _id: creator }, { _id: 1, 'personal.nickname': 1 })
        const _id = creatorDocument[0].get('_id')
        const nickname = creatorDocument[0].get('personal').nickname
        const contest = new Contest(
            {
                type: 'waiting',
                name,
                description,
                duration,
                teams: teams.map((value, index) => {
                    return {
                        name: `Team ${index + 1}`,
                        size: value,
                        members: [],
                        score: Array.from({ length: tasksCount }).fill(null)
                    }
                }),
                tasks: await Task.getRandom(tasksCount),
                privacy: {
                    access: privacy.access,
                    invited: privacy.invited
                },
                creator: { _id, nickname },
                dates: {
                    start: null,
                    end: null
                }
            }
        )
        contest.teams[0].members.push({ _id, nickname })

        await contest.save()
        return res.status(200).json({ _id: contest._id })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default create
