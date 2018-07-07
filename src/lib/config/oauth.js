const oauth2orize = require('oauth2orize')
const moment = require('moment-timezone')
const url = require('url')
const crypto = require('crypto')
const utils = require('../../lib/utils')

const { Client, Scope, AccessToken, AuthorizationCode, RefreshToken } = require('../../model/auth')

const server = oauth2orize.createServer()

server.serializeClient((client, done) => done(null, client._id))

server.deserializeClient((id, done) => {

    Client.findById(id, (err, client) => {

        if (err) return done(err)
        return done(null, client)

    })

})

// Register grant (used to issue authorization codes)
server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, done) => {

    let code = utils.uid(32)

    let codeHash = crypto.createHash('sha1').update(code).digest('hex')

    let authorizationCode = new AuthorizationCode({
        code: codeHash,
        clientId: client._id,
        redirectUri: redirectURI,
        userId: user.username,
        scope: ares.scope || ['profile']
    })

    authorizationCode.save((err) => {

        if (err) return done(err)
        done(null, code)

    })

}))

server.grant(oauth2orize.grant.token(function (client, user, ares, req, done) {

    if (req.redirectURI !== client.redirectUri) return done(null, false)

    let token = utils.uid(32)
    let tokenHash = crypto.createHash('sha1').update(token).digest('hex')
    let expirationDate = moment().add(2, 'hours')

    let accessToken = new AccessToken({
        token: tokenHash,
        expirationDate: expirationDate,
        userId: user.username,
        clientId: client._id,
        scope: ares.scope || ['profile']
    })

    accessToken.save((err) => {

        if (err) return done(err)

        return done(null, token, { expires_in: expirationDate.format('MM_DD_YYYY_HH_mm_ss'), scope: accessToken.scope })

    })

}))

// Used to exchange authorization codes for access token
server.exchange(oauth2orize.exchange.code((client, code, redirectURI, done) => {

    let codeHash = crypto.createHash('sha1').update(code).digest('hex')

    AuthorizationCode.findOne({ code: codeHash }, (err, authCode) => {

        if (err) return done(err)

        if (!authCode) return done(null, false)

        if (client._id.toString() !== authCode.clientId) return done(null, false)

        if (redirectURI !== authCode.redirectUri) return done(null, false)

        AuthorizationCode.remove({ code: codeHash }, (err) => {

            if (err) return done(err)

            let tokenCode = utils.uid(32)
            let refreshTokenCode = utils.uid(32)

            let tokenHash = crypto.createHash('sha1').update(tokenCode).digest('hex')

            let refreshTokenHash = crypto.createHash('sha1').update(refreshTokenCode).digest('hex')

            let expirationDate = moment().add(2, 'hours')

            let accessToken = new AccessToken({
                token: tokenHash,
                expirationDate: expirationDate,
                userId: authCode.userId,
                clientId: authCode.clientId,
                scope: authCode.scope
            })

            accessToken.save((err) => {

                if (err) return done(err)

                let refreshToken = new RefreshToken({
                    refreshToken: refreshTokenHash,
                    clientId: authCode.clientId,
                    userId: authCode.userId
                })

                refreshToken.save((err) => {

                    if (err) return done(err)

                    done(null, tokenCode, { expires_in: expirationDate, refreshToken: refreshTokenCode, scope: accessToken.scope })

                })

            })

        })

    })

}))

// Refresh Token

server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {

    let refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex')

    RefreshToken.findOne({ refreshToken: refreshTokenHash }, (err, token) => {

        if (err) return done(err)

        if (!token) return done(null, false)

        if (client._id.toString() !== token.clientId) return done(null, false)

        let newAccessToken = utils.uid(32)

        let accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex')

        let expirationDate = moment().add(2, 'hours')

        AccessToken.update({ userId: token.userId }, { $set: { token: accessTokenHash, expirationDate: expirationDate } }, (err) => {

            if (err) return done(err)

            done(null, newAccessToken, refreshToken, { expires_in: expirationDate })

        })
    })
}))

const loadscopes = (scope, done) => {

    Scope.findAll({})
        .then(data => {

            let result = scope.length > 0 ? data.filter((el) => scope.filter((e) => el.name === e).length > 0) : data

            done(result.length ? result : data)

        })
        .catch(err => done([], err))
}

module.exports = {

    authorization: [
        server.authorization((clientId, redirectUri, scope, callback) => {

            Client.findById(clientId, (err, client) => {

                if (!client) {
                    return callback(null, false)
                }

                if (!client.redirectUri || client.redirectUri.indexOf(url.parse(redirectUri).hostname) < 0) {
                    err = new Error('Redirect URI does not match registered redirect URI')
                    err.name = 'Error'
                    err.status = 400
                    err.code = 400
                }

                if (err) { return callback(err) }

                return callback(null, client, redirectUri)
            })
        }),
        (req, res) => {

            if (req.session.authorize) {
                for (var key in req.session.authorize) {
                    if (key !== req.oauth2.transactionID) {
                        delete req.session.authorize[key]
                    }
                }
            }

            let scope = req.query['scope'].replace(/\s/g, '').split(/,/)

            loadscopes(scope, (result) =>
                res.render('oauth/decision', {
                    layout: 'layout-oauth',
                    transactionID: req.oauth2.transactionID,
                    user: req.user,
                    client: req.oauth2.client,
                    scope: result
                }))

        }
    ],

    decision: [
        server.decision((req, done) => done(null, { scope: req.body.scope }))
    ],

    token: [
        server.token(),
        server.errorHandler()
    ]
}
