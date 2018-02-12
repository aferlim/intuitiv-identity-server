const mongoose = require('mongoose')

const ex = require('extend')

const scopes = require('./scope')

const schema = mongoose.Schema({

    name: { type: String, unique: true, required: true },

    id: { type: String, required: true },

    secret: { type: String, required: true },

    admin: { type: String, required: true },

    scope: [scopes],

    returnUrl: { type: String, required: true }

})

const methods = { methods: undefined }

ex(schema, methods)

module.exports = mongoose.model('client', schema, 'client')
