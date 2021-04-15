import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import Task from '../../models/Task'
import Package from '../../models/Package'

const root = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { _id } = req.query

    try {
        if (_id) {
            validator.set
                .value(_id)
                .is.ObjectId().check('task must be valid')
            const { name, task } = await Task.findOne({ _id })
            const packages = user ? await Package.find({ creator: user._id, task: _id }).sort([['date', -1]]) : []
            return res.status(200).json({ _id, name, task, packages })
        } else {
            const tasks = await Task.find({}, { _id: 1, name: 1 })
            return res.status(200).json(tasks)
        }
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default root
