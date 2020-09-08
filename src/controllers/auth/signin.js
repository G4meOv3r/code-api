import { asyncHandler } from "../../helpers/async";
import validator from "../../helpers/validator";
import httpError from "../../helpers/error";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

import User from "../../models/User"

const signin = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    try {

        validator.set
            .value(email)
            .is.exist().check("'email' must exist")
            .is.string().check("'email' must be a string")
            .is.email().check("'email' must be a valid email");

        validator.set
            .value(password)
            .is.exist().check("'password' must exist")
            .is.string().check("'password' must be a string");

    } catch (error) {
        return res.status(400).json(httpError(400, error.message));
    }

    try {

        const user = await User.findOne({ "personal.email": email });
        if (!user) {
            return res.status(400).json(httpError(400, "invalid 'email' or 'paswword'"));
        }
        const match = await bcrypt.compare(password, user.personal.password);
        if (!match) {
            return res.status(400).json(httpError(400, "invalid 'email' or 'paswword'"));
        }
        const token = jwt.sign({ _id: user.id }, process.env.JWT_KEY);
        user.personal.tokens = user.personal.tokens.concat({ token });

        await user.save();
        return res.status(200).json({ token });

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

})

export default signin;