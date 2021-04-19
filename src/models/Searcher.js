import mongoose from 'mongoose'
import { subscribable } from '../helpers/subscribable'

import Contest from './Contest'
import Task from './Task'
import User from './User'

const Schema = mongoose.Schema
const schema = new Schema({
    searcher: mongoose.ObjectId,
    date: Date,
    contest: mongoose.ObjectId
})

const Searcher = subscribable(mongoose.model('Searcher', schema))
Searcher.subscribers[0] = async (data) => {
    const searchers = await Searcher.find({ contest: null })
    if (searchers.length >= 2) {
        const members = await User.find({ _id: { $in: [searchers[0].searcher, searchers[1].searcher] } })
        const contest = new Contest(
            {
                type: 'live',
                name: 'Соревновательный контест',
                description: '',
                duration: 60,
                teams: [
                    {
                        name: 'Team 1',
                        size: 1,
                        members: [{ _id: members[0]._id, nickname: members[0].personal.nickname }],
                        score: [null]
                    },
                    {
                        name: 'Team 2',
                        size: 1,
                        members: [{ _id: members[1]._id, nickname: members[1].personal.nickname }],
                        score: [null]
                    }
                ],
                tasks: await Task.getRandom(1),
                privacy: {
                    access: 0,
                    invited: []
                },
                creator: null,
                dates: {
                    start: (new Date()),
                    end: (new Date(Date.now() + 3600000))
                }
            }
        )
        contest.save()

        searchers[0].contest = contest._id
        searchers[1].contest = contest._id
        searchers[0].save()
        searchers[1].save()
    }
}
export default Searcher
