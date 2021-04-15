import Contest from '../../models/Contest'
import Package from '../../models/Package'
import Task from '../../models/Task'

const onContestSubscribe = async (data, socket) => {
    const { _id } = data
    const { user } = socket
    let contest = await Contest.findOne({ _id })

    const unsubscribeContest = Contest.subscribe(async (data) => {
        if (data.documentKey._id.equals(_id)) {
            console.log(data.fullDocument)
            const filledTasks = await Promise.all(data.fullDocument.tasks.map(async taskId => {
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
                isCreator = user._id.equals(data.fullDocument.creator._id)
                for (const { members } of data.fullDocument.teams) {
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

            if (contest.tasks.reduce((accumulator, value) => {
                return accumulator && data.fullDocument.tasks.reduce((otherAccumulator, otherValue) => {
                    return otherAccumulator || otherValue.equals(value)
                })
            })) {
                contest = data.fullDocument
            }
            const { _id, type, name, description, duration, teams, privacy, dates, creator } = data.fullDocument
            socket.emit(`contest:${_id}:update`, { _id, type, name, description, duration, teams, privacy, dates, creator, tasks: filledTasks, isMember, isCreator })
        }
    })

    const unsubscribePackages = Package.subscribe((data) => {
        if (data.fullDocument.creator.equals(user._id)) {
            if (contest.tasks.reduce((accumulator, value) => {
                return accumulator || value.equals(data.fullDocument._id)
            })) {
                socket.emit(`contest:${_id}:package:update`, data.fullDocument)
            }
        }
    })

    socket.on(`contest:${_id}:unsubscribe`, () => {
        unsubscribeContest()
        unsubscribePackages()
    })
}

export default onContestSubscribe
