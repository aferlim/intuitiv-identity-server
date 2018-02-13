module.exports = {

    ok: (res, data) => res.status(200).json(data),

    error: (res, err) => res.status(500).send({ error: 'Internal Server Error' }),

    notfound: (res) => res.sendStatus(404),

    notfoundRender: (res) => res.redirect('/notfound'),

    errorRender: (res) => res.redirect('/500')

}
