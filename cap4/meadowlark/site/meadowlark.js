const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()
 //Importando módulo biscoito.js
 const cookie = require('./lib/biscoito.js')

/*configurar o view engine Handlebars -> Aqui será determinada algumas configurações, 
o uso do defaultLayout informa que o arquivo main.handlebars será a nossa página mestre 
e à partir desta sera injetado o conteúdo do body. Nesse projeto foi configurado o path: 
views/layouts/main.hbs -> estrutura padrão (famoso boilerplate: trechos de código que podem
    ser reutilizados várias vezes, com ou sem nenhuma modificação)
*/

/*
################################
Exemplo livro que não funcionou
#################################
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}))
*/

/*
############################################
Exemplo na documentação do git do handlebars
#############################################
*/
//a linha 19, foi criado uma instancia passando a configuração da pagina mestre, mas pode haver outras config.
let hbs = expressHandlebars.create({ defaultLayout: 'main' });
//o uso o 'hbs' define a extensão do arquivo, esta é o modo contraido, mas pode ser o mode full 'handlebars'
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs') //deve ser tambem definido a exteção apois o primeiro atribuito

//Definido a porta atráves de uma variável de ambiente antes da inicialização do servidor
const port = process.env.PORT || 3000

/*
######################
Rotas para as páginas
######################
O roteador de rotas do expresse app.get, realiza alguns tratamentos de formta automática como
o tratamento de querystring, ver cap1 req.url para comparar*/
//O view engine define automaticamente o contenType(text/html) e o status padrão(200)

app.get('/', (req, res) => res.render('home'))
app.get('/about', (req, res) => {

    //envia para o front por meio da variável biscoito o valor coletado no random
    res.render('about', {biscoito: cookie.getBiscoito()})
})

/*
###########################
Definir o middleware static
###########################
*/
app.use(express.static(__dirname + '/public'))


//Página 404 personalizada
app.use((req, res) => {
    res.status(404)
    res.render('404')
})

//Página 505 personalizada
app.use((err, req, res, next) => {
    //console.erro(err.message)
    res.status(505)
    res.render('500')
})


app.listen(port, () => console.log(
    `Express started on http://localhost:${port};
press Ctrl-C to terminate.`))

