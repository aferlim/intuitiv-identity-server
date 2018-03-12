import { check, validationResult } from 'express-validator/check'
import { notfoundRender, errorRender } from '../../lib/handler/base-result'

import scope from '../../model/auth/scope'
import clientModel from '../../model/auth/client'
import moment from 'moment'

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
        .get((req, res) => {
            clientModel.findAllOrMany({})
                .then(data => res.render('client/client-list', { clients: data }))

                .catch(err => errorRender(res, err))
        })

    app.route('/client/add')
        .get((req, res) => {
            //
            loadScopes((data, result) => {
                let model = { errors: undefined, scopes: data }
                result.render('client/client-add', model)
            }, res)
        })

        .post(
            [
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
                        //
                        let candidate = {
                            name: req.body.name,
                            secret: req.body.secret,
                            admin: 1,
                            scope: data,
                            returnUrl: req.body.returnUrl,
                            created: moment()
                        }

                        clientModel.add(candidate)

                            .then(data => res.redirect('/client'))

                            .catch(err => errorRender(res, err))
                    })

                    .catch(err => errorRender(res, err))
            })

    app.route('/client/remove')
        .post((req, res) => {
            //
            if (!req.body.clientId || req.body.clientId === '') {
                notfoundRender(res, null)
            }

            clientModel.removeOne(req.body.clientId)
                .then(data => {
                    res.redirect('/client')
                })
                .catch(err => {
                    errorRender(res, err)
                })
        })
}
