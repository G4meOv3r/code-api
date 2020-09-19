import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const schema = new Schema({
    members: [
        {
            type: mongoose.ObjectId
        }
    ],
    settings: {
        type: Object,
        default: {
            privacy: 0,
            chat: true,
            invites: [],
        },
    },
    chat: {
        type: Array,
        default: [],
    },
    searcher: mongoose.ObjectId,
})

const Lobby = mongoose.model('Lobby', schema);
export default Lobby; 