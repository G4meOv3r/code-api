import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'

import Package from '../../models/Package'

const rootGet = asyncHandler(async (req, res, next) => {
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
        const pkg = await Package.findOne({ _id })
        if (!pkg) {
            console.log(pkg)
            return res.status(400).json(httpError(400, 'package does not exist'))
        }
        if (!pkg.creator.equals(user._id)) {
            return res.status(401).json(httpError(401, 'you must be creator to get package'))
        }
        const { tests, compiler, task, code, score, date } = pkg
        res.status(200).json({ _id, tests, compiler, task, code, score, date })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default rootGet
