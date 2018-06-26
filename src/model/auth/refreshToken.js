const mongoose = require('mongoose')

const schema = mongoose.Schema({

    refreshToken: { type: String, unique: true, required: true },

    clientId: { type: String, required: true },

    userId: { type: String, required: true }

})

module.exports = mongoose.model('refreshToken', schema, 'refreshToken')
