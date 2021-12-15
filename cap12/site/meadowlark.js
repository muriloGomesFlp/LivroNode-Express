const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas')
const weatherMiddleware = require('./lib/middleware/weather')
const bodyParser = require('body-parser')
const cookieParse = require('cookie-parser')
const expressSession = require('express-session')
const flashMiddleware = require('./lib/middleware/flash')
const { credentials } = require('./config')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const cluster = require('cluster')
//instanciar o Sentry + Tracing para registro e erros e analise
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

require('dotenv').config()

app.disable('x-powered-by')

const port = process.env.PORT

//config sentry
Sentry.init({
  dsn: credentials.sentryDSN,
  debug: true,
  environment: app.get('env'),
  
  /*integrations(integrations) {
    console.log(integrations)
    return integrations.filter(integration => integration.id !== 'OnUncaughtException')
  },*/
  //tracesSampleRate: 1.0,
})

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
console.log(app.get('env'))
//define env using definition on .env
app.set('env', process.env.NODE_ENV)
console.log(app.get('env'))

//ativando o logging com o morgan em ambiente de produção
switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'))
    break
  case 'production':
    const stream = fs.createWriteStream(path.join(__dirname, '/access.log'))
    app.use(morgan('combined', { stream }))
    break
}

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

//ver atividade do worker
app.use((req, res, next) => {
  if (cluster.isWorker)
    console.log(`Worker ${cluster.worker.id} recebeu a requisição`)
  next()
})

//habilitando o flash no app
app.use(flashMiddleware)

//app.get('/', rotas.home)
//Talvez melhor desempenho
app.get('/',(req, res)=>{
  res.render('home')
})
app.get('/about', rotas.about)
app.get('/mail', rotas.mail)
app.post('/api/sendMail', rotas.api.sendMail)

app.get('/fail', (req, res) => {
  throw new Error('Nope!')
})

app.get('/EpicFail', (req, res) => {
  process.nextTick(() => {
    throw new Error('FOI')
  })
  res.render('500')
})

app.use(rotas.notFound)
app.use(rotas.serverErro)


//OBs.:boas praticas em ambiente de produção 
process.on('uncaughtException', (error) => {  
  const hub = Sentry.getCurrentHub();
  hub.withScope(async (scope) => {
    scope.setLevel('fatal');
    hub.setTag("Book", "Cap12");
    hub.captureException(error, { originalException: error })    
  })
  process.exit(1)
}).on('uncaughtException', (error) => {
  const hub = Sentry.getCurrentHub();
  hub.withScope(async (scope) => {
    scope.setLevel('error');
    hub.captureException(error, {originalException: error });
  });
  process.exit(1)
});

function startServer(port) {
  app.listen(port, function () {
    console.log(
      `Express started on http://localhost:${port}; Envorimet use is ${app.get('env')};
    press Ctrl-C to terminate.`)
  })
}

if (require.main === module) {
  // application run directly; start app server
  startServer(process.env.PORT)
} else {
  // application imported as a module via "require": export
  // function to create server
  module.exports = startServer
}


