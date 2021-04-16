import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import Task from '../../models/Task'
import Package from '../../models/Package'

const root = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { _id, code, compiler } = req.body

    try {
        validator.set
            .value(_id)
            .is.ObjectId().check('_id must be valid')
        validator.set
            .value(compiler)
            .is.in.array(['Python 3.9']).check('compiler must be valid (Python 3.9)')
    } catch (error) {
        return res.status(400).json(httpError(400, error.message))
    }

    try {
        const task = await Task.findOne({ _id })
        if (task) {
            const pkg = new Package({
                creator: user._id,
                task: _id,
                compiler,
                code,
                tests: Array.from({ length: task.tests.length }).fill({ status: null, time: null }),
                score: null,
                date: Date()
            })
            await pkg.save()
        } else {
            return res.status(400).json(httpError(400, 'task does not exist'))
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(httpError(500, error.message))
    }
})

export default root
