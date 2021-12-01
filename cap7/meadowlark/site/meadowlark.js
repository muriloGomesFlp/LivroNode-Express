const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas')
const weatherMiddleware = require('./lib/middleware/weather')

require('dotenv').config({
    path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
})
const port = process.env.PORT
//configuração do Handlebars
let hbs = expressHandlebars.create({
    defaultLayout: 'main',
    //declarar sempre, principalmente se usar o partials
    extname: '.hbs',                      
    //função que permite injetar blocos de códigos referente a scripts, head, entre outros em páginas específicas
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

//ativando explicitamente o cache de views
app.set('view cache', true)
//static files
app.use(express.static(__dirname + '/public'))

//importando modulo de clima (./lib/midlleware/weather.js), origem dos dados de clima, ainda estaticos
app.use(weatherMiddleware)

//rotas das páginas 
app.get('/', rotas.home)
app.get('/about', rotas.about)
app.get('/blocks', rotas.blocks)
app.get('/sections', rotas.sections)

//pagina 404
app.use(rotas.notFound)

//pagina 500
app.use(rotas.serverErro)

//start server
if (require.main == module) {
    app.listen(port, () => console.log(
        `Express started on http://localhost:${port};
press Ctrl-C to terminate.`))
} else {
    module.exports = app
}

