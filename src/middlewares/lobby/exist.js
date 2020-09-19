import { asyncHandler } from "../../helpers/async";
import httpError from "../../helpers/error";
import validator from "../../helpers/validator";

import Lobby from "../../models/User"


const catching = asyncHandler(async (req, res, next) => {

    const { user } = req;

    try {

        let { lobby } = user.activity;
        if (!lobby) {
            return res.status(401).json(httpError(401, "you are not in the lobby"));
        }

        req.lobby = lobby;

        return next();

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

})

const through = asyncHandler(async (req, res, next) => {

    const { user } = req;

    try {

        if (user) {
            req.lobby = user.activity;
        }

        return next();

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

})

export default {
    catching: catching,
    through: through
};

