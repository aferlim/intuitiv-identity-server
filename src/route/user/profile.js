const { isLoggedIn, passport } = require('../../lib/config/passport')

module.exports = (app) => {

    app.get('/profile', isLoggedIn, (req, res) => {

        res.render('user/profile', {
            user: req.user
        })

    })

    app.get('/profile/link/facebook', isLoggedIn, passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }))
}
