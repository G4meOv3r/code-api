import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';


const Schema = mongoose.Schema;
const schema = new Schema({
    personal: {
        name: {
            type: String
        },
        lastname: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: false,
                },
            },
        ]
    }
});

schema.pre('save', async function (next) {
    try {
        const user = this;
        if (user.isModified('personal.password')) {
            const salt = await bcrypt.genSalt(10);
            user.personal.password = await bcrypt.hash(user.personal.password, salt);
        }
        next();
    } catch (error) {
        throw error;
    }
});

schema.methods.public = function () {
    const user = this;

    return user.personal;
}

schema.methods.private = function () {
    const user = this;

    return user;
}

const User = mongoose.model('User', schema);
export default User; 