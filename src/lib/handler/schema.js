
module.exports = {
    ok: result => {
        console.log(`${result} is done!`)
        return Promise.resolve(result)
    },

    nok: err => {
        console.error(`${err}`)
        return Promise.reject(err)
    }
}
