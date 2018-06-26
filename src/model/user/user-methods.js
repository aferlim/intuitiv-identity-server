const bcrypt = require('bcrypt-nodejs')
const { ok, nok } = require('../../lib/handler/schema')

module.exports = {
    methods: {
        presave: (target, callback) => {
            if (!target.isModified('password')) return callback()

            var salt = bcrypt.genSaltSync(5)
            var hash = bcrypt.hashSync(target.password, salt)

            target.password = hash
            callback()
        },

        verifyPassword: (hash, password, back) => {
            return bcrypt.compare(password, hash, (err, isMatch) => {
                if (err) { return back(err) }

                back(null, isMatch)
            })
        },

        removeIt: function () {
            return this.remove()
                .then(ok)
                .catch(nok)
        }
    }
}
