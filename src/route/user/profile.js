const { isLoggedIn } = require('../../lib/config/passport')

module.exports = (app) => {

    app.get('/profile', isLoggedIn, (req, res) => {

        res.render('user/profile', {
            user: req.user
        })

    })
}
