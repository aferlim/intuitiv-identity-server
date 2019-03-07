const passport = require('passport')
const moment = require('moment')
const crypto = require('crypto')
const extend = require('extend')

const LocalStrategy = require('passport-local').Strategy
const { BasicStrategy } = require('passport-http')
const BearerStrategy = require('passport-http-bearer').Strategy

const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../../model/user/user')
const { Client, AccessToken } = require('../../model/auth')
const config = require('./global')

passport.use(
    'local-login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        function (req, email, password, done) {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(
                            null,
                            false,
                            req.flash('loginMessage', 'No user found.')
                        )
                    }

                    user.verifyPassword(
                        user.password,
                        password,
                        (err, isMatch) => {
                            if (err || !isMatch) {
                                return done(
                                    null,
                                    false,
                                    req.flash(
                                        'loginMessage',
                                        'Oops! Wrong password.'
                                    )
                                )
                            }

                            return done(null, user)
                        }
                    )
                })
                .catch(err => done(err))
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
        done(err, user)
    })
})

const islogged = (req, res, next) => {
    // return next()

    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect(`/login?returnUrl=${encodeURIComponent(req.originalUrl)}`)
}

passport.use(
    'client-basic',
    new BasicStrategy(function (clientId, clientSecret, done) {
        Client.findById(clientId, (err, client) => {
            if (err) return done(err)

            if (!client) return done(null, false)

            if (client.secret === clientSecret) return done(null, client)
            else return done(null, false)
        })
    })
)

passport.use(
    new BearerStrategy(function (accessToken, done) {
        let accessTokenHash = crypto
            .createHash('sha1')
            .update(accessToken)
            .digest('hex')

        AccessToken.findOne({ token: accessTokenHash }, (err, token) => {
            if (err) return done(err)

            if (!token) return done(null, false)

            if (moment(token.expirationDate).diff(moment(), 'seconds') < 0) {
                // comment and add expire index on mongodb is recommended
                // AccessToken.remove({ token: accessTokenHash }, function (err) { done(err) })
                done(null, false)
            } else {
                User.findOne({ username: token.userId }, (err, user) => {
                    if (err) return done(err)

                    if (!user) return done(null, false)

                    var info = { scope: token.scope.join(',') }

                    done(null, user, info)
                })
            }
        })
    })
)

passport.use(
    new FacebookStrategy(
        {
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret,
            callbackURL: config.facebookAuth.callbackURL,
            profileFields: config.facebookAuth.profileFields,
            passReqToCallback: true
        },
        function (req, accessToken, refreshToken, profile, done) {
            let facebook = {
                id: profile.id, // set the users facebook id
                token: accessToken, // we will save the token that facebook provides to the user
                name: profile.name.givenName + ' ' + profile.name.familyName, // look at the passport user profile to see how names are returned
                email: profile.emails[0].value
            }

            if (req.user) {
                // user is already logged in.  link facebook profile to the user
                let user = req.user

                extend(user, { facebook: facebook })

                User.update({ _id: user._id }, { $set: { facebook: facebook } })
                    .then(() => done(null, user))
                    .catch(err =>
                        done(
                            err,
                            false,
                            req.flash('loginMessage', 'Oops! Wrong password.')
                        )
                    )
            } else {
                // not logged in.  find or create the user based on facebook profile
                User.findOne({ 'facebook.id': profile.id })
                    .then(user => {
                        if (!user) {
                            done(
                                null,
                                false,
                                req.flash(
                                    'loginMessage',
                                    'Invalid Facebook Login.'
                                )
                            )
                        }

                        extend(user, { facebook: facebook })

                        User.update(
                            { _id: user._id },
                            { $set: { facebook: facebook } }
                        )
                            .then(() => done(null, user))
                            .catch(err => done(err))
                    })
                    .catch(err => done(err))
            }
        }
    )
)

module.exports = {
    initialize: () => passport.initialize(),

    useSession: () => passport.session(),

    isLoggedIn: (req, res, next) => islogged(req, res, next),

    isClientAuthenticated: passport.authenticate('client-basic', {
        session: false
    }),

    isBearerAuthenticated: passport.authenticate('bearer', { session: false }),

    passport: passport
}
