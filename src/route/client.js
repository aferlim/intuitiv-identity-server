import Scope from '../schemas/auth/scope'

import { ok, error } from '../lib/result-promisses'

module.exports = app => {
    //
    app.route('/client/scope')

        .post((req, res) => {
            //
            let candidate = {
                _id: req.body.id,
                name: req.body.name
            }

            Scope.add(candidate)
                .then(data => ok(res, data))
                .catch(err => error(res, err))
        })
        .get((req, res) => {
            Scope.findAll({})
                .then(data => ok(res, data))
                .catch(err => error(res, err))
        })
}
