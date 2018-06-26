
const mongoose = require('mongoose')
const extend = require('extend')

const { ok, nok } = require('../../lib/handler/schema')

const roleSchema = require('./role-schema')

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
