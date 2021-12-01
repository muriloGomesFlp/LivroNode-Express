const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas')
const weatherMiddleware = require('./lib/middleware/weather')
//middleware para fazer o parser do corpo codificado em URL
const bodyParser = require('body-parser')
//modulo pra upload de arquivos
const multiparty = require('multiparty')

require('dotenv').config({
    path: ".env"
})

app.disable('x-powered-by')

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
//ativando o bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//rotas das páginas 
app.get('/', rotas.home)
app.get('/about', rotas.about)
app.get('/blocks', rotas.blocks)
app.get('/sections', rotas.sections)

//conectar os manipuladores com a aplicação
app.get('/formNewsletter', rotas.formNewsletterSigup)
app.get('/formNewsletterFetch', rotas.formNewsletterSigupFecth)

app.post('/api/formNewsletter', rotas.api.newsletterSigup)
app.post('/formNewsletter/process', rotas.formNewsletterSigupProcess)
app.get('/formNewsletter/thanks', rotas.newsletterSignupThanks)

//upload de arquivos
app.get('/contest', rotas.contestVacation)
app.post('/contest/formPhoto/:year/:month', (req, res) => {
    const formPhoto = new multiparty.Form({uploadDir:'views/contest/upload'})
    formPhoto.parse(req, (err, fields, files) => {
        if (err) return res.status(500).send({ error: err.message })
        console.log('got fields: ', fields)
        console.log('and files: ', files)
        rotas.contestVacationPhotoProcess(req, res, fields, files)
    })
})

app.get('/contest/contestVacationThanks', rotas.contestVacationThanks)

//UPLOAD DE ARQUIVOS COM AJAX
app.get('/contestFetch', rotas.contestVacationfetch)
app.post('/api/formPhoto/:year/:month', (req, res) => {
    const formPhoto = new multiparty.Form({uploadDir:'views/contest/upload'})
    formPhoto.parse(req, (err, fields, files) => {
        if (err) return res.status(500).send({ error: err.message })       
        rotas.api.formPhotoFetch(req, res, fields, files)
    })
})
 

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

