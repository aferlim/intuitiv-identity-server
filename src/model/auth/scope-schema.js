import mongoose from 'mongoose'

const scopeSchema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true }

}, { _id: false })

module.exports = scopeSchema
