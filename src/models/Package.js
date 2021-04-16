import mongoose from 'mongoose'
import { subscribable } from '../helpers/subscribable'

import Contest from './Contest'

const Schema = mongoose.Schema
const schema = new Schema({
    creator: mongoose.ObjectId,
    task: mongoose.ObjectId,
    compiler: String,
    code: String,
    tests: [
        {
            status: String,
            time: Number
        }
    ],
    score: Number,
    date: Date
})

const Package = subscribable(mongoose.model('Package', schema))
Package.subscribers[0] = async (data) => {
    const pkg = data.fullDocument
    if (pkg.score !== null) {
        const contests = await Contest.find({ type: 'live', 'teams.members._id': pkg.creator, tasks: pkg.task })
        if (contests.length !== 0) {
            for (const contest of contests) {
                const teamNumber = contest.teams.reduce((accumulator, team, index) => {
                    return accumulator + (team.members.length !== 0 && team.members.reduce((otherAccumulator, member) => {
                        return otherAccumulator || member._id.equals(pkg.creator)
                    }, false)
                        ? index + 1
                        : 0
                    )
                }, -1)
                const taskIndex = contest.tasks.reduce((accumulator, taskId, index) => {
                    return accumulator + (taskId.equals(pkg.task) ? index + 1 : 0)
                }, -1)
                if (contest.teams[teamNumber].score[taskIndex] < pkg.score) {
                    contest.teams[teamNumber].score[taskIndex] = pkg.score
                    contest.markModified('teams')
                    await contest.save()
                }
            }
        }
    }
}
export default Package
