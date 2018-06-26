module.exports = (err, req, res, next) => {

    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)

    if (err.status === 404) {
        res.format({
            'text/plain': () => {
                res.send({ message: 'not found Data' })
            },
            'text/html': () => {
                res.render('error/notfound', { layout: 'layout-login' })
            },
            'application/json': () => {
                res.send({ message: 'not found data' })
            },
            'default': () => {
                res.status(406).send('Not Acceptable')
            }
        })
    }

    if (err.status === 403) {
        res.format({
            'text/plain': () => {
                res.send({ code: err.code, message: err.message })
            },
            'text/html': () => {
                res.render('error/unauthorized', { layout: 'layout-login', err: err })
            },
            'application/json': () => {
                res.send({ code: err.code, message: err.message })
            },
            'default': () => {
                res.status(406).send('Not Acceptable')
            }
        })
    }

    // when status is 500, error handler
    if (err.status === 500) {
        return res.send({ message: 'error occur' })
    }

    next()
}
