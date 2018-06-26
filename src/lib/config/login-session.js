module.exports = function (req, res, next) {

    if (!(req.path === '/login' || req.path.startsWith('/oauth/')) && req.session.returnUrl) {
        delete req.session.returnUrl
    }
    next()
}
