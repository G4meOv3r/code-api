import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'
import jwt from 'jsonwebtoken'
import fs from 'fs'

import User from '../../models/User'

const signup = asyncHandler(async (req, res, next) => {
    const { email, password, repeat } = req.body

    try {
        validator.set
            .value(email)
            .is.exist().check('email must exist')
            .is.string().check('email must be a string')
            .is.email().check('email must be a valid email')

        validator.set
            .value(password)
            .is.exist().check('password must exist')
            .is.string().check('password must be a string')
            .is.equals(repeat).check('password and repeat must be equals')
    } catch (error) {
        return res.status(400).json(httpError(400, error.message))
    }

    try {
        let user = await User.findOne({ 'auth.email': email })
        if (user) {
            return res.status(400).json(httpError(400, 'email must be unique'))
        }

        user = new User()
        user.auth.email = email
        user.auth.password = password
        const token = jwt.sign({ _id: user.id }, process.env.JWT_KEY)
        user.auth.tokens = user.auth.tokens.concat({ token })
        user.personal.nickname = email
        await fs.copyFile('./public/images/avatars/placeholder.png', `./public/images/avatars/${user._id.toString()}.png`)

        await user.save()

        return res.status(200).json({ _id: user._id, token })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default signup
