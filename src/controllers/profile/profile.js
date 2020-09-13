import { asyncHandler } from '../../helpers/async';
import validator from "../../helpers/validator";
import httpError from "../../helpers/error";

import User from "../../models/User";

const profile = asyncHandler(async (req, res, next) => {
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

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(400).json(httpError(400, "invalid '_id'"));
        }

        if (req.user) {
            if (user._id.equals(req.user._id)) {
                return res.status(200).json({ user: user.private() });
            }
        }

        return res.status(200).json({ user: user.public() });

    } catch (error) {
        return res.status(500).json(httpError(500, error.message));
    }

});

export default {
    profile: {
        get: profile,
    }
}