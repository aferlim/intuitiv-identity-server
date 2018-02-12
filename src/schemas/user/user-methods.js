import bcrypt from 'bcrypt-nodejs'

module.exports = {
    presave: (user, callback) => {
        if (!user.isModified('password')) return callback()

        var salt = bcrypt.genSaltSync(5)
        var hash = bcrypt.hashSync(user.password, salt)

        user.password = hash
        callback()
    },

    verifyPassword: (password, userpass, back) => {
        bcrypt.compare(password, userpass, (err, isMatch) => {
            if (err) { return back(err) }

            back(null, isMatch)
        })
    }
}
