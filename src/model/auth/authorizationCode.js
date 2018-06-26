const mongoose = require('mongoose')

const schema = mongoose.Schema({

    code: { type: String, unique: true, required: true },

    clientId: { type: String, required: true },

    userId: { type: String, required: true },

    redirectUri: { type: String },

    scope: [String]

})

module.exports = mongoose.model('authorizationCode', schema, 'authorizationCode')
