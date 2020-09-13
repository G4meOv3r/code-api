import { asyncHandler } from "../helpers/async";
import httpError from "../helpers/error";
import validator from "../helpers/validator";
import jwt from "jsonwebtoken";

import User from "../models/User"

const catching = asyncHandler(async (req, res, next) => {

    let token = req.header("Authorization");

    try {

        validator.set
            .value(token)
            .is.exist().check('authorization bearer must exist')
            .is.string().check('authorization bearer must be a string');
        token = token.replace('Bearer ', '');

    } catch (error) {
        res.status(400).json({ error: 400, name: "Bad Request", message: error.message });
    }

    try {

        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: data._id, 'personal.tokens.token': token });

        if (!user) {
            res.status(401).json({ error: 401, name: "Unauthorized", message: "bad authorization bearer" });
        }
        req.user = user;
        req.token = token;

        return next();

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

})

const through = asyncHandler(async (req, res, next) => {

    let token = req.header("Authorization");

    validator.set
        .value(token)
        .is.exist()
        .is.string();
    if (!validator.total) {
        next();
    }
    token = token.replace('Bearer ', '');

    try {

        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: data._id, 'personal.tokens.token': token });

        if (!user) {
            res.status(401).json({ error: 401, name: "Unauthorized", message: "bad authorization bearer" });
        }
        req.user = user;
        req.token = token;

        return next();

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

})

export default {
    catching,
    through
};