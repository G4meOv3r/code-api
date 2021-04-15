import mongoose from 'mongoose'
import { subscribable } from '../helpers/subscribable'

const Schema = mongoose.Schema
const schema = new Schema({
    name: {
        type: String
    },
    task: [
        {
            title: {
                type: String,
                text: String
            }
        }
    ],
    tests: Number
})
schema.statics.getRandom = async function (count) {
    const tasks = await this.find({})
    const randomTasks = []
    for (let _ = 0; _ < count; _++) {
        randomTasks.push(tasks[Math.floor(Math.random() * tasks.length)]._id)
    }
    return randomTasks
}

const Task = subscribable(mongoose.model('Task', schema))
export default Task
