import { asyncHandler } from '../../helpers/async'
import httpError from '../../helpers/error'
import fs from 'fs'

const root = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { avatar, nickname, name, lastName } = req.body

    try {
        if (avatar) {
            await fs.writeFile(`./public/images/avatars/${user._id.toString()}.png`, avatar.replace(/^data:image\/png;base64,/, ''), 'base64', () => {})
        }
        user.personal.nickname = nickname
        user.personal.name = name
        user.personal.lastName = lastName
        user.markModified('personal')
        await user.save()
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default root
