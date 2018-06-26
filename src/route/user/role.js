const { check, validationResult } = require('express-validator/check')

const Role = require('../../model/user/role')
const { notfoundRender, errorRender } = require('../../lib/handler/base-result')
const { isLoggedIn } = require('../../lib/config/passport')

module.exports = app => {
    app.route('/user/role')

        .get(isLoggedIn, (req, res) => {

            Role.findAll({})

                .then(data => res.render('user/role-list', { roles: data }))

                .catch(err => errorRender(res, err))
        })

    app.route('/user/role/add')

        .get(isLoggedIn, (req, res) => res.render('user/role-add', { errors: undefined }))

        .post(
            [
                isLoggedIn,

                check('name').trim().isLength({ min: 3, max: 200 })
                    .withMessage('Please insert a valid name')
                    .custom(value => {
                        return Role.findOne({name: value}).then(scres => {
                            if (scres) { throw new Error('this role is already in use') }
                        })
                            .catch(err => { throw new Error(err) })
                    }),
                check('description').trim().isLength({ min: 3 })
            ],
            (req, res, next) => {
                let errors = validationResult(req)

                if (!errors.isEmpty()) {
                    return res.render('user/role-add', { errors: errors.array() })
                }

                let candidate = {
                    name: req.body.name,
                    description: req.body.description
                }

                Role.add(candidate)

                    .then(data => res.redirect('/user/role'))

                    .catch(err => errorRender(res, err))
            })

    app.route('/user/role/remove')

        .post(isLoggedIn, (req, res) => {

            if (!req.body.roleId || req.body.roleId === '') {
                return notfoundRender(res, null)
            }

            Role.findById(req.body.roleId).then(item => {

                if (!item) {
                    return notfoundRender(res, null)
                }

                item.removeIt()
                    .then(data => {
                        res.redirect('/user/role')
                    })
                    .catch(err => {
                        errorRender(res, err)
                    })
            })
        })
}
