import mongoose from 'mongoose'
import { subscribable } from '../helpers/subscribable'

const Schema = mongoose.Schema
const schema = new Schema({
    type: {
        type: String
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    duration: {
        type: Number
    },
    teams: [
        {
            name: {
                type: String
            },
            size: {
                type: Number
            },
            members: [
                {
                    _id: {
                        type: mongoose.ObjectId
                    },
                    nickname: {
                        type: String
                    }
                }
            ],
            score: [
                {
                    type: Number
                }
            ]
        }
    ],
    tasks: [
        {
            type: mongoose.ObjectId
        }
    ],
    privacy: {
        access: {
            type: Number
        },
        invited: [
            {
                type: mongoose.ObjectId
            }
        ]
    },
    dates: {
        start: String,
        end: String
    },
    creator: {
        _id: {
            type: mongoose.ObjectId
        },
        nickname: {
            type: String
        }
    }
})

const Contest = mongoose.model('Contest', schema)
export default subscribable(Contest)
