import scope from '../schemas/auth/scope'

import { ok, error, errorRender } from '../lib/handler/base-result'

module.exports = app => {
    //
    app.route('/api/client/scope')

        .post((req, res) => {
            //
            let candidate = {
                _id: req.body.id,
                name: req.body.name
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

    app.route('/client/scope')
        .get((req, res) => {
            scope.findAll({})

                .then(data => res.render('client/scope-list', { scopes: data }))

                .catch(err => errorRender(res, err))
        })
}
