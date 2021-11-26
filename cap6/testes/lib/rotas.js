/*
Separando os manipuladores de rota para facilitar a etapa de testes
*/
const catNames = require('cat-names')
const sorte = require('./biscoito')

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => res.render('about', { biscoito: sorte.getBiscoito() })


exports.headers = (req, res) => {
    const headers = Object.entries(req.headers).map(([key, val]) => `${key}:${val}`)
    res.type('text/plain')
    res.send(headers.join('\n'))
}

exports.headersPage = (req, res) => res.render('headers')

//rota para reinderizar a página greeting passando um contexto para a view (valores, cookies e sessions)
exports.greeting = (req, res) => {
    res.render('greeting', {
        message: 'Olá, estimado programador!',
        userid: req.cookies.userid,
        username: req.session.username
    })
}
//gera um id de usuario randomicamente e armazena nos cookies com a chave 'userid' e após redirecioa para o /greeting
exports.randomUserId = (req, res) => {
    res.cookie('userid', (Math.random() * 10000).toFixed(0))
    res.redirect('/greeting')
}
//gera um nome aleatório por meio de um pacote "catNames" e armazena na session e após redireciona para o /greeting
exports.randomUserName = (req, res) => {
    req.session.username = catNames.random()
    res.redirect('/greeting')
}
//NÃO usa da página mestre, utiliza do código html escrito no noLayout.hbs
exports.noLayout = (req, res) => res.render('noLayout', { layout: null })

//usa da página mestre diferente da main.handlebars, neste caso uma outra página meste, a custom
exports.customLayout = (req, res) => res.render('customLayout', { layout: 'custom' })

//processamento de formulário básico, página de entrada dos dados
exports.basicForm = (req, res) => res.render('basicForm')


/*recebe os dados e redireciona para outra página onde mostra as entradas
OBS.: Aqui utilizou-se do require('url') que possibilita enviar via redirect uma querystring
para a outra página com os valores de entrada
*/
exports.sendForm = (req, res) => {
    const url = require('url');
    res.redirect(303, url.format({
        pathname: "/reciveBasicForm",
        query: {
            "title": 'Basic Form - Results',
            "nome": req.body.name,
            "email": req.body.email
        }
    }))
}
//reideriza a nova pagina com valores de entrada
exports.reciveBasicForm = (req, res) => res.render('statusSendForm', { title: req.query.title, nome: req.query.nome, email: req.query.email })

//processamento de formulário "robusto", página de entrada dos dados
exports.robustForm = (req, res) => res.render('robustForm')

//tratamento mais robusto a rota, simulando o armazenamento em um BD ou outro mecanismo de persistência
exports.sendRobustForm = (req, res) => {
    try {
        if (req.body.simulateError) throw new Error("error saving contact!")
        res.format({
            'text/html': () => res.redirect(303, require('url').format({
                pathname: "/reciveBasicForm",
                query: {
                    "title": 'Robust Form, use Try and Catch - Results',
                    "nome": req.body.name,
                    "email": req.body.email
                }
            })),
            'application/json': () => res.json({ success: true })
        })
    } catch (err) {
        console.error(`Erro ao processar o envio do formulário ${req.body.name} ` +
            `<${req.body.email}>`)
        res.format({
            'text/html': () => res.redirect(303, '/errorForm'),
            'application/json': () => res.status(500).json({
                error: 'Erro ao salvar contato'
            }),
        })
    }
}

//pagina error ao processar form
exports.errorForm = (req, res) => res.render('errorForm')




exports.notFound = (req, res) => {
    res.status(404)
    res.render('404')
}

/* eslint-disable no-unused-vars */
exports.serverErro = (err, req, res, next) => {
    res.status(500)
    res.render('500')
}
 /* eslint-enable no-unused-vars */