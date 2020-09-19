import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const schema = new Schema({
    lobby: mongoose.ObjectId,
    status: {
        type: Number,
        default: 0
    },
    options: {
        type: Array,
        default: [
            false,
            false,
            false,
            false,
            false
        ],
    },
    date: Date,
    contest: mongoose.ObjectId
})

const Searcher = mongoose.model('Searcher', schema);
export default Searcher; 