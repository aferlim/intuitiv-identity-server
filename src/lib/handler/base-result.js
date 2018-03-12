module.exports = {

    ok: (res, data) => res.status(200).json(data),

    error: (res, err) => res.status(500).send({ error: 'Internal Server Error' }),

    notfound: (res) => res.sendStatus(404),

    badrequest: (res, result) => res.status(400).json({ errors: result }),

    notfoundRender: (res, err) => res.redirect('/notfound'),

    errorRender: (res, err) => res.redirect('/500')

}
