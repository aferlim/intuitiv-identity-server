
const User = require('../../model/user/user')
const Role = require('../../model/user/role')

const moment = require('moment')
const { check, validationResult } = require('express-validator/check')
const { notfoundRender, errorRender } = require('../../lib/handler/base-result')

const { isLoggedIn } = require('../../lib/config/passport')

let roleList = null

const getRoles = (ok, result) => {
    if (roleList !== null) {
        return ok(roleList, result)
    }

    Role.findAll({})
        .then(data => {
            roleList = data
            ok(data, result)
        })
        .catch(err => errorRender(result, err))
}

const getAll = (res) => {
    User.findAll({})
        .then(data => res.render('user/user-list', { users: data }))
        .catch(err => errorRender(res, err))
}

const addUser = (req, res, data) => {
    let candidate = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: data.map(item => item.name),
        created: moment()
    }

    User.add(candidate)
        .then(data => res.redirect('/user'))
        .catch(err => errorRender(res, err))
}

module.exports = app => {
    app.route('/user').get(isLoggedIn, (req, res) => getAll(res))

    app.route('/user/add')

        .get(isLoggedIn, (req, res) => getRoles((data, result) =>
            result.render('user/user-add', { roles: data, errors: undefined }), res))

        .post(
            [
                isLoggedIn,

                check('email').isEmail()
                    .withMessage('Please insert a valid email')
                    .custom(value => {
                        return User.findOne({ email: value }).then(scres => {
                            if (scres) { throw new Error('this user email is already in use') }
                        })
                            .catch(err => { throw new Error(err) })
                    }),
                check('username').trim().isLength({ min: 3 }),
                check('password', 'passwords must be at least 6 chars long and contain one number')
                    .isLength({ min: 6 }).matches(/\d/)
            ],
            (req, res, next) => {
                let errors = validationResult(req)

                if (!errors.isEmpty()) {
                    getRoles((data, result) => res.render('user/user-add', { roles: data, errors: errors.array() }), res)
                    return
                }

                Role.findAll({ _id: { $in: req.body.role } })
                    .then(data => addUser(req, res, data))
                    .catch(err => errorRender(res, err))
            })

    app.route('/user/remove')

        .post(isLoggedIn, (req, res) => {
            if (!req.body.userId || req.body.userId === '') {
                return notfoundRender(res, null)
            }

            User.findById(req.body.userId).then(item => {
                if (!item) {
                    return notfoundRender(res, null)
                }

                item.removeIt()
                    .then(data => {
                        res.redirect('/user')
                    })
                    .catch(err => {
                        errorRender(res, err)
                    })
            })
        })
}
