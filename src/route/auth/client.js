const { check, validationResult } = require('express-validator/check')
const { notfoundRender, errorRender } = require('../../lib/handler/base-result')

const scope = require('../../model/auth/scope')
const clientModel = require('../../model/auth/client')

const { isLoggedIn } = require('../../lib/config/passport')

const moment = require('moment')

let scopesList = null

const loadScopes = (ok, result) => {
    if (scopesList) {
        return ok(scopesList, result)
    }

    return scope.findAll({})
        .then(data => {
            scopesList = data

            ok(data, result)
        })
        .catch(err => errorRender(result, err))
}

module.exports = app => {
    app.route('/client')

        .get(isLoggedIn, (req, res) => {
            clientModel.findAllOrMany({})
                .then(data => res.render('client/client-list', { clients: data }))

                .catch(err => errorRender(res, err))
        })

    app.route('/client/add')

        .get(isLoggedIn, (req, res) => {

            scopesList = null

            loadScopes((data, result) => {
                let model = { errors: undefined, scopes: data }
                result.render('client/client-add', model)
            }, res)
        })

        .post(
            [
                isLoggedIn,

                check('name').trim().isLength({ min: 3, max: 200 }),

                check('secret').trim().isLength({ min: 3 })
                    .custom(value => {
                        return clientModel.findOne({ secret: value }).then(scres => {
                            if (scres) { throw new Error('this client is already in use') }
                        })
                            .catch(err => { throw new Error(err) })
                    }),

                check('returnUrl')
                    .matches(/http(?:s)?:\/\/([\d]*)/i)
            ],
            (req, res, next) => {
                let errors = validationResult(req)

                if (!errors.isEmpty()) {
                    loadScopes((data, result) => {
                        let model = { errors: errors.array(), scopes: data }
                        return res.render('client/client-add', model)
                    }, res)

                    return
                }

                scope.findAll({ _id: { $in: req.body.scope } })
                    .then(data => {
                        let candidate = {
                            name: req.body.name,
                            secret: req.body.secret,
                            admin: 1,
                            scope: data,
                            redirectUri: req.body.returnUrl,
                            created: moment()
                        }

                        clientModel.add(candidate)

                            .then(data => {
                                scopesList = null
                                res.redirect('/client')
                            })

                            .catch(err => errorRender(res, err))
                    })

                    .catch(err => errorRender(res, err))
            })

    app.route('/client/remove')

        .post(isLoggedIn, (req, res) => {
            if (!req.body.clientId || req.body.clientId === '') {
                notfoundRender(res, null)
            }

            clientModel.removeOne(req.body.clientId)
                .then(data => {
                    scopesList = null
                    res.redirect('/client')
                })
                .catch(err => {
                    errorRender(res, err)
                })
        })
}
