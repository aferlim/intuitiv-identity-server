
import mongoose from 'mongoose'
import extend from 'extend'

import { ok, nok } from '../../lib/handler/schema'

import roleSchema from './role-schema'

let statics = {
    statics: {
        findAll: function (filter) {
            return this.find(filter)
                .exec()
                .then(ok)
                .catch(nok)
        },

        add: function (candidate, callback) {
            if (!candidate.name || candidate.name === '') { return nok('invalid role') }

            let ins = new this(candidate)

            return ins.save()
                .then(ok)
                .catch(nok)
        }
    }
}

let methods = {
    methods: {
        removeIt: function () {
            return this.remove()
                .then(ok)
                .catch(nok)
        }
    }
}

extend(roleSchema, statics, methods)

module.exports = mongoose.model('role', roleSchema, 'role')
