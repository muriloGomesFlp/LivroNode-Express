const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
const rotas = require('./lib/rotas.js')
const apis = require('./apis/apiAceess.js')
//modulos referente aos cookies e session
const cookieParser = require('cookie-parser')
const session = require('express-session')
//modulos para processamento de formulários
const bodyParser = require('body-parser')
//configurando as variáveis de ambiente e verificando se são as de desenvolvimento ou produção
require('dotenv').config({
    path: process.env.NODE_ENV === "development" ? ".env.dev" : ".env"
})

const produtos = [{ id: 0, nome: 'Tênis A', preco: '29,90' }, { id: 2, nome: 'Tênis B', preco: '79,90' }]


//configuração do Handlebars
let hbs = expressHandlebars.create({ defaultLayout: 'main' });
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

const port = process.env.PORT 

//habilitar o bodyParser e codificando-o
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//habilitar o suporte para cookies
app.use(cookieParser())

//habilitar o suporte para o session
app.use(session({ resave: false, saveUninitialized: false, secret: process.env.SESSION_SECRET }))
app.use(express.static(__dirname + '/public'))

//rotas das páginas (esta em lib/rotas.js) + declaração dos arquivos estaticos
app.get('/', rotas.home)
app.get('/about', rotas.about)
//cap6 Inicio + my mods
app.get('/headersPage', rotas.headersPage)
app.get('/headers', rotas.headers)
//cap6 Ex. 6.3 + my mods
app.get('/greeting', rotas.greeting)
app.get('/randomUserId', rotas.randomUserId)
app.get('/randomUserName', rotas.randomUserName)
//cap 6 Ex. 6.4
app.get('/noLayout', rotas.noLayout)
//cap 6 Ex. 6.5
app.get('/customLayout', rotas.customLayout)
//Cap6 - Ex. 6.9
app.get('/basicForm', rotas.basicForm)
app.get('/reciveBasicForm', rotas.reciveBasicForm)
//Cap 6 - Ex. 6.10 - OBS.: reutilizou-se o reciveBasicForm
app.get('/robustForm', rotas.robustForm)
app.get('/errorForm', rotas.errorForm)
//cap6 Ex. 6.11, 6.12, 6.13 e 6.14 fornecenco API - as APIs estão organizadas em outro diretório/arquivo
app.get('/api/produtos/json', apis.apiJson)
app.get('/api/produtos/mix', apis.apiMix)
//adicionar o"/:id" permite enviar parametros pela URl "/api/produtos/put/0"-> corresponde ao produto com id 0
app.put('/api/produtos/put/:id', apis.apiPut)
//removendo um registro "ficcao" por meio de um parametro ID
app.delete('/api/produtos/delete/:id', apis.apiDel)
/*
Redebimento de formulário 
OBS.: Para processar o formulário pode ser utilizado o req.body ou (ocasionamente) req.query;
O req.xhr pode ser usado para deterinar se trata-se de uma requisiçaõ em ajax.
*/
app.post('/sendFrom', rotas.sendForm)
app.post('/sendRobustForm', rotas.sendRobustForm)

//desativar o cabeçalho de resposta em relação a dados do servidor
app.disable('x-powered-by')

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

