
import { ok, nok } from '../../lib/schema-promisses'

module.exports = {
    findAll: function(filter) {
        return this.find(filter)
            .exec()
            .then(ok)
            .catch(nok)
    },

    add: function(candidate) {
        //
        if (!candidate.username || candidate.username === '') { return nok('invalid username') }

        var ins = new this(candidate)

        return ins.save()
            .then(ok)
            .catch(nok)
    }
}
