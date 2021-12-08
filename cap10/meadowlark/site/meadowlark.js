const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas')
const weatherMiddleware = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
const { credentials } = require('./config')
const cookieParse = require('cookie-parser')
const expressSession = require('express-session')
const flashMiddleware = require('./lib/middleware/flash')

require('dotenv').config()

app.disable('x-powered-by')

const port = process.env.PORT

const cartValidation = require('./lib/middleware/cartValidation')

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

app.use(cookieParse(credentials.cookieScret))
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieScret
}))
//habilitando o flash no app
app.use(flashMiddleware)


app.use(cartValidation.resetValidation)
app.use(cartValidation.checkWaivers)
app.use(cartValidation.checkGuestCounts)


app.get('/', rotas.home)
app.get('/about', rotas.about)
app.get('/cart', rotas.cart)
app.post('/addCart', rotas.addCart)
app.get('/clearCart', rotas.clearCart)

app.use(rotas.notFound)
app.use(rotas.serverErro)

if (require.main == module) {
    app.listen(port, () => console.log(
        `Express started on http://localhost:${port};
press Ctrl-C to terminate.`))
} else {
    module.exports = app
}

