import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'

import Searcher from '../../models/Searcher'

const root = asyncHandler(async (req, res, next) => {
    const { user } = req

    try {
        const searcher = await Searcher.findOne({ searcher: user._id })
        const searchers = await Searcher.countDocuments()
        return res.status(200).json({
            inSearch: !!searcher,
            searchers,
            date: searcher ? searcher.date : null,
            contest: searcher ? searcher.contest : null
        })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default root
