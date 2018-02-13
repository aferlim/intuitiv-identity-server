
import mongoose from 'mongoose'
import extend from 'extend'

import { ok, nok } from '../../lib/handler/schema'

const schema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true }

}, { _id: false })

schema.pre('save', function(next) {
    this._id = this._id
    console.log(this.name)
    next()
})

let statics = {
    findAll: function (filter) {
        return this.find(filter)
            .exec()
            .then(ok)
            .catch(nok)
    },

    add: function (candidate, callback) {
        if (!candidate.name || candidate.name === '') { return nok('invalid scope') }

        let ins = new this(candidate)

        return ins.save()
            .then(ok)
            .catch(nok)
    }
}

extend(schema.statics, statics)

module.exports = mongoose.model('scope', schema, 'scope')
