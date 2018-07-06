const { isLoggedIn, isClientAuthenticated, passport } = require('../../lib/config/passport')

const { authorization, decision, token } = require('../../lib/config/oauth')

module.exports = app => {

    app.route('/oauth/authorize')
        .get(isLoggedIn, authorization)
        .post(isLoggedIn, decision)

    app.post('/oauth/token', isClientAuthenticated, token)

    // Facabook
    app.get('/oauth/facebook/callback', function (req, res, next) {
        passport.authenticate('facebook', { failureFlash: true }, function (err, user, info) {

            // if (err) { return next(err) }

            if (err || !user) { return res.redirect(`/login?returnUrl=${encodeURIComponent(req.session.returnUrl)}`) }

            req.logIn(user, function (err) {

                if (err) { return next(err) }

                let returnUrl = '/profile'

                if (req.session.returnUrl) {

                    returnUrl = decodeURIComponent(req.session.returnUrl)

                    delete req.session.returnUrl

                }

                res.redirect(returnUrl)

            })
        })(req, res, next)

    })
}
