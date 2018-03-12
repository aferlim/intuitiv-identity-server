import mongoose from 'mongoose'
import ex from 'extend'

import scopeSchema from './scope-schema'

const schema = mongoose.Schema({

    name: { type: String, unique: true, required: true },

    secret: { type: String, required: true },

    admin: { type: String },

    scope: [scopeSchema],

    returnUrl: { type: String, required: true },

    created: { type: Date }

})

ex(schema, require('./client-statics'), require('./client-methods'))

module.exports = mongoose.model('client', schema, 'client')
