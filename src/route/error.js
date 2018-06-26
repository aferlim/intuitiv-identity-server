
module.exports = app => {

    app.get('/notfound', (req, res) => {

        res.render('error/notfound', { layout: 'layout-login' })

    })

    app.get('/500', (req, res) => {

        res.render('error/500', { layout: 'layout-login' })

    })
}
