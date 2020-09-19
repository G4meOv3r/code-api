import { asyncHandler } from '../../helpers/async';
import validator from "../../helpers/validator";
import httpError from "../../helpers/error";

import Lobby from "../../models/Lobby";

const lobby = asyncHandler(async (req, res, next) => {
    const { _id } = req.query;

    try {

        validator.set
            .value(_id)
            .is.exist().check("'_id' must exist")
            .is.string().check("'_id' must be a string")
            .is.length(24).check("'_id' length must be 24");

    } catch (error) {
        return res.status(400).json(httpError(400, error.message));
    }

    try {

        const lobby = await Lobby.findOne({ _id });

        if (!lobby) {
            return res.status(400).json(httpError(400, "invalid '_id'"));
        }

        if (req.lobby) {
            if (lobby._id.equals(req.lobby._id)) {
                return res.status(200).json({ lobby: lobby });
            }
        }

        return res.status(200).json({ lobby: lobby });

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

});

export default {
    lobby: {
        get: lobby,
    }
}