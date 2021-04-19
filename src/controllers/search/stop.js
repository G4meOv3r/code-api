import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'

import Searcher from '../../models/Searcher'

const stop = asyncHandler(async (req, res, next) => {
    const { user } = req

    try {
        await Searcher.findOneAndDelete({ searcher: user._id })
        return res.status(200).json({})
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default stop
