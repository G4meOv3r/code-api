import mongoose from 'mongoose'
import { subscribable } from '../helpers/subscribable'

const Schema = mongoose.Schema
const schema = new Schema({
    searcher: mongoose.ObjectId,
    date: Date,
    contest: mongoose.ObjectId
})

const Searcher = mongoose.model('Searcher', schema)
export default subscribable(Searcher)
