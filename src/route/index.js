
module.exports = (app) => {
    app.get('/', (req, res) => res.json({'Index': 'Index Intuitiv REST API'}))
}
