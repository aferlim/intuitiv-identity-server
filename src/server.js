import express from 'express'
import bodyParser from 'body-parser'
import consign from 'consign'
import path from 'path'
import session from 'express-session'
import expresslayouts from 'express-ejs-layouts'

import config from './config/global'

global.Promisse = require('bluebird')

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(expresslayouts)

app.set('views', path.join(path.dirname(require.main.filename || process.mainModule.filename), '/public/view'))

app.set('view engine', 'ejs')

app.use(session({
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: false
}))

consign({ cwd: 'src', verbose: true })
    .include('config/database.js')
    .into(config)

consign({ cwd: 'src', verbose: true })
    .include('route')
    .into(app)

app.listen(config.PORT, () => console.log(`Intuitiv API - porta ${config.PORT}`))
