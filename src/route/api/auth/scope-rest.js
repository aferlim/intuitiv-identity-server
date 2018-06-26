const { check, validationResult } = require('express-validator/check')
const express = require('express')

const scope = require('../../../model/auth/scope')
const { ok, error, badrequest } = require('../../../lib/handler/base-result')

module.exports = app => {
    const apiRouter = express.Router()

    apiRouter.route('/client/scope')

        .post([
            check('name').trim().isLength({ min: 3, max: 200 })
                .withMessage('Please insert a valid name')
                .custom(value => {
                    return scope.findAll({ name: value }).then(scres => {
                        if (scres && scres.length) { throw new Error('this scope is already in use') }
                    })
                        .catch(err => { throw new Error(err) })
                })
        ],
        (req, res) => {
            let errors = validationResult(req)

            if (!errors.isEmpty()) {
                return badrequest(res, errors.mapped())
            }

            let candidate = {
                _id: req.body.name,
                name: req.body.name,
                description: req.body.description
            }

            scope.add(candidate)
                .then(data => ok(res, data))
                .catch(err => error(res, err))
        })
        .get((req, res) => {
            scope.findAll({})
                .then(data => ok(res, data))
                .catch(err => error(res, err))
        })

    app.use('/api', apiRouter)
}
