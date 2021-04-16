import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'

import Searcher from '../../models/Searcher'

const search = asyncHandler(async (req, res, next) => {
    const { user } = req

    try {
        const searcher = new Searcher({
            searcher: user._id,
            date: (new Date())
        })
        await searcher.save()
        return res.status(200).json({})
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default search
