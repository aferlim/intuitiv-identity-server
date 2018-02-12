
import User from '../schemas/user/user'

import { ok, error } from '../lib/result-promisses'

module.exports = app => {
    //
    app.route('/users')

        .post((req, res) => {
            //
            let candidate = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            }

            User.add(candidate)
                .then(data => ok(res, data))
                .catch(err => error(res, err))
        })
        .get((req, res) => {
            User.findAll({})
                .then(data => ok(res, data))
                .catch(err => error(res, err))
        })
}
