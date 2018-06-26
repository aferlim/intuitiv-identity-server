const { check, validationResult } = require('express-validator/check')

const scope = require('../../model/auth/scope')
const { notfoundRender, errorRender } = require('../../lib/handler/base-result')

const { isLoggedIn } = require('../../lib/config/passport')

module.exports = app => {
    app.route('/client/scope')

        .get(isLoggedIn, (req, res) => {
            scope.findAll({})

                .then(data => res.render('client/scope-list', { scopes: data }))

                .catch(err => errorRender(res, err))
        })

    app.route('/client/scope/add')

        .get(isLoggedIn, (req, res) => res.render('client/scope-add', { errors: undefined }))

        .post(
            [
                isLoggedIn,

                check('name').trim().isLength({ min: 3, max: 200 })
                    .withMessage('Please insert a valid name')
                    .custom(value => {
                        return scope.findById(value).then(scres => {
                            if (scres) { throw new Error('this scope is already in use') }
                        })
                            .catch(err => { throw new Error(err) })
                    }),
                check('description').trim().isLength({ min: 3 })
            ],
            (req, res, next) => {
                let errors = validationResult(req)

                if (!errors.isEmpty()) {
                    return res.render('client/scope-add', { errors: errors.array() })
                }

                let candidate = {
                    _id: req.body.name,
                    name: req.body.name,
                    description: req.body.description
                }

                scope.add(candidate)

                    .then(data => res.redirect('/client/scope'))

                    .catch(err => errorRender(res, err))
            })

    app.route('/client/scope/remove')

        .post(isLoggedIn, (req, res) => {

            if (!req.body.scopeId || req.body.scopeId === '') {
                return notfoundRender(res, null)
            }

            scope.findById(req.body.scopeId).then(item => {
                if (!item) {
                    return notfoundRender(res, null)
                }

                item.removeIt()
                    .then(data => {
                        res.redirect('/client/scope')
                    })
                    .catch(err => {
                        errorRender(res, err)
                    })
            })
        })
}
