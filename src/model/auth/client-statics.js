import { ok, nok } from '../../lib/handler/schema'

module.exports = {
    statics: {
        findAllOrMany: function (filter) {
            return this.find(filter)
                .exec()
                .then(ok)
                .catch(nok)
        },

        add: function (candidate) {
            let ins = new this(candidate)

            return ins.save()
                .then(ok)
                .catch(nok)
        },
        removeOne: function (id) {
            return this.findByIdAndRemove(id)
                .exec()
                .then(ok)
                .catch(nok)
        }
    }
}
