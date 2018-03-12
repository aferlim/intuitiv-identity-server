import bcrypt from 'bcrypt-nodejs'

module.exports = {
    methods: {
        presave: (callback) => {
            if (!this.isModified('password')) return callback()

            var salt = bcrypt.genSaltSync(5)
            var hash = bcrypt.hashSync(this.password, salt)

            this.password = hash
            callback()
        },

        verifyPassword: (password, userpass, back) => {
            bcrypt.compare(password, userpass, (err, isMatch) => {
                if (err) { return back(err) }

                back(null, isMatch)
            })
        }
    }
}
