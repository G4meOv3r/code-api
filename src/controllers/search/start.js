import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'

import Searcher from '../../models/Searcher'

const start = asyncHandler(async (req, res, next) => {
    const { user } = req

    try {
        const searcher = new Searcher({
            searcher: user._id,
            date: (new Date()),
            contest: null
        })
        await searcher.save()
        return res.status(200).json({ _id: searcher._id })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default start
