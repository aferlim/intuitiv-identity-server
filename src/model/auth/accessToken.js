const mongoose = require('mongoose')

const schema = mongoose.Schema({

    token: { type: String, unique: true, required: true },

    clientId: { type: String, required: true },

    userId: { type: String, required: true },

    expirationDate: { type: Date },

    scope: [String]

})

module.exports = mongoose.model('accessToken', schema, 'accessToken')
