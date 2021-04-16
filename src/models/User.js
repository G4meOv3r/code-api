import mongoose from 'mongoose'
import { subscribable } from '../helpers/subscribable'

import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema
const schema = new Schema({
    invites: {
        friends: [
            {
                from: { type: mongoose.ObjectId },
                date: { type: Date }
            }
        ],
        contests: [
            {
                _id: { type: mongoose.ObjectId },
                date: { type: Date }
            }
        ]
    },

    auth: {
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
                    required: false
                }
            }
        ]
    },

    personal: {
        nickname: {
            type: String
        },
        name: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        awards: {
            type: Array,
            default: []
        },
        status: {
            type: Number,
            default: 0
        }
    },

    friends: [
        {
            type: mongoose.ObjectId
        }
    ]
})

schema.pre('save', async function (next) {
    const user = this
    if (user.isModified('auth.password')) {
        const salt = await bcrypt.genSalt(10)
        user.auth.password = await bcrypt.hash(user.auth.password, salt)
    }
    next()
})

schema.methods.public = function () {
    const user = this

    return user.personal
}

schema.methods.private = function () {
    return this
}

const User = mongoose.model('User', schema)
export default subscribable(User)
