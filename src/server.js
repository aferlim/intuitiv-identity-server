const express = require('express')
const bodyParser = require('body-parser')
const consign = require('consign')
const path = require('path')
const session = require('express-session')
const expresslayouts = require('express-ejs-layouts')
const flash = require('connect-flash')

const config = require('./lib/config/global')
const passportCfg = require('./lib/config/passport')

global.Promisse = require('bluebird')

const app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(expresslayouts)

app.set('views', path.join(path.dirname(require.main.filename || process.mainModule.filename), '/public/view'))

app.use('/css', express.static(path.join(path.dirname(require.main.filename || process.mainModule.filename), '/public/css')))

app.set('view engine', 'ejs')

app.use(session({ secret: 'intuitiv-cms-node' }))

app.use(passportCfg.initialize())
app.use(passportCfg.useSession())

app.use(flash())

consign({ cwd: 'src', verbose: true })
    .include('lib/config/database.js')
    .into(config)

consign({ cwd: 'src', verbose: true })
    .include('route')
    .into(app)

app.use(require('./lib/config/login-session'))

app.use(require('./lib/handler/server-error'))

app.listen(config.PORT, () => console.log(`Intuitiv API - porta ${config.PORT}`))
