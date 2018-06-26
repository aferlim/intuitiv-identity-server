const passport = require('passport')
const moment = require('moment')
const crypto = require('crypto')

const LocalStrategy = require('passport-local').Strategy
const { BasicStrategy } = require('passport-http')
const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../../model/user/user')
const { Client, AccessToken } = require('../../model/auth')

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},

function (req, email, password, done) {

    User.findOne({ email: email }).then(user => {

        if (!user) { return done(null, false, req.flash('loginMessage', 'No user found.')) }

        user.verifyPassword(user.password, password, (err, isMatch) => {

            if (err || !isMatch) { return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')) }

            return done(null, user)
        })

    }).catch(err => done(err))
}))

passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, function (err, user) {
        done(err, user)
    })
})

const islogged = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect(`/login?returnUrl=${encodeURIComponent(req.originalUrl)}`)
}

passport.use('client-basic', new BasicStrategy(

    function (clientId, clientSecret, done) {

        Client.findById(clientId, function (err, client) {

            if (err) return done(err)

            if (!client) return done(null, false)

            if (client.secret === clientSecret) return done(null, client)

            else return done(null, false)
        })
    }
))

passport.use(new BearerStrategy(

    function (accessToken, done) {

        let accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex')

        AccessToken.findOne({ token: accessTokenHash }, function (err, token) {

            if (err) return done(err)

            if (!token) return done(null, false)

            if (moment(token.expirationDate).diff(moment(), 'seconds') < 0) {

                // comment and add expire index on mongodb is recommended
                // AccessToken.remove({ token: accessTokenHash }, function (err) { done(err) })
                done(null, false)

            } else {

                User.findOne({ username: token.userId }, function (err, user) {

                    if (err) return done(err)

                    if (!user) return done(null, false)

                    var info = { scope: token.scope.join(',') }

                    done(null, user, info)

                })
            }
        })
    }
))

module.exports = {

    initialize: () => passport.initialize(),

    useSession: () => passport.session(),

    isLoggedIn: (req, res, next) => islogged(req, res, next),

    isClientAuthenticated: passport.authenticate('client-basic', { session: false }),

    isBearerAuthenticated: passport.authenticate('bearer', { session: false }),

    passport: passport
}
