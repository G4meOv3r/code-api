import { asyncHandler } from '../../helpers/async'
import validator from '../../helpers/validator'
import httpError from '../../helpers/error'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../../models/User'

const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

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
    } catch (error) {
        return res.status(400).json(httpError(400, error.message))
    }

    try {
        const user = await User.findOne({ 'auth.email': email })
        if (!user) {
            return res.status(400).json(httpError(400, 'invalid email or password'))
        }
        const match = await bcrypt.compare(password, user.auth.password)
        if (!match) {
            return res.status(400).json(httpError(400, 'invalid email or password'))
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
        user.auth.tokens = user.auth.tokens.concat({ token })

        await user.save()
        return res.status(200).json({ _id: user._id, token })
    } catch (error) {
        return res.status(500).json(httpError(500, error.message))
    }
})

export default signin
