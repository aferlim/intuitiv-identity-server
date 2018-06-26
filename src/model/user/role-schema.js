const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },

    description: { type: String, required: true }
})

module.exports = roleSchema
