module.exports = {

    ok: (res, data) => res.status(200).json(data),

    error: (res, err) => res.status(500).send({ error: 'Internal Server Error' }),

    notfound: (res) => res.sendStatus(404)

}
