import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'

const signout = asyncHandler(async (req, res, next) => {
    try {
        const { user, token } = req
        user.auth.tokens = user.auth.tokens.filter(
            (tokenObj) => tokenObj.token !== token
        )

        await user.save()
        return res.status(200).json({})
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default signout
