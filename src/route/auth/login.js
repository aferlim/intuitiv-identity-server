const { isLoggedIn, passport } = require('../../lib/config/passport')

module.exports = (app) => {

    app.get('/', (req, res) => res.render('home/home'))

    app.get('/login', (req, res) => {

        if (req.query.returnUrl) {
            req.session.returnUrl = req.query.returnUrl
        }

        res.render('login/signin', { layout: 'layout-login', message: req.flash('loginMessage') })
    })

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', { failureFlash: true }, function (err, user, info) {

            if (err) { return next(err) }

            // Redirect if it fails
            if (!user) { return res.redirect(`/login?returnUrl=${encodeURIComponent(req.session.returnUrl)}`) }

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

    app.get('/logout', isLoggedIn, (req, res) => {
        req.logout()
        res.redirect('/')
    })

}
