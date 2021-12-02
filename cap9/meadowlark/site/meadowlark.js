const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas')
const weatherMiddleware = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
//importar modulo credentials especidicado no arquivo .config.js
const { credentials } = require('./config')
//adicionando o middleware cookie-parse
const cookieParse = require('cookie-parser')
//instanciando o modulo express-session
const expressSession = require('express-session')
//instanciando o middleware criado para o flash
const flashMiddleware = require('./lib/middleware/flash')

require('dotenv').config({
    path: ".env"
})
app.disable('x-powered-by')

const port = process.env.PORT
let hbs = expressHandlebars.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        }
    }
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.set('view cache', true)
app.use(express.static(__dirname + '/public'))
app.use(weatherMiddleware)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//usando o cookie-parser e a credential configurada
app.use(cookieParse(credentials.cookieScret))
//habilitando e configurando o expressSession (detalhes cap9 pg 140)
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieScret
}))
//habilitando o flash no app
app.use(flashMiddleware)

app.get('/', rotas.home)
app.get('/about', rotas.about)
app.get('/blocks', rotas.blocks)
app.get('/sections', rotas.sections)
app.get('/formNewsletter', rotas.formNewsletterSigup)
app.post('/formNewsletter/process', rotas.formNewsletterSigupProcess)
app.get('/formNewsletter/thanks', rotas.newsletterSignupThanks)


app.use(rotas.notFound)
app.use(rotas.serverErro)
if (require.main == module) {
    app.listen(port, () => console.log(
        `Express started on http://localhost:${port};
press Ctrl-C to terminate.`))
} else {
    module.exports = app
}

