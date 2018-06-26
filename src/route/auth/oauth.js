const { isLoggedIn, isClientAuthenticated } = require('../../lib/config/passport')

const { authorization, decision, token } = require('../../lib/config/oauth')

module.exports = app => {

    app.route('/oauth/authorize')
        .get(isLoggedIn, authorization)
        .post(isLoggedIn, decision)

    app.post('/oauth/token', isClientAuthenticated, token)

}
